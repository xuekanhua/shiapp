from django.http.response import JsonResponse
from django.core.cache import cache
import requests
from django.contrib.auth.models import User
from game.models.player.player import Player
from random import randint



def receive_code(request):


    print("***********************************************")
    print("acapp端登录")
    print("***********************************************")

    data = request.GET

    if "errcode" in data:
        return JsonResponse({
            'result' : "apply_failed",
            'errcode': data['errcode'],
            'errmsg' : data['errmsg'],
        })

    
    code = data.get('code')
    state = data.get('state')


    print(code, state)

    if not cache.has_key(state):
        return JsonResponse({
            'result':"state not exist"
        })
    cache.delete(state)


    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        'appid' : "171",
        'secret' : "01ee20ebb5314dd0981df7f17d9c983c",
        'code' : code
    }

    access_token_res = requests.get(apply_access_token_url, params=params).json()

    print(access_token_res)

    access_token = access_token_res['access_token']
    openid = access_token_res['openid']


    players = Player.objects.filter(openid=openid)
    if players.exists(): # 用户查找是否登录
        # login(request, players[0].user)
        player = players[0]
        return JsonResponse({
            'result' : "success",
            'username' : player.user.username,
            'photo' : player.photo,
        })


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
    # login(request, user)

    return JsonResponse({
        'result' : "success",
        'username' : player.user.username,
        'photo' : player.photo,
    })
