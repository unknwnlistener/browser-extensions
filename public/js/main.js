let isInvalidEmail = true;
let isInvalidPassword = true;
// const currentUrl = //'https://ancient-coast-51172.herokuapp.com';
const currentUrl = 'http://localhost:3000';


$(function() {

    $('#email, #password').keyup(() => {
        enableLoginButton();
    })

    $('#submit').on('click', function(event) {
        if(!isInvalidEmail && !isInvalidPassword) {
            $.ajax({
                url: `${currentUrl}/api/register`,
                type: 'POST',
                data: $('#register-form').serialize(),
                success: function (data) {
                    successfulLogin();
                    // window.location.href = "/dashboard.html";
                },
                error: function(err) {
                    console.error(err);
                    $('#login-error').css('display', 'block');
                }
            });
            event.preventDefault();
        } else {
            console.error("Still invalid values in the form");
        }
    });
});

function enableLoginButton() {
    let email = $('#email');
    let password = $('#password');

    if(validateEmail(email.val()) && password.val() && password.val()!='') {
        $('#submit').removeAttr('disabled');
    } else {
        $('#submit').attr('disabled', 'disabled');
    }
}

function successfulLogin() {
    $(".main").html(`
    <div class="text-section">
            <h1>Registration successful</h1>
            <p>You have been registered to use the tool. Enable the extension and login through it to start recording browser actions</p>
        </div>
    `);
}

function emailValidation() {
    let email = document.getElementById('email').value;
    checkEmail(email);

    activateErrorElement(isInvalidEmail, "email-error");
}

function passwordValidation() {
    let password = document.getElementById('password').value;
    checkPassword(password);

    activateErrorElement(isInvalidPassword, "password-error");

}

function activateErrorElement(flag, id) {
    if(flag) {
        $('#'+id).css('display', 'inline');
    } else {
        $('#'+id).css('display', 'none');
    }
}

function checkEmail(email) {
    if(email && validateEmail(email)) {
        isInvalidEmail = false;
    } else {
        isInvalidEmail = true;
    }
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkPassword(password) {
    if(!password || password == "") {
        isInvalidPassword = true;
    } else {
        isInvalidPassword = false;
    }
}