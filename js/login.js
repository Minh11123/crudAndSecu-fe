$(function () {
    $("#id01").css('display', 'block');
    setupEnterLoginEvent();
    setDefaultRememberme();
});

function setupEnterLoginEvent() {
    $("#username").on("keyup", function (event) {
        // enter key code = 13
        if (event.keyCode === 13) {
            login();
        }
    });

    $("#password").on("keyup", function (event) {
        // enter key code = 13
        if (event.keyCode === 13) {
            login();
        }
    });
}

function setDefaultRememberme() {
    document.getElementById("rememberMe").checked = storage.getRememberMe();
}

function login() {
    // Get username & password
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // validate
    const validUsername = isValidUsername(username);
    const validPassword = isValidPassword(password);

    // format
    if (!validUsername || !validPassword) {
        return;
    }

    // validate username 6 -> 30 characters
    if (username.length < 6 || username.length > 50 || password.length < 6 || password.length > 50) {
        // show error message
        showLoginFailMessage();
        return;
    }

    callLoginAPI(username, password);
}

function callLoginAPI(username, password) {

    $.ajax({
        url: 'http://localhost:8080/api/v1/auth/login',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            username: username,
            password: password
        }), // body
        dataType: 'json', // datatype return
        headers: langHeader,
        success: function (data, textStatus, xhr) {
            // save remember me
            const isRememberMe = document.getElementById("rememberMe").checked;
            storage.saveRememberMe(isRememberMe);

            // save data to storage
            // https://www.w3schools.com/html/html5_webstorage.asp
            storage.setItem("ID", data.id);
            storage.setItem("FIRST_NAME", data.firstName);
            storage.setItem("LAST_NAME", data.lastName);
            storage.setItem("ROLE", data.role);
            storage.setItem("USERNAME", username);
            storage.setItem("PASSWORD", password);

            // redirect to home page
            window.location.replace("http://localhost:63342/final-exam-web/html/program.html");
        },
        error(jqXHR, textStatus, errorThrown) {
            if (jqXHR?.status === 401) {
                showLoginFailMessage();
            } else {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        }
    });
}

const error_message_username = "Hãy điền tên đăng nhập!";
const error_message_password = "Hãy điền mật khẩu!";

function isValidUsername(username) {

    if (!username) {
        // show error message
        showFieldErrorMessage("incorrect-mess", "username", error_message_username);
        return false;
    }

    hideFieldErrorMessage("incorrect-mess", "username");
    return true;
}

function isValidPassword(password) {

    if (!password) {
        // show error message
        showFieldErrorMessage("incorrect-mess", "password", error_message_password);
        return false;
    }

    hideFieldErrorMessage("incorrect-mess", "password");
    return true;
}

function showLoginFailMessage() {
    showFieldErrorMessage("incorrect-mess", "username", "Đăng nhập thất bại!");
    showFieldErrorMessage("incorrect-mess", "password", "Đăng nhập thất bại!");
}

function showFieldErrorMessage(messageId, inputId, message) {
    document.getElementById(messageId).innerHTML = message;
    document.getElementById(messageId).style.display = "block";
    document.getElementById(inputId).style.border = "1px solid red";
}

function hideFieldErrorMessage(messageId, inputId) {
    document.getElementById(messageId).style.display = "none";
    document.getElementById(inputId).style.border = "1px solid #ccc";
}

function showSuccessSnackBar(snackbarMessage) {
    // Get the snackbar DIV
    const x = document.getElementById("snackbar");
    x.innerHTML = snackbarMessage;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

const langHeader = {
    "lang": localStorage.getItem("LANG") ? localStorage.getItem("LANG") : "vi"
}