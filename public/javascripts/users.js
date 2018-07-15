var searchBox = $('#searchBox');
var formDiv = $('#form');
var modalBtn = $('#btn-save');
var listDiv = $('#list');
var objects = [];

reloadTable(null);

searchBox.on('keyup', function () {
    if (!searchBox.val()) {
        return false;
    } else {
        reloadTable(searchBox.val(), true);
    }
});

modalBtn.on('click', function (e) {
    //e.preventDefault();
    $.ajax({
        url: formDiv.attr('action') || window.location.pathname,
        type: "POST",
        data: formDiv.serialize(),
        success: function (data) {
            reloadTable(null);
            $("#addModal").modal("hide");
        },
        error: function (jXHR, textStatus, errorThrown) {
            console.log(jXHR);
            console.log(textStatus);
            //alert(errorThrown);
        }
    });
});

function reloadTable(query, from) {
    $.ajax({
        type: "GET",
        url: '/api/v1/settings/users',
        data: {'query': query === null ? "" : query},
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.length > 0) {
                objects = response;
                listDiv.find("tbody").empty();
                var html = '';
                $.each(response, function (index, member) {

                    html += '<tr>';
                    html += '<td class="text-center"><input class="form-control" type="checkbox" id="' + response[index].id + '"></td>';
                    html += '<td>' + response[index].lastname + '</td>';
                    html += '<td>' + response[index].firstname + '</td>';
                    html += '<td>' + response[index].username + '</td>';
                    html += '<td>' + response[index].roles[0].role + '</td>';
                    html += '<td class="row-actions">';
                    html += '<a onclick="fillEditForm(' + response[index].id + ')"><i class="os-icon os-icon-pencil-2"></i></a>';
                    html += '<a href="#"><i class="os-icon os-icon-link-3"></i></a>';
                    html += '<a class="danger" href="#"><i class="os-icon os-icon-database-remove"></i></a>';
                    html += '</tr>';

                });

                if ($('tbody', listDiv).length > 0) {
                    listDiv.append(html);
                }

            } else {

            }
        }
    });
}

function getObjectById(cId, hotels) {
    if (cId <= 0) return false;

    if (hotels.length <= 0) return false;

    for (var i = 0, len = hotels.length; i < len; i++) {
        if (hotels[i].id === cId) {
            return hotels[i];
        }
    }

    return null;
}

function fillEditForm(id) {
    var user = getObjectById(id, objects);

    if (user !== null || typeof user !== "undefined") {
        $("input[name='lastname']").val(user.lastname);
        $("input[name='firstname']").val(user.firstname);
        $("input[name='username']").val(user.username);
        $("select[name='role']").val(user.roles[0].role);
        $(".passwordrow").hide();
        $("#addModal").modal("show");
    }
}