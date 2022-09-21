const headers = {
    "Authorization": "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")),
    "lang": langHeader.lang
}

const langHeader = {
    "lang": localStorage.getItem("LANG") ? localStorage.getItem("LANG") : "vi"
}