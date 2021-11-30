
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
        let outer = this;
        console.log("start playground");
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
        this.scale = this.height;
        //调用game_map
        if(this.game_map)this.game_map.resize();


    }

    show() {
        // window.alert("------------------\n欢迎游玩\n------------------\n本游戏尚在开发阶段\nQ为火球,W为闪现,右键移动\n祝您游玩愉快");
        this.$playground.show();
        this.resize();
        this.root.$shi_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();

        let unit = Math.min(this.width / 16, this.height/ 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;
        
        this.game_map = new GameMap(this);
        this.players = [];
        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "black", 0.15, false));
        }
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, true));


    }
    hide() {
        this.$playground.hide();
    }

}