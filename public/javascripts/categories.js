var $Modal = null;
var $ModalContent = null;
var categorieInfos = $("input[type=hidden][class=results]");
var _objects = getData(categorieInfos, []);
var token = $("input[name='authenticityToken']").val();
var object = null;
var obj_id = null;

function updateObject(container, url, update, containerBtn) {
    var title = container.find("input[name='object.title']").val();

    var data = {
        title: title
    };

    $("#loader").css("display", "block");
    $("#container-add").css("display", "none");
    $("" + containerBtn + "").html("Veuillez patienter...").attr("disabled", true);
    var dataString = JSON.stringify(data);
    $.ajax({
        url: getFinalUrl(url),
        type: 'post',
        data: {
            authenticityToken: token,
            data: dataString

        },
        success: function (data) {
            if (data.error == false) {
                setTimeout(function () {
                    $("#loader").css("display", "none");
                    $("#container-add").css("display", "block");
                    $("" + containerBtn + "").html("Valider").attr("disabled", false);
                    $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                    $("#errorMsg").html("La catégorie a été enregistré.");
                    setTimeout("window.location.replace(getFinalUrl('categories'));", 2000);
                }, 3000);
            } else {
                setTimeout(function () {
                    $("#loader").css("display", "none");
                    $("#container-add").css("display", "block");
                    $("" + containerBtn + "").html("Valider").attr("disabled", false);
                    $("#errorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                    $("#errorMsg").html("Une erreur est survenue. Veuillez actualiser la page !");
                }, 3000);
            }
        }
    });
}

//Add Item in a Modal (JQuery Function)
$(".addM").click(function () {
    //alert("Ok");
    $Modal = $("#addModal");
    $ModalContent = $Modal.find("#addmodone");
    $ModalContent.find("input[name='object.title']").val("");
    $ModalContent.find("#errorMsg").hide();
    $ModalContent.find("#errorMsg").html("");

    $("#add-modifs").click(function () {

        var form = $ModalContent.find('.form-validation');
        var valid = form.valid();

        if (!valid) {
            form.data('validator').focusInvalid();
            return false;
        }

        updateObject($ModalContent, "categories/edit", false, "#add-modifs");
    });

});

//Edit Item in a Modal (JQuery Function)
$(".ediM").click(function () {
    $Modal = $("#editModal");
    $ModalContent = $Modal.find("#editmodone");
    $ModalContent.find("#errorMsg").hide();
    $ModalContent.find("#errorMsg").html("");
    object = null;
    obj_id = null;
    obj_id = parseInt($(this).attr("id"));
    for (var i = 0; i < _objects.length; i++) {
        if (_objects[i].id === obj_id) {
            object = _objects[i];
        }
    }

    $ModalContent.find("input[name='object.title']").val(object.title);

    $("#send-modifs").click(function () {

        var form = $ModalContent.find('.form-validation');
        var valid = form.valid();

        if (!valid) {
            form.data('validator').focusInvalid();
            return false;
        }

        updateObject($ModalContent, 'categories/' + object.id + '/edit', true, "#send-modifs");
    });

});

//View Item in a Modal (JQuery Function)

$(".vieM").click(function () {
    //alert("Ok");
    $Modal = $("#viewModal");
    $ModalContent = $Modal.find("#viewmodone");
    $ModalContent.find("#verrorMsg").hide();
    $ModalContent.find("#verrorMsg").html("");
    obj_id = null;
    object = null;
    obj_id = parseInt($(this).attr("id"));
    for (var i = 0; i < _objects.length; i++) {
        if (_objects[i].id === obj_id) {
            object = _objects[i];
        }
    }

    $ModalContent.find("#label").html(object.title);

    $("#delete-modifs").click(function () {
        $ModalContent.find("#vloader").css("display", "block");
        $ModalContent.find("#container-view").css("display", "none");
        $Modal.find("#delete-modifs").html("Veuillez patienter...").attr("disabled", true);

        $.ajax({

            url: getFinalUrl('categories/' + object.id + '/delete'),
            type: 'post',
            data: {
                authenticityToken: token,
                id: object.id

            },
            success: function (data) {
                if (data.error == false) {
                    setTimeout(function () {
                        $ModalContent.find("#vloader").css("display", "none");
                        $ModalContent.find("#container-view").css("display", "block");
                        $Modal.find("#delete-modifs").html("Supprimer").attr("disabled", false);
                        $ModalContent.find("#verrorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                        $ModalContent.find("#verrorMsg").html("La catégorie a été supprimée.");
                        setTimeout("window.location.replace(getFinalUrl('categories'));", 2000);
                    }, 3000);
                } else {
                    setTimeout(function () {
                        $ModalContent.find("#vloader").css("display", "none");
                        $ModalContent.find("#container-view").css("display", "block");
                        $Modal.find("#delete-modifs").html("Supprimer").attr("disabled", false);
                        $ModalContent.find("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                        $ModalContent.find("#verrorMsg").html("Une erreur est survenue pendant la suppression. Veuillez actualiser la page !");
                    }, 3000);
                }
            }
        });

    });

});