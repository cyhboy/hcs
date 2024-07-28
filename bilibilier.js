/* eslint-disable no-undef */


if (typeof window !== 'undefined') {
    console.log('You are on the browser in bilibilier.js')
    // can use localStorage here
} else {
    console.log('You are on the server in bilibilier.js')
    // can't use localStorage
}


chrome.storage.local.get(['domUrl'], function (result) {
    console.log('Value of domUrl currently is ' + result.domUrl)
    let newLocation = new URL('openbl://' + result.domUrl)
    
    console.log(newLocation)

    window.location = newLocation
    setTimeout(() => {
        window.close()
    }, 10000)
})



