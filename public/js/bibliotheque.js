/**
 * Created by dchristo on 10/27/16.
 *
**/
var result = 0;
var finish = 0;
$(document).scroll(function() {
    var body = document.body;
    if (body.scrollTop + (window.innerHeight) >= (body.scrollHeight - (body.scrollHeight * 0.05)))
    {
        console.log("tu es arriver en bas de la page je vais charger plus de résultat");
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
                        //console.log(res);
                        console.log(res[0].background_image);
                        var bibliotheque = $("#bibliotheque").html();
                        var i = 0;
                        var html = '';
                        while(res[i]) {
                             html += "<div class='big_vignette col-lg-3 col-sm-4 col-xs-4' style='margin:15px'>";
                             html += "<p style='text-align:center;font-weight:700'>"+res[i].title+"</p>";
                             html += "<p style='text-align:center;font-weight:700'>"+res[i].year+"</p>";
                             html += "<p style='text-align:center;font-weight:700'>"+res[i].rating+"</p>";
                             html += "<div class='vignette' style='background: url("+res[i].medium_cover_image+") center no-repeat; height:340px; margin:15px')></div>";
                             html += "<div class='button' style='text-align:center'>";
                             if (res[i].torrent_3D_id)
                                html += "<button class='film_3D' movie='"+res[i].id+"' style='margin:5px;'>3D</button>";
                             html += "<button class='film_720p' movie='"+res[i].id+"' style='margin:5px;'>720p</button>";
                             html += "<button class='film_1080p' movie='"+res[i].id+"' style='margin:5px;'>1080p</button></div></div>";
                            i++;
                        }
                        bibliotheque += html;
                        //console.log(bibliotheque);
                        $("#bibliotheque").html(bibliotheque);
                        finish = 0;
                        // J'affiche les nouveaux résultats
                        //$( this ).addClass( "done" );
                    }
                    else
                        alert("Oups something went wrong");
                });
        }
    }

});

$(document).ready(function() {
    $(".film_3D").on("click", function () {
        $.ajax({
            url: '/video',
            method: 'GET',
            data: {id: $(this).attr("movie"), quality: "3D"} // l'id du film en db
        })
            .done(function (res) {
                if (res == "fail") // la page a eu un problème
                    alert("Oups something went wrong");
            });
    });

    $(".film_720p").on("click", function () {
        $.ajax({
            url: '/video',
            method: 'GET',
            data: {id: $(this).attr("movie"), quality: "720p"} // l'id du film en db
        })
            .done(function (res) {
                if (res == "fail") // la page a eu un problème
                    alert("Oups something went wrong");
            });
    });

    $(".film_1080p").on("click", function () {
        $.ajax({
            url: '/video',
            method: 'GET',
            data: {id: $(this).attr("movie"), quality: "1080p"} // l'id du film en db et la qualité demander
        })
            .done(function (res) {
                if (res == "fail") // la page a eu un problème
                    alert("Oups something went wrong");
            });
    });
});