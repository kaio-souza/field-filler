let fillData = [];
let presetData = [];

chrome.storage.sync.get('aac', function (data) {
    fillData = data.aac;
});

chrome.storage.sync.get('fillPreset', function (data) {
    presetData = data.fillPreset;
});

document.addEventListener('DOMContentLoaded', function () {
    listData()
}, false);

document.addEventListener('click', function (event) {
    event.preventDefault();

    let message = {
            type: 'fill',
            data: fillData
        },
        fillName = document.querySelector('#fillName'),
        fillValue = document.querySelector('#fillValue'),
        fillPresetName = document.querySelector('#pressetName');

    if (event.target.matches('.add')) {


        if (fillName.value.length === 0 || fillValue.value.length === 0) {
            return;
        }


        fillData.push({
            name: fillName.value,
            value: fillValue.value
        });


        chrome.storage.sync.set({aac: fillData}, function () {
            listData();
            fillName.value = '';
            fillValue.value = '';
        });
    } else if (event.target.matches('.remove')) {

        fillData.splice(event.target.dataset.key, 1);
        chrome.storage.sync.set({aac: fillData}, function () {
            listData();
        });
    } else if (event.target.matches('.remove-preset')) {

        presetData.splice(event.target.dataset.key, 1);
        chrome.storage.sync.set({fillPreset: presetData}, function () {

        });
        listData();
    } else if (event.target.matches('.use-preset')) {

        fillData = presetData[event.target.dataset.key].preset;
        chrome.storage.sync.set({aac: fillData}, function () {
        });
        listData();

    } else if (event.target.matches('.fill')) {
        message.type = 'fill';
        message.data = fillData;

        chrome.runtime.sendMessage(message, function (data) {
            console.log(data);
        })

    } else if (event.target.matches('.get')) {
        message.type = 'get';
        message.data = fillPresetName.value;

        if (fillPresetName.value.length === 0) {
            return;
        }

        chrome.runtime.sendMessage(message, function (data) {
            console.log(data)
        })

        chrome.storage.sync.get('fillPreset', function (data) {
            presetData = data.fillPreset;
        });
listData()

        fillPresetName.value = '';
        console.log(presetData)


    }

    return;

}, false);

function listData() {
    let $container = document.querySelector('#keys'),
        text = '<table> <tr><th> Name</th> <th> Value</th> <th></th></tr>';

    fillData.forEach(function (item, key) {
        text += '<tr><td>' + item.name + '</td><td>' + item.value + '</td> <td width="2"> <button class="remove" data-key="' + key + '">X</button></td> </tr>';
    });

    text += '</table>';

    $container.innerHTML = fillData.length === 0 ? '( Empty )' : text;

    let $containerPreset = document.querySelector('#pressets'),
        textPreset = '<table> ';

    presetData.forEach(function (item, key) {
        textPreset += '<tr><td>' + item.name + '</td><td class="col-bt-preset">  <button class="use-preset" data-key="' + key + '">USE </button> <button class="remove-preset" data-key="' + key + '">X</button></td> </tr>';
    });

    textPreset += '</table>';

    $containerPreset.innerHTML = presetData.length === 0 ? '( Empty )' : textPreset;
}


