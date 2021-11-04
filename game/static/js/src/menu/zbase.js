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
            <div class="shi_game_menu_filed_item shi_game_menu_filed_item_single">
                    单人模式
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_multi">
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
        this.$single = this.$menu.find('.shi_game_menu_filed_item_single');
        this.$multi = this.$menu.find('.shi_game_menu_filed_item_multi');
        this.$settings = this.$menu.find('.shi_game_menu_filed_item_settings');
        

    }
}