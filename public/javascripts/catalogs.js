var $Modal = null;
var $ModalContent = null;
var object = null;
var token = $("input[name='authenticityToken']").val();

//Add Item in a Modal (JQuery Function)
$(".addM").click(function () {
    $Modal = $("#addModal");
    $ModalContent = $Modal.find("#addmodone");

    var fileInput = document.querySelector('#file');
    var pictureUrl = null;

    fileInput.addEventListener('change', function () {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', getFinalUrl('catalog/upload'));
        var form = new FormData();
        form.append("authenticityToken", token);
        for (var i = 0, len = fileInput.files.length; i < len; i++) {
            form.append('file', fileInput.files[i]);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status != 200) {//Message si il se preoduit une erreur
                    console.log("Erreur code " + xhr.status);
                } else {
                    if (xhr.responseText != null) {
                        pictureUrl = xhr.responseText;
                    }

                }
            }
            return xhr.readyState;
        };
        xhr.send(form);
    });

    $("#add-modifs").click(function () {
        var productId = $ModalContent.find("select[name='product']").val();

        if (productId > 0 && pictureUrl != null) {
            $("#loader").css("display", "block");
            $("#edicontent").css("display", "none");
            $("#add-modifs").html("Veuillez patienter...").attr("disabled", true);
            $.ajax({
                url: getFinalUrl('catalog/edit'),
                type: 'post',
                data: {
                    authenticityToken: token,
                    productId: productId,
                    pictureUrl: pictureUrl
                },
                success: function (data) {
                    if (data.error == false) {
                        setTimeout(function () {
                            $("#loader").css("display", "none");
                            $("#edicontent").css("display", "block");
                            $("#add-modifs").html("Valider").attr("disabled", false);
                            $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                            $("#errorMsg").html("Les produits ont été affectés.");
                            setTimeout("window.location.replace(getFinalUrl('catalog'));", 2000);
                        }, 3000);
                    } else {
                        setTimeout(function () {
                            $("#loader").css("display", "none");
                            $("#edicontent").css("display", "block");
                            $("#add-modifs").html("Valider").attr("disabled", false);
                            $("#errorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                            $("#errorMsg").html("Une erreur est survenue. Veuillez réessayer !");
                        }, 3000);
                    }
                }
            });
        } else {
            $("#errorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
            $("#errorMsg").html("Veuillez bien renseigner les champs.");
        }
    });

});

//View Item in a Modal (JQuery Function)
$(".vieM").click(function () {
    $Modal = $("#viewModal");
    $ModalContent = $Modal.find("#viewmodone");
    var obj_id = $(this).attr("id");
    object = $.parseJSON($("#item_" + obj_id).val());

    $ModalContent.find("#label").html(object.productName);
    $ModalContent.find("#categorie").html(object.categoryName);
    var picture = '<img id ="picture" style = "max-width: 100%; height: auto; max-height: 100%;" src="../' + object.pictureUrl + '"/>'
    $ModalContent.find("#picture").html(picture);

    $("#delete-modifs").click(function () {
        var r = confirm("Voulez vous supprimer ce element ?");
        if (r) {
            $("#vloader").css("display", "block");
            $("#viecontent").css("display", "none");
            $("#delete-modifs").html("Veuillez patienter...").attr("disabled", true);
            $.ajax({
                url: getFinalUrl('catalog/' + obj_id + '/delete'),
                type: 'post',
                data: {
                    authenticityToken: token,
                    id: obj_id
                },
                success: function (data) {
                    if (data.error == false) {
                        setTimeout(function () {
                            $("#vloader").css("display", "none");
                            $("#viecontent").css("display", "block");
                            $("#delete-modifs").html("Supprimer").attr("disabled", false);
                            $("#verrorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                            $("#verrorMsg").html("Les produits ont été supprimés.");
                            setTimeout("window.location.replace(getFinalUrl('catalog'));", 2000);
                        }, 3000);
                    } else {
                        setTimeout(function () {
                            $("#vloader").css("display", "none");
                            $("#viecontent").css("display", "block");
                            $("#delete-modifs").html("Supprimer").attr("disabled", false);
                            $("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                            $("#verrorMsg").html("Une erreur est survenue. Veuillez réessayer !");
                        }, 3000);
                    }
                }
            });
        }

    });
});