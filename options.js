function save_options() {
    var downloadServer = document.getElementById('url').value
    chrome.storage.sync.set({
        'downloadServer': downloadServer
    }, function () {
        var status = document.getElementById('status')
        status.textContent = 'Options saved.'
        setTimeout(function () {
            status.textContent = ''
        }, 1000)
    })
}

function restore_options() {
    chrome.storage.sync.get({
        downloadServer: ''
    }, function (items) {
        document.getElementById('url').value = items.downloadServer
    })
}
document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('save').addEventListener('click', save_options)