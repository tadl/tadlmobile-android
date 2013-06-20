/*  CarouFredSel: a circular, responsive jQuery carousel.
    Configuration created by the "Configuration Robot"
    at caroufredsel.dev7studios.com
*/

function showsliders() {
    $("#login_form").slideUp("fast");
    $('#music').html("");
    $.getJSON('https://www.tadl.org/mobile/export/items/json/music', function(data) {
        var template = Handlebars.compile($('#items-template').html());
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
                height: 135
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
        var template = Handlebars.compile($('#items-template').html());
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
                height: 135
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
    $.getJSON('https://www.tadl.org/mobile/export/items/json/movies', function(data) {
        var template = Handlebars.compile($('#items-template').html());
        var info = template(data);
        $('#movies').html(info);
        $("#movies").carouFredSel({
            circular: true,
            infinite: true,
            direction: "left",
            width: "100%",
            align: "center",
            items: {
                width: "variable",
                height: 135
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
}


