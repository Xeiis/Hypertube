/**
 * Created by aliandie on 10/27/16.
 */
$(document).ready(function() {
    $('#sign_up').on('click', (function(event){
        event.preventDefault();
        var password_regex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/);
        var email_regex    = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
        var err            = "";
        // if (!password_regex.test($('#pass'))){
        //    err  += 'Password must contain at least 8 characters with a capital letter, a special character, a number</br>';
        // }
        // if (!($('#pass').val() === $('#cpass').val())) {
        //     err += "Password must match</br>";
        // }
        // if (!email_regex.test(email)) {
        //     err += "Please enter a valide email</br>";
        // }
        if (err != ""){
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
                    $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html("Great ! You are register on Hypertube").show().delay(2000).hide('slow');
                    $("#sign_up_form").hide('fast');
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
                if (html === "OK"){
                    $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html(html).show('slow').delay(2000).hide('slow');
                    $(".login-bloc").hide('fast');
                }
                else if (html === "Wrong password") {
                    $('#pass-reset').show('slow');
                    $("#signup_erreur").addClass('alert-danger').html(html).show('slow').delay(2000).hide('slow');
                }
                else
                    $("#signup_erreur").addClass('alert-danger').html('Wrong Login / Password').show('slow').delay(2000).hide('slow');
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
                    if(html === "OK"){
                        $("#reset-pass-form").hide('fast');
                        $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html("Check you\'re mail !").show('slow').delay(2000).hide('slow');
                    }
                    else
                        $("#signup_erreur").addClass('alert-danger').html(html).show('slow').delay(2000).hide('slow');
                }
            })
        }

    }));


    if (window.location.search.includes("log") && window.location.search.includes("cle"))
    {
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

            // var password_regex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/);
            // if (!password_regex.test($('#reset_pass'))){
            //     err  += 'Password must contain at least 8 characters with a capital letter, a special character, a number</br>';
            // }
            // if ($('#reset_pass').val() !== $('#reset_cpass').val()) {
            //     err += "Password must match</br>";
            // }
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
                        if (html === "OK") {
                            $("#signup_erreur").addClass('alert-success').removeClass('alert-danger').html("Password successfully updated.").show('slow').delay(2000).hide('slow');
                            $("#reset-pass-form").hide('fast');
                            $("#forgot_pass").hide('fast');
                        }
                        else{
                            $("#signup_erreur").addClass('alert-danger').html(html).show('slow').delay(2000).hide('slow');
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
                console.log(html);

                if (html === "OK"){
                    FB.getLoginStatus(function(response){
                        if (response.status == 'connected')
                            fbLogout();
                    });
                    $("#signup_erreur").addClass('alert-success').removeClass('alert-danger').html("You are disconnected").show();
                }
                else
                    $("#signup_erreur").addClass('alert-danger').removeClass('alert-success').html(html).show('slow');
            }
        })
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


function fbLogout(){
    FB.logout(function(response) {
    });
}
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html("You are connected with facebook").show();
            getCurrentUserInfo(response)
        } else {
            FB.login(function(response) {
                if (response.authResponse){
                    getCurrentUserInfo(response)
                } else {

                    console.log('Auth cancelled.')
                }
            }, { scope: 'email' });
        }
    });
}

function getCurrentUserInfo() {
    FB.api('/me', {fields: 'name,email'}, function (userInfo) {
        data = {
            u_name: userInfo.name,
            u_mail: userInfo.email,
            u_fname: userInfo.name.split(" ")[0],
            u_lname: userInfo.name.split(" ")[1]
        };
        $.ajax({
            url: '/sign_in_fb',
            method: 'POST',
            data: data,
            success: function (html) {

            }
        });
    })
}
    $('#con-edit').on('click', (function(event) {
        event.preventDefault();
        var password_regex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/);
        var email_regex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
        var err = "";
        // if (!password_regex.test($('#edit_pass'))){
        //    err  += 'Password must contain at least 8 characters with a capital letter, a special character, a number</br>';
        // }
        // if (!($('#edit_pass').val() === $('#edit_cpass').val())) {
        //     err += "Password must match</br>";
        // }
        // if (!email_regex.test($('#edit_email')) {
        //     err += "Please enter a valide email</br>";
        // }
        if (err != "") {
            $("#signup_erreur").addClass('alert-danger').html(err).show().delay(2000).hide('slow');
        }
        else {
            var data = new Object();
            if ($('#edit_name').val() !== "")
                data.u_name = $('#edit_name').val();
            if ($('#edit_fname').val() !== "")
                data.u_fname = $('#edit_fname').val();
            if ($('#edit_lname').val() !== "")
                data.u_lname = $('#edit_lname').val();
            if ($('#edit_email').val() !== "")
                data.u_email = $('#edit_email').val();
            if ($('#edit_pass').val() !== "")
                data.u_pass = $('#edit_pass').val();
            console.log(data);

            $.ajax({
                url    : '/edit',
                method : 'POST',
                data   : data,
                success: function (html) {
                    $("#signup_erreur").removeClass('alert-danger').addClass('alert-success').html("Great ! You are register on Hypertube").show().delay(2000).hide('slow');
                    $("#sign_up_form").hide('fast');
                }
            });
        }
    }));
});


