// Static saving of current open URLs in browser on button click

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

    this.document.getElementById('saveAll').onclick = function() {
        chrome.tabs.query({currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            // let activeTab = tabs[0];
            // console.log(tabs);
            // if(activeTab.status == "complete") {
            //     alert(activeTab.url);
            //     chrome.storage.sync.set({'activeUrl': activeTab.url, "id": activeTab.id});
            // };
            let utcDate = new Date(Date.now());

            let urlList = [];
            // chrome.storage.sync.get('urlList', function(data) {
            //     urlList = data;
            // });
            // if(urlList == "undefined") {
            //     urlList = [];
            // }

            //Reset urlList
            chrome.storage.sync.set({'urlList': null});

            tabs.forEach(tab => {
                if(tab.status == "complete") {
                    urlList.push({"date": utcDate.toString(), "url": tab.url, "id": tab.id, "active":tab.active});
                }
            });
            console.log("Set url list", urlList);
            chrome.storage.sync.set({'urlList': urlList});
        });
    };
    
    this.document.getElementById('getValue').onclick = function() {
        chrome.storage.sync.get('urlList', function(data) {
            console.log(data);
            let newUrlList = data.urlList;
            console.log('new url list : ', newUrlList);
            let displayDiv = document.getElementById('url-list-display');
            
            //reset HTML
            displayDiv.innerHTML = '';

            newUrlList.forEach(element => {
                displayDiv.innerHTML += `<div>
                    <div class='col1'>${element.date}</div>
                    <div class='col2'>${element.url}</div>
                </div>`;
            });
        });
        
    };
}