# Python 课程设计
* 基于Django的web联机第三人称射击游戏

## 项目小组：C嘉嘉
|成员|负责模块|
--|--| 


## 项目简介
* 地址 ： https://app171.acapp.acwing.com.cn/
* 基于Django的前后端分离的web联机第三人称射击游戏
* python后端、web前端
1. **预览**
    ![登录界面](https://cdn.acwing.com/media/article/image/2021/12/07/137551_9939596d57-DDDD.png)

    ![单人模式](https://cdn.acwing.com/media/article/image/2021/12/07/137551_95a4a69c57-CCCC.png)

    ![联机模式](https://cdn.acwing.com/media/article/image/2021/12/07/137551_903148f057-AAAA.png)


2. **项目结构**
    ### **项目系统设计**
    * 菜单界面 ： `menu` 
    * 游戏界面 ： `playground`
    * 设置界面 ：  `settings`

    ### **项目文件结构**
    * 管理`html`文件 : `templates`
    * 管理路由 : `urls`
    * 管理`http`函数 : `views` 
    * 管理数据库数据 : `models`
    * 管理`websocket`函数 : `consumers`
    * 管理静态文件 : `static`
        * 格式 ： `css`
        * 逻辑 ： `js`
        * 图片 ： `image`


3. **项目实现**
    * 运行环境 : `Ubuntu20.04`下的`docker`容器
    * 项目部署 : `nginx`
    * 账号系统 : `Redis` 、 `sqite`
    * 联机对战 : `channels_redis` 、 `websocket`
    * 匹配机制 : `thrift`
    * 聊天系统 : `websocket`

## 项目分析
### 一、前端实现
* `html` 、 `css` 、 `JavaScript`的web前端
* 游戏的画面渲染在`js`中以html对象类编写由`Canvas`实现实时渲染
* 游戏的对象逻辑由`js`的类，监听器， 函数等实现
* 前后端数据交换及网页的动态刷新由`AJAX`实现



### 二、后端实现
* 项目的创建由`Django`实现
* 项目的部署，域名的使用，`https`证书由`nginx` 和`uwsgi`实现
* 账号系统由`python`编写用户类， `redis`内存数据库存储临时信息， `sqlite`存储用户信息
* 联机对战由`websocket`实现前端与后端的双向请求，并用`python`编写同步函数及网络路由
* 匹配机制由`thrift`实现匹配池与匹配的具体逻辑
* 项目的运行均由`python`实现项目的路由

