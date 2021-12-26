
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

    # print(data)
    code = data.get('code')
    state = data.get('state')



    print(code, state)
    if not cache.has_key(state):
        return redirect("index")
    cache.delete(state)
    redirect_uri = ("https://app171.acapp.acwing.com.cn/settings/github/receive_code")

    client_id = "c3231c34576b710370f8c831a97763bf65b8273043d3684dc3f2469138c7ad55"
    client_secret = "053c1c69fc5211bd126d54f2bb2688b41eb4a7b938b9afa8f63340be4e7040f4"
    


    apply_access_token_url = "https://gitee.com/oauth/token?grant_type=authorization_code&client_id=%s&client_secret=%s&code=%s&redirect_uri%s" %(client_id, client_secret, code, redirect_uri)
    params = {
        'grant_type' : "authorization_code",
        'code' : code,
        'client_id': "c3231c34576b710370f8c831a97763bf65b8273043d3684dc3f2469138c7ad55",
        'client_secret': "053c1c69fc5211bd126d54f2bb2688b41eb4a7b938b9afa8f63340be4e7040f4"
        
    }
    access_token_res = requests.post("https://gitee.com/oauth/token?grant_type=authorization_code&code=%s&client_id=c3231c34576b710370f8c831a97763bf65b8273043d3684dc3f2469138c7ad55&redirect_uri=https://app171.acapp.acwing.com.cn/settings/github/receive_code&client_secret=053c1c69fc5211bd126d54f2bb2688b41eb4a7b938b9afa8f63340be4e7040f4" % code).json()


    # print(access_token_res)

    access_token = access_token_res['access_token']
    # openid = access_token_res['openid']
    userinfo_res = requests.get("https://gitee.com/api/v5/user?access_token=%s" % access_token).json()
    # print(userinfo_res)

    openid = str(userinfo_res['id']) + "gitee"
    # print(openid)
    players = Player.objects.filter(openid=openid)
    if players.exists(): # 用户查找是否登录
        login(request, players[0].user)
        return redirect("index")


    # get_userinfo_url = "https://gitee.com/api/v5/user/"
    # params = {
    #     'access_token' : access_token,
    #     'openid' : openid
    # }
    # userinfo_res = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_res['name']
    photo = userinfo_res['avatar_url']
    
    while User.objects.filter(username=username).exists(): #用户名查重
        username += str(randint(0, 9))

    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo=photo, openid=openid)
    login(request, user)

    return redirect("index")


'''
'id': 9101708, 'login': 'shiguang124', 'name': 'shiguang124', 'avatar_url': 'https://gitee.com/assets/no_portrait.png',
 'url': 'https://gitee.com/api/v5/users/shiguang124', 'html_url': 'https://gitee.com/shiguang124', 'remark': '',
  'followers_url': 'https://gitee.com/api/v5/users/shiguang124/followers', 'following_url': 'https://gitee.com/api/v5/users/shiguang124/following_url{/other_user}',
   'gists_url': 'https://gitee.com/api/v5/users/shiguang124/gists{/gist_id}', 'starred_url': 'https://gitee.com/api/v5/users/shiguang124/starred{/owner}{/repo}', 
   'subscriptions_url': 'https://gitee.com/api/v5/users/shiguang124/subscriptions', 'organizations_url': 'https://gitee.com/api/v5/users/shiguang124/orgs', 
   'repos_url': 'https://gitee.com/api/v5/users/shiguang124/repos', 'events_url': 'https://gitee.com/api/v5/users/shiguang124/events{/privacy}', 
   'received_events_url': 'https://gitee.com/api/v5/users/shiguang124/received_events', 'type': 'User', 'blog': None, 'weibo': None, 'bio': None, 
   'public_repos': 0, 'public_gists': 0,
 'followers': 0, 'following': 2, 'stared': 0, 'watched': 1, 'created_at': '2021-05-11T11:28:21+08:00',
  'updated_at': '2021-12-02T21:11:30+08:00', 'email': None}
'''