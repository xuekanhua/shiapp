from django.contrib import admin
from django.urls import path,include
from game.views.ranking_list.ranking_list import get_integral_info
urlpatterns = [
   path('get_integral_info/',get_integral_info,name='ranking_list_get_integral_info'),
]