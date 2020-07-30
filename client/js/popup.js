// Passing data through REST APIs to Node server
const currentUrl = 'http://localhost:3000';
// const currentUrl = 'https://ancient-coast-51172.herokuapp.com'; 
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWRhMTc2ZmMwMjA3YzQxMDBlM2JiYTkiLCJpYXQiOjE1OTEzNTExNTF9.-HonhXPYV2S0DUyNNStY9qeGqWCW5M_IkNlrlmrx3bs';

let config = {};
const cookieExpireDays = 1; //Number value representing number of days cookie will be active.

$(document).ready(() => {
    // Already logged in
    if(Cookies.get('token')) {
        readConfig();
        $('.main').replaceWith(loggedInMessageHtml());
    }

    // Adding listeners
    $('#register').click(() => {
        popupRegister();
    });

    $('#logout').click(() => {
        console.log("Logging user out...");
        Cookies.remove('token');
        Cookies.remove('config');
        chrome.runtime.sendMessage({source: "popup", token: Cookies.get('token')});
        location.reload(false);
    });

    // Disabled login button till input found
    $('#email, #password').keyup(() => {
        enableLoginButton();
    })

    // REST call to login
    $('#login').click((e) => {
        console.log("Logging the user in...");

        $.ajax({
            url: `${currentUrl}/api/login`,
            type: "POST",
            data: $('#login-form').serialize(),
            success: (data) => {
                if(data.status) {
                    Cookies.set("token", data.data.token, {expires: cookieExpireDays});
                }
                chrome.runtime.sendMessage({source: "popup", token: Cookies.get('token')});
                $('.main').replaceWith(loggedInMessageHtml());
                readConfig();
            },
            error: () => {
                console.log("Invalid credentials entered", "color: red;");
                $('.error-msg').css('display', 'block');
            }
        });

        e.preventDefault();
    });

});

function addLoginListener() {
    
}

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
    $.ajax({
        url: `${currentUrl}/api/config`,
        type: "GET",
        headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        success: (data) => {
            if(data.status) {
                config.actions = JSON.parse(JSON.stringify(data.data));
            }
            console.log("Config file received = ", data);
            // TEST MODE for Development
            // $(".test-mode").css("display", "block");
            // $(".settings").html(generateToggleRows());
            Cookies.set('config', config, {expires: cookieExpireDays});
            chrome.storage.sync.set({'config': config}, function() {
                console.log("[POPUP] Chrome storage value is set to ", config);
            });
            setConfigToggle();
        },
        error: (e) => {
            $(".test-mode").css("display", "none");
            if(e.status != 403)
                console.error("Could not read config", e);
            else
                console.log("Forbidden", e);
        }
    });
}

function generateToggleRows() {
    let rowCount = 1;
    let html = '';
    
    for (const value in config.actions) {
        if (config.actions.hasOwnProperty(value)) {
            const flag = config.actions[value]["active"];
            html += `
            <div class="items item-${rowCount++}">
                <p class="item-text">${value}</p>
                <input id="${value}" type="checkbox" class="toggle" ${flag=="true"?"checked": ""}>
            </div>`;
        }
    }
    // Submit button to send the test call
    html += `<input type="button" id="test-submit" class="btn" type="submit" value="Save changes" disabled>`;
    return html;
}

// Updates the config={} object. [TODO] Send that config to server and the server will handle that config to send data
function setConfigToggle() {
    console.log("Setting test button values : ", JSON.stringify(config));
    $('input:checkbox').change(function(){
        if(($(this)).is(':checked')) {
            console.log("Checked config : ",$(this).attr('id'), true);
            config.actions[$(this).attr('id')]["active"] = true;
        } else {
            console.log("Unchecked config : ",$(this).attr('id'), false);
            config.actions[$(this).attr('id')]["active"] = false;
        }
        $('#test-submit').removeAttr('disabled');
    });
    // Update config
    $('#test-submit').click(function() {
        console.log("Sending new config settings");
        $.ajax({
            url: `${currentUrl}/api/config`,
            type: "PUT",
            data: config,
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`,
            },
            success: (data) => {
                if(data.status) {
                    config.actions = JSON.parse(JSON.stringify(data.data));
                }
                Cookies.set('config', config, {expires: cookieExpireDays});
                chrome.storage.sync.set({'config': config}, function() {
                    console.log("[POPUP] Chrome storage value is set to ", config);
                });
                chrome.runtime.sendMessage({source: "popup", token: Cookies.get('token')});
                location.reload(false);
            },
            error: (e) => {
                console.error("Could not update config", e);
            }
        });
    });
}