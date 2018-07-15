var _results = $.parseJSON($("#result_id").val());
var _objects = _results.objects;

//Add Item in a Modal (JQuery Function)
$(".addM").click(function () {
    //alert("Ok");
    $Modal = $("#addModal");
    $ModalContent = $Modal.find("#addmodone");

    var object = new Object();

    $("#add-modifs").click(function () {

        object.title = $ModalContent.find("input[name='object.title']").val();

        $.ajax({

            url: "/backend/accounttypes/edit",
            type: 'post',
            data: {
                object: object

            },
            success: function () {
                window.location.replace("/backend/accounttypes");
            }
        });

    });

});

//Edit Item in a Modal (JQuery Function)

$(".ediM").click(function () {
    //alert("Ok");
    $Modal = $("#editModal");
    $ModalContent = $Modal.find("#editmodone");

    var obj_id = $(this).attr("id");
    console.log(obj_id);
    for (var i = 0; i < _objects.length; i++) {

        if (_objects[i].id == obj_id) {
            var object = _objects[i];
            console.log(object);
        }
    }

    $ModalContent.find("input[name='object.title']").val(object.title);

    $("#send-modifs").click(function () {

        object.title = $ModalContent.find("input[name='object.title']").val();

        $.ajax({

            url: "/backend/accounttypes/" + object.id + "/edit",
            type: 'post',
            data: {
                object: object

            },
            success: function () {
                window.location.replace("/backend/accounttypes");
            }
        });

    });

});

//View Item in a Modal (JQuery Function)

$(".vieM").click(function () {
    //alert("Ok");
    $Modal = $("#viewModal");
    $ModalContent = $Modal.find("#viewmodone");

    var obj_id = $(this).attr("id");
    console.log(obj_id);
    for (var i = 0; i < _objects.length; i++) {

        if (_objects[i].id == obj_id) {
            var object = _objects[i];
            console.log(object);
        }
    }

    $ModalContent.find("#label").html(object.title);
    $ModalContent.find("#created").html(object.created);
    $ModalContent.find("#updated").html(object.updated);

    $("#delete-modifs").click(function () {

        object.title = $ModalContent.find("input[name='object.title']").val();

        $.ajax({

            url: "/backend/accounttypes/" + obj_id + "/delete",
            type: 'post',
            data: {
                id: obj_id

            },
            success: function () {
                window.location.replace("/backend/accounttypes");
            }
        });

    });

});