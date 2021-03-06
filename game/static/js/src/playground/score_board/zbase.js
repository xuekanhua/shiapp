class ScoreBoard extends ShiGameObject {
    constructor(playground) {
        super();
        // console.log("ss");
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.state = null;  // win: 胜利，lose：失败

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png";
    }

    start() {
        // this.win(); 
        console.log(this.playground);
        console.log(this.state);
    }

    add_listening_events() {
        let outer = this;
        let $canvas = this.playground.game_map.$canvas;

        $canvas.on('click', function() {
            this.state = null;
            outer.playground.hide();
            outer.playground.root.menu.show();
            location.reload();

        });
    }

    win() {
        if(this.state !== null)return true;
        this.state = "win";
        console.log(this.state);

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
            outer.playground.notice_board.write("单击退出");
        }, 3000);
    }

    lose() {
        if(this.state !== null)return true;
        this.state = "lose";
        console.log(this.state);

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
            outer.playground.notice_board.write("单击退出");

        }, 3000);
    }

    late_update() {
        this.render();
    }
    // update() {
    //     this.render();
    // }


    render() {
        let len = this.playground.height / 2;
        if (this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        } 
        else if (this.state === "lose") {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
