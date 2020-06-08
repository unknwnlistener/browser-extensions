// Passing data through REST APIs to Node server
const currentUrl = 'http://localhost:3000/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWRhMTc2ZmMwMjA3YzQxMDBlM2JiYTkiLCJpYXQiOjE1OTEzNTExNTF9.-HonhXPYV2S0DUyNNStY9qeGqWCW5M_IkNlrlmrx3bs';
$(document).ready(function() {
    var allData;
    $('#register').click(function() {
        console.log("Register button clicked");
        redirectRegister();
    });

    $('#getValue').click(function() {
        $.ajax({
            url: currentUrl+'api/users/actions',
            type: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            success: function(result) {
                console.log("GET call invoked", result);
                allData = result[0];
                
                // let newUrlList = allData.session;
                // let sessionDate = allData.created_date;
                // console.log('new url list : ', newUrlList);
                // modifyList(newUrlList, sessionDate);
            },  
            error: function(error) {
                console.log("ERROR : ", error);
            }
        });

    });

});

function redirectRegister() {
    // var newURL = currentUrl;
    chrome.tabs.create({ url: currentUrl });
}

function modifyList(urlList, date) {
    console.log("Inside modifyList function");
    let displayDiv = document.getElementById('url-list-display');
    
    //reset HTML
    displayDiv.innerHTML = '';

    urlList.forEach(element => {
        displayDiv.innerHTML += `<div>
            <div class='col1'>${date}</div>
            <div class='col2'>${element.url}</div>
        </div>`;
    });
}
                // chrome.storage.sync.get('urlList', function(data) {
        //     console.log(data);
        // let newUrlList = fetchUrl(currentUrl+'url');
        // console.log('new url list : ', newUrlList);
        // let displayDiv = document.getElementById('url-list-display');
        
        // //reset HTML
        // displayDiv.innerHTML = '';

        // newUrlList.forEach(element => {
        //     displayDiv.innerHTML += `<div>
        //         <div class='col1'>${element.date}</div>
        //         <div class='col2'>${element.url}</div>
        //     </div>`;
        // });
        // });
