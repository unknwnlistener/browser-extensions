window.onload = function () {
    document.getElementById('save').onclick = function () {
        let value = document.getElementById('saveLine').value;
        //alert(value);

        chrome.storage.sync.set({'myLine': value}, function() {
            alert("Success");
        });
    }

    this.document.getElementById('display').onclick = function() {
        let line = chrome.storage.sync.get('myLine', function(data) {
            alert(data.myLine);
        });
        // console.log(line);
        
    }
}