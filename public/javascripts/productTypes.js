/**
 * Created by ROMUALD on 17/02/2017.
 */

var _results = $.parseJSON($("#result_id").val());
var _objects = _results.objects;

console.log(_results);
console.log(_objects);

//Add Item in a Modal (JQuery Function)
$(".addM").click(function () {
    //alert("Ok");
    $Modal = $("#addModal");
    $ModalContent = $Modal.find("#addmodone");

    var object = new Object();

    $("#add-modifs").click(function () {

        object.title = $ModalContent.find("input[name='object.title']").val();

        $.ajax({

            url: "/backend/producttypes/edit",
            type: 'post',
            data: {
                object: object

            },
            success: function () {
                window.location.replace("/backend/producttypes");
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

            url: "/backend/producttypes/" + object.id + "/edit",
            type: 'post',
            data: {
                object: object

            },
            success: function () {
                window.location.replace("/backend/producttypes");
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

    $("#delete-modifs").click(function () {

        object.title = $ModalContent.find("input[name='object.title']").val();

        $.ajax({

            url: "/backend/producttypes/" + obj_id + "/delete",
            type: 'post',
            data: {
                id: obj_id

            },
            success: function () {
                window.location.replace("/backend/producttypes");
            }
        });

    });

});