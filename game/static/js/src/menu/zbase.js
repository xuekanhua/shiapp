
class ShiGameMenu {
    constructor(root) {
        //一般.html对象加$普通的不加
        this.root = root;
        this.$menu = $(`
<div class="shi_game_menu">
    <div class="shi_game_menu">
        <div class="shi_game_menu_filed">   
            <div class="shi_game_menu_userinfo">
                <div class="shi_game_menu_userinfo_img">
                    
                </div>
                <br>
                <div class="shi_game_menu_userinfo_username">
                    
                </div>
                <br>
                <div class="shi_game_menu_userinfo_score">
                    
                </div>
                <br>
            </div>
            <div class="shi_game_menu_filed_item shi_game_menu_filed_item_single_mode">
                    单人模式
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_multi_mode">
                    多人模式
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_ranking_list">
                    战绩榜
                </div>
                <br>
                <div class="shi_game_menu_filed_item shi_game_menu_filed_item_settings">
                    退出
                </div>
        </div>
    </div>
</div>
`);

        this.$menu.hide();
        this.root.$shi_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.shi_game_menu_filed_item_single_mode');
        this.$multi_mode = this.$menu.find('.shi_game_menu_filed_item_multi_mode');
        this.$ranking_list = this.$menu.find('.shi_game_menu_filed_item_ranking_list');
        this.$settings = this.$menu.find('.shi_game_menu_filed_item_settings');
        this.$userinfo_score = this.$menu.find('.shi_game_menu_userinfo_score');
        this.$userinfo_username = this.$menu.find('.shi_game_menu_userinfo_username');
        this.$userinfo_img = this.$menu.find('.shi_game_menu_userinfo_img');

        this.start();

    }
    start() {
        this.add_listening_events();
    }
    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {
            // console.log("click single mode");
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function () {
            // console.log("click multi mode");
            outer.hide();
            outer.root.playground.show("multi mode");

        });
        this.$ranking_list.click(function () {
            // console.log("click multi mode");
            outer.hide();
            outer.root.rankinglist.show();

        });
        this.$settings.click(function () {
            // console.log("click settings");
            // console.log("click logout");
            outer.root.settings.logout_on_remote();
        });
    }


    show() {
        this.$menu.show();
    }
    hide() {
        this.$menu.hide();
    }
}