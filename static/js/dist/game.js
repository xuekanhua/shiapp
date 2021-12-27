
class ShiGameMenu {
    constructor(root) {
        //一般.html对象加$普通的不加
        this.root = root;
        this.$menu = $(`
<div class="shi_game_menu">
    <div class="shi_game_menu">
        <div class="shi_game_menu_filed">   
            <div class="shi_game_menu_userinfo">
                <div class="shi_game_menu_userinfo_img">
                    
                </div>
                <br>
                <div class="shi_game_menu_userinfo_username">
                    
                </div>
                <br>
                <div class="shi_game_menu_userinfo_score">
                    
                </div>
                <br>
            </div>
            <div class="shi_game_menu_filed_item shi_game_menu_filed_item_single_mode">
                    单人模式
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_multi_mode">
                    多人模式
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_ranking_list">
                    战绩榜
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_settings">
                    退出
                </div>
        </div>
    </div>
</div>
`);

        this.$menu.hide();
        this.root.$shi_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.shi_game_menu_filed_item_single_mode');
        this.$multi_mode = this.$menu.find('.shi_game_menu_filed_item_multi_mode');
        this.$ranking_list = this.$menu.find('.shi_game_menu_filed_item_ranking_list');
        this.$settings = this.$menu.find('.shi_game_menu_filed_item_settings');
        this.$userinfo_score = this.$menu.find('.shi_game_menu_userinfo_score');
        this.$userinfo_username = this.$menu.find('.shi_game_menu_userinfo_username');
        this.$userinfo_img = this.$menu.find('.shi_game_menu_userinfo_img');

        this.start();

    }
    start() {
        this.add_listening_events();
    }
    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {
            // console.log("click single mode");
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function () {
            // console.log("click multi mode");
            outer.hide();
            outer.root.playground.show("multi mode");

        });
        this.$ranking_list.click(function () {
            // console.log("click multi mode");
            outer.hide();
            outer.root.rankinglist.show();

        });
        this.$settings.click(function () {
            // console.log("click settings");
            // console.log("click logout");
            outer.root.settings.logout_on_remote();
        });
    }


    show() {
        this.$menu.show();
    }
    hide() {
        this.$menu.hide();
    }
}
// 判定游戏结束
let game_over = 0;let game_over_time = 0;let game_is_win = 1;

