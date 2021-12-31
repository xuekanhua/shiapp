# Python 课程设计

* 基于Django的web联机2D平面射击游戏

## 项目小组：C嘉嘉

| 成员   | 成员   | 成员   |
| ------ | ------ | ------ |
| 陈延忠 | 王  聪 | 秦浩源 |

## 项目简介

* 地址 ： [黄豆勇者](https://app171.acapp.acwing.com.cn/)
* 基于Django的web联机2D平面射击游戏
* python后端、web前端
* 玩法：右键移动， q火球， f闪现，  左键释放技能

1. **预览**

   * 登录界面
     ![登录界面](https://cdn.acwing.com/media/article/image/2021/12/29/137551_095891eb68-1.png)
   * 用户界面
     ![用户界面](https://cdn.acwing.com/media/article/image/2021/12/29/137551_0c936e2c68-2.png)
   * 单人模式
     ![单人模式](https://cdn.acwing.com/media/article/image/2021/12/29/137551_12531e1868-4.png)
     ![单人模式](https://cdn.acwing.com/media/article/image/2021/12/29/137551_13da316868-5.png)
   * 排行榜
     ![排行榜](https://cdn.acwing.com/media/article/image/2021/12/29/137551_1752ea9d68-6.png)
   * 联机模式
     ![联机模式](https://cdn.acwing.com/media/article/image/2021/12/29/137551_1c4b730c68-8.png)
     ![联机模式](https://cdn.acwing.com/media/article/image/2021/12/29/137551_1e731d7f68-9.png)
2. **项目结构**

   ### **项目系统设计**


   * 菜单界面 ： `menu`
   * 游戏界面 ： `playground`
   * 设置界面 ：  `settings`

   ### **项目文件结构**

   * 管理 `html`文件 : `templates`
   * 管理路由 : `urls`
   * 管理 `http`函数 : `views`
   * 管理数据库数据 : `models`
   * 管理 `websocket`函数 : `consumers`
   * 管理用户匹配机制：`match_system`
   * 管理静态文件 : `static`
     * 格式 ： `css`
     * 逻辑 ： `js`
     * 图片 ： `image`
3. **项目实现**

   * 运行环境 : `Ubuntu20.04`下的 `docker`容器
   * 项目部署 : `nginx` 、 `uwsgi` 、 `daphne`、 `thrift`
   * 账号系统 : `Redis` 、 `sqite`
   * 联机对战 : `channels_redis` 、 `websocket`
   * 聊天系统 : `websocket`
   * 匹配机制 : `thrift`
4. 项目部署需执行以下命令
    ```bash
    cd shiapp
    sudo /etc/init.d/nginx start
    sudo redis-server /etc/redis/redis.conf
    uwsgi --ini scripts/uwsgi.ini
    daphne -b 0.0.0.0 -p 5015 shiapp.asgi:application
    ./match_system/src/main.py
    ```

## 项目分析

### 一、前端实现

* `html` 、 `css` 、 `JavaScript`的web前端
* 游戏的画面渲染在 `js`中以html对象类编写由 `Canvas`实现实时渲染
* 游戏的对象逻辑由 `js`的类，监听器， 函数等实现
* 前后端数据交换及网页的动态刷新由 `AJAX`实现

### 二、后端实现

* 项目的创建由 `Django`实现
* 项目的部署，域名的使用，`https`协议由 `nginx` 和 `uwsgi`实现
* 账号系统由 `python`编写用户类， `redis`内存数据库存储临时信息， `sqlite`存储用户信息
* 联机对战由 `websocket`实现前端与后端的双向请求，并用 `python`编写同步函数及网络路由
* 匹配机制由 `thrift`实现匹配池与匹配的具体逻辑
* 项目的运行均由 `python`实现项目的路由具体逻辑实现以及数据的创建修改与交换
