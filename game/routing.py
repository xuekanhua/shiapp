from django.urls import path
from game.consumers.multiplayer.index import MultiPlayer # wss的view函数编写
# wss 的路由
websocket_urlpatterns = [
    path("wss/multiplayer/",MultiPlayer.as_asgi(), name="wss_multiplayer"),
    
]