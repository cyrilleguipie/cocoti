var searchBox = $('#searchBox');
var modal = $('#addModal');
var modalBtn = $('#btn-save');
var addBtn = $('#add-object');
var editBtn = $('.edit-object');
var viewBtn = $('.view-object');
var baseUrl = $('#base-url').val();
var baseApiUrl = $('#base-api-url').val();
var listDiv = $('#list');
var objects = [];

searchBox.on('keyup', function () {
    if (!searchBox.val()){
        return false;
    } else {
        alert("Search Event");
/*        $.ajax({
            type: "GET",
            url: baseUrl + "/search",
            data:{
                name: searchBox.val(),
                city: searchBox.val()
            },
            success: function (response) {
                console.log(response);
                if (response.length > 0) {
                    objects = response;
                    listDiv.find("tbody").empty();
                    if ($('tbody', listDiv).length > 0) {
                        listDiv.append(response);
                    }
                } else {
                    console.log("Sometimes got wrong");
                }
            },
            error: function (jXHR, textStatus, errorThrown) {
                console.log(jXHR);
                console.log(textStatus);
                //alert(errorThrown);
            }
        });*/
    }
});

addBtn.click(function () {
    var id = 0;
    $.ajax({
        type: "GET",
        url: baseUrl + "/edit/" + id,
        success: function (response) {
            console.log(response);
            if (response.length > 0) {
                modal.find(".modal-body").empty();
                modal.find(".modal-body").append(response);
                modal.modal("show");
            } else {
                console.log("Sometimes got wrong");
            }
        }
    });
});

editBtn.click(function () {
    var id = parseInt($(this).attr("id"));
    $.ajax({
        type: "GET",
        url: baseUrl + "/edit/" + id,
        success: function (response) {
            console.log(response);
            if (response.length > 0) {
                modal.find(".modal-body").empty();
                modal.find(".modal-body").append(response);
                modal.modal("show");
            } else {
                console.log("Sometimes got wrong");
            }
        }
    });
});

viewBtn.click(function () {
    var id = parseInt($(this).attr("id"));
    $.ajax({
        type: "GET",
        url: baseUrl + "/view/" + id,
        success: function (response) {
            console.log(response);
            if (response.length > 0) {
                modal.find(".modal-body").empty();
                modal.find(".modal-body").append(response);
                modal.modal("show");
            } else {
                console.log("Sometimes got wrong");
            }
        }
    });
});

modalBtn.on('click', function (e) {
    var formDiv = modal.find("#form");
    $.ajax({
        url: formDiv.attr('action'),
        type: "POST",
        data: formDiv.serialize(),
        success: function (data) {
            location.reload();
        },
        error: function (jXHR, textStatus, errorThrown) {
            console.log(jXHR);
            console.log(textStatus);
            //alert(errorThrown);
        }
    });
});