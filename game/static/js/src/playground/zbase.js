
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
        if (this.game_map) this.game_map.resize();
        // if (this.mini_map) this.mini_map.resize();
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
        // this.mini_map = new MiniMap(this, this.game_map);
        // this.mini_map.resize();


    }
    hide() {
        this.$playground.hide();
    }

}