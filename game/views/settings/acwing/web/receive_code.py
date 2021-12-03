from django.shortcuts import redirect
from django.core.cache import cache
import requests
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.contrib.auth import login
from urllib.parse import quote
from random import randint
def receive_code(request):


    print("***********************************************")
    print("web端acapp登录")
    print("***********************************************")

    data = request.GET
    code = data.get('code')
    state = data.get('state')


    print(code, state)
    if not cache.has_key(state):
        return redirect("index")
    cache.delete(state)

    redirect_uri = quote("https://app171.acapp.acwing.com.cn/settings/github/receive_code")

    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        'appid' : "171",
        'secret' : "01ee20ebb5314dd0981df7f17d9c983c",
        'code' : code
    }

    access_token_res = requests.get(apply_access_token_url, params=params).json()

    # print(access_token_res)

    access_token = access_token_res['access_token']
    openid = access_token_res['openid']


    players = Player.objects.filter(openid=openid)
    if players.exists(): # 用户查找是否登录
        login(request, players[0].user)
        return redirect("index")


    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
        'access_token' : access_token,
        'openid' : openid
    }
    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_res['username']
    photo = userinfo_res['photo']
    
    while User.objects.filter(username=username).exists(): #用户名查重
        username += str(randint(0, 9))

    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo=photo, openid=openid)
    login(request, user)

    return redirect("index")