{
    function setElementHide(n, state) {
        if (n != null) {
            if (state) {
                n.classList.add('hideplayer')
            }
            else {
                n.classList.remove('hideplayer')
            }
        }
    }

    function waitForNodeId(node, cb) {
        let ival = setInterval(function (node, cb) {
            if (document.getElementById(node) != null) {
                clearInterval(ival)
                cb()
            }
        }, 100, node, cb)
    }

    window.addEventListener('yt-navigate-finish', function () {
        runBypass()
    })

    document.currentScript = document.currentScript || (function () {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    let overriddenVideo = null
    const downloadURL = document.currentScript.getAttribute('data-url');

    function runBypass() {
        if (overriddenVideo != null) {
            console.log('Navigating away from page, removing iframe')

            setElementHide(document.getElementById('error-screen'), false)
            setElementHide(document.getElementsByClassName('ytp-error')[0], false)
            setElementHide(document.getElementById('movie_player'), false)

            overriddenVideo.remove()
        }

        let isWatchPage = (location.pathname.startsWith('/watch') || location.pathname.startsWith('/embed'))
        if (isWatchPage) {
            waitForNodeId('movie_player', function () {
                waitForNodeId('player-container', function () {
                    waitForNodeId('container', function () {
                        let playerElement = document.getElementById('movie_player')
                        let isRestricted = isWatchPage && playerElement.getPlayerState() == -1
                        if (isRestricted) {
                            setElementHide(document.getElementById('error-screen'), true)
                            setElementHide(document.getElementsByClassName('ytp-error')[0], true)
                            setElementHide(document.getElementById('movie_player'), true)

                            fetch(downloadURL + '?id=' + playerElement.getVideoData().video_id, {
                                mode: 'cors'
                            }).then(result => result.json()).then(result => {
                                let container = document.querySelector('div.ytd-player')

                                let videoPlayer = document.createElement('div')
                                videoPlayer.className = 'html5-video-player ytp-transparent ytp-hide-info-bar ytp-large-width-mode iv-module-loaded paused-mode'

                                let playerContent = document.createElement('div')
                                playerContent.className = 'ytp-player-content ytp-iv-player-content'

                                let playerFrame = window.document.createElement('iframe')
                                playerFrame.setAttribute('src', result.url)
                                playerFrame.setAttribute('id', 'movie_player_fake')
                                playerFrame.setAttribute('frameBorder', '0')
                                playerFrame.setAttribute('width', '100%')
                                playerFrame.setAttribute('height', '100%')
                                playerFrame.setAttribute('allowfullscreen', true)

                                container.appendChild(videoPlayer)
                                videoPlayer.appendChild(playerContent)
                                playerContent.appendChild(playerFrame)

                                overriddenVideo = videoPlayer
                            }).catch(function () {
                                // Pain
                                let container = document.querySelector('div.ytd-player')

                                let playerContent = document.createElement('yt-player-error-message-renderer')
                                playerContent.className = 'style-scope yt-playability-error-supported-renderers'

                                let errorFrame = window.document.createElement('div')
                                errorFrame.setAttribute('id', 'info')
                                errorFrame.className = 'style-scope yt-player-error-message-renderer'

                                let errorReason = window.document.createElement('div')
                                errorReason.setAttribute('id', 'reason')
                                errorReason.className = 'style-scope yt-player-error-message-renderer'
                                errorReason.innerHTML = 'Download server error'

                                let errorSubReason = window.document.createElement('yt-formatted-string')
                                errorSubReason.setAttribute('id', 'subreason')
                                errorSubReason.className = 'style-scope yt-player-error-message-renderer'
                                let errorSubReasonSpan = window.document.createElement('span')
                                errorSubReasonSpan.setAttribute('dir', 'auto')
                                errorSubReasonSpan.className = 'style-scope yt-formatted-string'
                                errorSubReasonSpan.innerHTML = 'There was an error downloading the video from the server intended to bypass content restrictions, please check your URL is valid in the extension options and that the server is online.'

                                container.appendChild(playerContent)
                                playerContent.appendChild(errorFrame)
                                errorFrame.appendChild(errorReason)
                                errorFrame.appendChild(errorSubReason)
                                errorSubReason.appendChild(errorSubReasonSpan)

                                overriddenVideo = playerContent
                            })
                        }
                    })
                })
            })
        }
    }
}