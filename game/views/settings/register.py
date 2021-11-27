import json
from django.contrib import auth
from django.db import models
from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player


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
    user = User(username=username)
    user.set_password(password)
    user.save()
    # Player.objects.create(user=user, photo="https://cdn.acwing.com/media/user/profile/photo/69128_lg_c8103deb2b.jpg")
    Player.objects.create(user=user, photo=photo)
    
    login(request, user)
    return JsonResponse({
        'result' : "success"
    })