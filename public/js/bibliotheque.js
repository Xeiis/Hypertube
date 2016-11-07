/**
 * Created by dchristo on 10/27/16.
 *
**/
var result = 0;
var finish = 0;
$(document).scroll(function() {
    var body = document.body;
    if (body.scrollTop + (window.innerHeight) >= (body.scrollHeight - (body.scrollHeight * 0.01)))
    {
        if (finish == 0) {
            result += 21;
            finish = 1;
            $.ajax({
                url: '/load_more_bibliotheque',
                method: 'POST',
                data: {result: result}
            })
                .done(function (res) {
                    if (res) {
                        var bibliotheque = $("#bibliotheque").html();
                        var i = 0;
                        var html = '';
                        while(res[i]) {
                             html += "<div class='big_vignette col-lg-3 col-sm-4 col-xs-4' style='margin:15px'>";
                             html += "<p style='text-align:center;font-weight:700;font-size:medium;min-height:44px;'>"+res[i].title+"</p>";
                             html += "<p style='text-align:center;font-weight:700'>"+res[i].year+"</p>";
                             html += "<p style='text-align:center;font-weight:700'>"+res[i].rating+"</p>";
                             html += "<div class='vignette' style='background: url("+res[i].medium_cover_image+") center no-repeat; height:340px; margin:15px')></div>";
                             html += "<div class='button' style='text-align:center'>";
                             if (res[i].torrent_3D_id)
                                html += "<button class='film_3D bouton' movie='"+res[i].id+"' style='margin:5px;'>3D</button>";
                             html += "<button class='film_720p bouton' movie='"+res[i].id+"' style='margin:5px;'>720p</button>";
                             html += "<button class='film_1080p bouton' movie='"+res[i].id+"' style='margin:5px;'>1080p</button></div></div>";
                            i++;
                        }
                        bibliotheque += html;
                        $("#bibliotheque").html(bibliotheque);
                        finish = 0;
                    }
                    else
                        alert("Oups something went wrong");
                });
        }
    }

});

$(document).ready(function() {
    $(".film_3D").on("click", function () {
        video_exist($(this).attr('movie'), '3D', go_to_video);
    });

    $(".film_720p").on("click", function () {
        video_exist($(this).attr('movie'), '720p', go_to_video);
    });

    $(".film_1080p").on("click", function () {
        video_exist($(this).attr('movie'), '1080p', go_to_video);
    });
});

function video_exist(id, quality, callback) {
    $.ajax({
        url: '/video_exist',
        method: 'POST',
        data: {id: id, quality: quality} // l'id du film en db
    })
        .done(function (res) {
            callback(res);
        });
}

function go_to_video(res) {
    var data = '';
    if (res.cle)
        data = '?cle='+res.cle+'&quality='+res.quality;
    else if (res.id && res.quality)
        data = '?id='+res.id+'&quality='+res.quality;
    else
        alert("error");
    window.location.href = 'http://localhost:3000/video'+data;
}