
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
        // window.alert("------------------\n欢迎游玩\n------------------\n本游戏尚在开发阶段\nQ为火球,W为闪现,右键移动\n祝您游玩愉快");
        this.$playground.show();
        this.root.$shi_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "black", this.height * 0.15, false));
        }
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));


    }
    hide() {
        this.$playground.hide();
    }

}