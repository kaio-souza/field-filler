chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({aac: []}, function () {
        console.log("[AAS] List Created");
    });
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({fillPreset: []}, function () {
        console.log("[AAS] Fill Preset Created");
    });
});

function listener(request, sender, sendResponse) {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id}, function (activeTabs) {
            activeTabs.map(function (tab) {
                if (request.type === 'fill') {
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id}, func: fill,
                        args: [request.data],
                    }, function () {
                        //chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['Ruler.js'] });
                    });
                } else if (request.type === 'get') {

                    chrome.scripting.executeScript({
                        target: {tabId: tab.id}, func: getAllInputs,
                        args: [],
                    }, function (response) {
                        let presets = [];
                        chrome.storage.sync.get('fillPreset', function (data) {
                            presets = data.fillPreset;
                        });
                        presets.push({
                            name: request.data,
                            preset: response[0].result
                        });
                        console.log(presets)

                        chrome.storage.sync.set({fillPreset: presets}, function () {

                        });
                    });
                }
            });
        });
    });
    sendResponse([]);
}

chrome.runtime.onMessage.addListener(listener)

function fill(fillData) {
    fillData.forEach(function (item, index) {
        let els = document.getElementsByName(item.name);
        for (let i = 0; i < els.length; i++) {
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
            ).set;
            nativeInputValueSetter.call(els[i], item.value);
            let inputEvent = new Event("input", {bubbles: true});
            els[i].dispatchEvent(inputEvent);

            els[i].value = item.value;
        }
        console.log('adicionado')
    })
}


function getAllInputs() {
    let inputs, selects, index, list = [];

    inputs = document.getElementsByTagName('input');
    for (index = 0; index < inputs.length; ++index) {
        if (inputs[index].name.length > 0 && inputs[index].value.length > 0) {
            list.push({
                name: inputs[index].name,
                value: inputs[index].value
            })
        }
    }

    selects = document.getElementsByTagName('select');
    for (index = 0; index < selects.length; ++index) {
        if (selects[index].name.length > 0 && selects[index].value.length > 0) {
            list.push({
                name: selects[index].name,
                value: selects[index].value
            })
        }
    }

    console.log('listou')

    return list;

}
