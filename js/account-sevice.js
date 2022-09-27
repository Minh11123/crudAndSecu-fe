

function Account(id, username, lastName, firstName, role, deptId,
    deptName) {
    this.id = id;
    this.username = username;
    this.lastName = lastName;
    this.firstName = firstName;
    this.role = role;
    this.departmentId = deptId;
    this.departmentName = deptName;
}


let accountList = [];


// crud service: start
function getAccountList() {
    let urlAcc = baseApi + "/accounts" + '?page='
        + `${currentPage - 1}` + '&size=' + size
        + "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");
    const searchValue = document.getElementById("search-account-input");
    if (searchValue?.value) {
        urlAcc += "&search.contains=" + searchValue.value;
    }
    

    // call API from server
    $.ajax({
        url: urlAcc,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        headers: headers,
        success: function(data, textStatus, xhr) {
            // success
            parseAccountData(data);
            fillAccountToTable();
            fillAccountPaging(data.numberOfElements, data.totalPages);
            fillAccountSorting();
        },
        error(jqXHR, textStatus, errorThrown) {
            // TODO
            alert("Error when loading data");
        }
    });
}

function createAccount() {
    // get data
    let username = document.getElementById("username").value;
    let lastName = document.getElementById("lastName").value;
    let firstName = document.getElementById("firstName").value;
    let role = document.getElementById("role").value;
    let departmentId = document.getElementById("departmentId").value;

    // TODO validate
    // then fail validate ==> return;

    const account = {
        username: username,
        lastName: lastName,
        firstName: firstName,
        role: role,
        departmentId: Number(departmentId),
    };

    $.ajax({
        url:urlAcc,
        type: 'POST',
        data: JSON.stringify(account), // body
        contentType: "application/json", // type of body (json, xml, text)
        headers: headers,
        success: function (data, textStatus, xhr) {
            hideModal();
            showSuccessAlert();
            buildAccountTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            alert("Có lỗi khi tạo tài khoản");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function updateAccount() {
    const id = document.getElementById("id").value;
    const username = document.getElementById("username").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const role = document.getElementById("role").value;
    const departmentId = document.getElementById("departmentId").value;

    // TODO validate
    // then fail validate ==> return;

    const account = {
        id: Number(id),
        username: username,
        firstName: firstName,
        lastName: lastName,
        role: role,
        departmentId: Number(departmentId),
        isDeleted: 0
    };

    $.ajax({
        url: urlAcc+ "/" + id,
        type: 'PUT',
        data: JSON.stringify(account),
        contentType: "application/json", // type of body (json, xml, text)
        headers: headers,
        success: function (result) {
            // error
            if (!result) {
                alert("Có lỗi khi cập nhật tài khoản");
                return;
            }

            // success
            hideModal();
            showSuccessAlert();
            buildAccountTable();
        }
    });
}

function deleteAccount(id) {
    // TODO validate
    $.ajax({
        url: urlAcc+ "/" + id,
        type: 'DELETE',
        headers: headers,
        success: function (result) {
            // error
            if (!result) {
                alert("Có lỗi khi xóa tài khoản");
                return;
            }

            // success
            showSuccessAlert();
            buildAccountTable();
        }
    });
}

// crud service: end

function clickNavAccountList() {
    $(".main").load("accountList.html");
    buildAccountTable();
}

function buildAccountTable() {
    $('tbody').empty();
    getAccountList();
}

function parseAccountData(data) {
    const newAccountList = [];
    data.content.forEach(function (item) {
        newAccountList.push(new Account(item.id, item.username, item.lastName,
            item.firstName, item.role, item.deptId, item.deptName));
    });
    accountList = newAccountList;
}

function fillAccountToTable() {
    accountList.forEach(function (item) {
        $('tbody').append(
            '<tr>' +
            '<td>' + item.id + '</td>' +
            '<td>' + item.username + '</td>' +
            '<td>' + item.firstName + '</td>' +
            '<td>' + item.lastName + '</td>' +
            '<td>' + item.role + '</td>' +
            '<td>' + item.departmentName + '</td>' +
            '<td>' +
            '<a class="edit" title="Edit" data-toggle="tooltip" onclick="openUpdateAccountModal('
            + item.id + ')">'
            + '<i class="material-icons">&#xE254;</i>'
            + '</a>' +
            '<a class="delete" title="Delete" data-toggle="tooltip" onclick="openConfirmDelete('
            + item.id + ')">'
            + '<i class="material-icons">&#xE872;</i>'
            + '</a>' +
            '</td>' +
            '</tr>')
    });
}

function openCreateAccountModal() {
    resetFormAcc();
    openModal();
}

function openUpdateAccountModal(id) {

    // get index from employee's id
    const index = accountList.findIndex(x => x.id === id);

    // fill data
    document.getElementById("id").value = accountList[index].id;
    document.getElementById("username").value = accountList[index].username;
    document.getElementById("firstName").value = accountList[index].firstName;
    document.getElementById("lastName").value = accountList[index].lastName;
    document.getElementById("role").value = accountList[index].role;
    document.getElementById(
        "departmentId").value = accountList[index].departmentId;

    openModal();
}

function openConfirmDelete(id) {
    // get index from employee's id
    const index = accountList.findIndex(x => x.id === id);
    const name = accountList[index].name;

    const result = confirm("Bạn có muốn xóa " + name + " không?");
    if (result) {
        deleteAccount(id);
    }
}

function resetFormAcc() {
    document.getElementById("username").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("role").value = "";
    document.getElementById("departmentId").value = "";
}

function openModal() {
    $('#myCreateAccountModal').modal('show');
}

function hideModal() {
    $('#myCreateAccountModal').modal('hide');
}



function saveAccount() {
    const id = document.getElementById("id").value;

    if (!id) {
        createAccount();
    } else {
        updateAccount();
    }
}

// paging
function fillAccountPaging(currentsize, totalPages) {
    // prev
    if (currentPage > 1) {
        document.getElementById("account-previousPage-btn").disabled = false;
    } else {
        document.getElementById("account-previousPage-btn").disabled = true;
    }

    // next
    if (currentPage < totalPages) {
        document.getElementById("account-nextPage-btn").disabled = false;
    } else {
        document.getElementById("account-nextPage-btn").disabled = true;
    }

    // text
    document.getElementById("account-page-info").innerHTML = currentsize
        + " tài khoản của trang " + currentPage + " / " + totalPages;
}

function prevAccountPage() {
    changeAccountPage(currentPage - 1);
}

function nextAccountPage() {
    changeAccountPage(currentPage + 1);
}

function changeAccountPage(page) {
    currentPage = page;
    buildAccountTable();
}

// sorting
function fillAccountSorting() {
    const sortTypeClazz = isAsc ? "fa-sort-up" : "fa-sort-down";
    const defaultSortType = "fa-sort";

    switch (sortField) {
        case 'username':
            changeIconSort("username-sort", sortTypeClazz);
            changeIconSort("fullname-sort", defaultSortType);
            changeIconSort("departmentName-sort", defaultSortType);
            break;
    }
}

function changeIconSort(id, sortTypeClazz) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-up",
        "fa-sort-down");
    document.getElementById(id).classList.add(sortTypeClazz);
}

function changeAccountSort(field) {
    if (field === sortField) {
        isAsc = !isAsc;
    } else {
        sortField = field;
        isAsc = true;
    }
    buildAccountTable();
}

function changeIdSort(field) {
    if (field === sortField) {
        isAsc = !isAsc;
    } else {
        sortField = field;
        isAsc = true;
    }
    buildAccountTable();
}

//search
function setupSearchEvent() {
    buildAccountTable();
}

