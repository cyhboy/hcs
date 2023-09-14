/* eslint-disable no-undef */


if (typeof window !== 'undefined') {
    console.log('You are on the browser in cmder.js')
    // can use localStorage here
} else {
    console.log('You are on the server in cmder.js')
    // can't use localStorage
}


chrome.storage.local.get(['domUrl'], function (result) {
    console.log('Value of domUrl currently is ' + result.domUrl)
    let newLocation = new URL('openyt://' + result.domUrl)
    
    console.log(newLocation)

    window.location = newLocation
    setTimeout(() => {
        window.close()
    }, 1000)
})



