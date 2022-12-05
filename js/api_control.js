$(function () {
    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function eraseCookie(name) {   
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function apiCallCode(resource, method, body) {
        var jqXHR = $.ajax('http://18.209.223.63:8080' + resource, {
            contentType: 'application/json',
            type: method,
            data: body,
            success: function (data, textStatus, xhr) {
                return xhr.status
            },
            async: false
        });
        //console.log(jqXHR.responseText);
        //console.log(jqXHR.status);
        return jqXHR;
    }
    function getScore(method, body) {
        return Promise.resolve($.ajax('http://18.209.223.63:8090/scores', {
            contentType: 'application/json',
            type: method,
            data: body,
            //headers: {
            //    "Authorization": "Bearer " + token
            //},
            success: function (dados, textStatus, xhr) {
                console.log(xhr.status);
            }
        }))
    }
    function apiCall(resource, method, body, token) {
        return Promise.resolve($.ajax('http://18.209.223.63:8080' + resource, {
            contentType: 'application/json',
            type: method,
            data: body,
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (dados, textStatus, xhr) {
                console.log(xhr.status);

                //return xhr.status
                //if (xhr.status === '200') {
                //}
                //console.log(dados);
                //return -1;
            },
            complete: function () {
                //$('.loading').remove();
            }
        }))
    }

    async function logar(login_info) {
        let data = await apiCall("/login", "POST", login_info);
        try {
            console.log('Data:', data);
            //console.log("!!!!!!!!!!!"+ apiCallCode("/auth", "POST", login_info).status);
            //console.log("!!!!!!!!!!!"+ apiCall("/auth", "POST", login_info, data.access_token));
            //console.log(data.access_token);
            //console.log(apiCall("/auth", "POST", login_info, data.access_token).status);
            if (await check_auth(login_info, data.access_token)) {
                setCookie('email', JSON.parse(login_info).login, 1);
                console.log(getCookie('email'));
                //window.sessionStorage.setItem('email', JSON.parse(login_info).login);
                //console.log(JSON.parse(login_info).login);
                //console.log(window.sessionStorage.getItem('email'));
                window.location.href = "home.html";
            }
        } catch (error) {
            console.log('Error:', error);
        }

    }
    async function check_auth(login_info, token) {
        let api_return_code = await apiCall("/auth", "POST", login_info, token);
        try {
            console.log('code:', api_return_code);
            if (api_return_code.auth == "ok") {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }
    async function create_user(body) {
        let data = await apiCall("/users", "POST", body);
        try {
            console.log('Data:', data);
            test_string = String(data)
        } catch (error) {
            console.log('Error:', error);
        }
        const found = String(data).match(regex);
        if (test_string.match(regex)) {

            console.log('found!!!:', found);
        }
        console.log(found);

    }
    $(document).ready(function () {
        console.log(getCookie('email'));
        jsonObj = {"email": getCookie('email')}
        console.log(jsonObj);
        console.log(getScore('GET', JSON.stringify(jsonObj)));
        $("#test").text(function( index ) {
            return window.sessionStorage.getItem('email');
          });
        $("#play_btn").on({
            mouseenter: function () {
                $('.icon_highlight').css("color", "#4169e1");
            },
            mouseleave: function () {
                $('.icon_highlight').css("color", "#000000");
            },
            click: function () {
                window.location.href = "index.html";
            }
        });
        $("#report_btn").on({
            mouseenter: function () {
                $('#play_icon').css("color", "#4169e1");
            },
            mouseleave: function () {
                $('#play_icon').css("color", "#000000");
            },
            click: function () {
                window.location.href = "reports.html";
            }
        });
        //$('#phone-number').mask('0000-0000');
        //if (! check_auth(login_info, data.access_token)) {
        //    window.location.href="login.html";
        //}
        $("#btn_login").click(function () {
            //console.log("teste");
            var $items = $('#login, #password')
            var obj = {}
            $items.each(function () {
                obj[this.id] = $(this).val();
            })

            var json = JSON.stringify(obj);
            console.log(json);
            logar(json);
            //scorePoint($(this).attr('id'));
        });
        $("#btn_signup").click(function () {
            var $items = $('#email, #password')
            var obj = { "user_id": 27 }
            $items.each(function () {
                obj[this.id] = $(this).val();
            })
            var json = JSON.stringify(obj);

            console.log(json);
            create_user(json);

        });
    });
    //execution();
});