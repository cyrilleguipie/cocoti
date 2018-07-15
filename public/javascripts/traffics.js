var $Modal = null;
var $ModalContent = null;
var object = null;

//View Item in a Modal (JQuery Function)
$(".vieM").click(function () {
    $Modal = $("#viewModal");
    $ModalContent = $Modal.find("#viewmodone");
    object = null;
    var obj_id = parseInt($(this).attr("id"));
    var o = parseInt($(this).attr("v"));
    object = $.parseJSON($("#item_" + obj_id).val());

    $ModalContent.find("#agentN").html(object.agentFullName);
    if(o === 1){
        $ModalContent.find("#customerN").html(object.cutomerFullName);
    }
    $ModalContent.find("#description").html(object.description);
    //$ModalContent.find("#status").html(object.status);
    var picture = "";

    for (var i = 0, len = object.pictureUrls.length; i < len; i++) {
        picture += '<img id ="picture" style = "max-width: 100%; height: auto; max-height: 100%;" src="data:image/jpeg;base64,' + object.pictureUrls[i].pictureUrl + '"/>'
    }

    $ModalContent.find("#picture").html(picture);

    $("#delete-modifs").click(function () {
        var r = confirm("Voulez-vous supprimer cet element ? ");
        if (r == true) {
            $("#delete-modifs").attr("disabled", true);
            $("#delete-modifs").html("Veuillez patienter");
            $.ajax({
                url: getFinalUrl('traffics/'+obj_id+'/delete '),
                type: 'post',
                data: {
                    id: obj_id
                },
                success: function () {
                    $("#delete-modifs").attr("disabled", false);
                    $("#delete-modifs").html("Supprimer");
                    window.location.replace(getFinalUrl('traffics'));
                }
            });
        }
    });
});
