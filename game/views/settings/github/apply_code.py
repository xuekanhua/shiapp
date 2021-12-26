from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache

def get_state():
    res = ""
    for i in range(8):
        res += str(randint(0, 9))
    return res

# 2d04b912e20b3418d0c75bb432dd08fbe8ed6485
def apply_code(request):
    client_id = "3ddb70db79756a69a8c9"
    redirect_uri = quote("https://app171.acapp.acwing.com.cn/settings/github/receive_code")
    scope = "userinfo"
    state = get_state()
    
    
    cache.set(state, True, 7200) # 有效期2小时
    
    
    apply_code_url = "https://github.com/login/oauth/authorize"
    return JsonResponse({
        'result': "success",
        'apply_code_url': apply_code_url + "?client_id=%s&redirect_uri=%s&state=%s" % (client_id, redirect_uri, state)

    })
    