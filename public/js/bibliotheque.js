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
            var data = {result: result};
            var checkbox = $("input[type='checkbox']");
            if ($("#search").val())
                data.search = $("#search").val();
            if (checkbox[0].checked) {
                data.year_min = $("#lower_year").val();
                data.year_max = $("#higher_year").val();
            }
            if (checkbox[1].checked) {
                data.note_min = $("#lower_note").val();
                data.note_max = $("#higher_note").val();
            }
            if ($(".custom__select").val() == 'note')
                data.order = 'note';
            else if ($(".custom__select").val() == 'year')
                data.order = 'year';
            else if ($(".custom__select").val() == 'name')
                data.order = 'name';
            finish = 1;
            $.ajax({
                url: '/load_more_bibliotheque',
                method: 'POST',
                data: data
            })
                .done(function (res) {
                    if (res) {
                        var bibliotheque = $("#bibliotheque").html();
                        bibliotheque += return_bibliotheque(res);
                        $("#bibliotheque").html(bibliotheque);
                        finish = 0;
                    }
                    else
                        alert("Oups something went wrong");
                });
        }
    }
});
var enter = 0;
$(document).ready(function() {
    $("body").on('click', function(){
        $("#autocompletion").hide("slow");
    });
    $("#search").on('keyup', function () {
        var zis = $(this);
        if (enter == 1) {
            $("#autocompletion").hide("slow");
            enter = 0;
        }
        else {
            delay(function () {
                if (zis.val().length < 3) {
                    $("#autocompletion").hide("slow");
                }
                else if (zis.val().length >= 3) {
                    $.ajax({
                        url: '/find_movie_autocompletion',
                        method: 'POST',
                        data: {search: zis.val()}
                    })
                        .done(function (res) {
                            var i = 0;
                            html = "";
                            while (res.content[i]) {
                                html += '<div class="result_autocompletion">';
                                html += '<div class="img_autocompletion"><img src=' + res.content[i].medium_cover_image + ' width="105" height="162"></div>';
                                html += '<div class="text_result_autocompletion"><h2>' + res.content[i].title + '</h2>';
                                html += '<h4>' + res.content[i].year + '</h4></div>';
                                html += "</div>";
                                i++;
                            }
                            $("#autocompletion").html(html);
                            $("#autocompletion").show("slow");
                            $(".result_autocompletion").on('click', function () {
                                $("#search").val($(this).find("h2").text());
                                $("#autocompletion").hide("slow");
                                find_movie();
                            });
                        });
                }
            }, 200);
        }
    })
        .keydown(function (event) {
            if (event.which == 13) {
                enter = 1;
                find_movie();
            }
        });

    $(".input-group-btn").on("click", function() {
        $("#autocompletion").hide("slow");
        find_movie();
    });

    $(".custom__select").on('change', function(){
       find_movie();
    });

    function find_movie() {
        var checkbox = $("input[type='checkbox']");
        var data = {};
        data.search = $("#search").val();
        if (checkbox[0].checked) {
            data.year_min = $("#lower_year").val();
            data.year_max = $("#higher_year").val();
        }
        if (checkbox[1].checked) {
            data.note_min = $("#lower_note").val();
            data.note_max = $("#higher_note").val();
        }
        if ($(".custom__select").val() == 'note')
            data.order = 'note';
        else if ($(".custom__select").val() == 'year')
            data.order = 'year';
        else if ($(".custom__select").val() == 'name')
            data.order = 'name';
        $.ajax({
            url: '/find_movie',
            method: 'POST',
            data: data
        })
            .done(function (res) {
                if (res.content[0])
                    $("#bibliotheque").html(return_bibliotheque(res.content));
                else
                    $("#bibliotheque").html('<div class="jumbotron col-lg-12" style="margin-top:20px;"><h2>'+res.translation.no_result+'</h2></div>');
            })
    }

    $('input[name="range"]').on("change mousemove", function() {
        var zis = $(this);
        $(this).attr('value', $(this).val());
        $(this).next().html($(this).val());
        $(this).prev().html($(this).val());

        delay(function(){
            var checkbox = $("input[type='checkbox']");
            if (checkbox[0].checked && zis.attr('search') == 'year') {
                find_movie();
            }
            if (checkbox[1].checked && zis.attr('search') == 'note') {
                find_movie();
            }
        }, 300);
    });

    $("input[type='checkbox']").on('change', function(){
       find_movie();
    });

    $('#lower_year').on("change mousemove", function() {
        $("#higher_year").attr("min", parseInt($(this).val()));

    });

    $('#lower_note').on("change mousemove", function() {
        $("#higher_note").attr("min", parseInt($(this).val()));
    });

    $("body").on("click", ".film_3D", function () {
        video_exist($(this).attr('movie'), '3D', go_to_video);
    });

    $("body").on("click", ".film_720p", function () {
        video_exist($(this).attr('movie'), '720p', go_to_video);
    });

    $("body").on("click", ".film_1080p", function () {
        video_exist($(this).attr('movie'), '1080p', go_to_video);
    });
});

function return_bibliotheque(res){
    var i = 0;
    var html = '';
    while(res[i]) {
        html += "<div class='col-lg-3 col-md-4 col-sm-6 col-xs-6' style='margin-top:20px'><div class='big_vignette'>";
        html += "<p style='text-align:center;font-weight:700;font-size:medium;overflow-y: auto;max-height: 20px;'>"+res[i].title+"</p>";
        html += "<p style='text-align:center;font-weight:700'>"+res[i].year+"</p>";
        html += "<p style='text-align:center;font-weight:700'>"+res[i].rating+"</p>";
        html += "<img class='vignette' src="+res[i].medium_cover_image+" width='210' height='315'>";
        if (res[i].vision)
            html += '<div class="vision">'+res[i].vision+'</div>';
        html += "<div class='button' style='text-align:center'>";
        if (res[i].torrent_3D_id)
            html += "<button class='film_3D bouton' movie='"+res[i].id+"' style='margin:5px;'>3D</button>";
        if (res[i].torrent_720_id)
            html += "<button class='film_720p bouton' movie='"+res[i].id+"' style='margin:5px;'>720p</button>";
        if (res[i].torrent_1080_id)
            html += "<button class='film_1080p bouton' movie='"+res[i].id+"' style='margin:5px;'>1080p</button></div></div></div>";
        i++;
    }
    return html;
}

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

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

