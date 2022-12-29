chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({aac: []}, function () {
        console.log("[AAS] List Created");
    });
});

function listener(request, sender, sendResponse) {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id}, function (activeTabs) {
            activeTabs.map(function (tab) {
                chrome.scripting.executeScript({target: {tabId: tab.id}, func: fill,
                    args: [request],}, function () {
                    //chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['Ruler.js'] });
                });
            });
        });
    });


    sendResponse([request])
}

chrome.runtime.onMessage.addListener(listener)

function fill(fillData) {
    fillData.forEach(function (item, index) {
        var els = document.getElementsByName(item.name);
        for (var i = 0; i < els.length; i++) {
            els[i].value = item.value;
        }
console.log('adicionado')
    })
}