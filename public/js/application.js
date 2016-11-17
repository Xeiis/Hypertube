$(document).ready(function() {
    var save = '';
    var input_save = '';
    var input_save_save = '';
    var save_save = '';
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
        if ($(".profile").css('display') == 'none')
            get_user_data();
        else
            $(".profile").hide('fast');
        // afficher les infos de la personne dans une petite box
        /*
        if ($("#sidebar-wrapper").css('display') == 'block')
            $("#sidebar-wrapper").hide('fast');
        else
            $("#sidebar-wrapper").show('slow');
            */
    });

    var input = function(val, id, id_pass){
        var type;
        type = id_pass ? "type='password'" : "type='text'";
        return '<div class="group"><input '+type+' required="" class="'+id+'" id="'+id_pass+'"> <span class="highlight"></span> <span class="bar"></span> <label class="'+id+'">'+val+'</label></div>';
    };

    var get_user_data = function(hide){
        $.ajax({
            url    : '/get_user_data',
            method : 'POST',
            success: function (data) {
                html = '<form style="padding:30px 15px 15px 15px">';
                html += '<div style="margin:0 auto;width:100px;height:100px;"><img src='+data[0].u_pic+' height="100" width="100" style="border-radius: 50%;border: 5px solid #eeeeee;"><input type="file" style="position: relative;top: -65px;height: 65px;width: 67px;opacity: 0;"></div>';
                html += input(data[0].u_name, 'username');
                html += input(data[0].u_fname, 'firstname');
                html += input(data[0].u_lname, 'lastname');
                html += input(data[0].u_mail, 'email');
                html += input('Password', 'no', 'password');
                html += input('Password Confirmation', 'no', 'passwordConfirmation');
                html += "<input type='submit' class='btn btn-default form_stack'  id='update_profile' value='Update')>";
                if (hide == 1){}
                else {
                    $(".profile").html(html);
                    $(".profile").show('slow');
                }
                $(document).on('click',function() {
                    if (input_save_save && $(this)[0].activeElement.className == input_save_save) {
                        return ;
                    }
                    if (input_save_save != ''){
                        $("label." + input_save_save).text(save_save);
                    }
                    if (input_save == $(this)[0].activeElement.className) {
                        return ;
                    }
                    if (input_save != '') {
                        $("label." + input_save).text(save);
                    }
                });
                $("input").on('click',function(){
                    var input = $(this).attr('class');
                    if (input == 'no')
                        return ;
                    if (input_save != '')
                        input_save_save = input_save;
                    if (save != '')
                        save_save = save;
                    input_save = input;
                    save = $("label." + input).text();
                    $("label." + input+"").text(input);
                });
                $("#update_profile").on('click', function(){
                    var data = {};
                    if ($("input.username").val() != '')
                        data.username = $("input.username").val();
                    if ($("input.firstname").val() != '')
                        data.firstname = $("input.firstname").val();
                    if ($("input.lastname").val() != '')
                        data.lastname = $("input.lastname").val();
                    if ($("input.email").val() != '')
                        data.email = $("input.email").val();
                    if ($("input#password").val() != '' && $("input#password").val() == $("input#passwordConfirmation").val())
                        data.password = $("input#password").val();
                    $.ajax({
                        url: '/update_profile',
                        method: 'POST',
                        data: data,
                        success: function (res) {
                            if (res == "OK") {
                                alert('ok');
                                // afficher un petit message
                            }
                            else {
                                alert(res);
                                // afficher un petit message
                            }
                        }
                    });
                });
            }
        });
    };
    get_user_data(1);
});