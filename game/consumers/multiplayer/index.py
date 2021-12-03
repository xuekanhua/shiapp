from channels.generic.websocket import AsyncWebsocketConsumer
import json
# shiapp/settings
from django.conf import settings
# radis数据库
from django.core.cache import cache

class MultiPlayer(AsyncWebsocketConsumer):
    # 创建链接函数， 同意创建链接执行以下函数
    async def connect(self):
        self.room_name = None

        for i in range(1000):
            name = "room-%d" % (i)
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name
                break

        if not self.room_name:
            return
        
        # 成功创建链接
        await self.accept()

        print('accept')
        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600) # 有效期一小时


        for player in cache.get(self.room_name):
            # dumps 将字典变成字符串 
            await self.send(text_data=json.dumps({
                'event' : "create_player",
                'uuid' : player['uuid'],
                'username':player['username'],
                'photo' : player['photo'],

            }))

        # 引入group组的概念，进行群发
        # self.room_name = "room"
        # 添加进组
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    # 断开链接函数， 但他不一定执行(突然断电)
    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)


    # 创建玩家
    async def create_player(self, data):
        players = cache.get(self.room_name)
        players.append({
            'uuid' : data['uuid'],
            'username' : data['username'],
            'photo' : data['photo'],
        })
        cache.set(self.room_name, players, 3600) # 有效期一小时
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "create_player",
                'uuid' : data['uuid'],
                'username' : data['username'],
                'photo' : data['photo'],
            }
        )

    # 玩家移动
    async def move_to(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "move_to",
                'uuid' : data['uuid'],
                'tx' : data['tx'],
                'ty' : data['ty'],
            }
        )
    
    async def shoot_fireball(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "shoot_fireball",
                'uuid' : data['uuid'],
                'tx' : data['tx'],
                'ty' : data['ty'],
                'ball_uuid' : data['ball_uuid'],
            }
        )

    async def attack(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "attack",
                'uuid' : data['uuid'],
                'attackee_uuid' : data['attackee_uuid'],
                'x' : data['x'],
                'y' : data['y'],
                'angle' : data['angle'],
                'damage' : data['damage'],
                'ball_uuid' : data['ball_uuid'],
            }
        )

    async def blink(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type' : "group_send_event",
                'event' : "blink",
                'uuid' : data['uuid'],
                'tx' : data['tx'],
                'ty' : data['ty'],
            }
        )



    



    async def group_send_event(self, data):
        await self.send(text_data=json.dumps(data))

    # 接受前端向后端发送到请求
    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        if(event == "create_player"):
            await self.create_player(data)
        elif(event == "move_to"):
            await self.move_to(data)
        elif(event == "shoot_fireball"):
            await self.shoot_fireball(data)
        elif(event == "attack"):
            await self.attack(data)
        elif(event == "blink"):
            await self.blink(data)
        # print(data)


