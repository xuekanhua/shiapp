from django.http import JsonResponse

from game.models.player.player import Player

def get_integral_info(request):
    # print("yes +++++++++++++++++++++++++++++++++")
    infos=Player.objects.order_by('-score')
    infosDict=[]
    pre=1
    pre_score=-1
    for i in range(len(infos)):
        if i==0 or pre_score!=infos[i].score:
            pre=i+1
        username=[infos[i].user.username,infos[i].photo]
        infosDict.append({'ranking':pre,'username':username,'integral':infos[i].score})
        pre_score=infos[i].score
    # print(*infosDict, sep="\n")
    print("一共有：",len(infosDict))
    return JsonResponse({
        'result':"success get",
        'data':infosDict,
    })