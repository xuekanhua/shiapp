class ShiGameMenu
{
    constructor (root)
    {
        //一般.html对象加$普通的不加
        this.root = root;
        this.$menu = $(`
<div class="shi_game_menu">
    <div class="shi_game_menu">
        <div class="shi_game_menu_filed">
            <div class="shi_game_menu_filed_item shi_game_menu_filed_item_single_mode">
                    单人模式
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_multi_mode">
                    多人模式
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_settings">
                    设置
                </div>
        </div>
    </div>
</div>
`);
        this.root.$shi_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.shi_game_menu_filed_item_single_mode');
        this.$multi_mode = this.$menu.find('.shi_game_menu_filed_item_multi_mode');
        this.$settings = this.$menu.find('.shi_game_menu_filed_item_settings');
        this.start();

    }
    start()
    {
        this.add_listening_events();
    }
    add_listening_events()
    {
        let outer = this;
        this.$single_mode.click(function()
        {
            console.log("click single mode");
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function()
        {
            console.log("click multi mode");
        });
        this.$settings.click(function()
        {
            console.log("click settings");
        });
    }


    show()
    {
        this.$menu.show();
    }
    hide()
    {
        this.$menu.hide();
    }
}class ShiGamePlayground
{
    constructor(root)
    {
        this.root = root;
        this.$playground = $(`
        <div>游戏界面</div>
        `)
        this.hide();
        this.root.$shi_game.append(this.$playground);
        this.start();
    }
    start()
    {
        console.log("start");
    }
    
    show()
    {
        this.$playground.show();
    }
    hide()
    {
        this.$playground.hide();
    }

}class ShiGame 
{
    constructor(id)
    {
        this.id = id;
        this.$shi_game = $('#' + id);
        this.menu = new ShiGameMenu(this);
        this.playground = new ShiGamePlayground(this);
        this.start();
    }
    start()
    {
        console.log("start")
    }
}