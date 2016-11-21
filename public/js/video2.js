/**
 * Created by dchristo on 10/24/16.
 */
// var download_end = function() {
//     var u_name_start_index = window.location.search.indexOf("=") + 1;
//     var u_name_end_index   = window.location.search.indexOf("&");
//     var u_id               = window.location.search.slice(u_name_start_index, u_name_end_index);
//     var u_quality          = window.location.search.split("=")[2];
//     $.ajax({
//         url: '/download_end',
//         method: 'POST',
//         data: {id: u_id, quality: u_quality} // l'id du film en db
//     })
//         .done(function (res) {
//             if (res.res == "yes") {
//                 clearInterval(this.watchDownload);
//                 html = "<button class='bouton' style='padding:15px;'><a  style='color:white' href='http://localhost:3000/video?cle="+res.cle+"&quality="+res.quality+"'> Regardé le film maintenant </a></button>";
//                 $("#voir_la_video").html(html);
//             }
//         });
//
//     $.ajax ({
//         url: '/customstream',
//         method : 'POST',
//         data : {id: u_id, quality: u_quality}
//     })
//         .done(function(res) {
//             console.log(res);
//             if (res == ""){
//              html = "<button class='bouton' style='padding:15px;'><a  style='color:white' href='http://localhost:3000/video?cle="+res.cle+"&quality="+res.quality+"'> Regardé le film maintenant </a></button>";
//            $("#voir_la_video").html(html);
//        }
//     });
//
// };

// var watchDownload = setInterval(download_end, 7000);

$(document).ready(function(){
    $("#mavideo").css('visibility','hidden');
    $('#send-com').on('click', function(event){
        var u_name_start_index = window.location.search.indexOf("=") + 1;
        var u_name_end_index   = window.location.search.indexOf("&");
        var cle               = window.location.search.slice(u_name_start_index, u_name_end_index);
        var u_quality          = window.location.search.split("=")[2];

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
                            <img id="p-pic" src='+html.u_pic+' height="100" width="100" style="border-radius: 50%;border: 5px solid #eeeeee;float:left;"/>\
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
                    $(document).on("mouseover", '.comm-name', function(){
                        $(this).prev($('.profil-views')).show('slow');
                        $('.p-uname').html($(this).text());
                    });
                    $(document).on("mouseout", '.profil-views', function() {
                        $('.profil-views').hide('slow');
                    });

                }
            });
        }
        else
            $("#comm_erreur").html("Enter something please").show('slow').delay(2000).hide('slow');
    });
    $(document).on("mouseover", '.comm-name', function(){
        $(this).prev($('.profil-views')).show('slow');
        $.ajax({
            url : '/get_user_data',
            method : 'POST',
            data : {login : $(this).text()},
            success : function(html){
                $('.p-fname').text(html[0].u_fname);
                $('.p-lname').text(html[0].u_lname);
                $('.p-pic').attr("src", html[0].u_pic);
                console.log(html[0].u_pic);
            }
        });
    });

    $(document).on("mouseout", '.profil-views', function() {
        $('.profil-views').hide('slow');
    });
});

