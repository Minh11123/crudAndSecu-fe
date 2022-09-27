

function Department(id, name, totalMember, type, createdDate) {
    this.id = id;
    this.name = name;
    this.totalMember = totalMember;
    this.type = type;
    this.createdDate = createdDate;
}

let departmentList = [];



// crud service: start
function getDepartmentList() {

    let urlDep = baseApi + "/departments" + '?page='
        + `${currentPage - 1}` + '&size=' + size
        + "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");

    const searchValue = document.getElementById("search-department-input");
    if (searchValue?.value) {
        urlDep += "&search.contains=" + searchValue.value;
    }

    // call API from server
    $.ajax({
        url: urlDep,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        headers: headers,
        success: function(data, textStatus, xhr) {
            // success
            parseDepartmentData(data);
            fillDepartmentToTable();
            fillDepartmentPaging(data.numberOfElements, data.totalPages);
            fillDepartmentSorting();
        },
        error(jqXHR, textStatus, errorThrown) {
            // TODO
            alert("Error when loading data");
        }
    });
}

function createDepartment() {
    // get data
    let name = document.getElementById("name").value;
    let totalMember = document.getElementById("totalMember").value;
    let type = document.getElementById("type").value;
    let createdDate = document.getElementById("createdDate").value;

    // TODO validate
    // then fail validate ==> return;

    const department = {
        name: name,
        totalMember: Number(totalMember),
        type: type,
        createdDate: Date(createdDate.year, createdDate.month)
    };

    $.ajax({
        url: urlDep,
        type: 'POST',
        data: JSON.stringify(department), // body
        contentType: "application/json", // type of body (json, xml, text)
        headers: headers,
        success: function (data, textStatus, xhr) {
            hideModal();
            showSuccessAlert();
            buildDepartmentTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            alert("Có lỗi khi tạo tài khoản");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function updateDepartment() {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const totalMember = document.getElementById("totalMember").value;
    const type = document.getElementById("type").value;
    const createdDate = document.getElementById("createdDate").value;

    // TODO validate
    // then fail validate ==> return;

    const department = {
        id: Number(id),
        name: username,
        totalMember: Number(totalMember),
        type: type,
        isDeleted: 0,
        createdDate: Date(createdDate.year, createdDate.month)
    };

    $.ajax({
        url: urlDep + "/" + id,
        type: 'PUT',
        data: JSON.stringify(department),
        contentType: "application/json", // type of body (json, xml, text)
        headers: headers,
        success: function (result) {
            // error
            if (!result) {
                alert("Có lỗi khi cập nhật phòng ban");
                return;
            }

            // success
            hideModal();
            showSuccessAlert();
            buildDepartmentTable();
        }
    });
}

function deleteDepartment(id) {
    // TODO validate
    $.ajax({
        url: urlDep + "/" + id,
        type: 'DELETE',
        headers: headers,
        success: function (result) {
            // error
            if (!result) {
                alert("Có lỗi khi xóa phòng ban");
                return;
            }

            // success
            showSuccessAlert();
            buildDepartmentTable();
        }
    });
}

// crud service: end

function clickNavDepartmentList() {
    $(".main").load("departmentList.html");
    buildDepartmentTable();
}

function buildDepartmentTable() {
    $('tbody').empty();
    getDepartmentList();
}

function parseDepartmentData(data) {
    const newDepartmentList = [];
    data.content.forEach(function (item) {
        newDepartmentList.push(new Department(item.id, item.name, item.totalMember,
            item.type, item.createdDate));
    });
    departmentList = newDepartmentList;
}

function fillDepartmentToTable() {
    departmentList.forEach(function (item) {
        $('tbody').append(
            '<tr>' +
            '<td>' + item.id + '</td>' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.totalMember + '</td>' +
            '<td>' + item.type+ '</td>' +
            '<td>' + item.createdDate+ '</td>' +
            '<td>' +
            '<a class="edit" title="Edit" data-toggle="tooltip" onclick="openUpdateDepartmentModal('
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

function openCreateDepartmentModal() {
    resetFormDep();
    openModal();
}

function openUpdateDepartmentModal(id) {

    // get index from employee's id
    const index = departmentList.findIndex(x => x.id === id);

    // fill data
    document.getElementById("id").value = departmentList[index].id;
    document.getElementById("name").value = departmentList[index].name;
    document.getElementById("totalMember").value = departmentList[index].totalMember;
    document.getElementById("type").value = departmentList[index].type;
    document.getElementById("createdDate").value = departmentList[index].createdDate;
    openModal();
}

function openConfirmDelete(id) {
    // get index from employee's id
    const index = departmentList.findIndex(x => x.id === id);
    const name = departmentList[index].name;

    const result = confirm("Bạn có muốn xóa phòg ban" + name + " không?");
    if (result) {
        deleteDepartment(id);
    }
}

function resetFormDep() {
    document.getElementById("name").value = "";
    document.getElementById("totalMember").value = "";
    document.getElementById("type").value = "";
    document.getElementById("createdDate").value = "";

}

function openModal() {
    $('#myCreateDepartmentModal').modal('show');
}

function hideModal() {
    $('#myCreateDepartmentModal').modal('hide');
}



function saveDepartment() {
    const id = document.getElementById("id").value;

    if (!id) {
        createDepartment();
    } else {
        updateDepartment();
    }
}

// paging
function fillDepartmentPaging(currentSize, totalPages) {
    // prev
    if (currentPage > 1) {
        document.getElementById("department-previousPage-btn").disabled = false;
    } else {
        document.getElementById("department-previousPage-btn").disabled = true;
    }

    // next
    if (currentPage < totalPages) {
        document.getElementById("department-nextPage-btn").disabled = false;
    } else {
        document.getElementById("department-nextPage-btn").disabled = true;
    }

    // text
    document.getElementById("department-page-info").innerHTML = currentSize
        + " phòng ban của trang " + currentPage + " / " + totalPages;
}

function prevDepartmentPage() {
    changeDepartmentPage(currentPage - 1);
}

function nextDepartmentPage() {
    changeDepartmentPage(currentPage + 1);
}

function changeDepartmentPage(page) {
    currentPage = page;
    buildDepartmentTable();
}

// sorting
function fillDepartmentSorting() {
    const sortTypeClazz = isAsc ? "fa-sort-up" : "fa-sort-down";
    const defaultSortType = "fa-sort";

    switch (sortField) {
        case 'name':
            changeIconSort("name-sort", sortTypeClazz);
            break;
    }
}

function changeIconSort(id, sortTypeClazz) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-up",
        "fa-sort-down");
    document.getElementById(id).classList.add(sortTypeClazz);
}

function changeDepartmentSort(field) {
    if (field === sortField) {
        isAsc = !isAsc;
    } else {
        sortField = field;
        isAsc = true;
    }
    buildDepartmentTable();
}

function changeIdSort(field) {
    if (field === sortField) {
        isAsc = !isAsc;
    } else {
        sortField = field;
        isAsc = true;
    }
    buildDepartmentTable();
}

//search
function setupSearchEvent() {
    buildDepartmentTable();
}

