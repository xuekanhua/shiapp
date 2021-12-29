"""
ASGI config for shiapp project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

'''
asgi 异步应用 因为 WSGI的单次调用接口不适合WebSocket
ASGI由单独的异步应用沟通成。其中包括scope，包含传入请求的所有信息；send，用于向客户端发送事件的异步方法，receive，用于接受客户端发来事件的异步方法。
ASGI不仅让应用可以多次接受或发送事件，并且可以结合协程时应用同时处理器他任务（比如监听外部触发的事件，就像Redis队列一样）。
'''

import os
import channels


import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shiapp.settings')
django.setup()


from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from game.routing import websocket_urlpatterns




# 在其他服务器中调用channel进程函数
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
})

