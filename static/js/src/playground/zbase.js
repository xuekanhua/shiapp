
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

}