let SHI_GAME_OBJECTS = []
class ShiGameObject { //基类，文件夹前缀加个a
    constructor() {
        SHI_GAME_OBJECTS.push(this);
        this.has_called_start = false; // 是否执行start函数
        this.timedelta = 0; // 当前帧距离上一帧的间隔
        this.uuid = this.create_uuid();
        // console.log(this.uuid);
    }
    create_uuid()
    {
        let res = "";
        for(let i = 0 ; i < 8; i ++)
        {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }
    start() // 只在第一帧执行
    {

    }
    update() // 每一帧一次
    {

    }
    late_update()
    {
        
    }
    on_destory() // 删除前执行一次
    {

    }

    destory() //删除该物体
    {
        this.on_destory();
        // console.log("destory");
        for (let i = 0; i < SHI_GAME_OBJECTS.length; i++) {
            if (SHI_GAME_OBJECTS[i] === this) {
                SHI_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

//游戏引擎
let last_timestamp;//上一帧
let SHI_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < SHI_GAME_OBJECTS.length; i++) {
        let obj = SHI_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();//标记执行过start
            obj.has_called_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp; //初始化时间间隔
            obj.update();
        }
    }
    
    for (let i = 0; i < SHI_GAME_OBJECTS.length; i++) {
        let obj = SHI_GAME_OBJECTS[i];
        obj.late_update();
    }

    last_timestamp = timestamp;
    //判定结束
    if(game_over === 1)
    {
        game_over_time = timestamp;
        game_over = -1;
    }
    
    requestAnimationFrame(SHI_GAME_ANIMATION);
}

requestAnimationFrame(SHI_GAME_ANIMATION);





class ChatField 
{
    constructor (playground)
    {
        this.playground = playground;
        this.$history = $(`<div class="shi_game_chat_field_history">历史记录</div>`);
        this.$input = $(`<input type="text" class="shi_game_chat_field_input">`);


        this.$history.hide();
        this.$input.hide();
        this.func_id = null;
        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input)
        this.start();
    }
    start()
    {
        this.add_listening_events();

    }

    render_message(message)
    {
        return $(`<div>${message}</div>`)
    }
    add_message(username, text)
    {
        this.show_history();
        let message = `[${username}] ${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    add_listening_events()
    {
        let outer = this;
        this.$input.keydown(function (e)
        {
            if (e.which === 27)
            {
                outer.hide_input();
                return false;
            }
            else if(e.which === 13)
            {
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if(text)
                {
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(username, text); 

                } 
                return false;
            }
            
        });
    }


    show_history()
    {
        let outer = this;
        this.$history.fadeIn();
        if(this.func_id)clearTimeout(this.func_id);
        this.func_id = setTimeout(function()
        {
            outer.$history.fadeOut();
            outer.func_id = null;
        }, 3000);
    }

    show_input()
    {
        this.show_history();
        this.$input.show();
        this.$input.focus();

    }


    hide_input()
    {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();


    }
}
class Grid extends ShiGameObject {
    constructor(playground, ctx, i, j, l, boder) {
        super();
        this.playground = playground;
        this.ctx = ctx;
        this.i = i;
        this.j = j;
        this.l = l;
        
        this.boder = boder;
        this.x = this.i * this.l;
        this.y = this.j * this.l;
        this.stroke_color = "rgba(0, 0, 0, 0.1)";
        if (this.boder === false)this.stroke_color = "black";
        // if(this.x === 0)this.stroke_color = "rgba(0, 0, 0, 1)";
    }

    start() {}

    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;
        let cx = ctx_x + this.l * 0.5, cy = ctx_y + this.l * 0.5; // grid的中心坐标
        // 处于屏幕范围外，则不渲染
        if (this.boder === true && (cx * scale < -0.2 * this.playground.width ||
            cx * scale > 1.2 * this.playground.width ||
            cy * scale < -0.2 * this.playground.height ||
            cy * scale > 1.2 * this.playground.height)) {
            return;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.l * 0.03 * scale;
        if(this.boder === false)this.ctx.lineWidth = this.l * 0.03 * scale * 0.02;
        this.ctx.strokeStyle = this.stroke_color;
        this.ctx.rect(ctx_x * scale, ctx_y * scale, this.l * scale, this.l * scale);
        this.ctx.stroke();
        this.ctx.restore();
    }
}


class GameMap extends ShiGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0 class="shi_game_playground_game_map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.width = this.playground.width;
        this.height = this.playground.height;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.playground.$playground.append(this.$canvas);
        this.generate_grid();
        this.start();

    }
    start() {
        
        this.$canvas.focus();
        
        // this.generate_wall();
        // this.has_called_start = true;
        
    }
    generate_grid() {
        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;

        let l = height; // 0.05 <==> 整个地图长宽划分为20份
        let nx = Math.ceil(width / l);
        let ny = Math.ceil(height / l);
        this.grids = [];
        for (let i = 0; i < ny; i ++ ) {
            for (let j = 0; j < nx; j ++ ) {
                this.grids.push(new Grid(this.playground, this.ctx, j, i, l, false));
            }
        }
        l = height * 0.025; // 0.05 <==> 整个地图长宽划分为20份
        nx = Math.ceil(width / l);
        ny = Math.ceil(height / l);
        for (let i = 0; i < ny; i ++ ) {
            for (let j = 0; j < nx; j ++ ) {
                this.grids.push(new Grid(this.playground, this.ctx, j, i, l, true));
            }
        }
    }

    update() {

        this.render();
    }
    //更新地图
    resize()
    {
        this.ctx.canvas.width = this.playground.map_width;
        this.ctx.canvas.height = this.playground.map_height;
        this.ctx.fillStyle = "rgba(176,224,230, 1)";
        // this.ctx.fillStyle = "rgba(176,224,230, 0)";

        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.render();

    }

    render()//更新画布 
    {
        // this.ctx.fillStyle = "rgba(53, 55, 75, 0.3)";
        this.ctx.fillStyle = "rgba(176,224,230, 0.6)";
        // this.ctx.fillStyle = "rgba(176,224,230, 0)s";

        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    // on_destory()
    // {
    //     while (this.grids && this.grids.length > 0) {
    //         this.grids[0].destory();
    //     }
    //     grids = [];
    // }

}


class MiniMap extends ShiGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas class="mini-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.bg_color = "rgba(0, 0, 0, 0.3)";
        this.bright_color = "rgba(247, 232, 200, 0.7)";
        this.players = this.playground.players; // TODO: 这里是浅拷贝?
        this.pos_x = this.playground.width - this.playground.height * 0.3;
        this.pos_y = this.playground.height * 0.7;
        this.width = this.playground.height * 0.3;
        this.height = this.width;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        
        this.playground.$playground.append(this.$canvas);
        this.real_map_width = this.playground.virtual_map_width;

        this.lock = false;
        this.drag = false;

    }

    start() {
        this.add_listening_events();
    }

    resize() {
        this.pos_x = this.playground.width - this.playground.height * 0.3;
        this.pos_y = this.playground.height * 0.7;
        this.width = this.playground.height * 0.3;
        this.height = this.width;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.margin_right = (this.playground.$playground.width() - this.playground.width) / 2;
        this.margin_bottom = (this.playground.$playground.height() - this.playground.height) / 2;
        this.$canvas.css({
            "position": "absolute",
            "right": this.margin_right,
            "bottom": this.margin_bottom,
        });

    }

    add_listening_events() {
        let outer = this;
        this.$canvas.on("contextmenu", function() {
            return false;
        });
        this.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            let ctx_x = e.clientX - rect.left, ctx_y = e.clientY - rect.top; // 小地图上的位置
            let tx = ctx_x / outer.width * outer.playground.virtual_map_width, ty = ctx_y / outer.height * outer.playground.virtual_map_height; // 大地图上的位置

            if (e.which === 1) { // 左键，定位屏幕中心
                outer.lock = true;
                outer.drag = false;

                outer.playground.focus_player = null;
                outer.playground.re_calculate_cx_cy(tx, ty);
                // (rect_x1, rect_y1)为小地图上框框的左上角的坐标（非相对坐标）
                outer.rect_x1 = ctx_x - (outer.playground.width / 2 / outer.playground.scale / outer.playground.virtual_map_width) * outer.width;
                outer.rect_y1 = ctx_y - (outer.playground.height / 2 / outer.playground.scale / outer.playground.virtual_map_height) * outer.height;
            } else if (e.which === 3) { // 右键，移动过去
                let player = outer.playground.players[0];
                if (player.character === "me") {
                    
                    player.move_to(tx, ty);
                }
            }
        });

        this.$canvas.mousemove(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            let ctx_x = e.clientX - rect.left, ctx_y = e.clientY - rect.top; // 小地图上的位置
            let tx = ctx_x / outer.width * outer.playground.virtual_map_width, ty = ctx_y / outer.height * outer.playground.virtual_map_height; // 大地图上的位置
            if (e.which === 1) {
                if (outer.lock) {
                    outer.drag = true;
                    outer.playground.focus_player = null;
                    outer.playground.re_calculate_cx_cy(tx, ty);
                    outer.rect_x1 = ctx_x - (outer.playground.width / 2 / outer.playground.scale / outer.playground.virtual_map_width) * outer.width;
                    outer.rect_y1 = ctx_y - (outer.playground.height / 2 / outer.playground.scale / outer.playground.virtual_map_height) * outer.height;
                }
            }
        });

        this.$canvas.mouseup(function(e) {
            if (outer.lock) outer.lock = false;
            
        });
    }

    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.clearRect(0, 0, this.width, this.height); // 不加这行的话小地图背景会变黑
        this.ctx.fillStyle = this.bg_color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        if (this.playground.focus_player) {
            this.rect_x1 = (this.playground.focus_player.x - this.playground.width / 2 / scale) / this.real_map_width * this.width;
            this.rect_y1 = (this.playground.focus_player.y - this.playground.height / 2 / scale) / this.real_map_width * this.height;
        }
        let w = this.playground.width / scale / this.real_map_width * this.width;
        let h = this.playground.height / scale / this.real_map_width * this.height;
        this.ctx.save();
        this.ctx.strokeStyle = this.bright_color;
        this.ctx.setLineDash([15, 5]);
        this.ctx.lineWidth = Math.ceil(3 * scale / 1080);
        this.ctx.strokeRect(this.rect_x1, this.rect_y1, w, h);
        this.ctx.restore();
        
        for (let i = 0; i < this.players.length; i ++ ) {
            let obj = this.players[i];
            // 物体在真实地图上的位置 -> 物体在小地图上的位置
            let x = obj.x / this.real_map_width * this.width, y = obj.y / this.real_map_width * this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.width * 0.04, 0, Math.PI * 2, false); // false代表顺时针
            if (obj.character === "me") this.ctx.fillStyle = "green";
            else this.ctx.fillStyle = "red";
            this.ctx.fill();
        }
    }

}
class NoticeBoard extends ShiGameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪：0人";
    }

    start() {
    }

    write(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}

class Particle extends ShiGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.friction = 0.9;
        this.move_length = move_length;
        this.eps = 0.01;

    }
    start() {

    }
    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destory();
            return false;

        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;

        this.render();
    }
    render() {
        let scale = this.playground.scale;
        
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }


        this.ctx.beginPath();
        // this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();


    }
}
class Player extends ShiGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo, user_mode) {
        // console.log(character, username, photo);
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.y = y;
        this.x = x;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.radius = radius;
        this.color = color;
        this.move_length = 0;
        this.speed = speed;
        this.character = character;
        this,username = username;
        this.photo = photo;
        //单独判断player属于那种模式
        this.user_mode = user_mode;
        
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;
        this.cur_skill = null;
        this.speed_old = this.speed;

        this.fireballs = [];

        if(this.character !== "robot"){
            this.img = new Image();
            this.img.src = this.photo;
        }
        else
        {
            this.img = new Image();
            this.img.src = "https://app171.acapp.acwing.com.cn/static/image/playground/huaidan.png"
        }
        // console.log(this.user_mode);

        if(this.character === "me")
        {
            this.fireball_coldtime = 3;
            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.blink_coldtime = 5;
            this.blink_img = new Image();
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";

        }
        else if(this.character === "robot")
        {
            this.fireball_coldtime = 3;

        }

    }


    start() {
        this.playground.player_count ++;
        this.playground.notice_board.write("🥰 智能匹配中");
        if(this.playground.player_count >= 3)
        {
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting  存活人数：" + this.playground.player_count + "   你要加油呀🥰");
        }
        if (this.character === "me") {
            this.add_listening_events();
        }
        else if(this.character === "robot"){
            // let tx = Math.random() * this.playground.width / this.playground.scale;
            // let ty = Math.random() * this.playground.height / this.playground.scale;
            
            let tx = Math.random() * this.playground.virtual_map_width;
            let ty = Math.random() * this.playground.virtual_map_height;
            
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        let m_x, m_y;//鼠标位置坐标
        //获取移动位置
        this.playground.game_map.$canvas.mousemove(function (e)
        {
            m_x = e.clientX, m_y = e.clientY;
        });
        //获取点击位置
        this.playground.game_map.$canvas.mousedown(function (e)
        {
            m_x = e.clientX, m_y = e.clientY;
        });
        // 禁用右键菜单
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });



        this.playground.game_map.$canvas.mousedown(function (e) {
            // console.log(outer.playground.state);

            

            if(outer.playground.state !== 'fighting') 
            {
                return true;
            }

            const rect = outer.ctx.canvas.getBoundingClientRect();

            let tx = (e.clientX - rect.left) / outer.playground.scale + outer.playground.cx;
            let ty = (e.clientY - rect.top) / outer.playground.scale + outer.playground.cy;
            
            if (e.which === 3) {// 右键3， 左键1， 滚轮2
                
                // let px = (m_x - rect.left) / outer.playground.scale, py = (m_y - rect.top) / outer.playground.scale;
                // let tx = px, ty = py;
                if (tx < 0 || tx > outer.playground.virtual_map_width || ty < 0 || ty > outer.playground.virtual_map_height) return; // 不能向地图外移动

                //点击地图的粒子效果
                // for (let i = 0; i < 10 + Math.random() * 10; i++) {
                //     //相对位置 
                //     let radius = outer.radius * Math.random() * 0.08;
                //     let angle = Math.random() * Math.PI * 2;
                //     let vx = Math.cos(angle), vy = Math.sin(angle);
                //     let color = outer.color;
                //     let speed = outer.speed * 0.15 * 5;
                //     let move_length = outer.radius * Math.random() * 2;
                //     new Particle(outer.playground, tx, ty, radius, vx, vy, "green", speed, move_length);
                // }
                // 相对位置 

                outer.move_to(tx, ty);

                if(outer.playground.mode === "multi mode")
                {
                    outer.playground.mps.send_move_to(tx, ty);
                }
                // if (ctx_x < 0 || ctx_x > outer.playground.virtual_map_width || ctx_y < 0 || ctx_y > outer.playground.virtual_map_height) return; // 不能向地图外移动
                // outer.move_to(e.clientX - rect.left + outer.playground.cx, e.clientY - rect.top + outer.playground.cy);


            }
            else if (e.which === 1) {
                
                // let tx = (m_x - rect.left) / outer.playground.scale, ty = (m_y - rect.top) / outer.playground.scale;
                if (outer.cur_skill === "fireball") {
                    // console.log(outer.cur_skill);   
                    //相对位置 
                    if(outer.fireball_coldtime > outer.eps)
                    {
                        return false;
                    }
                    let fireball = outer.shoot_fireball(tx, ty);
                    outer.fireball_coldtime = 0;
                    
                    // outer.shoot_fireball(ctx_x / outer.playground.scale, ctx_y / outer.playground.scale) / outer.playground.scale;
                    if(outer.playground.mode === "multi mode")
                    {
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                    }
                }
                // else if(outer.cur_skill === "fastmove")
                // {
                //     // console.log(outer.cur_skill);
                //     // outer.shoot_fireball((m_x - rect.left) / outer.playground.scale, (m_y - rect.top) / outer.playground.scale) / outer.playground.scale;
                //     //解除闪现
                //     outer.cur_skill = null;
                // }
                else if(outer.cur_skill === "blink")
                {
                    if(outer.blink_coldtime > outer.eps)
                    {
                        return false;
                    }
                    outer.blink(tx, ty);
                    outer.cur_skill = null;
                    outer.blink_coldtime = 5;
                    if(outer.playground.mode === "multi mode")
                    {
                        outer.playground.mps.send_blink(tx, ty);
                    }

                }
                outer.cur_skill = null;
            }

        });

        this.playground.game_map.$canvas.keydown(function (e) {

            if (e.which === 13) //enter
            {
                console.log(SHI_GAME_OBJECTS);

                if(outer.playground.mode === "multi mode")
                { // 打开聊天框
                    outer.playground.chat_field.show_input();
                    return false;
                }
            }
            else if (e.which === 27) // esc
            {
                if(outer.playground.mode === "multi mode")
                { // 关闭聊天框
                    outer.playground.chat_field.hide_input();
                }
            }

            if(outer.playground.state !== 'fighting') 
            {
                return true;
            }

            const rect = outer.ctx.canvas.getBoundingClientRect();

            if (e.which === 32 || e.which === 49) { // 按1键或空格聚焦玩家
                outer.playground.focus_player = outer;
                outer.playground.re_calculate_cx_cy(outer.x, outer.y);
                return false;
            }

            if (e.which === 81) { // q 火球
                if(outer.fireball_coldtime > outer.eps)
                {
                    return true;
                }
                outer.cur_skill = "fireball";
                // if (outer.cur_skill === "fireball") {
                //     console.log(outer.cur_skill);  
                //     //相对位置 
                //     outer.shoot_fireball((m_x - rect.left) / outer.playground.scale, (m_y - rect.top) / outer.playground.scale) / outer.playground.scale;
                // }
                // outer.cur_skill = null;
                return false;
            }
            // else if(e.which === 87)// w 闪现
            // {
            //     // outer.cur_skill = "fastmove";
            //     //相对位置 
            //     // outer.move_to((m_x - rect.left) / outer.playground.scale, (m_y - rect.top) / outer.playground.scale) / outer.playground.scale;
            //     return false;
            // }
            else if(e.which === 69)// e 
            {
                outer.cur_skill = "zisha";
                outer.is_attacked(0, 0.01 * 0.5);
                outer.cur_skill = null;
                return false;
                
            }
            else if(e.which === 70)// e 
            {
                if(outer.blink_coldtime > outer.eps)
                {
                    return true;
                }
                outer.cur_skill = "blink";
                return false;
                
            }

        });
    }


      
      
    shoot_fireball(tx, ty) {
        
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = 0.5;
        let move_length = 1;
        let damage = 0.01 * 0.9;

        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
        this.fireballs.push(fireball);

        
        return fireball;
    }

    blink(tx, ty)
    {
        let d = this.get_dist(this.x, this.y, tx, ty)
        d = Math.min(d, 0.8);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);
        this.move_length = 0; //闪现急停

    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        let outer = this;
        if(this.character === "me")
        {
            for (let i = 0; i < 10 + Math.random() * 10; i++) {
                //相对位置 
                let radius = outer.radius * Math.random() * 0.08;
                let angle = Math.random() * Math.PI * 2;
                let vx = Math.cos(angle), vy = Math.sin(angle);
                let color = outer.color;
                let speed = outer.speed * 0.15 * 5;
                let move_length = outer.radius * Math.random() * 2;
                new Particle(outer.playground, tx, ty, radius, vx, vy, "green", speed, move_length);
            }
        }
        
        // console.log("move to ", tx, ty);
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);



    }
    is_attacked(angle, damage) {
        for (let i = 0; i < 20 + Math.random() * 5; i++) {
            let x = this.x;
            let y = this.y;
            let radius = this.radius * Math.random() * 0.09;
            let angle = Math.random() * Math.PI * 2;
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 15 / 3;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        this.radius -= damage;
        if (this.radius < this.eps) {
            this.destory();
            return false;
        }
        this.dangeg_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 1.1;
    }
    re_calculate_cx_cy() {
        this.playground.cx = this.x - 0.5 * this.playground.width / this.playground.scale;
        this.playground.cy = this.y - 0.5 * this.playground.height / this.playground.scale;
    }

    receive_attacked(x, y, angle, damage, ball_uuid, attacker)
    {
        attacker.destory_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage);
        
        
    }

    update() 
    {
        this.spent_time += this.timedelta / 1000;
        this.update_move();
        
        if(this.user_mode === "single")
        {
            // this.update_single_gameover();
        }
        if(this.character === "me" && this.playground.state === "fighting")
        {
            this.update_coldtime();

        }
        if (this.character === "me" && this.playground.focus_player === this) this.playground.re_calculate_cx_cy(this.x, this.y); // 如果是玩家，并且正在被聚焦，修改background的 (cx, cy)



        // if (this.character === "me") this.re_calculate_cx_cy();

        this.render();
    }

    update_coldtime()
    {
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(0, this.fireball_coldtime);
        this.blink_coldtime -= this.timedelta / 1000;
        this.blink_coldtime = Math.max(0, this.blink_coldtime);
        // console.log(this.fireball_coldtime);
    }

    update_move() {// 更新移动
        if(Math.random() < 1 / 250.0 && this.character === "robot" && this.spent_time > 4)
        {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];       
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 1;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 1;
            if(player !== this)
                this.shoot_fireball(tx, ty);
        }

        if (this.damage_speed > this.eps) {
            this.vx = 0, this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character === "robot") {
                    // let tx = Math.random() * this.playground.width / this.playground.scale;
                    // let ty = Math.random() * this.playground.height / this.playground.scale;
                    
                    let tx = Math.random() * this.playground.virtual_map_width;
                    let ty = Math.random() * this.playground.virtual_map_height;
                    this.move_to(tx, ty);
                }
            }
            else {
                //闪现技能
                // if(this.cur_skill === "fastmove")
                // {
                //     this.speed = 1000000 * this.speed_old;
                // }
                // else if (this.character === "me"){
                //     //单机版开挂
                //     this.speed = 2.5 * this.speed_old;
                // }
                // else{
                    this.speed = 2 * this.speed_old;
                // }

                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        
       

        

    }
    update_single_gameover()//游戏结束
    {
        if(last_timestamp - game_over_time >= 500 && game_over === -1)
        {
            game_over = 0;
            // console.log(game_is_win);
            if(game_is_win === -1)
            {
                
                if(confirm("你输了,接下来是否返回主菜单？")){
                    location.reload();
                    return true;
                }
                else{
                    return false;
                }
                if(this.playground.players.length === 1)
                    location.reload();
                game_is_win = 0;
            }
            else
            {
                if(game_is_win === 1){
                    if(confirm("恭喜胜利，接下来是否返回主菜单？")){
                        location.reload();
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else
                {
                    if(confirm("游戏结束，接下来是否返回主菜单？")){
                        location.reload();
                        return true;
                    }
                    else{
                        return false;
                    }
                }

                // window.location.replace("https://app171.acapp.acwing.com.cn");
                
            }
            
        }

    }

    destory_fireball(uuid)
    {
        for(let i = 0; i < this.fireballs.length; i ++)
        {
            let fireball = this.fireballs[i];
            if( fireball.uuid === uuid)
            {
                fireball.destory();
                break;
            }
        }
    }

    on_destory()
    {
        this.playground.player_count --;
        if(this.playground.state === "fighting")
        {
            this.playground.notice_board.write("Fighting  存活人数：" + this.playground.player_count + "   你要加油呀🥰");
            if(this.playground.player_count === 1)
            {
                this.playground.notice_board.write("🎉🎉✨✨恭喜你取得最终胜利✨✨🎉🎉");
                this.playground.score_board.win();
            }
        }
        if(this.character === "me")
        {
            this.playground.state = "over";
            this.playground.notice_board.write("🐽铸币吧，好菜呀🐽");
            this.playground.score_board.lose();

        }
        for(let i = 0; i < this.playground.players.length; i ++)
        {
            if(this.playground.players[i] === this)
            {

                // 判断是否为输
                // console.log(this.character);
                if(this.character === "me"){
                    game_is_win = -1;
                    game_over = 1;
                }
                this.playground.players.splice(i, 1);
                // console.log("on_destory");
                break;
            }
        }
        // 判定游戏结束
        if(this.playground.players.length === 1 && this.playground.players[0].user_mode === "single")
        {
            game_over = 1;
        }

    }


    render()//更新画布 
    {
        let scale = this.playground.scale;

        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.2 * this.playground.width / scale ||
            ctx_x > 1.2 * this.playground.width / scale ||
            ctx_y < -0.2 * this.playground.height / scale ||
            ctx_y > 1.2 * this.playground.height / scale) {
            return;
        }



        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);

        // this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);

        // this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale); 
        this.ctx.restore();
        if(this.character === "me" && this.playground.state === "fighting")
        {
            this.render_skill_clodtime();
        }        
    }
    render_skill_clodtime()
    {
        let scale = this.playground.scale;
        let fireball_x = 0.5 + 0.3, fireball_y = 0.9, fireball_r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(fireball_x * scale, fireball_y * scale, fireball_r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (fireball_x - fireball_r) * scale, (fireball_y - fireball_r) * scale, fireball_r * 2 * scale, fireball_r * 2 * scale); 
        this.ctx.restore();


        let blink_x = 0.62 + 0.3, blink_y = 0.9, blink_r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(blink_x * scale, blink_y * scale, blink_r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (blink_x - blink_r) * scale, (blink_y - blink_r) * scale, blink_r * 2 * scale, blink_r * 2 * scale); 
        this.ctx.restore();



        if(this.fireball_coldtime > 0)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(fireball_x * scale, fireball_y * scale);
            this.ctx.arc(fireball_x * scale, fireball_y * scale, fireball_r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(fireball_x * scale, fireball_y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
            this.ctx.fill();
        }
        if(this.blink_coldtime > 0)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(blink_x * scale, blink_y * scale);
            this.ctx.arc(blink_x * scale, blink_y * scale, blink_r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.blink_coldtime / 5) - Math.PI / 2, true);
            this.ctx.lineTo(blink_x * scale, blink_y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
            this.ctx.fill();
        }
        

    }


}class ScoreBoard extends ShiGameObject {
    constructor(playground) {
        super();
        // console.log("ss");
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.state = null;  // win: 胜利，lose：失败

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png";
    }

    start() {
        // this.win(); 
        // console.log("win____");
        // console.log(this.state);
    }

    add_listening_events() {
        let outer = this;
        let $canvas = this.playground.game_map.$canvas;

        $canvas.on('click', function() {
            this.state = null;
            outer.playground.hide();
            outer.playground.root.menu.show();
            location.reload();

        });
    }

    win() {
        this.state = "win";
        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
            outer.playground.notice_board.write("单击退出");
        }, 3000);
    }

    lose() {
        this.state = "lose";
        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
            outer.playground.notice_board.write("单击退出");

        }, 3000);
    }

    late_update() {
        this.render();
    }
    // update() {
    //     this.render();
    // }


    render() {
        let len = this.playground.height / 2;
        if (this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        } 
        else if (this.state === "lose") {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}

class FireBall extends ShiGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.y = y;
        this.x = x;
        this.move_length = move_length;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.damage = damage;
        this.eps = 0.01;
        // console.log(this.player);
        // console.log(this.player.is_me);


    }
    start() {

    }
    update() {
        this.update_over();
        this.update_move();
        if(this.player.character !== "enemy")
        {
            this.update_attack();
        }
        
        this.render();

    }

    update_over()
    {
        if (this.move_length < this.eps) {
        this.destory();
        return false;
    }

    }
    update_move()
    {
        // console.log(this.move_length)
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        moved *= 1.5;
        if(this.player.is_me)moved *= 2;
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }
    update_attack()
    {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;

            }
        }

    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius) {
            return true;
        }
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);

        if(this.playground.mode === "multi mode")
        {
            
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
        this.destory();
    }


    on_destory()
    {
        let fireballs = this.player.fireballs;
        for(let i = 0; i < fireballs.length; i ++)
        {
            if(fireballs[i] === this)
            {
                fireballs.splice(i, 1);
                break;
            }
        }
    }


    render() {
        let scale = this.playground.scale;

        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }

        this.ctx.beginPath();
        // this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);

        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
}class MultiPlayerSocket
{
    constructor(playground)
    {
        this.playground = playground;
        this.ws = new WebSocket("wss://app171.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start()
    {
        this.receive();
    }


    receive()
    {
        let outer = this;
        this.ws.onmessage = function(e)
        {
            
            // 将string 转 json
            let data = JSON.parse(e.data);
            let uuid = data.uuid;

            // console.log(data);
            // console.log("uuuuu === ", uuid, data.uuid, outer.uuid);

            if(uuid === outer.uuid)return false;

            let event = data.event;
            if(event === "create_player")
            {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
            else if(event === "move_to")
            { 
                outer.receive_move_to(uuid, data.tx, data.ty);
            }
            else if(event === "shoot_fireball")
            {
                outer.receive_shoot_fireball(data.uuid, data.tx, data.ty, data.ball_uuid);
            }
            else if(event === "attack")
            {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            }
            else if(event === "blink")
            {
                outer.receive_blink(uuid, data.tx, data.ty);
            }
            else if(event === "message")
            {
                outer.receive_message(uuid, data.username, data.text);
            }

        };


    }


    send_create_player(username, photo)
    {
        let outer = this;
        this.ws.send(JSON.stringify(
            {
                'event' : "create_player",
                'uuid': outer.uuid,
                'username' : username,
                'photo': photo,

            }
        ));
    }
    receive_create_player(uuid, username, photo)
    {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale, 
            0.5, 
            0.05, 
            "white", 
            0.15, 
            "enemy",//敌人 
            username, 
            photo, 
            "multi"
        );
        player.uuid = uuid;
        this.playground.players.push(player);

    }
    get_player(uuid)
    {
        let players = this.playground.players;
        for(let i = 0; i < players.length; i ++)
        {
            let player = players[i];
            if(player.uuid === uuid)
                return player;

        }
        return null;
    }

    send_move_to(tx, ty)
    {
        let outer = this;
        this.ws.send(JSON.stringify(
            {
                'event' : "move_to",
                'uuid' : outer.uuid,
                'tx' : tx,
                'ty' : ty,

            }
        ));
    }
    receive_move_to(uuid, tx, ty)
    {
        let player = this.get_player(uuid)
        if (player)
        {
            player.move_to(tx, ty);
        }

    }

    

    send_shoot_fireball(tx, ty, ball_uuid)
    {
        let outer = this;
        this.ws.send(JSON.stringify(
            {
                'event' : "shoot_fireball",
                'uuid' : outer.uuid,
                'tx' : tx,
                'ty' : ty,
                'ball_uuid' : ball_uuid,
            }
        ));
    }
    receive_shoot_fireball(uuid, tx, ty, ball_uuid)
    {
        let player = this.get_player(uuid)
        if (player)
        {
            // player.move_to(tx, ty);
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;

        }

    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid)
    {
        let outer = this;
        this.ws.send(JSON.stringify(
            {
                'event' : "attack",
                'uuid' : outer.uuid,
                'attackee_uuid' : attackee_uuid,
                'x' : x,
                'y' : y,
                'angle' : angle,
                'damage' : damage,
                'ball_uuid' : ball_uuid,
            }
        ));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid)
    {
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);

        if (attacker && attackee)
        {
            attackee.receive_attacked(x, y, angle, damage, ball_uuid, attacker);


        }

    }

    send_blink(tx, ty)
    {
        let outer = this;
        this.ws.send(JSON.stringify(
            {
                'event' : "blink",
                'uuid' : outer.uuid,
                'tx' : tx,
                'ty' : ty,

            }
        ));
    }

    receive_blink(uuid, tx, ty)
    {
        let player = this.get_player(uuid);

        if (player)
        {
            player.blink(tx, ty);
        }

    }

    send_message(username, text)
    {
        let outer = this;
        this.ws.send(JSON.stringify(
            {
                'event' : "message",
                'uuid' : outer.uuid,
                'username' : username,
                'text' : text,

            }
        ));
    }
    receive_message(uuid, username, text)
    {
        // let player = this.get_player(uuid);
        this.playground.chat_field.add_message(username, text);

    }


}
class ShiGamePlayground {
    constructor(root) {
        this.root = root;
        this.focus_player = null;
        this.$playground = $(`
        <div class="shi_game_playground">  </div>
        `)
        this.hide();
        this.start();
    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }

    create_uuid()
    {
        let res = "";
        for(let i = 0 ; i < 8; i ++)
        {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }

    start() {
        let outer = this;
        let uuid = this.create_uuid();
        // console.log("start playground");
        //更新地图
        $(window).on(`resize.${uuid}`, function()
        {
            // console.log("resize");
            outer.resize();
        });

        if (this.root.AcWingOS)
        {
            this.root.AcWingOS.api.window.on_close(function()
            {
                $(window).off(`resize.${uuid}`);
            });
        }
    }

    //更新地图
    resize()
    {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height/ 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.map_width = 2 * unit * 16 / 2;
        this.map_height = 2 * unit * 9 / 2;
        this.scale = this.height;
        //调用game_map
        if (this.game_map) this.game_map.resize();
        if (this.mini_map) this.mini_map.resize();
    }

    re_calculate_cx_cy(x, y) {
        this.cx = x - 0.5 * this.width / this.scale;
        this.cy = y - 0.5 * this.height/ this.scale;
    }

    show(mode) 
    {
        let outer = this;
        this.$playground.show();
        this.root.$shi_game.append(this.$playground);

        //获取相对位置大小
        this.resize();


        // 虚拟地图大小改成相对大小
        this.virtual_map_width = 3;
        this.virtual_map_height = this.virtual_map_width; // 正方形地图，方便画格子


        //生成game_map
        this.game_map = new GameMap(this);


        //获取相对位置大小
        this.resize();
        this.mode = mode;

        

        this.state = "waiting"; // ---> fighting ---> over
        this.players = [];

        this.notice_board = new NoticeBoard(this);
        this.player_count = 0;
        this.score_board = new ScoreBoard(this);

        if(mode === "single mode")
        {
            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo, "single"));
            
            // 根据玩家位置确定画布相对于虚拟地图的偏移量
            this.re_calculate_cx_cy(this.players[0].x, this.players[0].y);
            this.focus_player = this.players[0];
    
            for (let i = 0; i < 5; i++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "black", 0.15, "robot", "", "", "single"));
                
            }

        }
        else if(mode === "multi mode")
        {

            this.chat_field = new ChatField(this);

            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo, "multi"));
            
            // 根据玩家位置确定画布相对于虚拟地图的偏移量
            this.re_calculate_cx_cy(this.players[0].x, this.players[0].y);
            this.focus_player = this.players[0];

            this.mps = new MultiPlayerSocket(this);//新建wbesocket链接对象
            this.mps.uuid = this.players[0].uuid;
            this.mps.ws.onopen = function()//链接创建成功后回调函数
            {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            }
        }

        // 在地图和玩家都创建好后，创建小地图对象
        this.mini_map = new MiniMap(this, this.game_map);
        this.mini_map.resize();
        



    }
    hide() {
        while (this.players && this.players.length > 0) {
            this.players[0].destory();
        }

        if (this.game_map) {
            this.game_map.destory();
            this.game_map = null;
        }

        if (this.notice_board) {
            this.notice_board.destory();
            this.notice_board = null;
        }

        if (this.score_board) {
            this.score_board.destory();
            this.score_board = null;
            console.log('12344');
        }

        this.$playground.empty();

        this.$playground.hide();
    }

}class RankingList {
    constructor(root) {
        this.root = root;
        this.$ranking_list = $(`
        <div class='shi_game_ranking_list'>
            <div class='shi_game_ranking_list_content'>
                <h3>战绩排行榜</h3>
                <table id="shi_game_ranking_list_content_table" class="table table_bordered table_striped">
                </table>
            </div>
            <div class='shi_game_ranking_list_back'>
            ESC
            </div>
        </div>`)
        this.root.$shi_game.append(this.$ranking_list);

        this.$ranking_list.hide();
        this.$list_back = this.$ranking_list.find('.shi_game_ranking_list_back');
        this.start();
    }

    start() {
        let outer = this;
        this.add_listening_events();

        let url = 'https://app171.acapp.acwing.com.cn/ranking_list/get_integral_info/';
        let field = 'integral';
        let f_title = '战绩';
        outer.send_get(url, field, f_title);
    }
    send_get(url, field, title) {
        console.log("获取数据库");
        let outer = this;
        $.ajax({
            url: url,
            type: 'GET',
            async: false,//取消异步
            success: function (resp) {
                outer.data = resp.data;
            }
        })
        $("#shi_game_ranking_list_content_table").bootstrapTable({
            pagination: true, //获得分页功能
            pageSize: 13, //默认分页数量
            pageList: [13],

            columns: [{
                field: "ranking",
                title: "排名"
            }, {
                field: "username",
                title: "玩家",
                formatter: function (value, row, index) {
                    return '<img src=' + row.username[1] + ' width=33px height=33px style="border-radius:100%;margin-left:6%"> <span>' + row.username[0] + '<span>'
                },

            }, {
                field: field,
                title: title,
            }],
            data: outer.data
        });
    }
    show() {
        this.$ranking_list.show();
    }
    add_listening_events() {
        let outer = this;
        this.$list_back.click(function () {
            outer.root.menu.$menu.show();
            outer.hide();
        });
    }
    hide() {
        this.$ranking_list.hide();
    }
}
class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) this.platform = "ACAPP";

        // console.log(this.platform);
        this.username = "";
        this.photo = "";



        this.$settings = $(`
<div class="shi_game_settings">

    <div class="shi_game_settings_login">

        <div class="shi_game_settings_title">
            登录
        </div>
                
        <div class="shi_game_settings_username">
            <div class="shi_game_settings_item">
                <input type="text" placeholder="用户名" >
            </div>
        </div>

        <div class="shi_game_settings_password">
            <div class="shi_game_settings_item">
                <input type="password" placeholder="密码" >
            </div>
        </div>

        <div class="shi_game_settings_submit">
            <div class="shi_game_settings_item">
                <button>登录</button>
            </div>
        </div>

        <div class="shi_game_settings_error_messages">
            
        </div>
        <div class="shi_game_settings_option">
            注册
        </div>

        <br>
        <br>
        <br>

        <div class="shi_game_settings_quick_login">
            <div class="shi_game_settings_quick_acwing">
                <img width="30" src="/static/image/settings/acwing_logo.png">
                <br>
                <div>
                    AcWing登录
                </div>
            </div>
            <div class="shi_game_settings_quick_gitee">
                <img width="30" src="https://cdn.acwing.com/media/article/image/2021/12/02/137551_c53a0bc853-META-INF_pluginIcon.png">
                <br>
                <div>
                    Gitee登录
                </div>
            </div>
            <div class="shi_game_settings_quick_github">
                <img width="30" src="https://cdn.jsdelivr.net/gh/zhangying458/CDN/nav/chapter/axvol-1j3rc.webp">
                <br>
                <div>
                    GitHub登录
                </div>
            </div>
        </div>
        

    </div>


    <div class="shi_game_settings_register">
        <div class="shi_game_settings_title">
            注册
        </div>
            
        <div class="shi_game_settings_username">
            <div class="shi_game_settings_item">
                <input type="text" placeholder="用户名" >
            </div>
        </div>

        <div class="shi_game_settings_password shi_game_settings_password_first ">
            <div class="shi_game_settings_item">
                <input type="password" placeholder="密码" >
            </div>
        </div>

        <div class="shi_game_settings_password shi_game_settings_password_second">
            <div class="shi_game_settings_item">
                <input type="password" placeholder="确认密码" >
            </div>
        </div>

        <div class="shi_game_settings_photo">
            <div class="shi_game_settings_item">
                <input type="text" placeholder="头像链接(默认可不填)" >
            </div>
        </div>

        <div class="shi_game_settings_submit">
            <div class="shi_game_settings_item">
                <button>注册</button>
            </div>
        </div>

        <div class="shi_game_settings_error_messages">
            
        </div>
        <div class="shi_game_settings_option">
            登录
        </div>

        <br>
        <div class="shi_game_settings_quick_login">
            <div class="shi_game_settings_quick_acwing">
                <img width="30" src="/static/image/settings/acwing_logo.png">
                <br>
                <div>
                    AcWing登录
                </div>
            </div>
            <div class="shi_game_settings_quick_gitee">
                <img width="30" src="https://cdn.acwing.com/media/article/image/2021/12/02/137551_c53a0bc853-META-INF_pluginIcon.png">
                <br>
                <div>
                    Gitee登录
                </div>
            </div>
            <div class="shi_game_settings_quick_github">
                <img width="30" src="https://cdn.jsdelivr.net/gh/zhangying458/CDN/nav/chapter/axvol-1j3rc.webp">
                <br>
                <div>
                    GitHub登录
                </div>
            </div>
        </div>

    </div>

</div>
`);
        this.$login = this.$settings.find(".shi_game_settings_login");
        this.$login_username = this.$login.find(".shi_game_settings_username input");
        this.$login_password = this.$login.find(".shi_game_settings_password input");
        this.$login_submit = this.$login.find(".shi_game_settings_submit button");
        this.$login_error_messages = this.$login.find(".shi_game_settings_error_messages");
        this.$login_register = this.$login.find(".shi_game_settings_option");

        this.$login.hide();

        this.$register = this.$settings.find(".shi_game_settings_register");
        this.$register_username = this.$register.find(".shi_game_settings_username input");
        this.$register_password = this.$register.find(".shi_game_settings_password_first input");
        this.$register_password_confirm = this.$register.find(".shi_game_settings_password_second input");
        this.$register_photo = this.$register.find(".shi_game_settings_photo input");
        this.$register_submit = this.$register.find(".shi_game_settings_submit button");
        this.$register_error_messages = this.$register.find(".shi_game_settings_error_messages");
        this.$register_login = this.$register.find(".shi_game_settings_option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find(".shi_game_settings_quick_acwing img");
        this.$gitee_login = this.$settings.find(".shi_game_settings_quick_gitee img");
        this.$github_login = this.$settings.find(".shi_game_settings_quick_github img");


        this.root.$shi_game.append(this.$settings);

        this.start();
    }

    add_listening_events()
    {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();
        this.$acwing_login.click(function()
        {
            // console.log("yes");
            outer.acwing_login();
        });
        this.$gitee_login.click(function(){
            // console.log("yes");
            outer.gitee_login();
        });
        this.$github_login.click(function(){
            // console.log("yes");
            outer.github_login();
        });

    }
    add_listening_events_login()
    {
        let outer = this;
        this.$login_register.click(function()
        {
            outer.register();
        });
        this.$login_submit.click(function()
        {

            outer.login_on_remote();
        });
    }
    add_listening_events_register()
    {

        let outer = this;
        this.$register_login.click(function()
        {
            outer.login();
        });
        this.$register_submit.click(function()
        {
            outer.register_on_remote();
        });
    }

    acwing_login()
    {
        // console.log("acwing_click login");
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success:function(resp)
            {
                if(resp.result === "success")
                {
                    // console.log(resp.apply_code_url);
                    window.location.replace(resp.apply_code_url);
                    
                }
            }
        });
    }

    // gitee一键登录
    gitee_login() 
    {
        // console.log("gitee_click login");
        $.ajax({
            url: "https://app171.acapp.acwing.com.cn/settings/gitee/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    // console.log(resp.apply_code_url);
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    github_login() 
    {
        // console.log("gitee_click login");
        $.ajax({
            url: "https://app171.acapp.acwing.com.cn/settings/github/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    console.log(resp.apply_code_url);
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }




    start() 
    {
        if(this.platform === "ACAPP")
        {
            // console.log("login_acapp");
            this.getinfo_acapp();
        }
        else{
            // console.log("login_web");
            this.getinfo_web();
            this.add_listening_events();
        }
    }

    login_on_remote() //登录远程服务器
    {
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_messages.empty();

        $.ajax({

            url: "https://app171.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data:{
                username: username,
                password: password,

            },
            success: function(resp)
            {
                // console.log(resp);
                if(resp.result === "success")
                {
                    location.reload();
                    // console.log("555");
                    

                }
                else{
                    outer.$login_error_messages.html(resp.result);
                }

            }

        });
    }
    register_on_remote()//注册远程服务器
    {
        let outer = this
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        let photo = this.$register_photo.val();
        this.$register_error_messages.empty();
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/register",
            type : "GET",
            data :{
                username :username,
                password : password,
                password_confirm: password_confirm,
                photo: photo,

            },
            success : function(resp)
            {
                // console.log(resp);
                // console.log(resp.result);
                if(resp.result === "success")
                {
                    location.reload();
                    // console.log("555");
                }
                else{
                    outer.$register_error_messages.html(resp.result);
                }

            }
        });

    }

    logout_on_remote()//登出远程服务器
    {   
        if(this.platform === "SHIAPP")return false;
        $.ajax({

            url : "https://app171.acapp.acwing.com.cn/settings/logout/",
            type : "GET",
            success : function(resp)
            {
                // console.log(resp)
                if(resp.result === "success" || resp.result === "success_not")
                {
                    location.reload();
                }
            }

        });

    }


    register() // 打开注册界面
    {
        this.$login.hide();
        this.$register.show();

    }

    login() // 打开登录界面
    {
        this.$register.hide();
        this.$login.show();

    }
    acapp_login(appid, redirect_uri, scope, state)
    {
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp){
            // console.log("called from acapp_login function");
            // console.log(resp.result);
            // console.log(resp);
            if(resp.result === "success")
            {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show() ;
            }
        });

    }


    getinfo_acapp()
    {
        let outer = this;
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type : "GET",
            success : function(resp)
            {
                if(resp.result === "success")
                {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }

        });
    }

    getinfo_web() 
    {
        let outer = this;
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/getinfo/",
            type : "GET",
            data:{
                platform : outer.platform,
            },
            success :function(resp){
                // console.log(resp);
                if(resp.result === "success"){
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                    outer.root.menu.$userinfo_username.html("用户名：" + resp.username);
                    outer.root.menu.$userinfo_score.html("战绩：" + resp.score);
                    outer.root.menu.$userinfo_img.html("<img  src="+ resp.photo +">");

                }else{
                    outer.login();
                    // outer.register();
                }
            }
        });
    }
    hide()
    {
        this.$settings.hide();
    }

    show()
    {
        this.$settings.show();
        
    }
}
export class ShiGame {
    constructor(id, AcWingOS) {
        // console.log(AcWingOS);
        
        this.id = id;
        this.$shi_game = $('#' + id);
        this.AcWingOS = AcWingOS;
        this.settings = new Settings(this);
        this.menu = new ShiGameMenu(this);
        this.playground = new ShiGamePlayground(this);
        this.rankinglist = new RankingList(this);

        this.start();
    }
    start() {
        // console.log("start")
    }
}