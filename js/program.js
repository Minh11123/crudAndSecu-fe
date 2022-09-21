$(function () {

    if (!isLogin()) {
        // redirect to login page
        window.location.replace("http://localhost:63342/final-exam-web/html/loginform.html");
        return;
    }

    $(".header").load("header.html");

    $(".main").load("home.html");

    $(".footer").load("footer.html");

    // trick
    setTimeout(hasAuthorized, 50);
});

function isLogin() {
    return !!localStorage.getItem("ID");
}

function logout() {
    localStorage.removeItem("ID");
    localStorage.removeItem("FULL_NAME");
    localStorage.removeItem("FIRST_NAME");
    localStorage.removeItem("LAST_NAME");
    localStorage.removeItem("ROLE");
    localStorage.removeItem("USERNAME");
    localStorage.removeItem("PASSWORD");

    // redirect to login page
    window.location.replace("http://localhost:63342/final-exam-web/html/loginform.html");

}

function showSuccessSnackBar(snackbarMessage) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerHTML = snackbarMessage;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function hasAuthorized() {
    let accountListElem = document.getElementById("accountListId");
    let departmentListElem = document.getElementById("departmentListId");

    if (accountListElem && departmentListElem) {
        switch (localStorage.getItem("ROLE")) {
            case "ADMIN":
                accountListElem.style.display = "block";
                departmentListElem.style.display = "block";
                break;
            case "MANAGER":
                accountListElem.style.display = "none";
                departmentListElem.style.display = "none";
                break;
            case "EMPLOYEE":
                accountListElem.style.display = "none";
                departmentListElem.style.display = "none";
                break;
        }
    }
}

function handleSelectLang() {
    const lang = document.getElementById("langSwitchId").value;
    localStorage.setItem("LANG", lang);

    const homeLabel = document.getElementById("homeLabelId");
    const headerHomeLabelId = document.getElementById("headerHomeLabelId");
    const accountListId = document.getElementById("accountListId");
    const departmentListId = document.getElementById("departmentListId");

    switch (lang) {
        case "en":
            homeLabel.innerHTML = en.home;
            headerHomeLabelId.innerHTML = en.home;
            accountListId.innerHTML = en.accountList;
            departmentListId.innerHTML = en.departmentList;
            break;
        default:
            homeLabel.innerHTML = vi.home;
            headerHomeLabelId.innerHTML = vi.home;
            accountListId.innerHTML = vi.accountList;
            departmentListId.innerHTML = vi.departmentList;
            break;
    }
}