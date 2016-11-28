/**
 * Created by aliandie on 10/27/16.
 */
$(document).ready(function() {
    $("#header").before("<div id='mavideo'><video loop autoplay muted><source type='video/mp4' src='/movie/home.mp4'></video></div>");
    $('#sign_up').on('click', (function(event){
        event.preventDefault();
        var password_regex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/);
        var email_regex    = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
        var err            = "";
        if (!password_regex.test($('#pass').val())){
           err  += 'Password must contain at least 8 characters with a capital letter, a special character, a number</br>';
        }
        if (!($('#pass').val() === $('#cpass').val())) {
            err += "Password must match</br>";
        }
        if (!email_regex.test($("#email").val())) {
             err += "Please enter a valide email</br>";
        }
        if (err != "") {
            $("#signup_erreur").addClass('alert-danger').html(err).show().delay(2000).hide('slow');
        }
        else {
            var data = {
                u_name  :  $('#user_name').val(),
                u_fname :  $('#fname').val(),
                u_lname :  $('#lname').val(),
                u_mail  :  $('#email').val(),
                u_pass  :  $('#pass').val()
            };
            $.ajax({
                url    : '/sign_up',
                method : 'POST',
                data   : data,
                success: function (html) {
                    if(html.res == "OK") {
                        $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html(html.translation.sign_up_success).show().delay(2000).hide('slow');
                        $("#sign_up_form").hide('fast');
                    }
                    else
                        $("#signup_erreur").removeClass('alert-success').addClass('alert-danger').html(html.translation.email_used).show().delay(2000).hide('slow');
                }
            });
        }
    }));

    $('#submit_connection').on('click', (function(event){
        event.preventDefault();
        var data = {
            u_name  : $('#login_in').val(),
            u_pass  : $('#password_in').val()
        };
        $.ajax({
            url     : '/sign_in',
            method  : 'POST',
            data    : data,
            success : function (html) {
                if (html.res === "OK"){
                    $("#sign_in").hide('fast');
                    $("#sign_up_toggle").hide('fast');
                    $("#login_value").show('slow');
                    $("#logout").show('slow');
                    $("#name").text($('#login_in').val());
                    $("#name").show('slow');
                    $("#42_sign_in").hide('fast');
                    $("#fbtn").hide('fast');
                    $("#video").show('slow');
                    $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html(html.translation.bienvenue+' '+ $('#login_in').val()).show('slow').delay(2000).hide('slow');
                    $(".login-bloc").hide('fast');
                    window.location.href = 'http://localhost:3000/bibliotheque';
                }
                else if (html.res === "Wrong password") {
                    $('#pass-reset').show('slow');
                    $("#signup_erreur").addClass('alert-danger').html(html.translation.password_error).show('slow').delay(2000).hide('slow');
                }
                else
                    $("#signup_erreur").addClass('alert-danger').html(html.translation.login_error).show('slow').delay(2000).hide('slow');
            }
        })
    }));

    $('#reset').on('click', (function(event){
        event.preventDefault();
        if ($('#reset_uname').val() !== "" && $('#reset_umail').val() !== ""){
            var data = {
                u_name : $('#reset_uname').val(),
                u_mail : $('#reset_umail').val()
            };
            $.ajax({
                url     : '/check_user',
                method  : 'POST',
                data    : data,
                success : function(html){
                    if(html.res === "OK"){
                        $("#reset-pass-form").hide('fast');
                        $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html(html.translation.check_mail).show('slow').delay(2000).hide('slow');
                    }
                    else
                        $("#signup_erreur").addClass('alert-danger').html(html).show('slow').delay(2000).hide('slow');
                }
            })
        }

    }));


    if (window.location.search.includes("log") && window.location.search.includes("cle"))
    {
        $(".group").show('slow');
        $('#reset_pass').show('slow');
        $('#reset_cpass').show('slow');
        $('#reset-pass-form').show('slow');
    }

    $('#reset').on('click', function(event) {
        if ($('#reset_pass').val() !== "" && $('#reset_cpass').val() !== "") {
            var err            = "";
            var u_name_start_index = window.location.search.indexOf("=") + 1;
            var u_name_end_index   = window.location.search.indexOf("&");
            var u_name             = window.location.search.slice(u_name_start_index, u_name_end_index);
            var u_cle              = window.location.search.split("=")[2];
            var password_regex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/);
            if (!password_regex.test($('#reset_pass'))){
                 err  += 'Password must contain at least 8 characters with a capital letter, a special character, a number</br>';
            }
            if ($('#reset_pass').val() !== $('#reset_cpass').val()) {
                err += "Password must match</br>";
            }
            if (err !== "")
                $("#signup_erreur").addClass('alert-danger').html(err).show('slow');
            else {
                var data = {
                    u_pass   : $('#reset_pass').val(),
                    u_name   : u_name,
                    u_cle    : u_cle
                };
                $.ajax({
                    url: '/reset_pass',
                    method: 'POST',
                    data: data,
                    success: function (html) {
                        if (html.res === "OK") {
                            $("#signup_erreur").addClass('alert-success').removeClass('alert-danger').html(html.translation.password_update).show('slow').delay(2000).hide('slow');
                            $("#reset-pass-form").hide('fast');
                            $("#forgot_pass").hide('fast');
                        }
                        else{
                            $("#signup_erreur").addClass('alert-danger').html(html.translation.key_used).show('slow').delay(2000).hide('slow');
                        }
                    }
                })
            }
        }
    });

    $('#logout').on('click', function(event){
        event.preventDefault();
        $.ajax({
            url     : '/logout',
            method  : 'POST',
            success : function (html) {
                if (html.res === "OK"){
                    FB.getLoginStatus(function(response){
                        if (response.status == 'connected')
                            fbLogout();
                    });
                    $("#signup_erreur").addClass('alert-success').removeClass('alert-danger').html(html.translation.logout).show('slow').delay(2000).hide('slow');
                    window.location.href = 'http://localhost:3000/';
                }
                else
                    $("#signup_erreur").addClass('alert-danger').removeClass('alert-success').html(html.translation.something_wrong).show('slow').delay(2000).hide('slow');
            }
        })
    });
});

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1491425387550978',
        xfbml      : true,
        version    : 'v2.8'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var fbLogout = function (){
    FB.logout(function(response) {
    });
};

var checkLoginState_fb = function () {
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html("Facebook Connect").show().delay(2000).hide('slow');
            getCurrentUserInfo();
        } else {
            FB.login(function(response) {
                if (response.authResponse)
                    getCurrentUserInfo();
            }, { scope: 'email, name' });
        }
    });
};

var getCurrentUserInfo = function () {
    FB.api('/me', {fields: 'name, email, picture'}, function (userInfo) {
        console.log(userInfo);
        data = {
            u_name  : userInfo.name,
            u_mail  : userInfo.email,
            u_fname : userInfo.name.split(" ")[0],
            u_lname : userInfo.name.split(" ")[1],
            u_pic   : userInfo.picture.data.url

        };
        $.ajax({
            url: '/sign_in_fb',
            method: 'POST',
            data: data,
            success: function (html) {
                if(html == "OK") {
                    window.location.href = 'http://localhost:3000/bibliotheque';
                }
                else {
                    $("#signup_erreur").addClass('alert-danger').removeClass('alert-success').html(html.translation.something_wrong).show('slow').delay(2000).hide('slow');
                }
            }
        });
    })
};

