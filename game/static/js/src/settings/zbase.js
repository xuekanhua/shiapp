class Settings {
    constructor(root) {
        this.root = root;
        this.platfrom = "WEB";
        if(this.root.AcWingOS) this.platfrom = "SHIAPP";
        this.username = "";
        this.photo = "";


        this.$settings = $(`
<div class="shi_game_settings">

    <div class="shi_game_settings_login">

        <div class="shi_game_settings_title">
            登录
        </div>
                
        <div class="shi_game_settings_username">
            <div class="shi_game_settings_item">
                <input type="text" placeholder="用户名" >
            </div>
        </div>

        <div class="shi_game_settings_password">
            <div class="shi_game_settings_item">
                <input type="password" placeholder="密码" >
            </div>
        </div>

        <div class="shi_game_settings_submit">
            <div class="shi_game_settings_item">
                <button>登录</button>
            </div>
        </div>

        <div class="shi_game_settings_error_messages">
            
        </div>
        <div class="shi_game_settings_option">
            注册
        </div>

        <br>
        <div class="shi_game_settings_acwing">
            <img width="30" src="https://app171.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>AcWing 一键登录</div>
        </div>

    </div>


    <div class="shi_game_settings_register">
        <div class="shi_game_settings_title">
            注册
        </div>
            
        <div class="shi_game_settings_username">
            <div class="shi_game_settings_item">
                <input type="text" placeholder="用户名" >
            </div>
        </div>

        <div class="shi_game_settings_password shi_game_settings_password_first ">
            <div class="shi_game_settings_item">
                <input type="password" placeholder="密码" >
            </div>
        </div>

        <div class="shi_game_settings_password shi_game_settings_password_second">
            <div class="shi_game_settings_item">
                <input type="password" placeholder="确认密码" >
            </div>
        </div>

        <div class="shi_game_settings_submit">
            <div class="shi_game_settings_item">
                <button>注册</button>
            </div>
        </div>

        <div class="shi_game_settings_error_messages">
            
        </div>
        <div class="shi_game_settings_option">
            登录
        </div>

        <br>
        <div class="shi_game_settings_acwing">
            <img width="30" src="https://app171.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>AcWing 一键登录</div>
        </div>

    </div>

</div>
`);
        this.$login = this.$settings.find(".shi_game_settings_login");
        this.$login_username = this.$login.find(".shi_game_settings_username input");
        this.$login_password = this.$login.find(".shi_game_settings_password input");
        this.$login_submit = this.$login.find(".shi_game_settings_submit button");
        this.$login_error_messages = this.$login.find(".shi_game_settings_error_messages");
        this.$login_register = this.$login.find(".shi_game_settings_option");

        this.$login.hide();
        this.$register = this.$settings.find(".shi_game_settings_register");
        this.$register_username = this.$register.find(".shi_game_settings_username input");
        this.$register_password = this.$register.find(".shi_game_settings_password_first input");
        this.$register_password_confirm = this.$register.find(".shi_game_settings_password_second input");
        this.$register_submit = this.$register.find(".shi_game_settings_submit button");
        this.$register_error_messages = this.$register.find(".shi_game_settings_error_messages");
        this.$register_login = this.$register.find(".shi_game_settings_option");

        this.$register.hide();

        this.root.$shi_game.append(this.$settings);

        this.start();
    }

    add_listening_events()
    {
        this.add_listening_events_login();
        this.add_listening_events_register();

    }
    add_listening_events_login()
    {
        let outer = this;
        this.$login_register.click(function()
        {
            outer.register();
        });
        this.$login_submit.click(function()
        {

            outer.login_on_remote();
        });
    }
    add_listening_events_register()
    {

        let outer = this;
        this.$register_login.click(function()
        {
            outer.login();
        });
        this.$register_submit.click(function()
        {
            outer.register_on_remote();
        });
    }



    start() 
    {
        this.getinfo();
        this.add_listening_events();
    }

    login_on_remote() //登录远程服务器
    {
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_messages.empty();

        $.ajax({

            url: "https://app171.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data:{
                username: username,
                password: password,

            },
            success: function(resp)
            {
                console.log(resp);
                if(resp.result === "success")
                {
                    location.reload();

                }
                else{
                    outer.$login_error_messages.html(resp.result);
                }

            }

        });
    }
    register_on_remote()//注册远程服务器
    {
        let outer = this
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_messages.empty();
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/register",
            type : "GET",
            data :{
                username :username,
                password : password,
                password_confirm: password_confirm,

            },
            success : function(resp)
            {
                console.log(resp);
                if(resp.success === "succsee")
                {
                    location.reload();
                }
                else{
                    outer.$register_error_messages.html(resp.result);
                }

            }
        });

    }

    logout_on_remote()//登出远程服务器
    {   
        if(this.platfrom === "SHIAPP")return false;
        $.ajax({

            url : "https://app171.acapp.acwing.com.cn/settings/logout/",
            type : "GET",
            success : function(resp)
            {
                console.log(resp)
                if(resp.result === "success" || resp.result === "success_not")
                {
                    location.reload();
                }
            }

        });

    }


    register() // 打开注册界面
    {
        this.$login.hide();
        this.$register.show();

    }

    login() // 打开登录界面
    {
        this.$register.hide();
        this.$login.show();

    }

    getinfo() 
    {
        let outer = this;
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/getinfo/",
            type : "GET",
            data:{
                platfrom : outer.platfrom,
            },
            success :function(resp){
                console.log(resp);
                if(resp.result === "success"){
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();

                }else{
                    outer.login();
                    // outer.register();
                }
            }
        });
    }
    hide()
    {
        this.$settings.hide();
    }

    show()
    {
        this.$settings.show();
        
    }
}