class RankingList {
    constructor(root) {
        this.root = root;
        this.$ranking_list = $(`
        <div class='shi_game_ranking_list'>
            <div class='shi_game_ranking_list_content'>
                <h3>战绩排行榜</h3>
                <table id="shi_game_ranking_list_content_table" class="table table_bordered table_striped">
                </table>
            </div>
            <div class='shi_game_ranking_list_back'>
            ESC
            </div>
        </div>`)
        this.root.$shi_game.append(this.$ranking_list);

        this.$ranking_list.hide();
        this.$list_back = this.$ranking_list.find('.shi_game_ranking_list_back');
        this.start();
    }

    start() {
        let outer = this;
        this.add_listening_events();

        let url = 'https://app171.acapp.acwing.com.cn/ranking_list/get_integral_info/';
        let field = 'integral';
        let f_title = '战绩';
        outer.send_get(url, field, f_title);
    }
    send_get(url, field, title) {
        console.log("获取数据库");
        let outer = this;
        $.ajax({
            url: url,
            type: 'GET',
            async: false,//取消异步
            success: function (resp) {
                outer.data = resp.data;
            }
        })
        $("#shi_game_ranking_list_content_table").bootstrapTable({
            pagination: true, //获得分页功能
            pageSize: 13, //默认分页数量
            pageList: [13],

            columns: [{
                field: "ranking",
                title: "排名"
            }, {
                field: "username",
                title: "玩家",
                formatter: function (value, row, index) {
                    return '<img src=' + row.username[1] + ' width=33px height=33px style="border-radius:100%;margin-left:6%"> <span>' + row.username[0] + '<span>'
                },

            }, {
                field: field,
                title: title,
            }],
            data: outer.data
        });
    }
    show() {
        this.$ranking_list.show();
    }
    add_listening_events() {
        let outer = this;
        this.$list_back.click(function () {
            outer.root.menu.$menu.show();
            outer.hide();
        });
    }
    hide() {
        this.$ranking_list.hide();
    }
}
