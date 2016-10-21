$( document ).ready(function() {
  var icon = $('.play');
  icon.click(function() {
    icon.toggleClass('active');
    return false;
  });
  var i = 0;
  var video = document.getElementById("rush_hour");

  video.onloadeddata = function () {console.log("data loaded");};
  video.oncanplay = function () {console.log("on can play");};
  video.oncanplaythrough = function () {console.log("can play through");video.play();$(".animation").css("display","none")};
  video.ondurationchange = function() {console.log("on duration change")};
  video.onloadedmetadata = function() {console.log("on load meta data");};
  video.onloadstart = function() {console.log("on load start");};
  video.onseeked = function() {
    console.log("video seeked");
    $("#div_download").css('display','none');
    clearInterval(this.watchBuffer);
  };
  video.onprogress = function()
  {
    console.log('téléchargement en cours');
  };

  $("#pause").click(function(){
    $(".animation").css("display","none");
    video.paused ? video.play() : video.pause();
  });

  $("video").click(function(){
    this.paused ? $(".animation").css("display","none") : $(".animation").css("display","block");
    this.paused ? this.play() : this.pause();
  });

  var updateProgressBar = function(){
    if (video.readyState) {
      var videoDuration = document.getElementById("rush_hour").duration;
      var buffered = video.buffered.end(0);
      var percent = 100 * buffered / videoDuration;
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
  precision = precision || 2;
  var tmp = Math.pow(10, precision);
  return Math.round(nombre * tmp) / tmp;
}
