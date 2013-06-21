var ILSCATCHER_HOST = 'tadl-ilscatcher.herokuapp.com'
var ILSCATCHER_BASE = 'https://' + ILSCATCHER_HOST
var ILSCATCHER_INSECURE_BASE = 'https://' + ILSCATCHER_HOST /* we will actually use https here also */
var EVENTS_URL = 'https://www.tadl.org/mobile/export/events/json/all'
var LOCATIONS_BASE = 'https://www.tadl.org/mobile/export/locations'
var PLACEHOLDER_IMG = 'img/clocktower100.png';
var searchquery = {};
var pagecount = {};
var mediatype = {};
var available = {};
$(document).ready(function() {
    showsliders();

    $('#term').keydown(function(event) {
        if (event.keyCode == 13) {
            getResults();
        }
    });
    $('#login_form').keydown(function(event) {
        if (event.keyCode == 13) {
            login();
        }
    });

    if (localStorage.getItem('username')) {
        login();
    }

    var getResults = function() {
        $("#login_form").slideUp("fast");
        $('#results').empty().trigger("create");
        $('.loadmore').show();
        $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
        pagecount = 0;

        searchquery = $('#term').val();
        mediatype = $('#mediatype').val();
        if (document.getElementById('available').checked) {
            available = true;
        } else {
            available = false;
        }

        $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/searchjson.json?utf8=%E2%9C%93&q=" + searchquery + "&mt=" + mediatype +"&avail=" + available, function(data) {
            var results = data.message
            if (results != "no results") {
                var template = Handlebars.compile($('#results-template').html());
                var info = template(data);
                $('#results').html(info);
            } else {
                $('#results').html("No Results");
                 $('.loadmore').hide();
            }
            $('#loadmoretext').empty().append('<a class="loadmore" onclick="loadmore();">LOAD MORE RESULTS</a>');
            $('#loadmoretext').trigger("create");
        });
    }
    $('#search').click(getResults);
    
});

function loadmore() {
    pagecount++;
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    $('#loadmoretext').trigger("create");
    $.get(ILSCATCHER_INSECURE_BASE + "/main/searchjson.json?utf8=%E2%9C%93&q=" + searchquery + "&mt=" + mediatype + "&p=" + pagecount +"&avail=" + available, function(data) {
        var results = data.message
        if (results != "no results") {
            var template = Handlebars.compile($('#results-template').html());
            var info = template(data);
            $('#results').append(info).promise().done(function() {
                $('#loadmoretext').empty().append('<a class="loadmore" onclick="loadmore();">LOAD MORE RESULTS</a>');
                $('#loadmoretext').trigger("create");
                $("#login_form").slideUp("fast");
            })
        } else {
            $('#loadmoretext').html("No Further Results");
        }
    });
}

function logout() {
    localStorage.clear();
    $('#results').html("");
    location.reload();
}

function showmore(record_id) {
    var record_id = record_id;
    var e = document.getElementById(record_id);
    if (e.style.display === 'none') {
        if( !$.trim( $('#'+ record_id).html() ).length ) {
            $('#'+ record_id +'-loading').html('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
            $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/itemdetails.json?utf8=%E2%9C%93&record_id=" + record_id, function(data) {
                var results = data.message;
                var template = Handlebars.compile($('#more_details-template').html());
                var info = template(data);
                $('#'+ record_id).html(info).promise().done(function() {  $('#'+ record_id +'-loading').empty();});
                $('#'+ record_id).css('display', 'block');
                $('#showmore-' + record_id).css('display', 'none');
            });
        } else {
            $('#'+ record_id).css('display', 'block');
        }
    } else {
        $('#'+ record_id).css('display', 'none');
    }
}

function viewitem(record_id) {
    $("#login_form").slideUp("fast");
    $('#results').empty().trigger("create");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    var record_id = record_id;
    $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/itemdetails.json?utf8=%E2%9C%93&record_id=" + record_id, function(data) {
        var results = data.message;
        var template = Handlebars.compile($('#result-details-template').html());
        var info = template(data);
        $('#'+ record_id).html(info).promise().done(function() {  $('#'+ record_id +'-loading').empty();});
        $('#'+ record_id).css('display', 'block');
    });
}

function unhide(eventId) {
    var eventId = eventId;
    var e = document.getElementById(eventId);
    if (e.style.display === 'none') {
        $('#' + eventId).css('display', 'block');
        $('#more' + eventId).css('display', 'none');
    } else {
        $('#' + eventId).css('display', 'none');
        $('#more' + eventId).css('display', 'block');
    }
}

function showshelf(record_id) {
    var record_id = record_id;
    var e = document.getElementById(record_id +'shelf');
    if (e.style.display === 'none') {
        if( !$.trim( $('#'+ record_id +'shelf').html() ).length ) {
            $('#'+ record_id +'-loading').html('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
            $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/itemonshelf.json?utf8=%E2%9C%93&record_id=" + record_id, function(data) {
                var results = data.message;
                var template = Handlebars.compile($('#shelf-template').html());
                var info = template(data);
                $('#'+ record_id +'shelf').html(info).promise().done(function() {  $('#'+ record_id +'-loading').empty();});
                $('#'+ record_id +'shelf').css('display', 'block');
            });
        } else {
            $('#'+ record_id +'shelf').css('display', 'block');
        }
    } else {
        $('#'+ record_id +'shelf').css('display', 'none');
    }
}

