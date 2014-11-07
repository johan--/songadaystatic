function trackEnded() {

    var next = window.now_playing.parent().parent().parent().next();
    window.next = next;
    $('#container' + now_playing_id).find('.favbtn').slideUp();
    var song_id = next.find('audio').attr('data-id');

    next.find('.play').click();

    $.smoothScroll({
        offset: -66,
        speed: 1000,
        scrollTarget: '#container' + song_id
    });

}


audiojs.events.ready(function() {
    window.a = audiojs.createAll({
        trackEnded: function() {
            trackEnded();
        }
    });
    $('.pause').click(function(self) {
        $(self.currentTarget).parent().parent().parent().parent().find('.favbtn').slideUp();
        $(self.currentTarget).parent().parent().parent().find('audio').attr('data-id');
    });
    $('.play').click(function(self) {
        window.now_playing = $(self.currentTarget).parent().parent();
        $('.playing').not(window.now_playing).find('.pause').click()
        var song_id = $(window.now_playing).find('audio').attr('data-id');
        console.log("play", song_id);
        if (window.now_playing_id == song_id) {
            $('#container' + song_id).find('.favbtn').slideDown();
            return;
        }
        window.now_playing_id = song_id;
        $('#container' + song_id).find('.favbtn').slideDown();

        $.post('/songs/listen/' + song_id).done(function(res) {
            $(now_playing).parent().parent().find('.listens').html(res['listens']);;
        });
    });

    $('.love').click(function(self) {
        console.log(window.song_id);
        if (typeof window.song_id =='undefined'){
            var song_id = $(self.currentTarget).parent().parent().find('audio').attr('data-id');
        }else{
            var song_id=window.song_id;
        }
        $.post('/songs/love/' + song_id).done(function(res) {
            console.log(res);
            console.log(typeof res['error'] != 'undefined');
            if (typeof res['error'] == 'string') {
                flash(res['error'], 'error');
            } else {
                if (res['loves'] == 1) {
                    var love_string = $(self.currentTarget).parent().parent().parent().find('.empty-love');
                    love_string.append('<a href="/profile/' + res['key'] + '">' + res['alias'] + '</a> loves it')
                } else if (res['loves'] == 2) {
                    var lover_one = $(self.currentTarget).parent().parent().parent().find('.first-love');
                    love_string = $(self.currentTarget).parent().parent().parent().find('.one-love');
                    love_string.html(lover_one.prop('outerHTML') + ' &amp; ');
                    love_string.append('<a href="/profile/' + res['key'] + '">' + res['alias'] + '</a> love it')
                } else if (res['loves'] == 3) {
                    var love_string = $(self.currentTarget).parent().parent().parent().find('.two-loves');
                    love_string.addClass('dropdown');
                    var lover_one = $(self.currentTarget).parent().parent().find('.first-love').prop('outerHTML');
                    var lover_two = $(self.currentTarget).parent().parent().find('.second-love').prop('outerHTML');
                    love_string.html('<a class="dropdown-toggle" data-toggle="dropdown"><b><span style="color:#428bca">♥</span><span class="lover-count"> 3 lovers <span style="color:#428bca">♥</span></span></b> </a><ul class="lovers-list dropdown-menu"><li>' + '<a href="/profile/' + res['key'] + '">' + res['alias'] + '</a></li><li>' + lover_one + '</li><li>' + lover_two + '</li></ul></span>');
                    love_string.fadeIn();


                } else {
                    $(self.currentTarget).parent().parent().parent().find('.lovers-list').append('<li><a href="/profile/' + res['key'] + '">' + res['alias'] + '</li>')
                    var loveCount = $(self.currentTarget).parent().parent().parent().find('.lover-count')
                    loveCount.html(res['loves']);
                }
                $(self.currentTarget).parent().parent().parent().find('.lovers').fadeIn();
                $(self.currentTarget).parent().parent().parent().find('.lovers').fadeIn();
                $(self.currentTarget).fadeOut();;
                if (res['remaining'] == 0) {
                    $('#my_loves').fadeOut();
                    $('#my_heart').fadeOut();
                } else {
                    $('#my_loves').html(res['remaining']);
                }
            }

        });


    })

});
$(document).ready(function() {

    $("abbr.timeago").timeago();
});

function flash(message, category) {
    if (category == 'error') {
        var icon = 'icon-exclamation-sign';
        category = 'danger';
    } else if (category == 'success')
        var icon = 'icon-ok-sign';
    else
        var icon = 'icon-info-sign';
    $('<div class="alert alert-' + category + '"><i class="' + icon + '"></i>&nbsp;<a class="close" data-dismiss="alert">×</a>' + message + '</div>').appendTo('#header .container').hide().slideDown();
}

function post_comment(comment_id) {
    var author = $('#comments' + comment_id + " input[name='author']").val();
    var comment = $('#comments' + comment_id + " textarea").val();
    if (comment == "") {
        alert('Say something John Cage...');
        return;
    }
    $.post('/comment/' + comment_id, {
        'comment': comment,
        'author': author
    }).done(function(msg) {
        if (author == "") {
            author = 'Buddha';
        }
        $('#comment_list_' + comment_id).append('<blockquote style="margin:3px"><p style="font-size:small;"><span style="font-size:small;color:#3b5998"><b>' + author + '</b></span>:  ' + comment + '</p><footer><abbr style="font-size:x-small;float:right">Just now</abbr></footer></blockquote>');
        var count = parseInt($('#count' + comment_id).html()) + 1;
        $('#count' + comment_id).html(count);
        $('#comments' + comment_id + " input[name='author']").val("");
        $('#comments' + comment_id + " textarea").val("");
    });
}