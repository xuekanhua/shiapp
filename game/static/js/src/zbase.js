
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