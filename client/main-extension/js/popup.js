// Passing data through REST APIs to Node server
const currentUrl = 'http://localhost:3000';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWRhMTc2ZmMwMjA3YzQxMDBlM2JiYTkiLCJpYXQiOjE1OTEzNTExNTF9.-HonhXPYV2S0DUyNNStY9qeGqWCW5M_IkNlrlmrx3bs';
$(document).ready(() => {
    if(Cookies.get('token')) {
        $('.main').replaceWith(loggedInMessageHtml());
    }

    readConfig();

    setConfigListeners();

    $('#register').click(() => {
        console.log("Register button clicked");
        popupRegister();
    });

    $('#logout').click(() => {
        console.log("Logging user out");
        Cookies.remove('token');
        chrome.runtime.sendMessage({source: "popup", token: Cookies.get('token')});
        location.reload(false);
    });

    // Disabled login button till input found
    $('#email, #password').keyup(() => {
        enableLoginButton();
    })

    // REST call to login
    $('#login').click((e) => {
        console.log("Logging the user in");

        $.ajax({
            url: `${currentUrl}/api/login`,
            type: "POST",
            data: $('#login-form').serialize(),
            success: (data) => {
                if(data.status) {
                    Cookies.set("token", data.data.token);
                }
                console.log("Packet receieved = ", data);
                console.log("Cookie set : ", Cookies.get("token"));
                chrome.runtime.sendMessage({source: "popup", token: Cookies.get('token')});
                location.reload(false);
            },
            error: () => {
                console.error("Could not log in");
                $('.error-msg').css('display', 'block');
            }
        });

        e.preventDefault();

        // Save the returned token to cookie. User session is now logged in.
    });

});

function loggedInMessageHtml() {
    let messageHtml = `
    <div class="main">
    <section class="form-title">Session Active</section>
    <h3>User is currently logged in.</h3>
    <br>
    <span class="register" id="logout">Log Out?</span>
    </div>
    `;
    return messageHtml;
}

function enableLoginButton() {
    let email = $('#email');
    let password = $('#password');

    if(validateEmail(email.val()) && password.val() && password.val()!='') {
        $('#login').removeAttr('disabled');
    } else {
        $('#login').attr('disabled', 'disabled');
    }
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function popupRegister() {
    // var newURL = currentUrl;
    chrome.tabs.create({ url: currentUrl });
}

function readConfig() {
    console.log(config);

    $(".settings").html(generateToggleRows());
}

function generateToggleRows() {
    let rowCount = 1;
    let html = '';
    
    for (const value in config.actions) {
        if (config.actions.hasOwnProperty(value)) {
            const element = config.actions[value];
            console.log("Element:  %s, Value: %s", element, value);
            html += `
            <div class="items item-${rowCount++}">
                <p class="item-text">${value}</p>
                <input id="${value}" type="checkbox" class="toggle" ${element?"checked": ""}>
            </div>`;
        }
    }

    return html;
}

// Updates the config={} object. [TODO] Send that config to server and the server will handle that config to send data
function setConfigListeners() {
    $('input:checkbox').change(function(){
        if(($(this)).is(':checked')) {
            console.log("Checked config : ",$(this).attr('id'), true);
            config.actions[$(this).attr('id')] = true;
        } else {
            console.log("Unchecked config : ",$(this).attr('id'), false);
            config.actions[$(this).attr('id')] = false;
        }
    });
}