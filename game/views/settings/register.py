import json
from django.contrib import auth
from django.db import models
from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player
import random


def register(request):
    data = request.GET
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    password_confirm = data.get("password_confirm", "").strip()
    photo = data.get("photo", "").strip()
    if not username or not password or not password_confirm:
        return JsonResponse({
            'result' : "用户名或密码不能为空"
        })
    if password_confirm != password:
        return JsonResponse({
            'result' : "两次密码不一致"
        })
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result' : "用户名已存在"
        })
    # print("yes")
    user = User(username=username)
    user.set_password(password)
    user.save()

    ph = ["https://i2.hdslb.com/bfs/face/96724d4de1d2338ac02b9ec9a6356f8883632144.jpg@240w_240h_1c_1s.webp",
    "https://i2.hdslb.com/bfs/face/d399d6f5cf7943a996ae96999ba3e6ae2a2988de.jpg@240w_240h_1c_1s.webp",
    "https://i1.hdslb.com/bfs/face/8895c87082beba1355ea4bc7f91f2786ef49e354.jpg@240w_240h_1c_1s.webp",
    "https://i2.hdslb.com/bfs/face/a7fea00016a8d3ffb015b6ed8647cc3ed89cbc63.jpg@240w_240h_1c_1s.webp",
    "https://i2.hdslb.com/bfs/face/668af440f8a8065743d3fa79cfa8f017905d0065.jpg@240w_240h_1c_1s.webp",
    "https://i0.hdslb.com/bfs/face/566078c52b408571d8ae5e3bcdf57b2283024c27.jpg@240w_240h_1c_1s.webp",
    "https://i2.hdslb.com/bfs/face/ad0e4a59f4e798c53d20ee01dec25d06bbb5cc71.jpg@240w_240h_1c_1s.webp",
    "https://i0.hdslb.com/bfs/emote/f9705395dc3536db243e4a4ffde66442e8440817.png@100w_100h.webp",
    "https://i0.hdslb.com/bfs/emote/438405970cbab6c6a06119bd9d9b474df62eb50c.png@100w_100h.webp",
    "https://i0.hdslb.com/bfs/emote/eda63a6172a2b4b3fc753e609d32cd63a5ac2761.png@100w_100h.webp",
    "https://i0.hdslb.com/bfs/emote/3cbc05078eee45c0861ce37e63092e379ae93d57.png@100w_100h.webp",
    "https://cdn.acwing.com/media/article/image/2021/12/27/137551_b056a7b066-zz.jpg",
    "https://cdn.acwing.com/media/article/image/2021/12/27/137551_a737eeb066-bb.jpg",
    "https://cdn.acwing.com/media/article/image/2021/12/27/137551_71f60b3866-moooo.jpg",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_e8f1b13c68-face-blowing-a-kiss_1f618.png",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_efcd26ae68-face-savoring-food_1f60b.png",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_f11f64ab68-face-with-hand-over-mouth_1f92d.png",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_f7947da668-ghost_1f47b.png",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_fbbacbae68-hugging-face_1f917.png",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_00c09ea468-smiling-face-with-halo_1f607.png",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_0309b29a68-smiling-face-with-hearts_1f970.png",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_04ac2e6d68-smiling-face-with-smiling-eyes_1f60a.png",
    "https://cdn.acwing.com/media/article/image/2021/12/29/137551_05df8d9e68-squinting-face-with-tongue_1f61d.png",
        ]
    # Player.objects.create(user=user, photo="https://cdn.acwing.com/media/user/profile/photo/69128_lg_c8103deb2b.jpg")

    # print("yesssssssssssssssssssssssssssssssss")

    if(photo and photo.find("https://") != -1):
        Player.objects.create(user=user, photo=photo)
    else:
        Player.objects.create(user=user, photo=random.choice(ph))

    
    login(request, user)
    return JsonResponse({
        'result' : "success"
    })