let fillData = [];

chrome.storage.sync.get('aac', function (data) {
    fillData = data.aac;
});

document.addEventListener('DOMContentLoaded', function () {
    listData()
}, false);

document.addEventListener('click', function (event) {

    event.preventDefault();
    if (event.target.matches('.add')) {
        let fillName = document.querySelector('#fillName'),
            fillValue = document.querySelector('#fillValue');

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
    } else if (event.target.matches('.fill')) {
        chrome.runtime.sendMessage(fillData, function (data) {
            console.log(data);
        })


    }

    return;

}, false);

function listData() {
    let $container = document.querySelector('#keys'),
        text = '<table> <tr><th> Name</th> <th> Value</th> <th></th></tr>';

    fillData.forEach(function (item, key) {
        text += '<tr><td>' + item.name + '</td><td>' + item.value + '</td> <td width="2"> <button class="remove" data-key="' + key + '">Remover</button></td> </tr>';
    });

    text += '</table>';

    $container.innerHTML = fillData.length === 0 ? '( Empty )' : text;
}


