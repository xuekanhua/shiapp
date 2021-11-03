class ShiGameMenu
{
    constructor (root)
    {
        //一般.html对象加$普通的不加
        this.root = root;
        this.$menu = $(`
<div class="shi_game_menu">
</div>
`);
        this.root.$shi_game.append(this.$menu);
    }
}