/**
 * Created by dchristo on 10/27/16.
 */

$(".film_3D").on("click", function(){
    $.ajax({
        url: '/download_torrent',
        data: {id: $(this).attr("movie"), quality: "720p"} // l'id du film en db
    })
        .done(function(res) {
            if(res == "done") // le téléchargement est fini
                $( this ).addClass( "done" );
            else
                alert("Oups something went wrong");
        });
});

$(".film_720p").on("click", function(){
    $.ajax({
        url: '/download_torrent',
        data: {id: $(this).attr("movie"), quality: "720p"} // l'id du film en db
    })
        .done(function(res) {
            if(res == "done") // le téléchargement est fini
                $( this ).addClass( "done" );
            else
                alert("Oups something went wrong");
    });
});

$(".film_1080p").on("click", function(){
    $.ajax({
        url: '/download_torrent',
        data: {id: $(this).attr("movie"), quality: "1080p"} // l'id du film en db et la qualité demander
    })
        .done(function(res) {
            if(res == "done") // le téléchargement est fini
                $( this ).addClass( "done" );
            else
                alert("Oups something went wrong");
        });
});