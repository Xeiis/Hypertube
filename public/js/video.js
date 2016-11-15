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
function reload_video(path) {
    var vid = document.getElementById("ourvideo");
    var time = vid.currentTime;
    vid.setAttribute('src', '/movie/'+path+'/essai.mp4');
    vid.load();
    vid.play();
    console.log(time);
    vid.currentTime = time;
}

