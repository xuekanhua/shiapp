class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) this.platform = "ACAPP";

        console.log(this.platform);
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
        <br>
        <br>

        <div class="shi_game_settings_quick_login">
            <div class="shi_game_settings_quick_acwing">
                <img width="30" src="/static/image/settings/acwing_logo.png">
                <br>
                <div>
                    AcWing登录
                </div>
            </div>
            <div class="shi_game_settings_quick_gitee">
                <img width="30" src="https://cdn.acwing.com/media/article/image/2021/12/02/137551_c53a0bc853-META-INF_pluginIcon.png">
                <br>
                <div>
                    Gitee登录
                </div>
            </div>
            <div class="shi_game_settings_quick_github">
                <img width="30" src="https://cdn.jsdelivr.net/gh/zhangying458/CDN/nav/chapter/axvol-1j3rc.webp">
                <br>
                <div>
                    GitHub登录
                </div>
            </div>
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

        <div class="shi_game_settings_photo">
            <div class="shi_game_settings_item">
                <input type="text" placeholder="头像链接(默认可不填)" >
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
        <div class="shi_game_settings_quick_login">
            <div class="shi_game_settings_quick_acwing">
                <img width="30" src="/static/image/settings/acwing_logo.png">
                <br>
                <div>
                    AcWing登录
                </div>
            </div>
            <div class="shi_game_settings_quick_gitee">
                <img width="30" src="https://cdn.acwing.com/media/article/image/2021/12/02/137551_c53a0bc853-META-INF_pluginIcon.png">
                <br>
                <div>
                    Gitee登录
                </div>
            </div>
            <div class="shi_game_settings_quick_github">
                <img width="30" src="https://cdn.jsdelivr.net/gh/zhangying458/CDN/nav/chapter/axvol-1j3rc.webp">
                <br>
                <div>
                    GitHub登录
                </div>
            </div>
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
        this.$register_photo = this.$register.find(".shi_game_settings_photo input");
        this.$register_submit = this.$register.find(".shi_game_settings_submit button");
        this.$register_error_messages = this.$register.find(".shi_game_settings_error_messages");
        this.$register_login = this.$register.find(".shi_game_settings_option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find(".shi_game_settings_quick_acwing img");
        this.$gitee_login = this.$settings.find(".shi_game_settings_quick_gitee img");
        this.$github_login = this.$settings.find(".shi_game_settings_quick_github img");


        this.root.$shi_game.append(this.$settings);

        this.start();
    }

    add_listening_events()
    {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();
        this.$acwing_login.click(function()
        {
            console.log("yes");
            outer.acwing_login();
        });
        this.$gitee_login.click(function(){
            console.log("yes");
            outer.gitee_login();
        });
        this.$github_login.click(function(){
            console.log("yes");
            outer.github_login();
        });

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

    acwing_login()
    {
        console.log("acwing_click login");
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success:function(resp)
            {
                if(resp.result === "success")
                {
                    console.log(resp.apply_code_url);
                    window.location.replace(resp.apply_code_url);
                    
                }
            }
        });
    }

    // gitee一键登录
    gitee_login() 
    {
        console.log("gitee_click login");
        $.ajax({
            url: "https://app171.acapp.acwing.com.cn/settings/gitee/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    console.log(resp.apply_code_url);
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    github_login() 
    {
        console.log("gitee_click login");
        $.ajax({
            url: "https://app171.acapp.acwing.com.cn/settings/github/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    console.log(resp.apply_code_url);
                    // window.location.replace(resp.apply_code_url);
                }
            }
        });
    }




    start() 
    {
        if(this.platform === "ACAPP")
        {
            console.log("login_acapp");
            this.getinfo_acapp();
        }
        else{
            console.log("login_web");
            this.getinfo_web();
            this.add_listening_events();
        }
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
        let photo = this.$register_photo.val();
        this.$register_error_messages.empty();
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/register",
            type : "GET",
            data :{
                username :username,
                password : password,
                password_confirm: password_confirm,
                photo: photo,

            },
            success : function(resp)
            {
                console.log(resp);
                console.log(resp.result);
                if(resp.result === "success")
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
        if(this.platform === "SHIAPP")return false;
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
    acapp_login(appid, redirect_uri, scope, state)
    {
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp){
            console.log("called from acapp_login function");
            console.log(resp.result);
            console.log(resp);
            if(resp.result === "success")
            {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show() ;
            }
        });

    }


    getinfo_acapp()
    {
        let outer = this;
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type : "GET",
            success : function(resp)
            {
                if(resp.result === "success")
                {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }

        });
    }

    getinfo_web() 
    {
        let outer = this;
        $.ajax({
            url : "https://app171.acapp.acwing.com.cn/settings/getinfo/",
            type : "GET",
            data:{
                platform : outer.platform,
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