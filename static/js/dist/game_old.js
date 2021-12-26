class AcGameChooseMode {
    constructor(root) {
        this.root = root;
        this.$choose_mode = $(`
            <div class="ac-game-choose-mode">
                <div class="ac-game-choose-mode-top">
                    <p class="ac-game-choose-mode-mode-desc">AI数量为6，AI攻击目标随机</p>
                </div>
                <div class="ac-game-choose-mode-middle">
                    <div class="ac-game-choose-mode-change-left"></div>
                    <p class="ac-game-choose-mode-mode-name">简单</p>
                    <div class="ac-game-choose-mode-change-right"></div>
                </div>
                <div class="ac-game-choose-mode-bottom">
                    <div class="ac-game-choose-mode-submit">确定</div>
                </div>
            </div>
        `);
        this.mode_names = ["简单", "中等", "困难"];
        this.mode_desc = ["AI数量为6，AI攻击目标随机", "AI数量为8，AI优先攻击玩家", "AI数量为8，AI优先攻击玩家，且预判更准，发射速度更快"];
        this.total_mode_num = 3;
        this.cur_mode_id = 0;
        this.$left_btn = this.$choose_mode.find(".ac-game-choose-mode-change-left");
        this.$right_btn = this.$choose_mode.find(".ac-game-choose-mode-change-right");
        this.$mode_name = this.$choose_mode.find(".ac-game-choose-mode-mode-name");
        this.$mode_desc = this.$choose_mode.find(".ac-game-choose-mode-mode-desc");
        this.$submit = this.$choose_mode.find(".ac-game-choose-mode-submit");
        this.hide();
        this.root.$ac_game.append(this.$choose_mode);
        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$left_btn.click(function() {
            outer.cur_mode_id --;
            if (outer.cur_mode_id < 0) outer.cur_mode_id = outer.total_mode_num - 1;
            outer.replace_text();
        });
        this.$right_btn.click(function() {
            outer.cur_mode_id ++;
            if (outer.cur_mode_id >= outer.total_mode_num) outer.cur_mode_id = 0;
            outer.replace_text();
        });
        this.$submit.click(function() {
            outer.hide();
            outer.root.playground.game_mode = outer.cur_mode_id;
            outer.root.playground.show("single mode");
        });
    }

    replace_text() {
        this.$mode_name.html(this.mode_names[this.cur_mode_id]);
        this.$mode_desc.html(this.mode_desc[this.cur_mode_id]);
    }

    show() {
        this.$choose_mode.show();
    }

    hide() {
        this.$choose_mode.hide();
    }
}
class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <audio class="ac-game-menu-bgm" src="https://git.acwing.com/TomG/resources/-/raw/master/menu-bgm.mp3" preload="auto" autoplay="autoplay" loop="loop"></audio>
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            退出账号
        </div>
    </div>
