from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache

def get_state():
    res = ""
    for i in range(8):
        res += str(randint(0, 9))
    return res

def apply_code(request):
    client_id = "c3231c34576b710370f8c831a97763bf65b8273043d3684dc3f2469138c7ad55"
    redirect_uri = quote("https://app171.acapp.acwing.com.cn/settings/github/receive_code")
    scope = "userinfo"
    state = get_state()
    
    
    cache.set(state, True, 7200) # 有效期2小时
    
    
    apply_code_url = "https://gitee.com/oauth/authorize"
    return JsonResponse({
        'result': "success",
        'apply_code_url': apply_code_url + "?response_type=code&client_id=%s&redirect_uri=%s&state=%s&scope=user_info" % (client_id, redirect_uri, state)

    })
    