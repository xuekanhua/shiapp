from django.urls import path, include
from game.views.index import index
urlpatterns = [
    path("", index, name="index"),
    path("menu/", include("game.urls.menu.index")), # 跳转到其他文件夹
    path("platground/", include("game.urls.playground.index")),
    path("settings/", include("game.urls.settings.index")),
    path("ranking_list/",include("game.urls.ranking_list.index")),

    

]