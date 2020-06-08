// Dynamic saving of new URLs in browser and retrieve on button click

// this.document.getElementById('save').onclick = function() {
// chrome.tabs.onUpdated.addListener( function( tabId,  changeInfo,  tab) {
//     chrome.extension.getBackgroundPage().console.log(tabId, tab);
//     // console.log(tabId, tab.url);
//     // if(tab.url=="https://www.google.co.in/"){
//         //      chrome.tabs.update(tab.id, {url: 'https://www.yahoo.com/'});
//     // }
//     // chrome.tabs.getCurrent(function (tab) {
//     //     console.log(tab);
//     // });
//     // chrome.storage.sync.set({'url': tab.url, "id": tab.tabId});
//     alert(tab.url);
// });

window.onload = function () {


    function onLoadFunction() {
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            let utcDate = new Date(Date.now());
            let urlList = [];


            //Retrieve current open tabs in window
            tabs.forEach(tab => {
                if(tab.status == "complete") {
                    urlList.unshift({"date": utcDate.toString(), "url": tab.url, "id": tab.id, "active":tab.active});
                }
            });

            //Display in HTML
            let displayDiv = document.getElementById('url-list-display');
            
            //reset HTML
            displayDiv.innerHTML = '';

            urlList.forEach(element => {
                displayDiv.innerHTML += `<div>
                    <div class='col1'>${element.date}</div>
                    <div class='col2'>${element.url}</div>
                </div>`;
            });
        });
        
    }
    
    onLoadFunction();
}