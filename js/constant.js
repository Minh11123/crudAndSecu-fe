const langHeader = {
    "lang": localStorage.getItem("LANG") ? localStorage.getItem("LANG") : "vi"
}

const headers = {
    "Authorization": "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")),
    "lang": langHeader.lang
}

const baseApi = "http://localhost:8080/api/v1";
const urlAcc = baseApi + "/accounts";
const urlDep = baseApi + "/departments";
// paging
let currentPage = 1;
const size = 10;

// sorting
let sortField = "id";
let isAsc = false;

function showSuccessAlert() {
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });
}