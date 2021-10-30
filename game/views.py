from django.http import HttpResponse

def index(request):

    line = '''
    <head>
            <meta charset="utf-8">
            <title>测试网站标题</title>
    </head>
    <h2 style="text-align: center" >测试网页</h2>
    <hr>
    <h3 style="text-align: center" ><a href="/play/">进入游戏<a></h3>
    <img style="width: 98vw" src="https://s3.bmp.ovh/imgs/2021/10/66d3480b484ae815.jpeg">'''
    return HttpResponse(line)


def play(request):
    line = '''
     <head>
            <meta charset="utf-8">
            <title>术士之战</title>
    </head>
    <h2 style="text-align: center" >游戏界面(测试)</h2>
    <hr>
    <a href="/"><h3 style="text-align: center" >返回主界面</h3><a>
    <img style="width: 98vw" src="https://s3.bmp.ovh/imgs/2021/09/21ee78aeae84b207.jpg">'''
    return HttpResponse(line)