function pre_hold(record_id) {
    var record_id = record_id;
    link_id = '#place_hold_' + record_id;
    $(link_id).html('Requesting hold...');
    $(link_id).css('color', 'green');
    hold(record_id);
}

function hold(record_id) {
    var record_id = record_id;
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/hold.json?u='+ username +'&pw=' + password + '&record_id=' + record_id, function(data) {
        var message = data[':message'];
        var success = false;
        var button_id = '#place_hold_' + record_id;

        if (message == 'Hold was successfully placed') {
            success = true;
        }

        if (message) {
            $(button_id).html(message);
        } else {
            $(button_id).html('Unable to place hold.');
        }

        $(button_id).css('color', (success) ? 'green' : 'red');

    });
    window.setTimeout(partB,5000);
}

function partB() {
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/login.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#logedin-template').html());
        var info = template(data);
        $('#login_form').html(info);
    });
}

function openForm() {
    if ($("#login_form").is(":hidden")) {
        $("#login_form").slideDown("fast");
        login();
    } else {
        $("#login_form").slideUp("fast");
        
    }
}

function login() {
    if (localStorage.getItem('username')) {
        username = localStorage.getItem('username');
        password = localStorage.getItem('password');
    } else {
        username = $('#username').val();
        password = $('#pword').val();
    }
    $.getJSON(ILSCATCHER_BASE + '/main/login.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#logedin-template').html());
        var info = template(data);
        $('#login_form').html(info);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
    });
}

function showcheckouts() {
    $("#login_form").slideUp("fast");
    $('#results').html("");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password'); 
    $.getJSON(ILSCATCHER_BASE + '/main/showcheckouts.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#showcheckedout-template').html());
        var info = template(data);
        $('#results').html(info);
        $('.loadmore').hide();
    });
}

function pre_cancelhold(element, hold_id) {
    var element = element;
    var hold_id = hold_id;
    var confirm_text = 'Tap to Cancel Hold';
    var canceling_text = 'Canceling hold...';
    $(element).css('color', 'red');
    $(element).html(confirm_text);
    $(element).prop("onclick", null); /* remove existing onclick */
    $(element).on("click", function(event) {$(this).off('click'); $(this).html(canceling_text); cancelhold(hold_id);});
}

function cancelhold(hold_id) {
    var hold_id = hold_id;
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/cancelhold.json?u='+ username +'&pw=' + password + '&hold_id=' + hold_id, function(data) {
        $('#hold_' + hold_id).remove();
    });
}

function showholds() {
    $("#login_form").slideUp("fast");
    $('#results').html("");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password'); 
    $.getJSON(ILSCATCHER_BASE + '/main/showholds.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#showholds-template').html());
        var info = template(data);
       $('#results').show();
       $('#results').html(info);
        $('.loadmore').hide(); 
    });
}

function showpickups() {
    $("#login_form").slideUp("fast");
    $('#results').html("");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");   
    var username = localStorage.getItem('username');
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password'); 
    $.getJSON(ILSCATCHER_BASE + '/main/showpickups.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#showholds-template').html());
        var info = template(data);
       $('#results').html(info);
        $('.loadmore').hide(); 
    });
}

function renew(element, circulation_id, barcode) {
    var element = element;
    var circ_id = circulation_id;
    var bc = barcode;
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    $(element).css('color','red');
    $(element).html('Renewing...');
    $.getJSON(ILSCATCHER_BASE + '/main/renew.json?u='+ username +'&pw=' + password + '&circ_id=' + circ_id + '&bc=' + bc, function(data) {
        var template = Handlebars.compile($('#renew-template').html());
        var info = template(data);
        $('#'+ bc +'').html(info);
    });
}

function showcard() {
    $("#login_form").slideUp("fast");
    $('#results').html("");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password'); 
    $.getJSON(ILSCATCHER_BASE + '/main/showcard.json?u='+ username +'&pw=' + password, function(data) {
        var card = data.barcode;
        $('.loadmore').hide();
        $('#results').empty().append('<div class="shadow result" id="bcTarget"></div>');
        $('#results').trigger("create"); 
        $("#bcTarget").barcode(card, "code128", {barWidth:2, barHeight:100, fontSize:14}); 
    });
}

function showevents() { 
     $("#login_form").slideUp("fast");
    $('#results').html("");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    $.getJSON(EVENTS_URL, function(data) {
        var template = Handlebars.compile($('#showevents-template').html());
        var info = template(data);
        $('.loadmore').hide();
        $('#results').html(info);
    });
}

function showlocations() { 
    $("#login_form").slideUp("fast");
    $('#results').html("");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    $.getJSON(LOCATIONS_BASE + "/all", function(data) {
        var template = Handlebars.compile($('#showlocations-template').html());
        var info = template(data);
        $('.loadmore').hide();
        $('#results').html(info);
    });
}

function img_check(img) {
    var img = img;
    if ($(img).width() == 1) {
        img_error(img);
    }
}

function img_error(img) {
    var img = img;
    $(img).attr('src', PLACEHOLDER_IMG);
}

Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";
    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }
    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('make_https', function(url, options) {
    var url = url;
    var https_url = url.replace(/^http:/, 'https:');
    return https_url;
});