</div>
            `);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.$menu_bgm = document.getElementsByClassName('ac-game-menu-bgm')[0];

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single.click(function(){
            outer.hide();
            outer.root.choose_mode.show();
        });
        this.$multi.click(function(){
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote();
        });
    }

    show() {
        this.$menu.show();
        // this.$menu_bgm.play();
    }

    hide() {
        this.$menu.hide();
        this.$menu_bgm.pause();
    }
}
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false; // 是否已经调用过start函数
        this.timedelta = 0; // 当前帧距离上一帧的时间间隔
        this.uuid = this.create_uuid();
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i ++ ) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }

    start() {
    }

    update() {
    }

    on_destroy() {
    }

    destroy() {
        this.on_destroy();

        for(let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;

let AC_GAME_ANIMATION = function(timestamp) { // 这个函数在一般的浏览器中，会每秒调用60次
    for(let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.update();
            obj.timedelta = timestamp - last_timestamp;
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION); // 递归调用自己，以实现动画效果
}

requestAnimationFrame(AC_GAME_ANIMATION); 
class Grid extends AcGameObject {
    constructor(playground, ctx, i, j, l, stroke_color) {
        super();
        this.playground = playground;
        this.ctx = ctx;
        this.i = i;
        this.j = j;
        this.l = l;
        this.stroke_color = stroke_color;
        this.fill_color = "rgb(210, 222, 238)";
        this.x = this.i * this.l;
        this.y = this.j * this.l;
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
        if (cx * scale < -0.2 * this.playground.width ||
            cx * scale > 1.2 * this.playground.width ||
            cy * scale < -0.2 * this.playground.height ||
            cy * scale > 1.2 * this.playground.height) {
            return;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.l * 0.03 * scale;
        this.ctx.strokeStyle = this.stroke_color;
        this.ctx.rect(ctx_x * scale, ctx_y * scale, this.l * scale, this.l * scale);
        this.ctx.stroke();
        this.ctx.restore();
    }
}
class Wall extends AcGameObject {
    constructor(ctx, x, y, l, img_url) {
        super();
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.l = l;
        this.ax = this.x * this.l;
        this.ay = this.y * this.l;
        this.img = new Image();
        this.img.src = img_url;
    }

    start() {
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.l * 0.03;
        this.ctx.strokeStyle = "rgba(0,0,0,0)";
        this.ctx.rect(this.ax, this.ay, this.l, this.l);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.img, this.ax, this.ay, this.l, this.l);
        this.ctx.restore();
    }
}
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas class="ac-game-playground-game-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.width;
        this.playground.$playground.append(this.$canvas);

        this.start();
    }

    start() {
        this.generate_grid();
        // this.generate_wall();
        this.has_called_start = true;
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
    }

    get_random_color() {
        let colors = ['#00FFFF', '#00FF7F', '#8A2BE2', '#CD2990', '#7FFF00', '#FFDAB9', '#FF6437','#CD853F'];
        return colors[Math.floor(Math.random() * 6)];
    }
    generate_grid() {
        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;
        let l = height * 0.05; // 0.05 <==> 整个地图长宽划分为20份
        let nx = Math.ceil(width / l);
        let ny = Math.ceil(height / l);
        this.grids = [];
        for (let i = 0; i < ny; i ++ ) {
            for (let j = 0; j < nx; j ++ ) {
                this.grids.push(new Grid(this.playground, this.ctx, j, i, l, "black"));
            }
        }
    }

    generate_wall() {
        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;
        let l = height * 0.05;
        let nx = Math.ceil(width / l);
        let ny = Math.ceil(height / l);
        let wall_pic = "https://s3.bmp.ovh/imgs/2021/11/837412e46f4f61a6.jpg";
        this.walls = [];
        for (let i = 0; i < nx; i ++ ) {
            for (let j = 0; j < ny; j ++ ) {
                if (Math.random() < 20 / (nx * ny)) {
                    this.walls.push(new Wall(this.playground, this.ctx, i, j, l, wall_pic));
                }
            }
        }
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgb(176, 224, 230)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class MiniMap extends AcGameObject {
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
            "bottom": this.margin_bottom
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
                if (player.is_me) {
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
            this.ctx.arc(x, y, this.width * 0.05, 0, Math.PI * 2, false); // false代表顺时针
            if (obj.is_me) this.ctx.fillStyle = "green";
            else this.ctx.fillStyle = "red";
            this.ctx.fill();
        }
    }

}
class ClickParticle extends AcGameObject {
    constructor(playground, x, y, color) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.color = color;

        this.angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(this.angle);
        this.vy = Math.sin(this.angle);

        this.radius = 0.01;
        this.eps = 0.001;
    }

    start() {
    }

    update() {
        if (this.radius < this.eps) {
            this.destroy();
            return false;
        }
        this.x += this.vx * 1.2 / this.playground.scale;
        this.y += this.vy * 1.2 / this.playground.scale;
        this.radius *= 0.8;
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
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Particle extends AcGameObject {
    constructor(playground, x, y, vx, vy, radius, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = .9;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length <  this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
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
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
        super();
        this.playground = playground;
        this.ctx = playground.game_map.ctx;
        // 位置相关
        this.x = x;
        this.y = y;
        // 移动相关
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0; // 需要移动的距离
        this.friction = .9;
        this.eps = 0.01;
        // 渲染相关
        this.radius = radius;
        this.color = color;

        // 身份相关
        this.character = character;
        this.username = username;
        this.photo = photo;
        // 状态相关
        this.hp = 50;
        this.damage = 10;
        this.cur_skill = null; // 当前选择技能
        this.spent_time = 0; // 这个AI已经存在的时间
        this.is_hurtable = true;

        this.fireballs = [];

        if (this.character != "robot") {
            this.img = new Image();
            this.img.src = this.photo;
        }

        // 表情相关
        this.is_laughing = false;
        this.laugh_time = 0;
        this.laugh_img = new Image();
        this.laugh_img.src = "https://app243.acapp.acwing.com.cn/static/image/player/emoji/huaji.jpg";

    }

    start() {
        if (this.character === "me") {
            this.add_listening_events();
        } else if (this.character === "robot") {
            let tx = Math.random() * this.playground.virtual_map_width;
            let ty = Math.random() * this.playground.virtual_map_height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });

        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - rect.left) / outer.playground.scale + outer.playground.cx;
            let ty = (e.clientY - rect.top) / outer.playground.scale + outer.playground.cy;

            if (e.which == 3) { // 右键，移动
                if (tx < 0 || tx > outer.playground.virtual_map_width || ty < 0 || ty > outer.playground.virtual_map_height) return; // 不能向地图外移动
                // 创建点击地图特效
                for (let i = 0; i < 20; i ++ ) {
                    new ClickParticle(outer.playground, tx, ty, "rgb(217, 143, 214)");
                }
                outer.move_to(tx, ty);

                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_move_to(tx, ty);
                }
            } else if (e.which === 1) { // 左键，放技能
                if (outer.playground.players[0].character === "me") {
                    if (outer.cur_skill === "fireball") {
                        let fireball = outer.shoot_fireball(tx, ty);
                        outer.cur_skill = null;

                        if (outer.playground.mode === "multi mode") {
                            outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                        }
                    }
                }
            }
        });

        // canvas不能聚焦，所以要用window对象
        $(window).keydown(function(e) {
            if (e.which === 81) { // 绑定q键发射火球
                outer.cur_skill = "fireball";
                return false; // 不处理了
            }

            if (e.which === 32 || e.which === 49) { // 按1键或空格聚焦玩家
                outer.playground.focus_player = outer;
                outer.playground.re_calculate_cx_cy(outer.x, outer.y);
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - y, tx - x);
        let color = "orange";
        let speed = this.get_fireball_speed();
        let vy = Math.sin(angle);
        let vx = Math.cos(angle);
        let move_length = 1;
        let damage = this.damage;

        let fireball = new Fireball(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
        this.fireballs.push(fireball);
        return fireball;
    }

    is_attacked(angle, fireball) {
        // 创建粒子效果
        for (let i = 0; i < 20 + Math.random() * 10; i ++ ) {
            let x = this.x, y = this.y;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let radius = this.radius * Math.random() * .1;
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, vx, vy, radius, color, speed, move_length);
        }
        // this.radius -= fireball.damage;
        this.hp -= fireball.damage;
        if (this.hp <= 0) {
            this.destroy();
            fireball.player.laugh();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = fireball.damage / this.playground.scale * 100;
        // this.speed *= 0.8;
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vy = Math.sin(angle);
        this.vx = Math.cos(angle);
    }

    laugh() {
        this.is_laughing = true;
        this.laugh_time = 2000;
    }

    get_fireball_speed() { // 单机模式下，火球速度随游戏难度变化，分别取值[1, 1.5, 2]
        let multiplier = (this.playground.game_difficulty * 0.5) + 1;
        return multiplier * 0.5;
    }

    get_tx_ty(me, target) {
        // 解三角形
        let tan_a = (target.y - me.y) / (target.x - me.x);
        let tan_b = target.vy / target.vx;
        let tan_a_minus_b = (tan_a - tan_b) / (1 + tan_a * tan_b);
        let tan_alpha = - tan_a_minus_b;
        let sin_alpha = tan_alpha / (Math.sqrt(1 + tan_alpha * tan_alpha));
        let cos_alpha = Math.sqrt(1 - sin_alpha * sin_alpha);
        let fireball_speed = this.get_fireball_speed();
        let sin_beta = target.speed / fireball_speed * sin_alpha;
        let cos_beta = Math.sqrt(1 - sin_beta * sin_beta);
        let sin_alpha_plus_beta = sin_alpha * cos_beta + cos_alpha * sin_beta;
        let d_me_target = Math.sqrt((me.x - target.x) * (me.x - target.x) + (me.y - target.y) * (me.y - target.y));
        let target_moved = sin_beta * d_me_target / sin_alpha_plus_beta;
        let t = target_moved / target.speed;
        let tx = target.x + target.speed * target.vx * t;
        let ty = target.y + target.speed * target.vy * t;
        return {tx, ty}
    }


    update() {
        this.spent_time += this.timedelta / 1000;
        // AI每3s向随机其他敌人发射火球，如果没有敌人了，则不会发射
        if (this.character ==="robot" && this.spent_time > 4 && Math.random() < 1 / 180) {
            let other_players = [];
            for (let i = 0; i < this.playground.players.length; i ++ ) {
                let player = this.playground.players[i];
                if (player !== this)
                    other_players.push(player);
            }
            if (other_players.length > 0) {
                let tx, ty, player;
                let real_player = other_players[0];
                if (this.playground.game_mode < 2) {
                // 普通难度，随机攻击，普通预判
                    player = other_players[Math.floor(other_players.length * Math.random())];
                    tx = player.x + player.speed * player.vx * (0.3 + Math.random() * 0.5);
                    ty = player.y + player.speed * player.vy * (0.3 + Math.random() * 0.5);
                } else {
                    // 地狱难度，优先攻击玩家，究极预判
                    player = real_player;
                    if (player.vx === 0 && player.vy === 0) { // 如果玩家静止不动，get_tx_ty会除零得到NaN
                        tx = player.x;
                        ty = player.y;
                    } else { // 如果玩家在移动，则调用预判
                        let txy = this.get_tx_ty(this, player);
                        tx = txy.tx;
                        ty = txy.ty;
                    }
                }
                this.shoot_fireball(tx, ty);
            }
        } // function end

        if (this.damage_speed > this.eps) { // 正在被击退
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;

            this.damage_speed *= 0.7;
        } else {
            if(this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character === "robot") {
                    let tx = Math.random() * this.playground.virtual_map_width;
                    let ty = Math.random() * this.playground.virtual_map_height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length); // 一帧要移动的距离
                this.x += moved * this.vx;
                this.y += moved * this.vy;
                this.move_length -= moved;
            }
        }

        if (this.character === "me" && this.playground.focus_player === this) this.playground.re_calculate_cx_cy(this.x, this.y); // 如果是玩家，并且正在被聚焦，修改background的 (cx, cy)

        if (this.is_laughing) {
            this.laugh_time -= this.timedelta;
            if (this.laugh_time <= 0) this.is_laughing = false;
        }

        this.render();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.2 * this.playground.width / scale ||
            ctx_x > 1.2 * this.playground.width / scale ||
            ctx_y < -0.2 * this.playground.height / scale ||
            ctx_y > 1.2 * this.playground.height / scale) {
            return;
        }
        if (this.is_laughing) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.radius * 0.1;
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.laugh_img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        } else {
            if (this.character != "robot") {
                this.ctx.save();
                this.ctx.strokeStyle = this.color;
                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
                this.ctx.stroke();
                this.ctx.clip();
                this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
                this.ctx.restore();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
            }
        }
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }
}
class Fireball extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.player = player;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length; // 火球的射程
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move();
        this.update_attack();

        this.render();
    }

    update_move() {
        let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break; // 只攻击一名玩家
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(player.x, player.y, this.x, this.y);
        if (distance < player.radius + this.radius) {
            return true;
        }
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this);
        this.destroy();
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
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        for (let i = 0; i < this.player.fireballs.length; i ++ ) {
            let fireball = this.player.fireballs[i];
            if (fireball === this) {
                this.player.fireballs.splice(i, 1);
                break;
            }
        }
    }
}
class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app243.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        let outer = this;
        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            } else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            } else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            }
        };
    }

    send_create_player(username, photo) {
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': this.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            this.playground.player_speed,
            "enemy",
            username,
            photo
        );
        player.uuid = uuid;
        this.playground.players.push(player);
    }

    get_player(uuid) {
        let players = this.playground.players;
        for (let i = 0; i < players.length; i ++ ) {
            let player = players[i];
            if (player.uuid === uuid)
                return player;
        }
        return null;
    }

    send_move_to(tx, ty) {
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': this.uuid,
            'tx': tx,
            'ty': ty
        }));
    }

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);

        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        this.ws.send(JSON.stringify({
            'event': 'shoot_fireball',
            'uuid': this.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.game_difficulty = 0;
        this.focus_player = null;

        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.root.$ac_game.append(this.$playground);
        this.hide();

        this.start();
    }

    get_random_color() {
        let colors = ['#00FFFF', '#00FF7F', '#8A2BE2', '#CD2990', '#7FFF00', '#FFDAB9', '#FF6437','#CD853F'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    start() {
        let outer = this;
        $(window).resize(function() {
            outer.resize();
        });
    }

    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.unit = Math.min(this.width / 16, this.height / 9);
        this.width = this.unit * 16;
        this.height = this.unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();
        if (this.mini_map) this.mini_map.resize();
    }

    re_calculate_cx_cy(x, y) {
        this.cx = x - 0.5 * this.width / this.scale;
        this.cy = y - 0.5 * this.height/ this.scale;
    }

    show(mode) {
        let outer = this;
        this.mode = mode;
        this.$playground.show();

        // 虚拟地图大小
        // this.virtual_map_width = Math.max(this.width, this.height) * 2;
        // this.virtual_map_height = this.virtual_map_width; // 正方形地图，方便画格子
        // 虚拟地图大小改成相对大小
        this.virtual_map_width = 3;
        this.virtual_map_height = this.virtual_map_width; // 正方形地图，方便画格子

        this.game_map = new GameMap(this);

        this.resize();

        // 控制AI数量，AI移动速度
        let AI_num, AI_speed = 0.3; // 速度也要改成相对值
        if (this.game_difficulty === 0)
            AI_num = 6;
        else if (this.game_difficulty === 1)
            AI_num = 8;
        else {
            AI_num = 8;
            AI_speed *= 1.2;
        }
        this.player_speed = AI_speed;

        // 加入玩家
        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", AI_speed, "me", this.root.settings.username, this.root.settings.photo));
        // 根据玩家位置确定画布相对于虚拟地图的偏移量
        this.re_calculate_cx_cy(this.players[0].x, this.players[0].y);
        this.focus_player = this.players[0];

        if (mode === "single mode") {
            for (let i = 0; i < AI_num; i ++ ) {
                let px = Math.random() * this.virtual_map_width, py = Math.random() * this.virtual_map_height;
                this.players.push(new Player(this, px, py, 0.05, this.get_random_color(), AI_speed, "robot"));
            }
        } else if (mode === "multi mode") {
            this.mps = new MultiPlayerSocket(this);

            this.mps.uuid = this.players[0].uuid;
            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        }

        // 在地图和玩家都创建好后，创建小地图对象
        this.mini_map = new MiniMap(this, this.game_map);
        this.mini_map.resize();
    }

    hide() {
        this.$playground.hide();
    }
}
class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";
        this.$settings = $(`
            <div class="ac-game-settings">
                <div class="ac-game-settings-login">
                    <div class="ac-game-settings-title">
                        登录
                    </div>
                    <div class="ac-game-settings-username">
                        <div class="ac-game-settings-item">
                            <input type="text" placeholder="用户名">
                        </div>
                    </div>
                    <div class="ac-game-settings-password">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                    <div class="ac-game-settings-submit">
                        <div class="ac-game-settings-item">
                            <button>登录</button>
                        </div>
                    </div>
                    <div class="login-row">
                        <div class="ac-game-settings-error-message">
                        </div>
                        <div class="ac-game-settings-option">
                            注册
                        </div>
                    </div>
                    <div class="ac-game-settings-acwing">
                        <div class="ac-game-settings-third-party-login">
                            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                            <div class="ac-game-settings-third-party-login-text">
                                AcWing一键登录
                            </div>
                        </div>
                    </div>

                </div>

                <div class="ac-game-settings-register">

                    <div class="ac-game-settings-title">
                        注册
                    </div>
                    <div class="ac-game-settings-username">
                        <div class="ac-game-settings-item">
                            <input type="text" placeholder="用户名">
                        </div>
                    </div>
                    <div class="ac-game-settings-password ac-game-settings-password-first">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                    <div class="ac-game-settings-password ac-game-settings-password-second">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="确认密码">
                        </div>
                    </div>
                    <div class="ac-game-settings-submit">
                        <div class="ac-game-settings-item">
                            <button>注册</button>
                        </div>
                    </div>
                    <div class="login-row">
                        <div class="ac-game-settings-error-message">
                        </div>
                        <div class="ac-game-settings-option">
                            登录
                        </div>
                    </div>
                    <div class="ac-game-settings-acwing">
                        <div class="ac-game-settings-third-party-login">
                            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                            <div class="ac-game-settings-third-party-login-text">
                                AcWing一键登录
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        this.root.$ac_game.append(this.$settings);

        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");
        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");
        this.$register.hide();

        this.$acwing_login = this.$settings.find(".ac-game-settings-third-party-login");

        this.start();
    }

    start() {
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else if (this.platform === "WEB") {
            this.getinfo_web();
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();
        this.$acwing_login.click(function() {
            outer.acwing_web_login();
        });
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });

        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    acwing_web_login() {
        $.ajax({
            url: "https://app243.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET", 
            success: function(resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    acwing_acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    login_on_remote() {
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        $.ajax({
            url: "https://app243.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password
            },
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();
                } else if (resp.result === "error") {
                    outer.$login_error_message.html(resp.msg);
                }
            }
        });
    }

    register_on_remote() {
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();

        $.ajax({
            url: "https://app243.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm
            },
            success: function(resp) {
                if (resp.result === "error") {
                    outer.$register_error_message.html(resp.msg);
                } else if (resp.result === "success") {
                    location.reload();
                }
            }
        });
    }

    logout_on_remote() {
        if (this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            $.ajax({
                url: "https://app243.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function(resp) {
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
    }

    login() { // 打开登录页面
        this.$register.hide();
        this.$login.show();
    }

    register() { // 打开注册页面
        this.$login.hide();
        this.$register.show();
    }

    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://app243.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.acwing_acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }


    getinfo_web() {
        let outer = this;

        $.ajax({
            url: "https://app243.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}
export class AcGame {
    constructor(id, AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.choose_mode = new AcGameChooseMode(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {
    }
}