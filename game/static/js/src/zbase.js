class ShiGame 
{
    constructor(id)
    {
        this.id = id;
        this.$shi_game = $('#' + id);
        this.menu = new ShiGameMenu(this);
        

    }
}