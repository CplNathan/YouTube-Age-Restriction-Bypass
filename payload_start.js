function requestAgeRestrictionBypassSettingsOpen() {
    window.dispatchEvent(new CustomEvent('requestAgeRestrictionBypassSettingsOpen', {}));
    return true;
}

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

    function removeLoadingPage() {
        if (loadingPage != null) {
            loadingPage.remove()
            loadingPage = null
        }
    }

    window.addEventListener('yt-navigate-finish', function () {
        runBypass()
    })

    document.currentScript = document.currentScript || (function () {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    let overriddenVideo = null
    let loadingPage = null
    const downloadURL = document.currentScript.getAttribute('data-url');
    const errorURL = document.currentScript.getAttribute('data-errorurl')
    const loadingURL = document.currentScript.getAttribute('data-loadingurl')
    const playerURL = document.currentScript.getAttribute('data-playerurl')

    function runBypass() {
        if (overriddenVideo != null) {
            console.log('Navigating away from page, removing iframe')

            setElementHide(document.getElementsByTagName('yt-player-error-message-renderer')[0], false)
            setElementHide(document.getElementById('error-screen'), false)
            setElementHide(document.getElementsByClassName('ytp-error')[0], false)
            setElementHide(document.getElementById('movie_player'), false)

            overriddenVideo.remove()
            overriddenVideo = null
        }

        removeLoadingPage()

        let isWatchPage = (location.pathname.startsWith('/watch') || location.pathname.startsWith('/embed'))
        if (isWatchPage) {
            waitForNodeId('movie_player', function () {
                waitForNodeId('player-container', function () {
                    waitForNodeId('container', function () {
                        let playerElement = document.getElementById('movie_player')
                        let isRestricted = isWatchPage && playerElement.getPlayerState() == -1
                        if (isRestricted) {
                            setElementHide(document.getElementsByTagName('yt-player-error-message-renderer')[0], true)
                            setElementHide(document.getElementsByClassName('ytp-error')[0], true)
                            setElementHide(document.getElementById('movie_player'), true)

                            fetch(loadingURL).then(function (response) {
                                return response.text();
                            }).then(function (data) {
                                let container = document.getElementsByTagName('yt-player-error-message-renderer')[0]
                                container.insertAdjacentHTML('beforebegin', data);
                                loadingPage = document.getElementById('loading-fake')
                            });

                            fetch(downloadURL + '?id=' + playerElement.getVideoData().video_id, {
                                mode: 'cors'
                            }).then(result => result.json()).then(result => {
                                setElementHide(document.getElementById('error-screen'), true)

                                fetch(playerURL).then(function (response) {
                                    return response.text();
                                }).then(function (data) {
                                    let container = document.querySelector('div.ytd-player')
                                    container.insertAdjacentHTML('beforebegin', data);
                                    document.getElementById('movie_player_fake').setAttribute('src', result.url)
                                    overriddenVideo = document.getElementById('player-fake')

                                    removeLoadingPage()
                                });
                            }).catch(function () {
                                fetch(errorURL).then(function (response) {
                                    return response.text();
                                }).then(function (data) {
                                    let container = document.getElementsByTagName('yt-player-error-message-renderer')[0]
                                    container.insertAdjacentHTML('beforebegin', data);
                                    overriddenVideo = document.getElementById('error-fake')

                                    removeLoadingPage()
                                });
                            })
                        }
                    })
                })
            })
        }
    }
}