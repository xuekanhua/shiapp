
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
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;
        this.cur_skill = null;
        this.speed_old = this.speed;
        if(this.is_me){
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
        }
        else
        {
            this.img = new Image();
            this.img.src = "https://app171.acapp.acwing.com.cn/static/image/playground/huaidan.png"
        }

    }


    start() {
        if (this.is_me) {
            this.add_listening_events();
        }
        else {
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        let x, y;//鼠标位置坐标
        //获取移动位置
        this.playground.game_map.$canvas.mousemove(function (e)
        {
            x = e.clientX, y = e.clientY;
        });
        //获取点击位置
        this.playground.game_map.$canvas.mousedown(function (e)
        {
            x = e.clientX, y = e.clientY;
        });
        // 禁用右键菜单
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {// 右键3， 左键1， 滚轮2
                //解除闪现
                if(outer.cur_skill === "fastmove")
                {
                    outer.cur_skill = null;
                }
                //点击地图的粒子效果
                for (let i = 0; i < 10 + Math.random() * 10; i++) {
                    //相对位置 
                    let px = (x - rect.left) / outer.playground.scale, py = (y - rect.top) / outer.playground.scale;
                    let radius = outer.radius * Math.random() * 0.08;
                    let angle = Math.random() * Math.PI * 2;
                    let vx = Math.cos(angle), vy = Math.sin(angle);
                    let color = outer.color;
                    let speed = outer.speed * 0.15 * 5;
                    let move_length = outer.radius * Math.random() * 2;
                    new Particle(outer.playground, px, py, radius, vx, vy, "green", speed, move_length);
                }
                //相对位置 
                outer.move_to((x - rect.left) / outer.playground.scale, (y - rect.top) / outer.playground.scale) / outer.playground.scale;
            }
            else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    // console.log(outer.cur_skill);   
                    //相对位置 
                    outer.shoot_fireball((x - rect.left) / outer.playground.scale, (y - rect.top) / outer.playground.scale) / outer.playground.scale;
                }
                else if(outer.cur_skill === "fastmove")
                {
                    // console.log(outer.cur_skill);
                    //解除闪现
                    outer.cur_skill = null;
                }
                outer.cur_skill = null;
            }

        });

        $(window).keydown(function (e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 81) { // q 火球
                outer.cur_skill = "fireball";
                if (outer.cur_skill === "fireball") {
                    console.log(outer.cur_skill);  
                    //相对位置 
                    outer.shoot_fireball((x - rect.left) / outer.playground.scale, (y - rect.top) / outer.playground.scale) / outer.playground.scale;
                }
                outer.cur_skill = null;
                return false;
            }
            else if(e.which === 87)// w 闪现
            {
                outer.cur_skill = "fastmove";
                //相对位置 
                outer.move_to((x - rect.left) / outer.playground.scale, (y - rect.top) / outer.playground.scale) / outer.playground.scale;
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
        for(let i = 0; i < this.playground.players.length; i ++)
        {
            if(this.playground.players[i] === this)
            {
                new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
                // console.log("shoot to ", tx, ty);
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
        if (this.radius < this.eps) {
            this.destory();
            return false;
        }
        this.dangeg_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 1.1;




    }
    update() 
    {
        this.update_move();
        this.update_gameover();
        this.render();
    }

    update_move() {// 更新移动
        this.spent_time += this.timedelta / 1000;
        if(Math.random() < 1 / 250.0 && !this.is_me && this.spent_time > 4)
        {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];       
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 1;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 1;
            if(player != this)
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
                if (!this.is_me) {
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
                else if (this.is_me){
                    //单机版开挂
                    this.speed = 3 * this.speed_old;
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
    
    on_destory()
    {
        for(let i = 0; i < this.playground.players.length; i ++)
        {
            if(this.playground.players[i] === this)
            {

                // 判断是否为输
                // console.log(this.is_me);
                if(this.is_me){
                    game_is_win = -1;
                    game_over = 1;
                }
                this.playground.players.splice(i, 1);
                console.log("on_destory");
            }
        }
        // 判定游戏结束
        if(this.playground.players.length === 1)
        {
            game_over = 1;
        }

    }


    render()//更新画布 
    {
        let scale = this.playground.scale;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale); 
        this.ctx.restore();
        
    }


}