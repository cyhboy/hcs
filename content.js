/* eslint-disable no-misleading-character-class */
/* eslint-disable no-undef */


// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...


    console.log('onMessage sender.id: ', sender.id)

    if (typeof window !== 'undefined') {
        console.log('You are on the browser in content.js')
        // can use localStorage here
    } else {
        console.log('You are on the server in content.js')
        // can't use localStorage
    }

    let author = ''
    let title = ''
    let domContent = ''

    if (msg.text == 'douyin_user') {

        let idStr = ''
        let locationStr = ''
        let sig = ''
        if (document.readyState === 'complete') {

            try {
                sig = document.querySelector('div[data-e2e=\'user-info\']')
                // console.log('sig: ', sig)
                author = sig.querySelector('h1').textContent
                author = author.trim()
                console.log('first get author: ', author)

                idStr = sig.querySelectorAll('p > span')[0].textContent
                idStr = idStr.replace('抖音号：', '')
                console.log('idStr: ', idStr)

                locationStr = sig.querySelectorAll('p > span')[-1].textContent
                locationStr = locationStr.replace('IP属地：', '')
                console.log('locationStr: ', locationStr)
            } catch (error) {
                console.log(error)
                author = ''
                idStr = ''
                locationStr = ''
                // sleep(1000)
            }

            try {
                let elements = []

                // console.log('sig: ', sig)
                Array.from(sig.querySelectorAll('div')).forEach((element, index) => {
                    if (element.querySelector('span') != null) {
                        if (element.querySelector('h1') == null) {
                            elements.push(element)
                        }
                    }

                })
                if (elements.length > 0) {
                    title = elements[0].textContent
                    title = title.trim()
                } else {
                    title = '记录美好生活'
                }
                console.log('first get title: ', title)
            } catch (error) {
                console.log(error)
                title = ''
                // sleep(1000)
            }
        }

        author = author.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')
        title = title.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')

        console.log('author: ', author)
        console.log('title: ', title)

        let domContent = author + '_' + title + '_' + idStr + '_' + locationStr

        sendResponse(domContent + '|' + msg.linkage)

        return true

    }


    if (msg.text == 'bilibili_episode') {

        // let cnt = 0
        if (document.readyState === 'complete') {

            // while (document.querySelector('a[class=\'up-name\']') == null || document.querySelector('h1[class=\'video-title special-text-indent\']') == null) {
            //     sleep(3000)
            //     cnt = cnt + 1
            //
            //     console.log('cnt: ', cnt)
            //     if (cnt == 6) {
            //         location.reload()
            //         break
            //         // return false
            //     }
            // }

            // cnt = 0
            // while (document.querySelector('a[class=\'up-name\']').textContent == '' || document.querySelector('h1[class=\'video-title special-text-indent\']').textContent == '') {
            //     sleep(3000)
            //     cnt = cnt + 1
            //
            //     console.log('cnt: ', cnt)
            //     if (cnt == 6) {
            //         location.reload()
            //         break
            //         // return false
            //     }
            // }

            try {
                author = document.querySelector('a[class=\'up-name\']').textContent
                author = author.trim()
                console.log('first get author in bilibili_episode: ', author)
            } catch (error) {
                console.log(error)
                author = ''
                sleep(1000)
            }

            try {

                title = document.querySelector('h1[class=\'video-title special-text-indent\']').textContent
                // console.log('sig: ', sig)
                title = title.trim()
                console.log('first get title in bilibili_episode: ', title)
            } catch (error) {
                console.log(error)
                title = ''
                // sleep(1000)
            }
        }

        author = author.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')
        title = title.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')

        console.log('author episode: ', author)
        console.log('title episode: ', title)

        let domContent = author + '_' + title

        sendResponse(domContent + '|' + msg.linkage)

        return true

    }

    if (msg.text == 'bilibili_video') {

        // let cnt = 0
        let listType = 'default'
        console.log('document.readyState in bilibili_video: ', document.readyState)
        // alert('document.readyState: ' + document.readyState)
        // alert('document.URL: ' + document.URL)
        // alert('msg.linkage: ' + msg.linkage)

        if (document.URL.indexOf('collectiondetail') != -1) {
            listType = 'collectiondetail'
        } else if (document.URL.indexOf('seriesdetail') != -1) {
            listType = 'seriesdetail'
        } else {
            let endLocation1 = document.URL.lastIndexOf('/') + 1
            listType = document.URL.substring(endLocation1)
            let endLocation2 = listType.indexOf('?')
            if (endLocation2 != -1) {
                listType = listType.substring(0, endLocation2)
            }
        }
        console.log('listType in bilibili_video: ' + listType)
        // alert('listType: ' + listType)
        // document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            // alert('document.querySelector(span[id=h-name])' + document.querySelector('span[id=\'h-name\']'))
            // alert('document.querySelector(span[class=item cur])' + document.querySelector('span[class=\'item cur\']'))

            // while (document.querySelector('span[id=\'h-name\']') == null) {
            //     sleep(3000)
            //     cnt = cnt + 1
            //
            //     console.log('cnt: ', cnt)
            //     if (cnt == 3) {
            //         location.reload()
            //         break
            //         // return false
            //     }
            // }

            // if (listType == 'collectiondetail' || listType == 'seriesdetail') {
            //     cnt = 0
            //     while (document.querySelector('span[class=\'item cur\']') == null) {
            //         sleep(3000)
            //         cnt = cnt + 1
            //
            //         console.log('cnt: ', cnt)
            //         if (cnt == 3) {
            //             location.reload()
            //             break
            //             // return false
            //         }
            //     }
            // }


            // alert(document.querySelector('span[id=\'h-name\']').textContent)

            // cnt = 0
            //
            // while (document.querySelector('span[id=\'h-name\']').textContent == '') {
            //     sleep(3000)
            //     cnt = cnt + 1
            //
            //     console.log('cnt: ', cnt)
            //     if (cnt == 3) {
            //         location.reload()
            //         break
            //         // return false
            //     }
            // }

            // if (listType == 'collectiondetail' || listType == 'seriesdetail') {
            //     cnt = 0
            //     while (document.querySelector('span[class=\'item cur\']').textContent == '') {
            //         sleep(3000)
            //         cnt = cnt + 1
            //
            //         console.log('cnt: ', cnt)
            //         if (cnt == 3) {
            //             location.reload()
            //             break
            //             // return false
            //         }
            //     }
            //     // alert(document.querySelector('span[class=\'item cur\']').textContent)
            // }


            try {
                author = document.querySelector('span[id=\'h-name\']').textContent
                author = author.trim()
                console.log('first get author: ', author)
            } catch (error) {
                console.log(error)
                author = ''
                // sleep(1000)
            }

            if (listType == 'collectiondetail' || listType == 'seriesdetail') {
                try {
                    title = document.querySelector('span[class=\'item cur\']').textContent
                    title = title.trim()
                    console.log('first get title in bilibili_video: ', title)
                } catch (error) {
                    console.log(error)
                    title = ''
                    // sleep(1000)
                }
            } else {
                title = listType
            }

        }
        // }

        author = author.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')
        title = title.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')

        console.log('author video: ', author)
        console.log('title video: ', title)

        let domContent = author + '_' + title

        // alert('domContent: ' + domContent)

        sendResponse(domContent + '|' + msg.linkage)

        return true

    }


    if (msg.text == 'report_back') {
        console.log('document.readyState in report_back', document.readyState)

        if (document.readyState === 'complete') {

            try {
                // author = document.querySelector('#text > a').text
                author = document.querySelector('#owner-text > a').textContent
                author = author.trim()
                console.log('first get author: ', author)

                title = document.querySelector('#container > #text.style-scope.yt-dynamic-sizing-formatted-string.yt-sans-28').textContent
                console.log('first get title: ', title)
            } catch (error) {
                console.log(error)
                author = ''
                title = ''
                // sleep(1000)
            }

            if (author == '') {
                try {
                    let authors = []
                    authors = document.querySelectorAll('#text > a')

                    let authorArr = [].map.call(authors, function (auth) {
                        return auth.textContent
                    })
                    // console.log('mostVal(authors)', mostVal(authorArr))
                    author = mostVal(authorArr)
                    author = author.trim()
                    console.log('second get author: ', author)
                } catch (error) {
                    console.log(error)
                    author = ''
                    // sleep(1000)
                }
            }

            if (title == '') {
                try {
                    title = document.querySelector('#title > yt-formatted-string > a').textContent
                    title = title.trim()
                    console.log('second get title: ', title)
                } catch (error) {
                    console.log(error)
                    title = ''
                    // sleep(1000)
                }
            }

            author = author.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')
            title = title.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')

            // author = author.replace(/[^\w\s]/gi, '')
            // title = title.replace(/[^\w\s]/gi, '')

            console.log('author: ', author)
            console.log('title: ', title)

            domContent = author + '_' + title
            console.log('domContent|msg.linkage: ', domContent + '|' + msg.linkage)
            sendResponse(domContent + '|' + msg.linkage)
            return true
        }

    }

    if (msg.text == 'report_back_playlists_videos') {
        console.log('document.readyState in report_back_playlists_videos', document.readyState)
        if (document.readyState === 'complete') {

            try {
                author = document.querySelector('#page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > div > yt-dynamic-text-view-model > h1 > span').textContent
                author = author.trim()
                console.log('first get author: ', author)
            } catch (error) {
                console.log(error)
                author = ''
                // sleep(1000)
            }

            if (author == '') {
                try {
                    author = document.querySelector('#text > a').text
                    author = author.trim()
                } catch (error) {
                    console.log(error)
                    author = ''
                    // sleep(1000)
                }
            }

            if (author == '') {
                try {
                    author = document.querySelector('#text-container > yt-formatted-string').textContent
                    author = author.trim()
                } catch (error) {
                    console.log(error)
                    author = ''
                    // sleep(1000)
                }

            }
        }

        try {
            title = msg.linkage

            author = author.replace(/[/\\?\-👶🎵👨‍💻 ，!🍎🍏🌻, •🎓🏦·+()【】（）&–《》！.%@*：:|｜"'<>]/g, '')
            // author = author.replace(/[^\w\s]/gi, '')

            let loc = title.lastIndexOf('/')
            title = title.slice(loc + 1)
            title = title.trim()

            console.log('report_back_playlists_videos author: ', author)
            console.log('report_back_playlists_videos title: ', title)

            domContent = author + '_' + title

            console.log('domContent|msg.linkage: ', domContent + '|' + msg.linkage)

            sendResponse(domContent + '|' + msg.linkage)
            return true
        } catch (error) {
            console.log(error)
            // sleep(1000)
            return false
        }

    }

})


// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms))
// }

function sleep(time) {
    const start = new Date().getTime()
    // eslint-disable-next-line no-empty
    while (new Date().getTime() - start < time) {

    }
}

function mostVal(arr) {
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length
        - arr.filter(v => v === b).length
    ).pop()
}