var searchBox = $('#searchBox');
var formDiv = $('#form');
var modal = $('#addModal');
var modalBtn = $('#btn-save');
var listDiv = $('#list');
var objects = [];

reloadTable(null);

function reloadTable(query, from) {
    $.ajax({
        type: "GET",
        url: '/api/v1/settings/proximities',
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
                    html += '<td>' + response[index].label + '</td>';
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
        $("input[name='label']").val(user.label);
        $("#addModal").modal("show");
    }
}

function resetForm() {
    $("input[name='label']").val("");
}

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

modal.on('hidden.bs.modal', function (e) {
    resetForm();
});