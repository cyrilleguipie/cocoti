var searchBox = $("input[name='name']");
var listDiv = $('#resultList');
var subOBox = $("#panel-sub-organism");
var subOBtn = $("#submit-sub-organism");
var subContainer = $("#subOContainer");
var subOmsg = $("#subOmsg");
var subOBox = $("#subOBox");
var url = "/api/v1/organisms/search";
var objects = [];
var modal = $('#addModal');
var modalBtn = $('#btn-save');
var baseUrl = $('#base-url').val();
var baseApiUrl = $('#base-api-url').val();
var addBtn = $('#add-object');
var editBtn = $('.edit-object');
var viewBtn = $('.view-object');

var organismId = 0;
if($("input[name='id']").length > 0){
    organismId = $("input[name='id']").val();
}

searchBox.on('keyup', function () {
    console.log("Key up event");
    if (!searchBox.val()) {
        return false;
    } else {
        reloadTable(searchBox.val(), true);
    }
});

subOBtn.on('click', function () {
    var subOAdress = $("input[name='subOAdress']").val();
    var subOCity = $("input[name='subOCity']").val();
    var subOPostalCode = $("input[name='subOPostalCode']").val();
    var subOTel = $("input[name='subOTel']").val();
    var subOFax = $("input[name='subOFax']").val();
    var subOObservation = $("textarea[name='subOObservation']").val();
    var subO1price = $("input[name='subO1stprice']").val();
    var subO2price = $("input[name='subO2ndprice']").val();
    var subO3price = $("input[name='subO3rdprice']").val();
    var subO4price = $("input[name='subOOthprice']").val();
    var subOSector = $("input[name='subOSecteur']").val();
    var subOSection = $("input[name='subOSection']").val();
    var subOCollection = $("input[name='subOCollection']").val();


});

addBtn.click(function () {
    var id = 0;
    $.ajax({
        type: "GET",
        url: baseUrl + "/editsuborganism/" + id +"/"+ organismId,
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
        url: baseUrl + "/editsuborganism/" + id +"/"+ organismId,
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
        url: baseUrl + "/viewsuborganism/" + id,
        success: function (response) {
            console.log(response);
            if (response.length > 0) {
                subOmsg.hide();
                subOBox.empty();
                subOBox.append(response);
            } else {
                subOmsg.show();
                subOBox.hide();
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
            console.log(data);
            location.reload();
        },
        error: function (jXHR, textStatus, errorThrown) {
            console.log(jXHR);
            console.log(textStatus);
            //alert(errorThrown);
        }
    });
});

subContainer.on("click", "#add-sub-object", function () {
    var id = 0;
    var subOrganismId = subContainer.find("input[name='id']").val();
    console.log(id);
    console.log(subOrganismId);
    $.ajax({
        type: "GET",
        url: baseUrl + "/editassistant/" + id +"/"+ subOrganismId,
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

subContainer.on("click", ".edit-sub-object", function () {
    var id = parseInt($(this).attr("id"));
    var subOrganismId = subContainer.find("input[name='id']").val();
    console.log(subOrganismId);
    $.ajax({
        type: "GET",
        url: baseUrl + "/editassistant/" + id +"/"+ subOrganismId,
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

subContainer.on("click", ".view-sub-object", function () {
    var id = parseInt($(this).attr("id"));
    $.ajax({
        type: "GET",
        url: baseUrl + "/viewassistant/" + id,
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



function reloadTable(query, from) {
    $.ajax({
        type: "GET",
        url: url,
        data: {'query': query === null ? "" : query},
        dataType: 'json',
        success: function (response) {
            //console.log(response);
            if (response.length > 0) {
                objects = response;
                listDiv.empty();
                var html = '<ul style="list-style: none;">';
                $.each(response, function (index, member) {
                    html += '<li onclick="fillEditForm(' + response[index].id + ')">'+response[index].name+' | '+response[index].code+ '| '+ response[index].sectorType+' </li>';

                });
                html += '</ul>';
                listDiv.append(html);

            } else {
                return false;
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
        $("input[name='organism.name']").val(user.name);
        $("input[name='organism.code']").val(user.code);
        $("select[name='organism.sectorType']").val(user.sectorType);
        $("input[name='subOSecteur']").val(user.code);
        listDiv.empty();
    }
}