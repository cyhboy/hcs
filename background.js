chrome.webNavigation.onCompleted.addListener(function (tab) {

    if (typeof window !== 'undefined') {
        console.log('onCompleted You are on the browser in background.js')
        // can use localStorage here
    } else {
        console.log('onCompleted You are on the server in background.js')
        // can't use localStorage
    }

    let msgtxt = ''
    let myUrl = ''
    let PG_READY = false

    console.log('tab.url', tab.url)
    console.log('tab.frameId', tab.frameId)
    console.log('tab.tabId', tab.tabId)

    if (tab.frameId == 0) {
        myUrl = tab.url
        console.log('onCompleted read myUrl when tab.frameId == 0: ' + myUrl)
        if (myUrl.endsWith('/videos?sttick=0')) {
            let loc = myUrl.lastIndexOf('?')
            myUrl = myUrl.slice(0, loc)
            console.log('onCompleted revised myUrl when tab.frameId == 0: ' + myUrl)
        }

        chrome.storage.local.set({'myUrl': myUrl}, function () {
            console.log('onCompleted set to myUrl when tab.frameId == 0: ' + myUrl)
        })
        chrome.storage.local.set({'PG_READY': false}, function () {
            console.log('onCompleted set to PG_READY when tab.frameId == 0: ' + false)
        })
    }

    if (tab.frameId > 0) {
        try {
            chrome.storage.local.set({'PG_READY': true}, function () {
                console.log('onCompleted set to PG_READY when tab.frameId > 0: ' + true)
            })

            chrome.storage.local.get(['myUrl', 'PG_READY'], function (result) {
                myUrl = result.myUrl
                PG_READY = result.PG_READY
                console.log('onCompleted get myUrl when tab.frameId > 0: ', myUrl)
                console.log('onCompleted get PG_READY when tab.frameId > 0: ', PG_READY)

                if (myUrl.startsWith('https://www.youtube.com/playlist?list=')) {
                    console.log('onCompleted get the youtube playlist linkage')
                    chrome.storage.local.set({'domUrl': myUrl}, function () {
                        console.log('onCompleted value is set to domUrl: ' + myUrl)
                    })
                    chrome.tabs.sendMessage(tab.tabId, {text: 'report_back', linkage: myUrl}, doStuffWithDom)
                } else if ((myUrl.startsWith('https://www.youtube.com/channel/') || myUrl.startsWith('https://www.youtube.com/user/') || myUrl.startsWith('https://www.youtube.com/c/') || myUrl.startsWith('https://www.youtube.com/')) && (myUrl.endsWith('/videos') || myUrl.endsWith('/playlists'))) {
                    console.log('onCompleted get the youtube playlists or videos linkage')
                    chrome.storage.local.set({'domUrl': myUrl}, function () {
                        console.log('onCompleted value is set to domUrl: ' + myUrl)
                    })
                    chrome.tabs.sendMessage(tab.tabId, {
                        text: 'report_back_playlists_videos',
                        linkage: myUrl
                    }, doStuffWithDom)
                } else if (myUrl.startsWith('https://www.douyin.com/user/')) {
                    console.log('onCompleted get the douyin user main linkage')
                    chrome.storage.local.set({'domUrl': myUrl}, function () {
                        console.log('onCompleted value is set to domUrl: ' + myUrl)
                    })
                    chrome.tabs.sendMessage(tab.tabId, {text: 'douyin_user', linkage: myUrl}, doStuffWithDom)
                } else if (myUrl.startsWith('https://www.bilibili.com/video/')) {
                    console.log('onCompleted get the bilibili topic main page')
                    chrome.storage.local.set({'domUrl': myUrl}, function () {
                        console.log('onCompleted value is set to domUrl: ' + myUrl)
                    })
                    chrome.tabs.sendMessage(tab.tabId, {text: 'bilibili_episode', linkage: myUrl}, doStuffWithDom)
                } else if (myUrl.startsWith('https://space.bilibili.com/')) {
                    console.log('onCompleted get the bilibili video main page')
                    chrome.storage.local.set({'domUrl': myUrl}, function () {
                        console.log('onCompleted value is set to domUrl: ' + myUrl)
                    })
                    chrome.tabs.sendMessage(tab.tabId, {text: 'bilibili_video', linkage: myUrl}, doStuffWithDom)
                } else {
                    console.log('onCompleted reset badge')
                    chrome.browserAction.setBadgeText({text: ''}, () => {
                    })
                    chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]}, () => {
                    })
                    chrome.browserAction.setTitle({title: ''}, () => {
                    })
                }
            })

            // msgtxt = msgtxt + 'tabId => ' + tab.tabId + '\n'
            // msgtxt = msgtxt + 'tab.url => ' + tab.url + '\n'

            // console.log('onCompleted: ', msgtxt)

        } catch (error) {
            console.log(error)
        }
    }

}, {url: [{urlMatches: 'http*'}]})
// }, {url: [{urlMatches: 'https://www.youtube.com/playlist\\?list\\='}]})


