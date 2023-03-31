
chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {

    // if (typeof window !== 'undefined') {
    //     console.log('You are on the browser in background.js')
    //     // can use localStorage here
    // } else {
    //     console.log('You are on the server in background.js')
    //     // can't use localStorage
    // }

    if (info.status !== undefined && tab.status == 'complete') {
        console.log('inside: ', tabId, info.status, tab.status, tab.url)

        if (tab.url.startsWith('https://www.youtube.com/playlist?list=')) {
            console.log('get the youtube playlist linkage')
            chrome.storage.local.set({ 'domUrl': tab.url }, function () {
                console.log('onUpdated value is set to domUrl: ' + tab.url)
            })
            chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, doStuffWithDom)
        } else if ((tab.url.startsWith('https://www.youtube.com/channel/') || tab.url.startsWith('https://www.youtube.com/user/') || tab.url.startsWith('https://www.youtube.com/c/') || tab.url.startsWith('https://www.youtube.com/@')) && (tab.url.endsWith('/videos') || tab.url.endsWith('/playlists'))) {
            console.log('get the youtube playlists or videos linkage')
            chrome.storage.local.set({ 'domUrl': tab.url }, function () {
                console.log('onUpdated value is set to domUrl: ' + tab.url)
            })
            chrome.tabs.sendMessage(tab.id, { text: 'report_back_playlists_videos', linkage: tab.url }, doStuffWithDom)
        } else {
            console.log('onUpdated reset badge')
            chrome.browserAction.setBadgeText({ text: '' }, () => { })
            chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] }, () => { })
            chrome.browserAction.setTitle({ title: '' }, () => { })
        }
    }
})

chrome.tabs.onActivated.addListener(info => {
    console.log(info)
    console.log(info.tabId)

    chrome.tabs.get(info.tabId, function (tab) {

        if (info.status == undefined && tab.status == 'complete') {
            console.log(tab.url)

            if (tab.url.startsWith('https://www.youtube.com/playlist?list=')) {
                chrome.storage.local.set({ 'domUrl': tab.url }, function () {
                    console.log('onActivated value is set to domUrl: ' + tab.url)
                })
                chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, doStuffWithDom)
            } else if ((tab.url.startsWith('https://www.youtube.com/channel/') || tab.url.startsWith('https://www.youtube.com/user/') || tab.url.startsWith('https://www.youtube.com/c/') || tab.url.startsWith('https://www.youtube.com/@')) && (tab.url.endsWith('/videos') || tab.url.endsWith('/playlists'))) {
                chrome.storage.local.set({ 'domUrl': tab.url }, function () {
                    console.log('onActivated value is set to domUrl: ' + tab.url)
                })
                chrome.tabs.sendMessage(tab.id, { text: 'report_back_playlists_videos', linkage: tab.url }, doStuffWithDom)
            } else {
                console.log('onActivated reset badge')
                chrome.browserAction.setBadgeText({ text: '' }, () => { })
                chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] }, () => { })
                chrome.browserAction.setTitle({ title: '' }, () => { })
            }
        }

    })

})


chrome.browserAction.onClicked.addListener(() => {
    chrome.browserAction.getBadgeText({}, (res) => {
        console.log(res, JSON.stringify(res))
        if (res == 'ok') {
            const createOption = {
                url: 'helper.html',
                // url: 'openss://C:/CHROME_SPACE/hcs/learning/' + result.domContent + '.xlsm',
                focused: false,

                state: 'minimized',
                // width: 1,
                // height: 1,

                // type: "popup",
            }
            chrome.windows.create(createOption, () => { })
            return true
        }

        if (res == 'ng') {
            const createOption = {
                url: 'cmder.html',
                // url: 'openyt://',
                focused: false,

                state: 'minimized',
                // width: 1,
                // height: 1,

                // type: "popup",
            }
            chrome.windows.create(createOption, () => { })
            return true
        }
    })
})



function doStuffWithDom(domContent) {
    console.log('I received the following DOM content in doStuffWithDom:\n' + domContent)

    chrome.storage.local.set({ 'domContent': domContent }, function () {
        console.log('Value is set to ' + domContent)
    })

    let myFile = 'learning/' + domContent + '.xlsm'

    chrome.runtime.getPackageDirectoryEntry(function (storageRootEntry) {
        storageRootEntry.getFile(myFile, {
        }, function (fileEntry) {
            fileEntry.file(function (file) {
                // console.log(file)
                let output = 'ng'
                let color = 'red'
                let dtitle = 'yt index files is not available'
                console.log('file.name: ', file.name)
                console.log('modification: ', file.lastModifiedDate)
                let date1 = new Date(file.lastModified)
                let date2 = new Date()
                let diffTime = Math.abs(date2 - date1)
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                console.log(diffTime + ' milliseconds')
                console.log(diffDays + ' days')
                if (diffDays > 180) {
                    output = 'ok'
                    color = 'orange'
                    dtitle = 'yt index files outdated over half year'
                } else if (diffDays > 90) {
                    output = 'ok'
                    color = 'yellow'
                    dtitle = 'yt index files outdated over 3 months'
                } else if (diffDays > 30) {
                    output = 'ok'
                    color = 'blue'
                    dtitle = 'yt index file is pending for review'
                } else {
                    output = 'ok'
                    color = 'green'
                    dtitle = 'yt index file just review in passed month'
                }

                chrome.browserAction.setBadgeText({ text: output }, () => { })
                chrome.browserAction.setBadgeBackgroundColor({ color: color }, () => { })
                chrome.browserAction.setTitle({ title: dtitle }, () => { })
            })
        }, function () {
            let output = 'ng'
            let color = 'red'
            let dtitle = 'yt index files is not available'

            chrome.browserAction.setBadgeText({ text: output }, () => { })
            chrome.browserAction.setBadgeBackgroundColor({ color: color }, () => { })
            chrome.browserAction.setTitle({ title: dtitle }, () => { })
        })
    })

}


