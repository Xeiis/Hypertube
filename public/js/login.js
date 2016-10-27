/**
 * Created by aliandie on 10/27/16.
 */
$(document).ready(function(){
    $('#sign_up').on('click', (function(event){
    event.preventDefault();
    var password_regex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/);
    var email_regex    = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
    var err            = "";
    if (!password_regex.test($('#pass'))){
       err  += 'Password must contain at least 8 characters with a capital letter, a special character, a number</br>';
    }
    if (!($('#pass').val() === $('#cpass').val())) {
        err += "Password must match</br>";
    }
    if (!email_regex.test(email)) {
        err += "Please enter a valide email</br>";
    }
    if (err != ""){
        $("#signup_erreur").addClass('alert-danger').html(err).show();
    }
    else {
            var data = {
                u_name :  $('#user_name').val(),
                u_fname: $('#fname').val(),
                u_lname: $('#lname').val(),
                u_mail :  $('#email').val(),
                u_pass :  $('#pass').val()
            };
            $.ajax({
                url    : '/sign_up',
                method : 'POST',
                data   : data,
                success: function (html) {
                    $("#signup_erreur").addClass('alert-success').html("Great ! You are register on Hypertube").show();
                    $('#sign_up_form').hide();
                }
            });
        }
    }));

    $('#submit_connection').on('click', (function(event){
        event.preventDefault();
        var data = {
            u_name  : $('#login_in').val();
            u_pass  : $('#password_in').val();
        }
        $.ajax({
            url     : '/sign_in',
            method  : 'POST',
            data    : data,
            success : function (html) {
                console.log(html);
            }
        })
    });
});
