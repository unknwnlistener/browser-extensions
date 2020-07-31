// Passing data through REST APIs to Node server
// const currentUrl = 'http://localhost:3000';
// const currentUrl = 'https://ancient-coast-51172.herokuapp.com'; 
const currentUrl = getCurrentUrl();

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
            error: (err) => {
                console.log("Invalid credentials entered", "color: red;", err);
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
                console.warn("Forbidden", e);
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

function setConfigToggle() {
    $('input:checkbox').change(function(){
        if(($(this)).is(':checked')) {
            config.actions[$(this).attr('id')]["active"] = true;
        } else {
            config.actions[$(this).attr('id')]["active"] = false;
        }
        $('#test-submit').removeAttr('disabled');
    });
    // Update config
    $('#test-submit').click(function() {
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