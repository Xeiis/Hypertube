$(document).ready(function() {
    $("#sign_in").on('click', function () {
        $('#sign_in_form').show('slow');
        $('#sign_up_form').hide('fast');
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
});