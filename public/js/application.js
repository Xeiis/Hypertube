$(document).ready(function() {
    // $("#header").before("<div id='mavideo'> <video loop autoplay> <source type='video/mp4' src='/movie/home.mp4'></video></div>");
    $("#sign_in").on('click', function () {
        $('#sign_in_form').show('slow');
        $('#sign_up_form').hide('fast');
        $(".login-bloc").show('slow');
    });

    $("#sign_up_toggle").on('click', function () {
        $('#sign_up_form').show('slow');
        $('#sign_in_form').hide('fast');
        $("#reset-pass-form").hide('fast');
    });

    $("#forgot_pass").on('click', function () {
        $("#reset-pass-form").show('slow');
        $('#sign_up_form').hide('fast');
    });
    $("#login_value").on('click', function(){
        html = '<form style="padding:30px 15px 15px 15px"> ';
        html += input('UserName');
        html += input('First Name');
        html += input('Last Name');
        html += input('E-mail');
        html += input('Password');
        html += input('Password Confirmation');
        $(".profile").html(html);
        if ($(".profile").css('display') == 'block')
            $(".profile").hide('fast');
        else
            $(".profile").show('slow');
        // afficher les infos de la personne dans une petite box
        /*
        if ($("#sidebar-wrapper").css('display') == 'block')
            $("#sidebar-wrapper").hide('fast');
        else
            $("#sidebar-wrapper").show('slow');
            */
    });

    var input = function(val){
        return '<div class="group"><input type="text" required=""> <span class="highlight"></span> <span class="bar"></span> <label>'+val+'</label></div>';
    }
});