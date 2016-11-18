$(document).ready(function() {
    var save = '';
    var input_save = '';
    var input_save_save = '';
    var save_save = '';
    var save_img;
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
        return '<div class="group"><input '+type+' required="" class="'+id+'" id="'+id_pass+'"> <span class="highlight"></span> <span class="bar"></span> <label class="'+id+' label">'+val+'</label></div>';
    };

    var get_user_data = function(hide){
        $.ajax({
            url    : '/get_user_data',
            method : 'POST',
            success: function (data) {
                html = '<form id="upload_picture" method="post" action="upload_picture" style="padding:0px 15px 15px 15px">';
                html += '<div style="margin:0 auto;width:100px;height:175px;"><img id="profile_picture" src='+data[0].u_pic+' height="100" width="100" style="border-radius: 50%;border: 5px solid #eeeeee;"><input type="file" name="singleInputFileName" style="position: relative;top: -100px;height: 100px;width: 100px;opacity: 0;"><input style="position: relative;top: -105px;width: auto;left: -12px;" type="submit" class="btn btn-default form_stack"  value="Change Picture")><input style="display:none;position: relative;top: -110px;width: auto;left: 20px;" type="submit" class="btn btn-default form_stack" id="reset" value="Reset")></div></form>';
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
                $(function () {
                    $('#upload_picture').on('submit', function (e) {

                        // On empêche le navigateur de soumettre le formulaire
                        e.preventDefault();

                        var $form = $(this);
                        var formdata = (window.FormData) ? new FormData($form[0]) : null;
                        var data = (formdata !== null) ? formdata : $form.serialize();
                        $.ajax({
                            url: "/upload_picture",
                            type: "POST",
                            contentType: false,
                            processData: false,
                            dataType: 'json',
                            data: data
                        })
                            .done(function(response) {
                                if (response.res == "NO PICTURE")
                                    $("#signup_erreur").addClass('alert-danger').removeClass('alert-success').html("U didn't choose a picture").show('slow').delay(2000).hide('slow');
                                else if (response.res == "MAUVAIS FORMAT")
                                    $("#signup_erreur").addClass('alert-danger').removeClass('alert-success').html("Picture format isn't valid").show('slow').delay(2000).hide('slow');
                                else if (response.res == "KO")
                                    $("#signup_erreur").addClass('alert-danger').removeClass('alert-success').html("Oups something went wrong").show('slow').delay(2000).hide('slow');
                                else if (response.res == "OK")
                                    $("#signup_erreur").addClass('alert-success').removeClass('alert-danger').html("You're picture successfully uploaded").show('slow').delay(2000).hide('slow');
                            });
                    });
                });
                $(function () {
                    // A chaque sélection de fichier
                    $('#upload_picture').find('input[name="singleInputFileName"]').on('change', function (e) {
                        console.log("une image a été choisi");
                        $("#reset").css('display','block');
                        var files = $(this)[0].files;

                        if (files.length > 0) {
                            // On part du principe qu'il n'y qu'un seul fichier
                            // étant donné que l'on a pas renseigné l'attribut "multiple"
                            var file = files[0];
                            // Ici on injecte les informations recoltées sur le fichier pour l'utilisateur
                            save_img = $("#profile_picture").attr('src');
                            $("#profile_picture").attr('src', window.URL.createObjectURL(file));
                        }
                    });

                    // Bouton "Annuler" pour vider le champ d'upload
                    $('#reset').on('click', function (e) {
                        e.preventDefault();
                        $("#profile_picture").attr('src', save_img);
                        $('#reset').css('display','none');
                        $('#upload_picture').find('input[name="singleInputFileName"]').val('');
                    });
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
                    if ($("input#password").val() != '' && $("input#password").val() == $("input#passwordConfirmation").val()) {
                        data.password = $("input#password").val();
                    }
                    console.log(data);
                    $.ajax({
                        url: '/update_profile',
                        method: 'POST',
                        data: data,
                        success: function (res) {
                            console.log(res);
                            if (res.res == "OK") {
                                $("#signup_erreur").addClass('alert-success').removeClass('alert-danger').html("You're profile has been updated for "+res.nb+" fields").show('slow').delay(2000).hide('slow');
                            }
                            else {
                                $("#signup_erreur").addClass('alert-danger').removeClass('alert-success').html("Oups something went wrong").show('slow').delay(2000).hide('slow');
                            }
                        }
                    });
                });
            }
        });
    };
    get_user_data(1);
});