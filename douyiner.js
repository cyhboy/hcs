/* eslint-disable no-undef */


if (typeof window !== 'undefined') {
    console.log('You are on the browser in douyiner.js')
    // can use localStorage here
} else {
    console.log('You are on the server in douyiner.js')
    // can't use localStorage
}


chrome.storage.local.get(['domUrl'], function (result) {
    console.log('Value of domUrl currently is ' + result.domUrl)
    let newLocation = new URL('opendy://' + result.domUrl)
    
    console.log(newLocation)

    window.location = newLocation
    setTimeout(() => {
        window.close()
    }, 10000)
})