chrome.tabs.onUpdated.addListener(function (tabIdUpd, infoUpd, tabUpd) {
    let myUrl = ''
    let PG_READY = false

    if (typeof window !== 'undefined') {
        console.log('onUpdated You are on the browser in background.js')
        // can use localStorage here
    } else {
        console.log('onUpdated You are on the server in background.js')
        // can't use localStorage
    }

    console.log('onUpdated infoUpd', infoUpd)
    console.log('onUpdated tabUpd.url', tabUpd.url)
    console.log('onUpdated tabIdUpd', tabIdUpd)
    console.log('onUpdated tabUpd', tabUpd)

    console.log('onUpdated tabUpd.status', tabUpd.status)
    console.log('onUpdated infoUpd.status', infoUpd.status)
    console.log('onUpdated infoUpd.favIconUrl', infoUpd.favIconUrl)

    if ((infoUpd.status == undefined && infoUpd.favIconUrl != undefined && tabUpd.status == 'complete') || (infoUpd.status == 'complete' && infoUpd.favIconUrl == undefined && tabUpd.status == 'complete')) {
        chrome.storage.local.get(['myUrl', 'PG_READY'], function (result) {
            myUrl = result.myUrl
            PG_READY = result.PG_READY
            console.log('onUpdated myUrl', myUrl)
            console.log('onUpdated PG_READY', PG_READY)

            if (!PG_READY) {
                console.log('onUpdated return', myUrl)
                return
            }

            if (tabUpd.url.startsWith('https://www.youtube.com/playlist?list=')) {
                console.log('get the youtube playlist linkage')
                chrome.storage.local.set({'domUrl': tabUpd.url}, function () {
                    console.log('onUpdated value is set to domUrl: ' + tabUpd.url)
                })
                chrome.tabs.sendMessage(tabIdUpd, {text: 'report_back', linkage: tabUpd.url}, doStuffWithDom)
            } else if ((tabUpd.url.startsWith('https://www.youtube.com/channel/') || tabUpd.url.startsWith('https://www.youtube.com/user/') || tabUpd.url.startsWith('https://www.youtube.com/c/') || tabUpd.url.startsWith('https://www.youtube.com/')) && (tabUpd.url.endsWith('/videos') || tabUpd.url.endsWith('/playlists'))) {
                console.log('get the youtube playlists or videos linkage')
                chrome.storage.local.set({'domUrl': tabUpd.url}, function () {
                    console.log('onUpdated value is set to domUrl: ' + tabUpd.url)
                })
                chrome.tabs.sendMessage(tabIdUpd, {
                    text: 'report_back_playlists_videos',
                    linkage: tabUpd.url
                }, doStuffWithDom)
            } else if (tabUpd.url.startsWith('https://www.douyin.com/user/')) {
                console.log('get the douyin user main linkage')
                chrome.storage.local.set({'domUrl': tabUpd.url}, function () {
                    console.log('onUpdated value is set to domUrl: ' + tabUpd.url)
                })
                chrome.tabs.sendMessage(tabIdUpd, {text: 'douyin_user', linkage: tabUpd.url}, doStuffWithDom)
            } else if (tabUpd.url.startsWith('https://www.bilibili.com/video/')) {
                console.log('get the bilibili topic main page')
                chrome.storage.local.set({'domUrl': tabUpd.url}, function () {
                    console.log('onUpdated value is set to domUrl: ' + tabUpd.url)
                })
                chrome.tabs.sendMessage(tabIdUpd, {text: 'bilibili_episode', linkage: tabUpd.url}, doStuffWithDom)
            } else if (tabUpd.url.startsWith('https://space.bilibili.com/')) {
                console.log('get the bilibili video main page')
                chrome.storage.local.set({'domUrl': tabUpd.url}, function () {
                    console.log('onUpdated value is set to domUrl: ' + tabUpd.url)
                })
                chrome.tabs.sendMessage(tabIdUpd, {text: 'bilibili_video', linkage: tabUpd.url}, doStuffWithDom)
            } else {
                console.log('onUpdated reset badge')
                chrome.browserAction.setBadgeText({text: ''}, () => {
                })
                chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]}, () => {
                })
                chrome.browserAction.setTitle({title: ''}, () => {
                })
            }
        })
    }
})


