
class ShiGameMenu {
    constructor(root) {
        //一般.html对象加$普通的不加
        this.root = root;
        this.$menu = $(`
<div class="shi_game_menu">
    <div class="shi_game_menu">
        <div class="shi_game_menu_filed">
            <div class="shi_game_menu_filed_item shi_game_menu_filed_item_single_mode">
                    单人模式
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_multi_mode">
                    多人模式
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
        this.$settings = this.$menu.find('.shi_game_menu_filed_item_settings');
        this.start();

    }
    start() {
        this.add_listening_events();
    }
    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {
            console.log("click single mode");
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function () {
            console.log("click multi mode");
            outer.hide();
            outer.root.playground.show("multi mode");

        });
        this.$settings.click(function () {
            console.log("click settings");
            console.log("click logout");
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






class GameMap extends ShiGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.width = this.playground.width;
        this.height = this.playground.height;
        this.map_width = this.playground.map_width;
        this.map_height = this.playground.map_height;
        this.ctx.canvas.width = this.map_width;
        this.ctx.canvas.height = this.map_height;

        this.playground.$playground.append(this.$canvas);

    }
    start() {
        
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
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.render();

    }

    render()//更新画布 
    {
        // this.ctx.fillStyle = "rgba(53, 55, 75, 0.3)";
        this.ctx.fillStyle = "rgba(176,224,230, 0.6)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}class NoticeBoard extends ShiGameObject {
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
        // let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        // if (ctx_x < -0.1 * this.playground.width || ctx_x > 1.1 * this.playground.width || ctx_y < -0.1 * this.playground.height || ctx_y > 1.1 * this.playground.height) {
            // return;
        // }


        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        // this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();


    }
}
class Player extends ShiGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo, user_mode) {
        console.log(character, username, photo);
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
        console.log(this.user_mode);

        if(this.character === "me")
        {
            this.fireball_coldtime = 3;
            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.blink_coldtime = 5;
            this.blink_img = new Image();
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";

        }

    }


    start() {
        this.playground.player_count ++;
        this.playground.notice_board.write("已就绪：" + this.playground.player_count);
        if(this.playground.player_count >= 3)
        {
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting");
        }
        if (this.character === "me") {
            this.add_listening_events();
        }
        else if(this.character === "robot"){
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
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
                return false;
            }

            const rect = outer.ctx.canvas.getBoundingClientRect();
            let ctx_x = e.clientX - rect.left + outer.playground.cx, ctx_y = e.clientY - rect.top + outer.playground.cy;

            if (e.which === 3) {// 右键3， 左键1， 滚轮2
                //解除闪现
                let px = (m_x - rect.left) / outer.playground.scale, py = (m_y - rect.top) / outer.playground.scale;
                let tx = px, ty = py;
                if(outer.cur_skill === "fastmove")
                {
                    outer.cur_skill = null;
                }
                //点击地图的粒子效果
                for (let i = 0; i < 10 + Math.random() * 10; i++) {
                    //相对位置 
                    let radius = outer.radius * Math.random() * 0.08;
                    let angle = Math.random() * Math.PI * 2;
                    let vx = Math.cos(angle), vy = Math.sin(angle);
                    let color = outer.color;
                    let speed = outer.speed * 0.15 * 5;
                    let move_length = outer.radius * Math.random() * 2;
                    new Particle(outer.playground, px, py, radius, vx, vy, "green", speed, move_length);
                }
                // 相对位置 

                outer.move_to(px, py);

                if(outer.playground.mode === "multi mode")
                {
                    outer.playground.mps.send_move_to(tx, ty);
                }
                // if (ctx_x < 0 || ctx_x > outer.playground.virtual_map_width || ctx_y < 0 || ctx_y > outer.playground.virtual_map_height) return; // 不能向地图外移动
                // outer.move_to(e.clientX - rect.left + outer.playground.cx, e.clientY - rect.top + outer.playground.cy);


            }
            else if (e.which === 1) {
                
                let tx = (m_x - rect.left) / outer.playground.scale, ty = (m_y - rect.top) / outer.playground.scale;
                if (outer.cur_skill === "fireball") {
                    // console.log(outer.cur_skill);   
                    //相对位置 
                    if(outer.fireball_coldtime > outer.eps)
                    {
                        return false;
                    }
                    let fireball = outer.shoot_fireball(tx, ty);
                    outer.fireball_coldtime = 3;
                    
                    // outer.shoot_fireball(ctx_x / outer.playground.scale, ctx_y / outer.playground.scale) / outer.playground.scale;
                    if(outer.playground.mode === "multi mode")
                    {
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                    }
                }
                else if(outer.cur_skill === "fastmove")
                {
                    // console.log(outer.cur_skill);
                    // outer.shoot_fireball((m_x - rect.left) / outer.playground.scale, (m_y - rect.top) / outer.playground.scale) / outer.playground.scale;
                    //解除闪现
                    outer.cur_skill = null;
                }
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

        $(window).keydown(function (e) {
            if(outer.playground.state !== 'fighting') 
            {
                return true;
            }

            const rect = outer.ctx.canvas.getBoundingClientRect();
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
            else if(e.which === 87)// w 闪现
            {
                outer.cur_skill = "fastmove";
                //相对位置 
                // outer.move_to((m_x - rect.left) / outer.playground.scale, (m_y - rect.top) / outer.playground.scale) / outer.playground.scale;
                return false;
            }
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
        let damage = 0.01 * 0.5;

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
            this.update_gameover();
        }
        if(this.character === "me" && this.playground.state === "fighting")
        {
            this.update_coldtime();

        }


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
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
                    this.move_to(tx, ty);
                }
            }
            else {
                //闪现技能
                if(this.cur_skill === "fastmove")
                {
                    this.speed = 1000000 * this.speed_old;
                }
                // else if (this.character === "me"){
                //     //单机版开挂
                //     this.speed = 2.5 * this.speed_old;
                // }
                else{
                    this.speed = 2 * this.speed_old;
                }

                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        
       

        

    }
    update_gameover()//游戏结束
    {
        if(last_timestamp - game_over_time >= 500 && game_over === -1)
        {
            game_over = 0;
            console.log(game_is_win);
            if(game_is_win === -1)
            {
                window.alert("你输了");
                if(this.playground.players.length === 1)
                    location.reload();
                game_is_win = 0;
            }
            else
            {
                if(game_is_win === 1)window.alert("恭喜胜利，接下来返回主菜单");
                else window.alert("游戏结束，接下来返回主菜单");
                // window.location.replace("https://app171.acapp.acwing.com.cn");
                location.reload();
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
        if(this.character === "me")
        {
            this.playground.state = "over";
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
                console.log("on_destory");
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
        // let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        // if (ctx_x < -0.2 * this.playground.width || ctx_x > 1.2 * this.playground.width || ctx_y < -0.2 * this.playground.height || ctx_y > 1.2 * this.playground.height) {
        //     return;
        // }
        // this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        // this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale); 
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale); 
        this.ctx.restore();
        if(this.character === "me" && this.playground.state === "fighting")
        {
            this.render_skill_clodtime();
        }        
    }
    render_skill_clodtime()
    {
        let scale = this.playground.scale;
        let fireball_x = 1.5, fireball_y = 0.9, fireball_r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(fireball_x * scale, fireball_y * scale, fireball_r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (fireball_x - fireball_r) * scale, (fireball_y - fireball_r) * scale, fireball_r * 2 * scale, fireball_r * 2 * scale); 
        this.ctx.restore();

        let blink_x = 1.62, blink_y = 0.9, blink_r = 0.04;
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

        // let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        // if (ctx_x < -0.1 * this.playground.width || ctx_x > 1.1 * this.playground.width || ctx_y < -0.1 * this.playground.height || ctx_y > 1.1 * this.playground.height) {
        //     return;
        // }

        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        // this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);

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

}
class ShiGamePlayground {
    constructor(root) {
        this.root = root;
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

    start() {
        let outer = this;
        console.log("start playground");
        //更新地图
        $(window).resize(function()
        {
            outer.resize();
        });
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
        if(this.game_map)this.game_map.resize();


    }

    show(mode) 
    {
        let outer = this;
        // window.alert("------------------\n欢迎游玩\n------------------\n本游戏尚在开发阶段\nQ为火球,W为闪现,右键移动\n祝您游玩愉快");
        this.$playground.show();
        this.root.$shi_game.append(this.$playground);
        //获取相对位置大小
        this.resize();
        //生成game_map
        this.game_map = new GameMap(this);
        //获取相对位置大小
        this.resize();
        this.mode = mode;

        this.state = "waiting"; // ---> fighting ---> over
        this.players = [];

        this.notice_board = new NoticeBoard(this);
        this.player_count = 0;

        if(mode === "single mode")
        {
            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo, "single"));
            // this.cx = this.players[0].x - 0.5 * this.width / 2;
            // this.cy = this.players[0].y - 0.5 * this.height / 2;
    
            for (let i = 0; i < 5; i++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "black", 0.15, "robot", "", "", "single"));
                
            }

        }
        else if(mode === "multi mode")
        {
            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo, "multi"));
            // this.cx = this.players[0].x - 0.5 * this.width / 2 ;
            // this.cy = this.players[0].y - 0.5 * this.height / 2 ;
            this.mps = new MultiPlayerSocket(this);//新建wbesocket链接对象
            this.mps.uuid = this.players[0].uuid;
            this.mps.ws.onopen = function()//链接创建成功后回调函数
            {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            }

            

        }


    }
    hide() {
        this.$playground.hide();
    }

}class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) this.platform = "ACAPP";

        console.log(this.platform);
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
        <div class="shi_game_settings_qick_login">

            <div class="shi_game_settings_qick_login_kong">

                <div class="shi_game_settings_acwing">
                    <img width="30" src="https://app171.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                    <br>
                    <div>acwing</div>
                    
                </div>

                <div class="shi_game_settings_kong">
                    &nbsp;&nbsp;&nbsp;
                </div>

                <div class="shi_game_settings_github">
                    <img width="30" src="https://cdn.acwing.com/media/article/image/2021/12/02/137551_c53a0bc853-META-INF_pluginIcon.png">
                    <br>
                    <div>git ee</div>
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
                <input type="text" placeholder="头像链接" >
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
        <div class="shi_game_settings_acwing">
            <img width="30" src="https://app171.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>一键登录</div>
        </div>
        <div class="shi_game_settings_github">
            <img width="30" src="https://cdn.acwing.com/media/article/image/2021/12/02/137551_c53a0bc853-META-INF_pluginIcon.png">
            <br>
            <div>git ee</div>
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

        this.$acwing_login = this.$settings.find(".shi_game_settings_acwing img");
        this.$github_login = this.$settings.find(".shi_game_settings_github img");

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
            console.log("yes");
            outer.acwing_login();
        });
        this.$github_login.click(function(){
            console.log("yes");
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
        console.log("acwing_click login");
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success:function(resp)
            {
                if(resp.result === "success")
                {
                    console.log(resp.apply_code_url);
                    window.location.replace(resp.apply_code_url);
                    
                }
            }
        });
    }

    // github一键登录
    github_login() 
    {
        console.log("github_click login");
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
            console.log("login_acapp");
            this.getinfo_acapp();
        }
        else{
            console.log("login_web");
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
                console.log(resp);
                if(resp.result === "success")
                {
                    location.reload();

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
                console.log(resp);
                console.log(resp.result);
                if(resp.result === "success")
                {
                    location.reload();
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
                console.log(resp)
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
            console.log("called from acapp_login function");
            console.log(resp.result);
            console.log(resp);
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
                console.log(resp);
                if(resp.result === "success"){
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();

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
        console.log(AcWingOS);
        
        this.id = id;
        this.$shi_game = $('#' + id);
        this.AcWingOS = AcWingOS;
        this.settings = new Settings(this);
        this.menu = new ShiGameMenu(this);
        this.playground = new ShiGamePlayground(this);

        this.start();
    }
    start() {
        console.log("start")
    }
}