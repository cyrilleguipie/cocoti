var $Modal = null;
var $ModalContent = null;
var object = null;
var account = null;
var obj_id = null;
var token = $("input[name='authenticityToken']").val();
var objectInfos = $("input[type=hidden][class=results]");
var _objects = getData(objectInfos, []);


function updateObject(container, url, update, containerBtn) {
    var title = container.find("input[name='object.title']").val();
    var barcode = container.find("input[name='object.barcode']").val();
    var productCode = container.find("input[name='object.productCode']").val();
    var itemId = container.find("input[name='object.itemId']").val();
    var formatProductId = container.find("select[name='object.formatProduct']").val();
    var categorieId = container.find("select[name='object.categorie']").val();
    var typeProductId = container.find("select[name='typeproduct']").val();
    console.log(typeProductId);
    var saleByLot = parseInt(container.find("select[name='saleByLot']").val());
    var numberOfPieces = container.find("input[name='object.numberOfPieces']").val();
    var sellPrice = container.find("input[name='object.priceCarton']").val();
    var piecePrice = container.find("input[name='object.priceUnit']").val();
    var halfSellPrice = 0;
    var pieceHalfPrice = 0;
    var wholeSellPrice = 0;
    var pieceWholePrice = 0;

    if (saleByLot === 1) {
        halfSellPrice = container.find("input[name='object.priceCartonHalf']").val();
        pieceHalfPrice = container.find("input[name='object.priceUnitHalf']").val();
        wholeSellPrice = container.find("input[name='object.priceCartonWhole']").val();
        pieceWholePrice = container.find("input[name='object.priceUnitWhole']").val();
    }

    var data = {
        title : title,
        barcode : barcode,
        productCode : productCode,
        itemId: itemId,
        formatProductId: formatProductId,
        categorieId: categorieId,
        typeProductId: typeProductId,
        saleByLot: saleByLot,
        numberOfPieces: numberOfPieces,
        sellPrice: sellPrice,
        piecePrice: piecePrice,
        halfSellPrice: halfSellPrice,
        pieceHalfPrice:  pieceHalfPrice,
        wholeSellPrice: wholeSellPrice,
        pieceWholePrice: pieceWholePrice
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
                    $("" + containerBtn + "").html("Ajouter").attr("disabled", false);
                    $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                    $("#errorMsg").html("Les produits ont été enregistrés.");
                    setTimeout("window.location.replace(getFinalUrl('products'));", 2000);
                }, 3000);
            } else {
                setTimeout(function () {
                    $("#loader").css("display", "none");
                    $("#container-add").css("display", "block");
                    $("" + containerBtn + "").html("Ajouter").attr("disabled", false);
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

    $ModalContent.find("#errorMsg").hide();
    $ModalContent.find("#errorMsg").html("");
    $ModalContent.find("input[name='object.title']").val("");
    $ModalContent.find("input[name='object.barcode']").val("");
    $ModalContent.find("input[name='object.productCode']").val("");
    $ModalContent.find("select[name='object.formatProduct']").val("");
    $ModalContent.find("input[name='object.itemId']").val("");
    $ModalContent.find("select[name='typeproduct']").val("");
    $ModalContent.find("select[name='saleByLot']").val("");
    $ModalContent.find("select[name='object.categorie']").val(0);
    $ModalContent.find("input[name='object.priceCarton']").val("");
    $ModalContent.find("input[name='object.priceUnit']").val("");
    $ModalContent.find("input[name='object.priceCartonHalf']").val("");
    $ModalContent.find("input[name='object.priceUnitHalf']").val("");
    $ModalContent.find("input[name='object.priceCartonWhole']").val("");
    $ModalContent.find("input[name='object.priceUnitWhole']").val("");
    $ModalContent.find("input[name='object.numberOfPieces']").val("");
    $ModalContent.find("#HalfPriceRow").hide();
    $ModalContent.find("#WholePriceRow").hide();
    $ModalContent.find("input[name='object.priceCartonHalf']").val("");
    $ModalContent.find("input[name='object.priceUnitHalf']").val("");
    $ModalContent.find("input[name='object.priceCartonWhole']").val("");
    $ModalContent.find("input[name='object.priceUnitWhole']").val("");

    $ModalContent.find("select[name='saleByLot']").change(function () {
        var saleByLot = $ModalContent.find("select[name='saleByLot']").val();
        if (saleByLot == 0) {
            $ModalContent.find("#HalfPriceRow").hide();
            $ModalContent.find("#WholePriceRow").hide();
        } else {
            $ModalContent.find("#HalfPriceRow").show();
            $ModalContent.find("#WholePriceRow").show();
        }
    });

    $("#add-modifs").click(function () {

        var form = $ModalContent.find('.form-validation');
        var valid = form.valid();

        if (!valid) {
            form.data('validator').focusInvalid();
            return false;
        }

        updateObject($ModalContent, "products/edit", false, "#add-modifs");

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
    var itemId = $(this).attr("item-Id");

    for (var i = 0; i < _objects.length; i++) {
        if (_objects[i].id === obj_id) {
            object = _objects[i];
        }
    }

    $ModalContent.find("input[name='object.title']").val(object.title);
    $ModalContent.find("input[name='object.barcode']").val(object.barcode);
    $ModalContent.find("input[name='object.productCode']").val(object.productCode);
    //$ModalContent.find("#object_itemId").hide();
    $ModalContent.find("input[name='object.itemId']").val(itemId);
    $ModalContent.find("select[name='object.formatProduct']").val(object.formatProduct.id);
    $ModalContent.find("select[name='typeproduct']").val(object.codeTypeProduct);
    $ModalContent.find("select[name='object.categorie']").val(object.category.id);
    $ModalContent.find("input[name='object.priceCarton']").val(object.sellPrice);
    $ModalContent.find("input[name='object.priceUnit']").val(object.piecePrice);
    $ModalContent.find("input[name='object.numberOfPieces']").val(object.numberOfPieces);
    $ModalContent.find("select[name='saleByLot']").val(object.saleByLot);

    if (object.saleByLot == 1) {
        $ModalContent.find("#HalfPriceRow").show();
        $ModalContent.find("#WholePriceRow").show();
        $ModalContent.find("input[name='object.priceCartonHalf']").val(object.halfSellPrice);
        $ModalContent.find("input[name='object.priceUnitHalf']").val(object.pieceHalfPrice);
        $ModalContent.find("input[name='object.priceCartonWhole']").val(object.wholeSellPrice);
        $ModalContent.find("input[name='object.priceUnitWhole']").val(object.pieceWholePrice);
    } else {
        $ModalContent.find("#HalfPriceRow").hide();
        $ModalContent.find("#WholePriceRow").hide();
        $ModalContent.find("input[name='object.priceCartonHalf']").val("");
        $ModalContent.find("input[name='object.priceUnitHalf']").val("");
        $ModalContent.find("input[name='object.priceCartonWhole']").val("");
        $ModalContent.find("input[name='object.priceUnitWhole']").val("");
    }

    $ModalContent.find("select[name='saleByLot']").change(function () {
        var saleByLot = $ModalContent.find("select[name='saleByLot']").val();
        if (saleByLot == 0) {
            $ModalContent.find("#HalfPriceRow").hide();
            $ModalContent.find("#WholePriceRow").hide();
        } else {
            $ModalContent.find("#HalfPriceRow").show();
            $ModalContent.find("#WholePriceRow").show();
        }
    });

    $("#send-modifs").click(function () {

        var form = $ModalContent.find('.form-validation');
        var valid = form.valid();

        if (!valid) {
            form.data('validator').focusInvalid();
            return false;
        }

        updateObject($ModalContent, 'products/' + object.id + '/edit', true, "#send-modifs");
    });
});

//View Item in a Modal (JQuery Function)
$(".vieM").click(function () {
    $Modal = $("#viewModal");
    $ModalContent = $Modal.find("#viewmodone");
    $ModalContent.find("#vferrorMsg").hide();
    $ModalContent.find("#vferrorMsg").html("");

    object = null;
    obj_id = null;
    obj_id = parseInt($(this).attr("id"));
    var itemId = $(this).attr("item-Id");

    for (var i = 0, len = _objects.length; i < len; i++) {
        if (_objects[i].id === obj_id) {
            object = _objects[i];
        }
    }

    $ModalContent.find("#label").html(object.title);
    $ModalContent.find("#barcode").html(object.barcode);
    $ModalContent.find("#productCode").html(object.productCode);
    $ModalContent.find("#itemIdview").html(itemId);
    $ModalContent.find("#formatproduit").html(object.formatProduct.title);
    $ModalContent.find("#cartonprice").html(object.sellPrice);
    $ModalContent.find("#unitprice").html(object.piecePrice);
    $ModalContent.find("#colisproduct").html(object.numberOfPieces);
    if (object.saleByLot == 0) {
        $ModalContent.find("#saleblot").html("NON");
        $ModalContent.find(".halfPriceView").hide();
        $ModalContent.find(".wholePriceView").hide();
    } else {
        $ModalContent.find("#saleblot").html("OUI");
        $ModalContent.find(".halfPriceView").show();
        $ModalContent.find(".wholePriceView").show();
        $ModalContent.find("#cartonpriceHalf").html(object.halfSellPrice);
        $ModalContent.find("#unitpriceHalf").html(object.pieceHalfPrice);
        $ModalContent.find("#cartonpriceWhole").html(object.wholeSellPrice);
        $ModalContent.find("#unitpriceWhole").html(object.pieceWholePrice);
    }

    $("#delete-modifs").click(function () {
        var r = confirm("Voulez vous suppromer ce produit ?");
        if (r) {
            $ModalContent.find("#vfloader").css("display", "block");
            $ModalContent.find("#container-view").css("display", "none");
            $Modal.find("#delete-modifs").html("Veuillez patienter...").attr("disabled", true);
            $.ajax({
                url: getFinalUrl('products/' + object.id + '/delete'),
                type: 'post',
                data: {
                    id: object.id
                },
                success: function (data) {
                    if (data.error == false) {
                        setTimeout(function () {
                            $ModalContent.find("#vfloader").css("display", "none");
                            $ModalContent.find("#container-view").css("display", "block");
                            $Modal.find("#delete-modifs").html("Supprimer").attr("disabled", false);
                            $ModalContent.find("#vferrorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                            $ModalContent.find("#vferrorMsg").html("Le produit a été supprimé.");
                            setTimeout("window.location.replace(getFinalUrl('products'));", 2000);
                        }, 3000);
                    } else {
                        setTimeout(function () {
                            $ModalContent.find("#vfloader").css("display", "none");
                            $ModalContent.find("#container-view").css("display", "block");
                            $Modal.find("#delete-modifs").html("Supprimer").attr("disabled", false);
                            $ModalContent.find("#vferrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                            $ModalContent.find("#vferrorMsg").html("Une erreur est survenue pendant la suppression. Veuillez actualiser la page !");
                        }, 3000);
                    }
                }
            });
        }
    });

});

var $inputFile = $("#contactsFile");

$inputFile.change(function () {
    var file = $inputFile[0].files[0];

    var fileName = file.name;
    var ext = fileName.split('.').pop();
    switch (ext) {
        case "xlsx" :
            $("#verrorMsg").hide();
            break;
        case "xls" :
            $("#verrorMsg").hide();
            break;
        default:
            $("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
            $("#verrorMsg").html("Veuillez choisir un fichier avec un format correct");
    }
});

$("#import-modifs").click(function () {
    var file = $inputFile[0].files[0];

    if (file != null) {
        var fileName = file.name;
        var ext = fileName.split('.').pop();
        switch (ext) {
            case "xls":
                $("#verrorMsg").hide();
                if ($("#typeproducts").val() == "0") {
                    $("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                    $("#verrorMsg").html("Veuillez choisir un type de produit a importer");
                } else {
                    var typeProduct = parseInt($("#typeproducts").val());
                    loadFile(file, typeProduct, getFinalUrl('products/import'));
                }
                break;
            case "xlsx":
                $("#verrorMsg").hide();
                if ($("#typeproducts").val() == "0") {
                    $("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                    $("#verrorMsg").html("Veuillez choisir un type de produit a importer");
                } else {
                    var typeProduct = parseInt($("#typeproducts").val());
                    loadFile(file, typeProduct, getFinalUrl('products/import'));
                }
                break;
            default:
                $("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                $("#verrorMsg").html("Veuillez choisir un fichier au format Excel");
        }

        return false;
    } else {
        $("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
        $("#verrorMsg").html("Veuillez choisir un fichier au format Excel");
    }
});

function loadFile(file, typeProduct, url) {
    var responseText = null;

    $("#vloader").css("display", "block");
    $("#vcontent").css("display", "none");
    $("#import-modifs").html("Veuillez patienter...").attr("disabled", true);

    var xhr = new XMLHttpRequest();

    xhr.open('POST', url);

    var form = new FormData();
    form.append('file', file);
    form.append('productTypeId', typeProduct);
    form.append('authenticityToken', token);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status != 200) {
                //alert("Erreur code " + xhr.status);
            } else {
                if (xhr.responseText != null) {
                    responseText = xhr.responseText;
                    //console.log(responseText);
                    var obj = jQuery.parseJSON(responseText);
                    if (obj.error) {
                        $("#vloader").css("display", "none");
                        $("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                        $("#verrorMsg").html(obj.message);
                        $("#vcontent").css("display", "block");
                        $("#import-modifs").html("Importer").attr("disabled", false);
                    } else {
                        setTimeout(function () {
                            $("#vloader").css("display", "none");
                            $("#verrorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                            $("#verrorMsg").html("Les produits ont bien été importés !");
                            $("#vcontent").css("display", "block");
                            $("#import-modifs").html("Importer").attr("disabled", false);
                            setTimeout("window.location.replace(getFinalUrl('products'));", 2000);
                        }, 3000);
                    }
                }

            }
        }
        return xhr.readyState;
    };
    xhr.send(form);

}