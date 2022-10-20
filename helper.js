/* eslint-disable no-undef */


if (typeof window !== 'undefined') {
    console.log('You are on the browser in helper.js')
    // can use localStorage here
} else {
    console.log('You are on the server in helper.js')
    // can't use localStorage
}


chrome.storage.local.get(['domContent'], function (result) {
    console.log('Value currently is ' + result.domContent)
    let newLocation = new URL('openss://C:/CHROME_SPACE/ytcheck/learn/' + result.domContent + '.xlsm')
    // openss://C:/CHROME_SPACE/ytcheck/learn/窃客学院_安卓必学之MVCMVPMVVMNDK和JNcmake快速入门Android动画AndroidmustlearnMVCMVPMVVMNDKandJNcmakequickstartAndroidanimation.xlsm
    window.location = newLocation

    setTimeout(() => {
        window.close()
    }, 1000)
})



