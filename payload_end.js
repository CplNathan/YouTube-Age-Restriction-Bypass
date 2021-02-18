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
            clearInterval(ival)
            cb()
        }
    }, 100, node, cb)
}

window.addEventListener('yt-navigate-start', function () {
    runBypass()
})

window.addEventListener('popstate', function () {
    runBypass()
})

var overriddenVideo = null

function runBypass() {
    if (overriddenVideo != null) {
        console.log("Navigating away from page, removing iframe")

        setElementHide(document.getElementById('error-screen'), false)
        setElementHide(document.getElementsByClassName('ytp-error')[0], false)
        setElementHide(document.getElementById("movie_player"), false)

        overriddenVideo.remove()
    }

    let isWatchPage = (location.pathname.startsWith('/watch') || location.pathname.startsWith('/embed'))
    if (isWatchPage) {
        waitForNodeId('movie_player', function () {
            waitForNodeId('player-container', function () {
                waitForNodeId('container', function () {
                    let playerElement = document.getElementById("movie_player")
                    let isRestricted = isWatchPage && playerElement.getPlayerState() == -1
                    if (isRestricted) {
                        setElementHide(document.getElementById('error-screen'), true)
                        setElementHide(document.getElementsByClassName('ytp-error')[0], true)
                        setElementHide(document.getElementById("movie_player"), true)

                        fetch('https://example.com/?id=' + playerElement.getVideoData().video_id, {
                            mode: 'cors'
                        }).then(result => result.json()).then(result => {
                            var container = document.querySelector('div.ytd-player')

                            var videoPlayer = document.createElement('div')
                            videoPlayer.className = "html5-video-player ytp-transparent ytp-hide-info-bar ytp-large-width-mode iv-module-loaded paused-mode"

                            var playerContent = document.createElement('div')
                            playerContent.className = "ytp-player-content ytp-iv-player-content"

                            var playerFrame = window.document.createElement("iframe")
                            playerFrame.setAttribute("src", result.url)
                            playerFrame.setAttribute("id", "movie_player_fake")
                            playerFrame.setAttribute("frameBorder", "0")
                            playerFrame.setAttribute("width", "100%")
                            playerFrame.setAttribute("height", "100%")
                            playerFrame.setAttribute("allowfullscreen", true)

                            container.appendChild(videoPlayer)
                            videoPlayer.appendChild(playerContent)
                            playerContent.appendChild(playerFrame)

                            overriddenVideo = videoPlayer
                        })
                    }
                })
            })
        })
    }
}

runBypass()