function removeNode(n) {
    if (n != null) n.parentNode.removeChild(n);
}

function setElementHide(n, state) {
    if (n != null) {
        if (state) {
            n.classList.add("hideplayer")
        }
        else {
            n.classList.remove("hideplayer")
        }
    }
}

function waitForNodeId(node, cb) {
    var ival = setInterval(function (node, cb) {
        if (document.getElementById(node) != null) {
            clearInterval(ival);
            cb();
        }
    }, 100, node, cb);
}

window.addEventListener('yt-navigate-start', function () {
    runBypass();
});

window.addEventListener('popstate', function () {
    runBypass();
});

var overriddenVideo = null

function runBypass() {
    if (overriddenVideo != null) {
        console.log("Navigating away from page, removing iframe");

        setElementHide(document.getElementById('error-screen'), false);
        setElementHide(document.getElementsByClassName('ytp-error')[0], false);
        setElementHide(document.getElementById("movie_player"), false);

        overriddenVideo.remove();
    }

    waitForNodeId('movie_player', function () {
        let player = document.getElementById("movie_player");
        let watch = (location.pathname.startsWith('/watch') || location.pathname.startsWith('/embed')) && player.getPlayerState() == -1
        if (watch) {
            waitForNodeId('player-container', function () {
                setElementHide(document.getElementById('error-screen'), true);
                setElementHide(document.getElementsByClassName('ytp-error')[0], true);
                setElementHide(document.getElementById("movie_player"), true);

                waitForNodeId('container', function () {
                    fetch('https://example.com/?id=' + player.getVideoData().video_id, {
                        mode: 'cors'
                    }).then(result => result.json()).then(result => {
                        var container = document.querySelector('div.ytd-player');

                        var videoplayer = document.createElement('div');
                        videoplayer.className = "html5-video-player ytp-transparent ytp-hide-info-bar ytp-large-width-mode iv-module-loaded paused-mode";

                        var playercontent = document.createElement('div');
                        playercontent.className = "ytp-player-content ytp-iv-player-content";

                        var playerframe = window.document.createElement("iframe");
                        playerframe.setAttribute("src", result.url);
                        playerframe.setAttribute("id", "movie_player_fake");
                        playerframe.setAttribute("frameBorder", "0");
                        playerframe.setAttribute("width", "100%");
                        playerframe.setAttribute("height", "100%");
                        playerframe.setAttribute("allowfullscreen", true)

                        container.appendChild(videoplayer);
                        videoplayer.appendChild(playercontent);
                        playercontent.appendChild(playerframe);

                        overriddenVideo = videoplayer;
                        console.log("injected new video");
                    })
                });
            });
        }
    })
}

runBypass();