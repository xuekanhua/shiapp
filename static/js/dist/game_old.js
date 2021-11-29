
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
            outer.root.playground.show();
        });
        this.$multi_mode.click(function () {
            console.log("click multi mode");
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

let SHI_GAME_OBJECTS = []
class ShiGameObject { //基类，文件夹前缀加个a
    constructor() {
        SHI_GAME_OBJECTS.push(this);
        this.has_called_start = false; // 是否执行start函数
        this.timedelta = 0; // 当前帧距离上一帧的间隔
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

let last_timestamp;
let SHI_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < SHI_GAME_OBJECTS.length; i++) {
        let obj = SHI_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(SHI_GAME_ANIMATION);
}

requestAnimationFrame(SHI_GAME_ANIMATION);






class GameMap extends ShiGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

    }
    start() {
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(53, 55, 75, 0.3)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
        this.eps = 1;
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
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends ShiGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
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
        this.is_me = is_me;
        this.eps = 0.1;
        this.friction = 0.9;
        this.spent_time = 0;
        this.cur_skill = null;
        if(this.is_me){
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
        }
        

    }


    start() {
        if (this.is_me) {
            this.add_listening_events();
        }
        else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        let x, y;
        this.playground.game_map.$canvas.mousemove(function (e)
        {
            x = e.clientX, y = e.clientY;
        });
        this.playground.game_map.$canvas.mousedown(function (e)
        {
            x = e.clientX, y = e.clientY;
        });
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {// 右键3， 左键1， 滚轮2
                outer.move_to(x - rect.left, y - rect.top);
            }
            else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    console.log(outer.cur_skill);   
                    outer.shoot_fireball(x - rect.left, y - rect.top);
                }
                else if(outer.cur_skill === "fastmove")
                {
                    console.log(outer.cur_skill);
                    // this.x = x;
                    // this.y = y;

                }
                outer.cur_skill = null;
            }

        });
        // this.playground.game_map.$canvas.mousedown(function (e) {
        //     const rect = outer.ctx.canvas.getBoundingClientRect();
        //     if (e.which === 3) {// 右键3， 左键1， 滚轮2
        //         outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
        //     }
        //     else if (e.which === 1) {
        //         if (outer.cur_skill === "fireball") {
        //             console.log(outer.cur_skill);   
        //             outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
        //         }
        //         outer.cur_skill = null;
        //     }

        // });

        // this.playground.game_map.$canvas.mousemove(function (e)
        // {
        //     const rect = outer.ctx.canvas.getBoundingClientRect();

        //     if (outer.cur_skill === "fireball") {
        //         console.log(outer.cur_skill);   
        //         outer.shoot_fireball(x - rect.left, y - rect.top);
        //     }
        //     outer.cur_skill = null;
        // });
        $(window).keydown(function (e) {
            if (e.which === 81) { // q
                outer.cur_skill = "fireball";
                const rect = outer.ctx.canvas.getBoundingClientRect();
                if (outer.cur_skill === "fireball") {
                    console.log(outer.cur_skill);   
                    outer.shoot_fireball(x - rect.left, y - rect.top);
                }
                outer.cur_skill = null;
                return false;
            }
            else if(e.which === 87)
            {
                outer.cur_skill = "fastmove";
            }

        });
    }


      
      
    shoot_fireball(tx, ty) {
        
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        let damage = this.playground.height * 0.01;
        for(let i = 0; i < this.playground.players.length; i ++)
        {
            if(this.playground.players[i] === this)
            {
                new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
                console.log("shoot to ", tx, ty);
            }
        }
        
        

    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        console.log("move to ", tx, ty);
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
            let speed = this.speed * 15;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        this.radius -= damage;
        if (this.radius < 10) {
            this.destory();
            return false;
        }
        this.dangeg_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.9;




    }
    update() {
        this.spent_time += this.timedelta / 1000;
        if(Math.random() < 1 / 250.0 && !this.is_me && this.spent_time > 4)
        {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];       
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 1;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 1;
            this.shoot_fireball(tx, ty);
        }

        if (this.damage_speed > 10) {
            this.vx = 0, this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            }
            else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                if (this.is_me) moved *= 2.5;
                if(this,this.cur_skill === "fastmove") moved *= 10;
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        if(this.playground.players.length === 1)
        {
            setTimeout(window.alert("游戏结束"), 10000);

            // setTimeout(after(), 1000);
                
            // location.reload();
        }
        this.render();
    }

    on_destory()
    {
        for(let i = 0; i < this.playground.players.length; i ++)
        {
            if(this.playground.players[i] === this)
            {
                this.playground.players.splice(i, 1);
                console.log("on_destory");
            }
        }

    }

    render() {

        if(this.is_me)
        {

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }else{
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
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
        this.eps = 0.1;
        // console.log(this.player);
        // console.log(this.player.is_me);


    }
    start() {

    }
    update() {
        if (this.move_length < this.eps) {
            this.destory();
            return false;
        }
        // console.log(this.move_length)
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        moved *= 1.5;
        if(this.player.is_me)moved *= 2;
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);

            }
        }

        this.render();

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
        this.destory();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
}
class ShiGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
        <div class="shi_game_playground">  </div>
        `)
        this.hide();
        // this.root.$shi_game.append(this.$playground);
        // this.width = this.$playground.width();
        // this.height = this.$playground.height();
        // this.game_map = new GameMap(this);
        // this.players = [];
        // for (let i = 0; i < 5; i++) {
        //     this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        // }
        // this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        

        this.start();
    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }

    start() {
        console.log("start playground");
    }
    show() {
        this.$playground.show();
        this.root.$shi_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));


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
        <div class="shi_game_settings_acwing">
            <img width="30" src="https://app171.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>AcWing 一键登录</div>
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
            <div>AcWing 一键登录</div>
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

        this.$acwing_login= this.$settings.find(".shi_game_settings_acwing img");


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
            outer.acwing_login();
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
function sleep3(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, ms)
    })
}
async function init() {
    await sleep3(1000);
}
init().then(() => {
    console.log(3000)
})