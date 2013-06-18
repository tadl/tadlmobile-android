var ILSCATCHER_HOST = 'ilscatcher.herokuapp.com'
var ILSCATCHER_BASE = 'https://' + ILSCATCHER_HOST
var ILSCATCHER_INSECURE_BASE = 'http://' + ILSCATCHER_HOST
var EVENTS_URL = 'http://www.tadl.org/mobile/events/json/all'
var LOCATIONS_BASE = 'http://www.tadl.org/mobile/export/locations'
var searchquery = {};
var pagecount = {};
var mediatype = {};
var available = {};
$(document).ready(function() {
    $('.searchform').keydown(function() {
        if (event.keyCode == 13) {
            getResults();
        }
    });
       $('#login_form').keydown(function() {
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
        if( !$.trim( $('#'+ record_id +'').html() ).length ) {
            $('#'+ record_id +'-loading').html('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</a>').trigger("create");
            $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/itemdetails.json?utf8=%E2%9C%93&record_id=" + record_id, function(data) {
                var results = data.message;
                if (data[':items'][0][':item'][':copies_available'].substring(0,2) == '0 ') {
                    data[':items'][0][':item'][':is_available'] = false;
                } else {
                    data[':items'][0][':item'][':is_available'] = true;
                }
                var template = Handlebars.compile($('#more_details-template').html());
                var info = template(data);
                $('#'+ record_id +'').html(info).promise().done(function() {  $('#'+ record_id +'-loading').empty();});
                $('#'+ record_id +'').css('display', 'block');
            });
        } else {
            $('#'+ record_id +'').css('display', 'block');
        }
    } else {
        $('#'+ record_id +'').css('display', 'none');
    }
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

function hold(record_id) {
    var record_id = record_id;
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/hold.json?u='+ username +'&pw=' + password + '&record_id=' + record_id, function(data) {});
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
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="http://empower.swmorey.com/images/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password'); 
    $.getJSON(ILSCATCHER_BASE + '/main/showcheckouts.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#showcheckedout-template').html());
        var info = template(data);
        $('#results').html(info);
        $('.loadmore').hide();
    });
}

function cancelhold(hold_id) {
    var hold_id = hold_id;
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/cancelhold.json?u='+ username +'&pw=' + password + '&hold_id=' + hold_id, function(data) {
        $('#'+ hold_id +'').css('display', 'none');
    });
}

function showholds() {
    $("#login_form").slideUp("fast");
    $('#results').html("");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="http://empower.swmorey.com/images/ajax-loader-2.gif">LOADING...</a>').trigger("create");
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
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="http://empower.swmorey.com/images/ajax-loader-2.gif">LOADING...</a>').trigger("create");   
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

function renew(circulation_id, barcode) {
    var circ_id = circulation_id;
    var bc = barcode;
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/renew.json?u='+ username +'&pw=' + password + '&circ_id=' + circ_id + '&bc=' + bc, function(data) {
        var template = Handlebars($('#renew-template').html());
        var info = template(data);
        $('#'+ bc +'').html(info);
    });
}

function showcard() {
    $("#login_form").slideUp("fast");
    $('#results').html("");
    $('.loadmore').show();
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="http://empower.swmorey.com/images/ajax-loader-2.gif">LOADING...</a>').trigger("create");
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
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="http://empower.swmorey.com/images/ajax-loader-2.gif">LOADING...</a>').trigger("create");
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
    $('#loadmoretext').empty().append('<a class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="http://empower.swmorey.com/images/ajax-loader-2.gif">LOADING...</a>').trigger("create");
    $.getJSON(LOCATIONS_BASE + "/all", function(data) {
        var template = Handlebars.compile($('#showlocations-template').html());
        var info = template(data);
        $('.loadmore').hide();
        $('#results').html(info);
    });
}
