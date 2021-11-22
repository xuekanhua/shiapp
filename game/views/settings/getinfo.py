from django.http import JsonResponse
from game.models.player.player import Player


def getinfo_shiapp(request):
    player = Player.objects.all()[0]
    return JsonResponse({
        'result':"success",
        'username':player.user.username,
        'photo':player.photo,
    })


def getinfo_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result' : "未登录",
        })
    else:
        player = Player.objects.all()[0]
        return JsonResponse({
            'result':"success",
            'username':player.user.username,
            'photo':player.photo,
        })


def getinfo(request):
    platfrom = request.GET.get('platfrom')
    if platfrom == "SHIAPP":
        return getinfo_shiapp(request)
    elif platfrom == "WEB" :
        return getinfo_web(request)
