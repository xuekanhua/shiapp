
class GameMap extends ShiGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.width = this.playground.width;
        this.height = this.playground.height;
        this.map_width = this.playground.map_width;
        this.map_height = this.playground.map_height;
        this.ctx.canvas.width = this.map_width;
        this.ctx.canvas.height = this.map_height;

        this.playground.$playground.append(this.$canvas);

    }
    start() {
        
    }

    update() {

        this.render();
    }
    //更新地图
    resize()
    {
        this.ctx.canvas.width = this.playground.map_width;
        this.ctx.canvas.height = this.playground.map_height;
        this.ctx.fillStyle = "rgba(176,224,230, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.render();

    }

    render()//更新画布 
    {
        // this.ctx.fillStyle = "rgba(53, 55, 75, 0.3)";
        this.ctx.fillStyle = "rgba(176,224,230, 0.6)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}