chrome.tabs.onActivated.addListener(infoActv => {
    let msgtxt1 = ''
    let msgtxt2 = ''
    msgtxt1 = msgtxt1 + 'onActivated infoActv.tabId => ' + infoActv.tabId + '\n'
    msgtxt1 = msgtxt1 + 'onActivated infoActv.status => ' + infoActv.status + '\n'

    console.log('onActivated infoActv: ', msgtxt1)

    let myUrl = ''
    let PG_READY = false

    chrome.storage.local.get(['myUrl', 'PG_READY'], function (result) {
        myUrl = result.myUrl
        PG_READY = result.PG_READY
        console.log('onActivated myUrl', myUrl)
        console.log('onActivated PG_READY', PG_READY)

        if (!PG_READY) {
            return
        }
        chrome.tabs.get(infoActv.tabId, function (tabActv) {
            msgtxt2 = msgtxt2 + 'tabActv.url => ' + tabActv.url + '\n'
            msgtxt2 = msgtxt2 + 'tabActv.status => ' + tabActv.status + '\n'
            console.log('onActivated tabActv: ', msgtxt2)

            try {
                if (infoActv.status == undefined && tabActv.status == 'complete' && (tabActv.url == myUrl || 1 == 1)) {
                    console.log('onActivated entry major logic!!!')

                    if (tabActv.url.startsWith('https://www.youtube.com/playlist?list=')) {
                        chrome.storage.local.set({'domUrl': tabActv.url}, function () {
                            console.log('onActivated value is set to domUrl: ' + tabActv.url)
                        })
                        chrome.tabs.sendMessage(tabActv.id, {text: 'report_back', linkage: tabActv.url}, doStuffWithDom)
                    } else if ((tabActv.url.startsWith('https://www.youtube.com/channel/') || tabActv.url.startsWith('https://www.youtube.com/user/') || tabActv.url.startsWith('https://www.youtube.com/c/') || tabActv.url.startsWith('https://www.youtube.com/')) && (tabActv.url.endsWith('/videos') || tabActv.url.endsWith('/playlists'))) {
                        chrome.storage.local.set({'domUrl': tabActv.url}, function () {
                            console.log('onActivated value is set to domUrl: ' + tabActv.url)
                        })
                        chrome.tabs.sendMessage(tabActv.id, {
                            text: 'report_back_playlists_videos',
                            linkage: tabActv.url
                        }, doStuffWithDom)
                    } else if (tabActv.url.startsWith('https://www.douyin.com/user/')) {
                        console.log('onActivated get the douyin user main linkage')
                        chrome.storage.local.set({'domUrl': tabActv.url}, function () {
                            console.log('onActivated value is set to domUrl: ' + tabActv.url)
                        })
                        chrome.tabs.sendMessage(tabActv.id, {text: 'douyin_user', linkage: tabActv.url}, doStuffWithDom)
                    } else if (tabActv.url.startsWith('https://www.bilibili.com/video/')) {
                        console.log('onActivated get the bilibili topic main page')
                        chrome.storage.local.set({'domUrl': tabActv.url}, function () {
                            console.log('onActivated value is set to domUrl: ' + tabActv.url)
                        })
                        chrome.tabs.sendMessage(tabActv.id, {
                            text: 'bilibili_episode',
                            linkage: tabActv.url
                        }, doStuffWithDom)
                    } else if (tabActv.url.startsWith('https://space.bilibili.com/')) {
                        console.log('onActivated get the bilibili video main page')
                        chrome.storage.local.set({'domUrl': tabActv.url}, function () {
                            console.log('onActivated value is set to domUrl: ' + tabActv.url)
                        })
                        chrome.tabs.sendMessage(tabActv.id, {
                            text: 'bilibili_video',
                            linkage: tabActv.url
                        }, doStuffWithDom)
                    } else {
                        console.log('onActivated reset badge')
                        chrome.browserAction.setBadgeText({text: ''}, () => {
                        })
                        chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]}, () => {
                        })
                        chrome.browserAction.setTitle({title: ''}, () => {
                        })
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
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
            chrome.windows.create(createOption, () => {
            })
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
            chrome.windows.create(createOption, () => {
            })
            return true
        }

        if (res == 'gd' || res == 'na') {
            const createOption = {
                url: 'douyiner.html',
                // url: 'openyt://',
                focused: false,

                state: 'minimized',
                // width: 1,
                // height: 1,

                // type: "popup",
            }
            chrome.windows.create(createOption, () => {
            })
            return true
        }

        if (res == 'po' || res == 'ne') {
            const createOption = {
                url: 'bilibilier.html',
                // url: 'openyt://',
                focused: false,

                state: 'minimized',
                // width: 1,
                // height: 1,

                // type: "popup",
            }
            chrome.windows.create(createOption, () => {
            })
            return true
        }
    })
})


function doStuffWithDom(domContentUrl) {
    console.log('I received the following DOM string in doStuffWithDom:\n' + domContentUrl)
    if (domContentUrl != undefined) {
        let domContent = domContentUrl.split('|')[0]
        let domUrl = domContentUrl.split('|')[1]
        console.log('I received the following DOM content in doStuffWithDom:\n' + domContent)
        console.log('I received the following DOM url in doStuffWithDom:\n' + domUrl)

        chrome.storage.local.set({'domContent': domContent}, function () {
            console.log('Value is set to ' + domContent)
        })

        let myFile = 'learning/' + domContent + '.xlsm'

        chrome.runtime.getPackageDirectoryEntry(function (storageRootEntry) {
            storageRootEntry.getFile(myFile, {}, function (fileEntry) {
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

                    if (domUrl.startsWith('https://www.youtube.com/')) {
                        output = 'ok'
                    }

                    if (domUrl.startsWith('https://www.douyin.com/')) {
                        output = 'gd'
                    }

                    if (domUrl.startsWith('https://www.bilibili.com/') || domUrl.startsWith('https://space.bilibili.com/')) {
                        output = 'po'
                    }

                    if (diffDays > 180) {

                        color = 'orange'
                        dtitle = 'yt index files outdated over half year'
                    } else if (diffDays > 90) {

                        color = 'yellow'
                        dtitle = 'yt index files outdated over 3 months'
                    } else if (diffDays > 30) {

                        color = 'blue'
                        dtitle = 'yt index file is pending for review'
                    } else {

                        color = 'green'
                        dtitle = 'yt index file just review in passed month'
                    }

                    chrome.browserAction.setBadgeText({text: output}, () => {
                    })
                    chrome.browserAction.setBadgeBackgroundColor({color: color}, () => {
                    })
                    chrome.browserAction.setTitle({title: dtitle}, () => {
                    })
                })
            }, function () {
                let output = 'ng'

                if (domUrl.startsWith('https://www.youtube.com/')) {
                    output = 'ng'
                }

                if (domUrl.startsWith('https://www.douyin.com/')) {
                    output = 'na'
                }

                if (domUrl.startsWith('https://www.bilibili.com/') || domUrl.startsWith('https://space.bilibili.com/')) {
                    output = 'ne'
                }

                let color = 'red'
                let dtitle = 'yt index files is not available'

                chrome.browserAction.setBadgeText({text: output}, () => {
                })
                chrome.browserAction.setBadgeBackgroundColor({color: color}, () => {
                })
                chrome.browserAction.setTitle({title: dtitle}, () => {
                })
            })
        })
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}