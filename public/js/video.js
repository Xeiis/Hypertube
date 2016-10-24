/**
 * Created by dchristo on 10/24/16.
 */
$( document ).ready(function() {
    videojs("rush_hour").ready(function () {
        var video = this;
        var icon = $('.play');
        icon.click(function() {
            icon.toggleClass('active');
            return false;
        });

        video.onprogress = function() {console.log('téléchargement en cours');};
        video.ondurationchange = function() {console.log("on duration change")};
        video.onloadedmetadata = function() {console.log("on load meta data");};
        video.onloadeddata = function () {console.log("data loaded");};
        video.oncanplay = function () {console.log("on can play");};
        video.oncanplaythrough = function () {console.log("can play through");video.play();$("#pause").css("display","none");};
        video.onloadstart = function() {console.log("on load start");};
        /*
        video.suspend = function(){
            var video = document.getElementById("rush_hour");
            var buffered = video.buffered.end(0);
            if (buffered < (video.currentTime + 10)) {
                console.log(buffered + " < " + (video.currentTime + 10) );
                $(".sk-circle").css("display","block");
                $("#pause").css("display","none");
                video.pause();
            }
            else {
                console.log(buffered + " > " + (video.currentTime + 10) );
            }
            video.onprogress = function() {
                if (buffered > (video.currentTime + 10)) {
                    video.play();
                    $(".sk-circle").css("display","none");
                    $("#pause").css("display","none");
                }
            };
        };

        $("#pause").click(function(){
            $("#pause").css("display","none");
        });
        */

        var updateProgressBar = function(){
            if (video.readyState() == 4) {
                var percent = 100 * video.bufferedPercent();
                $("#download_bar").css('width', percent + '%');
                $("#download_bar_text").html(roundDecimal(percent, 2) + '%');

                if (video.bufferedPercent() == 1) {
                    clearInterval(this.watchBuffer);
                }
            }
        };
        var watchBuffer = setInterval(updateProgressBar, 500);
    });
});
/*

});*/

function roundDecimal(nombre, precision) {
    precision = precision || 2;
    var tmp = Math.pow(10, precision);
    return Math.round(nombre * tmp) / tmp;
}