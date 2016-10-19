$( document ).ready(function() {
  var video = document.getElementById("rush_hour");



  video.onloadeddata = function () {console.log("data loaded");};
  video.oncanplay = function () {console.log("on can play");};
  video.oncanplaythrough = function () {console.log("can play through");video.play();};
  video.ondurationchange = function() {console.log("on duration change")};
  video.onloadedmetadata = function() {console.log("on load meta data");};
  video.onloadstart = function() {console.log("on load start");};
  video.onprogress = function()
  {
    console.log('téléchargement en cours');
  };

  $("video").click(function(){
    this.paused ? this.play() : this.pause();
  });

  var i = 0;
  var updateProgressBar = function(){
    if (video.readyState) {
      var videoDuration = document.getElementById("rush_hour").duration;
      var buffered = video.buffered.end(i);
      var buffered_next = video.buffered.end(i+1);
      var percent;
      if (buffered_next)
      {
         percent = 100 * buffered_next / videoDuration;
        i++;
      }
      else {
        var percent = 100 * buffered / videoDuration;
      }
      $("#download_bar").css('width', percent + '%');
      $("#download_bar_text").html(roundDecimal(percent, 2) + '%');

      if (buffered >= videoDuration) {
        clearInterval(this.watchBuffer);
      }
    }
  };
  var watchBuffer = setInterval(updateProgressBar, 500);
});

function roundDecimal(nombre, precision) {
  var precision = precision || 2;
  var tmp = Math.pow(10, precision);
  return Math.round(nombre * tmp) / tmp;
}
