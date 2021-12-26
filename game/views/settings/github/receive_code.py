
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
    print("web端github登录")
    print("***********************************************")

    data = request.GET

    print(data)
    code = data.get('code')
    state = data.get('state')



    print(code, state , "code ++++++")
    if not cache.has_key(state):
        return redirect("index")
    cache.delete(state)
    redirect_uri = ("https://app171.acapp.acwing.com.cn/settings/github/receive_code")

    client_id = "3ddb70db79756a69a8c9"
    client_secret = "2d04b912e20b3418d0c75bb432dd08fbe8ed6485"
    headers = {'Accept': 'application/json'}
    data = {
        'client_id': client_id,
        'client_secret': client_secret,
        # code参数为GitHub转向至回调url时附带的
        'code': code
        }
    url = "https://github.com/login/oauth/access_token?"
    
# https://github.com/login/oauth/access_token?client_id=3ddb70db79756a69a8c9&client_secret=2d04b912e20b3418d0c75bb432dd08fbe8ed6485&code=%s&redirect_uri=https://app171.acapp.acwing.com.cn/settings/github/receive_code/
    
#https://github.com/login/oauth/access_token
    # access_token_res = requests.post("https://github.com/login/oauth/access_token?client_id=3ddb70db79756a69a8c9&client_secret=2d04b912e20b3418d0c75bb432dd08fbe8ed6485&code=%s&redirect_uri=https://app171.acapp.acwing.com.cn/settings/github/receive_code" % code)

    access_token_res = requests.post(url, data, headers=headers, timeout=1).json()

    print(access_token_res)


    access_token = access_token_res['access_token']
    # #  #openid = access_token_res['openid']
    url = ("https://api.github.com/user?access_token=%s" % access_token)
    # userinfo_res = requests.get("https://api.github.com/user?access_token=%s" % access_token).json()
    userinfo_res = requests.get(url, timeout=1)
    print(userinfo_res.text)

    # openid = str(userinfo_res['id']) + "github"
    # # print(openid)
    # players = Player.objects.filter(openid=openid)
    # if players.exists(): # 用户查找是否登录
    #     login(request, players[0].user)
    #     return redirect("index")


    # # get_userinfo_url = "https://gitee.com/api/v5/user/"
    # # params = {
    # #     'access_token' : access_token,
    # #     'openid' : openid
    # # }
    # # userinfo_res = requests.get(get_userinfo_url, params=params).json()
    # username = userinfo_res['name']
    # photo = userinfo_res['avatar_url']
    
    # while User.objects.filter(username=username).exists(): #用户名查重
    #     username += str(randint(0, 9))

    # user = User.objects.create(username=username)
    # player = Player.objects.create(user=user, photo=photo, openid=openid)
    # login(request, user)

    # return redirect("index")