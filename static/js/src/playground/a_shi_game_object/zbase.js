
// 判定游戏结束
let game_over = 0;let game_over_time = 0;let game_is_win = 1;

let SHI_GAME_OBJECTS = []
class ShiGameObject { //基类，文件夹前缀加个a
    constructor() {
        SHI_GAME_OBJECTS.push(this);
        this.has_called_start = false; // 是否执行start函数
        this.timedelta = 0; // 当前帧距离上一帧的间隔
        this.uuid = this.create_uuid();
        console.log(this.uuid);
    }
    create_uuid()
    {
        let res = "";
        for(let i = 0 ; i < 8; i ++)
        {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }
    start() // 只在第一帧执行
    {

    }
    update() // 每一帧一次
    {

    }
    on_destory() // 删除前执行一次
    {

    }

    destory() //删除该物体
    {
        this.on_destory();
        // console.log("destory");
        for (let i = 0; i < SHI_GAME_OBJECTS.length; i++) {
            if (SHI_GAME_OBJECTS[i] === this) {
                SHI_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

//游戏引擎
let last_timestamp;//上一帧
let SHI_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < SHI_GAME_OBJECTS.length; i++) {
        let obj = SHI_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();//标记执行过start
            obj.has_called_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp; //初始化时间间隔
            obj.update();
        }
    }
    last_timestamp = timestamp;
    //判定结束
    if(game_over === 1)
    {
        game_over_time = timestamp;
        game_over = -1;
    }
    
    requestAnimationFrame(SHI_GAME_ANIMATION);
}

requestAnimationFrame(SHI_GAME_ANIMATION);





