/**
 * Created by dchristo on 10/24/16.
 */

$(document).ready(function(){
    $("#mavideo").css('visibility','hidden');
    var position = window.location.search.indexOf("cle");
    if (position == -1) {
        $(".comms").hide();
        $(".test").hide();
    }
        $('#send-com').on('click', function (event) {
            var u_name_start_index = window.location.search.indexOf("=") + 1;
            var u_name_end_index = window.location.search.indexOf("&");
            var cle = window.location.search.slice(u_name_start_index, u_name_end_index);
            var u_quality = window.location.search.split("=")[2];

            event.preventDefault();
            if ($('#com-content').val() !== "") {
                $.ajax({
                    url: '/save_comm',
                    method: 'POST',
                    data: {content: $('#com-content').val(), cle: cle, quality: u_quality},
                    success: function (html) {
                        $('#com-content').val("");
                        var render = '<div class="comm">\
                        <div class="profil-views"  style="display:none">\
                            <img id="p-pic" src=' + html.u_pic + ' height="100" width="100" style="border-radius: 50%;border: 5px solid #eeeeee;float:left;"/>\
                            <div class="p-fname"></div>\
                            <div class="p-lname"></div>\
                        </div>\
                        <p class="comm-name">' + html.u_name + '</p>\
                        <p id="comm-time">' + html.time + '</p>\
                        <p id="comm-content">' + html.content + '</p>\
                    </div>';
                        var container = $(".comm-container").html();
                        container += render;
                        $(".comm-container").html(container);
                        $(document).on("mouseover", '.comm-name', function () {
                            $(this).prev($('.profil-views')).show('slow');
                            $('.p-uname').html($(this).text());
                        });
                        $(document).on("mouseout", '.profil-views', function () {
                            $('.profil-views').hide('slow');
                        });

                    }
                });
            }
            else
                $("#comm_erreur").html(html.translation.enter_qq).show('slow').delay(2000).hide('slow');
        });

        $(document).on("mouseover", '.comm-name', function () {
            $(this).prev($('.profil-views')).show('slow');
            $.ajax({
                url: '/get_user_data',
                method: 'POST',
                data: {login: $(this).text()},
                success: function (html) {
                    $('.p-fname').text(html.res[0].u_fname);
                    $('.p-lname').text(html.res[0].u_lname);
                    $('.p-pic').attr("src", html.res[0].u_pic);
                }
            });
        });

        $(document).on("mouseout", '.profil-views', function() {
            $('.profil-views').hide('slow');
        });
});

