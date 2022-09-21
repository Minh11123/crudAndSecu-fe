function isValidRegisterUsername(username) {
    return !(!username || username.length < 6 || username.length > 50);

}

function isValidRegisterPassword(password, rePassword) {
    if (password !== rePassword) {
        return false;
    }
    return !(!password || password.length < 6 || password.length > 50);
}

function callRegisterApi(username, password, firstName, lastName) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/auth/register',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
        }), // body
        dataType: 'json', // datatype return
        headers: langHeader,
        success: function (data, textStatus, xhr) {
            alert("Đăng ký thành công")
            // redirect to home page
            window.location.replace("http://localhost:63342/final-exam-web/html/loginform.html");
        },
        error(jqXHR, textStatus, errorThrown) {
            const body = JSON.parse(jqXHR.responseText.replace("\\", ""));
            if (body) {
                alert(body.message)
            } else {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        }
    });
}

function register() {
    // Get username & password
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rePassword = document.getElementById("rePassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;

    //validate
    const validUsername = isValidRegisterUsername(username);
    const validPassword = isValidRegisterPassword(password, rePassword);

    if (validUsername && validPassword) {
        callRegisterApi(username, password, firstName, lastName);
    } else {
        alert("Thông tin nhập vào không đúng, vui lòng kiểm tra lại")
    }
}

const langHeader = {
    "lang": localStorage.getItem("LANG") ? localStorage.getItem("LANG") : "vi"
}