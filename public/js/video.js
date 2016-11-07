/**
 * Created by dchristo on 10/24/16.
 */
$( document ).ready(function() {
    videojs("rush_hour").ready(function () {
        var video = this;

        video.onprogress = function() {console.log('téléchargement en cours');};
        video.ondurationchange = function() {console.log("on duration change")};
        video.onloadedmetadata = function() {console.log("on load meta data");};
        video.onloadeddata = function () {console.log("data loaded");};
        video.oncanplay = function () {console.log("on can play");};
        video.oncanplaythrough = function () {console.log("can play through");video.play();$("#pause").css("display","none");};
        video.onloadstart = function() {console.log("on load start");};

    });
});

var download_end = function() {
    var u_name_start_index = window.location.search.indexOf("=") + 1;
    var u_name_end_index   = window.location.search.indexOf("&");
    var u_id               = window.location.search.slice(u_name_start_index, u_name_end_index);
    var u_quality          = window.location.search.split("=")[2];
    $.ajax({
        url: '/download_end',
        method: 'POST',
        data: {id: u_id, quality: u_quality} // l'id du film en db
    })
        .done(function (res) {
            if (res.res == "yes") {
                clearInterval(this.watchDownload);
                html = "<button class='bouton' style='padding:15px;'><a  style='color:white' href='http://localhost:3000/video?cle="+res.cle+"&quality="+res.quality+"> Regardé le film maintenant </a></button>";
                $("#voir_la_video").html(html);
            }
        });
};

var watchDownload = setInterval(download_end, 5000);