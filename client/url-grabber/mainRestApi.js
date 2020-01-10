// Passing data through REST APIs to Node server
const currentUrl = 'http://localhost:3000/';
$(document).ready(function() {
    var allData;
    $('#getValue').click(function() {
        $.ajax({
            url: currentUrl+'url',
            type: "GET",
            success: function(result) {
                console.log("GET call invoked", result);
                allData = result[0];
                
                let newUrlList = allData.session;
                let sessionDate = allData.created_date;
                console.log('new url list : ', newUrlList);
                modifyList(newUrlList, sessionDate);
            },  
            error: function(error) {
                console.log("ERROR : ", error);
            }
        });

    });

});

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
