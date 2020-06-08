let isInvalidEmail = true;
let isInvalidPassword = true;

$(function() {
    $('#submit').on('click', function(event) {
        if(!isInvalidEmail && !isInvalidPassword) {
            console.log($('#register-form').serialize());
            $.ajax({
                url: "http://localhost:3000/api/register",
                type: 'POST',
                data: $('#register-form').serialize(),
                success: function (data) {
                    console.log("Success", data);
                    // window.location.href = "/dashboard.html";
                },
                error: function(err) {
                    console.error(err);
                }
            });
            event.preventDefault();
        } else {
            console.error("Still invalid values in the form");
        }
    });
});

function checkForm() {
    let email = document.getElementById('email').value;

    let password = document.getElementById('password').value;

    checkEmail(email);
    checkPassword(password);

    activateErrorElement(isInvalidEmail, "email-error");
    activateErrorElement(isInvalidPassword, "password-error");

    if(!isInvalidEmail && !isInvalidPassword) {
        $("#submit").disabled
    }
    
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
    if(!password || password == "" || password.length < 6) {
        isInvalidPassword = true;
    } else {
        isInvalidPassword = false;
    }
}