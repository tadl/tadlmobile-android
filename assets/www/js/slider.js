/*  CarouFredSel: a circular, responsive jQuery carousel.
    Configuration created by the "Configuration Robot"
    at caroufredsel.dev7studios.com
*/

function showsliders() {
    $("#login_form").slideUp("fast");
    $('.loadmore').hide();
    $('#results').html('<div class="image_carousel"><div id="books"></div><div class="clearfix"></div><div id="music"></div><div class="clearfix"></div><div id="movies"></div><div class="clearfix"></div></div>');
    $.getJSON('https://www.tadl.org/mobile/export/items/json/music', function(data) {
        var template = Handlebars.compile($('#music-template').html());
        var info = template(data);
        $('#music').html(info);
        $("#music").carouFredSel({
            circular: true,
            infinite: true,
            direction: "left",
            width: "100%",
            align: "center",
            items: {
                width: "variable",
                height: 130
            },
            auto: false,
            swipe: {
                duration: 500,
                easing: "swing",
                fx: "directscroll",
                onTouch: true,
                onMouse: true
            }
        }, {
            debug: true,
            transition: true
        });
    });
    $.getJSON('https://www.tadl.org/mobile/export/items/json/books', function(data) {
        var template = Handlebars.compile($('#books-template').html());
        var info = template(data);
        $('#books').html(info);
        $("#books").carouFredSel({
            circular: true,
            infinite: true,
            direction: "left",
            width: "100%",
            align: "center",
            items: {
                width: "variable",
                height: 130
            },
            auto: false,
            swipe: {
                duration: 500,
                easing: "swing",
                fx: "directscroll",
                onTouch: true,
                onMouse: true
            }
        }, {
            debug: true
        });
    });
    $.getJSON('https://www.tadl.org/mobile/export/items/json/movies', function(data) {
        var template = Handlebars.compile($('#books-template').html());
        var info = template(data);
        $('#movies').html(info);
        $("#movies").carouFredSel({
            circular: true,
            infinite: true,
            direction: "right",
            width: "100%",
            align: "center",
            items: {
                width: "variable",
                height: 130
            },
            auto: false,
            swipe: {
                duration: 500,
                easing: "swing",
                fx: "directscroll",
                onTouch: true,
                onMouse: true
            }
        }, {
            debug: true
        });
    });
}


