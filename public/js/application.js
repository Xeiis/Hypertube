$( document ).ready(function() {
  var video = document.getElementById("rush_hour");

  video.onloadstart = function() {
    console.log("on load start");
    video.ondurationchange = function() {
      console.log("on duration change");
      video.onloadedmetadata = function() {
        console.log("on load meta data");
        video.onloadeddata = function () {
          console.log("data loaded");
          video.oncanplay = function () {
            console.log("on can play");
            video.oncanplaythrough = function () {
              console.log("can play through");
              video.play();
            };
          };
        };
      };
    };
  };

  video.onprogress = function()
  {
    console.log('téléchargement en cours');
  };

  $("video").click(function(){
    this.paused ? this.play() : this.pause();
  });

  var updateProgressBar = function(){
    if (video.readyState) {
      var videoDuration = document.getElementById("rush_hour").duration;
      var buffered = video.buffered.end(0);
      var percent = 100 * buffered / videoDuration;
      $("#download_bar").css('width', percent + '%');
      //$("#download_bar").html(percent + '%');
      //console.log("pourcentage : " + percent);
      if (buffered >= videoDuration) {
        clearInterval(this.watchBuffer);
      }
    }
  };
  var watchBuffer = setInterval(updateProgressBar, 500);
});