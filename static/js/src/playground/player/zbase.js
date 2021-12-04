
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
                return false;
            }

            const rect = outer.ctx.canvas.getBoundingClientRect();

            let tx = (e.clientX - rect.left) / outer.playground.scale + outer.playground.cx;
            let ty = (e.clientY - rect.top) / outer.playground.scale + outer.playground.cy;
            
            if (e.which === 3) {// 右键3， 左键1， 滚轮2
                
                // let px = (m_x - rect.left) / outer.playground.scale, py = (m_y - rect.top) / outer.playground.scale;
                // let tx = px, ty = py;
                if (tx < 0 || tx > outer.playground.virtual_map_width || ty < 0 || ty > outer.playground.virtual_map_height) return; // 不能向地图外移动

                //点击地图的粒子效果
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
                    outer.fireball_coldtime = 3;
                    
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

        $(window).keydown(function (e) {
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
            this.update_single_gameover();
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
            console.log(game_is_win);
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