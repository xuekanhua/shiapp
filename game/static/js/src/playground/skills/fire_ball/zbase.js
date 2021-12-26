
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
}