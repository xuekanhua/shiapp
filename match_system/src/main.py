#! /usr/bin/env python3
# thrift 服务端用于匹配玩家

import glob
import queue
import sys
sys.path.append('gen-py')
sys.path.insert(0, glob.glob('../../')[0])

from match_server.match_service import Match
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from queue import Queue
from time import sleep
from threading import Thread

from shiapp.asgi import channel_layer
from asgiref.sync import async_to_sync 
from django.core.cache import cache

queue = Queue() # 消息队列

# 生产者与消费者模型

class Player:
    def __init__(self, score, uuid, username, photo, channel_name):
        self.score = score
        self.uuid = uuid
        self.username = username
        self.photo = photo
        self.channel_name = channel_name
        self.waiting_time = 0 # 等待时间

class Pool:
    def __init__(self):
        self.players = []
    def add_player(self, player):
        print("Add_player  %s  %d" %(player.username, player.score))
        flag = None
        for i in self.players:
            if player.username == i.username:
                flag = i
                break
        if flag:
            print(1)
            self.players.remove(flag)


        self.players.append(player)
        for i in self.players:
            print(i.username, end = " ;")
        print()

    def check_match(self, a, b):
        if a.username == b.username:
            return False
        dt = abs(a.score - b.score)
        a_max_dif = a.waiting_time * 50
        b_max_dif = b.waiting_time * 50
        return dt <= a_max_dif and dt <= b_max_dif

    def match_success(self, ps):
        print("Match Success: %s   %s   %s" % (ps[0].username, ps[1].username, ps[2].username))
        room_name = "room-%s-%s-%s" % (ps[0].uuid, ps[1].uuid, ps[2].uuid)
        players = []
        for p in ps:
            async_to_sync(channel_layer.group_add)(room_name, p.channel_name)
            players.append({
                'uuid' : p.uuid,
                'username' : p.username,
                'photo' : p.photo,
                'hp' : 100,
            })
        cache.set(room_name, players, 3600) # use 1hour

        for p in ps:
            async_to_sync(channel_layer.group_send)(
                room_name,
                {
                    'type' : "group_send_event",
                    'event' : "create_player",
                    'uuid' : p.uuid,
                    'username' : p.username,
                    'photo' : p.photo,

                }
            )


    def increase_waiting_time(self):
        for player in self.players:
            player.waiting_time += 1
    def match(self):
        while len(self.players) >= 3:
            self.players = sorted(self.players, key=lambda p: p.score)
            flag = False
            for i in range(len(self.players) - 2):
                a, b, c  = self.players[i], self.players[i + 1], self.players[i + 2]
                if self.check_match(a, b) and self.check_match(a, c) and self.check_match(b, c):
                    self.match_success([a, b, c])
                    self.players = self.players[:i] + self.players[i + 3:]
                    flag = True
                    break
            if not flag:
                break
        self.increase_waiting_time()


class MatchHandler:
    def add_player(self, score, uuid, username, photo, channel_name):
        player = Player(score, uuid, username, photo, channel_name)
        queue.put(player)
        return 0

def get_player_from_queue():
    try:
        return queue.get_nowait()
    except:
        return None

def worker():
    pool = Pool()
    while True:
        player = get_player_from_queue()
        if player:
            pool.add_player(player)
        else:
            pool.match()
            sleep(1)




if __name__ == '__main__':
    handler = MatchHandler()
    processor = Match.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    # server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)    # 单线程服务


    # You could do one of these for a multithreaded server
    # 多线程服务，一个请求占用一个线程高并行， 产生资源浪费
    server = TServer.TThreadedServer(
        processor, transport, tfactory, pfactory)
    # 匹配池服务 有限线程并行。多余预定线程就会阻塞
    # server = TServer.TThreadPoolServer(
    #     processor, transport, tfactory, pfactory)

    # 开守护线程daemon为True时为守护进程。False时杀主线程时这个线程不会关
    Thread(target=worker, daemon=True).start()

    print('Starting the server...')

    server.serve()
    print('done.')