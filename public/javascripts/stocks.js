var _stocks = [];
var $Modal = null;
var $ModalContent = null;
var inputFile = $("#contactsFile");
var token = $("input[name='authenticityToken']").val();
/*var stockInfos = $("input[type=hidden][class=stocks]");

stockInfos.each(function () {
    var value = $.parseJSON($(this).val());
    _stocks = _stocks.concat(value);
});*/

//View Item in a Modal (JQuery Function)
$(".vieM").click(function () {
    $Modal = $("#viewModal");
    $ModalContent = $Modal.find("#viewmodone");
    var obj_id = $(this).attr("id");
    var nameAgent = $("#name_" + obj_id).html();
    //var serialAgent = $(this).attr("v");
    var data = [];
    _stocks = $.parseJSON($("#stock_" + obj_id).val());

    for (var j = 0, len = _stocks.length; j < len; j++) {
        //if (_stocks[j].agentSerial == serialAgent) {
            data.push([
                _stocks[j].product.productCode,
                _stocks[j].titleProduct,
                _stocks[j].quantityPack,
                _stocks[j].quantityPiece,
                _stocks[j].quantityPackHalf,
                _stocks[j].quantityPieceHalf,
                _stocks[j].quantityPackWhole,
                _stocks[j].quantityPieceWhole,
                _stocks[j].id
            ]);
       // }
    }
    $ModalContent.find("#chiefinfo").html(nameAgent);
    $('#example5').DataTable({
        "dom": 'Blfrtip',
        "pageLength": 20,
        "order": [],
        "colVis": {
            "buttonText": "Colonnes",
            "overlayFade": 0,
            "align": "right"
        },
        "buttons": [
            {
                "extend": 'excel',
                "text": 'Exporter en Excel',
                "exportOptions": {
                    "columns": "thead th:not(.noExport)"
                }
            }
        ],
        "language": {
            "lengthMenu": '_MENU_ données par page',
            "search": '<i class="fa fa-search"></i>',
            "paginate": {
                "previous": '<i class="fa fa-angle-left"></i>',
                "next": '<i class="fa fa-angle-right"></i>'
            }
        },
        destroy: true,
        data: data,
        columns: [
            {title: "Reference"},
            {title: "Nom"},
            {title: "Qty Pack"},
            {title: "Qty Piece"},
            {title: "Qty Pack Demi-gros"},
            {title: "Qty Piece Demi-gros"},
            {title: "Qty Pack Gros"},
            {title: "Qty Piece Gros"}
        ],
        createdRow: function (row, data, index) {
            $('td', row).eq(2).attr('class', 'quantityStock');
            $('td', row).eq(3).attr('class', 'quantityStock');
            $('td', row).eq(4).attr('class', 'quantityStock');
            $('td', row).eq(5).attr('class', 'quantityStock');
            $('td', row).eq(6).attr('class', 'quantityStock');
            $('td', row).eq(7).attr('class', 'quantityStock');

            $('td', row).eq(2).attr('type', 'pack');
            $('td', row).eq(3).attr('type', 'piece');
            $('td', row).eq(4).attr('type', 'halfPack');
            $('td', row).eq(5).attr('type', 'halfPiece');
            $('td', row).eq(6).attr('type', 'wholePack');
            $('td', row).eq(7).attr('type', 'wholePiece');

            $('td', row).eq(2).attr('id', data[8]);
            $('td', row).eq(3).attr('id', data[8]);
            $('td', row).eq(4).attr('id', data[8]);
            $('td', row).eq(5).attr('id', data[8]);
            $('td', row).eq(6).attr('id', data[8]);
            $('td', row).eq(7).attr('id', data[8]);
        }
    });

    var productsUpdate = [];
    var stockObject;

    $(".update").click(function () {
        alert("Vous pouvez modifier la quantité des produits");
        $ModalContent.find(".quantityStock").prop('contenteditable', true);

        var quantityBase = 0;
        var quantityEnd = 0;
        $ModalContent.find(".quantityStock").focusin(function () {
            quantityBase = parseInt($(this).html());
        }).focusout(function () {
            quantityEnd = parseInt($(this).html());
            var idStock = parseInt($(this).attr("id"));
            var typeQuantity = $(this).attr("type");
            var isNew = false;

            if (quantityEnd !== quantityBase) {
                stockObject = checkIfStockExists(idStock, productsUpdate);
                if (stockObject == null) {
                    stockObject = new Object();
                    stockObject.id = idStock;
                    isNew = true;
                }
                if (typeQuantity === "piece") {
                    stockObject.quantityPiece = quantityEnd;
                } else if (typeQuantity === "pack") {
                    stockObject.quantityPack = quantityEnd;
                } else if (typeQuantity === "halfPack") {
                    stockObject.quantityPackHalf = quantityEnd;
                } else if (typeQuantity === "halfPiece") {
                    stockObject.quantityPieceHalf = quantityEnd;
                } else if (typeQuantity === "wholePack") {
                    stockObject.quantityPackWhole = quantityEnd;
                } else if (typeQuantity === "wholePiece") {
                    stockObject.quantityPieceWhole = quantityEnd;
                }

                if (isNew) {
                    productsUpdate.push(stockObject);
                }
            }
        });
    });

    $("#valid").click(function () {
        var r = confirm(" Voulez-vous effectuez ces changements ?");
        if (r == true) {
            if (productsUpdate != null && productsUpdate.length > 0) {
                $("#loader").css("display", "block");
                $("#edicontent").css("display", "none");
                $("#valid").html("Veuillez patienter...").attr("disabled", true);
                var sendOrderLines = JSON.stringify(productsUpdate);
                $.ajax({
                    url: getFinalUrl('inventory/edit'),
                    type: 'post',
                    data: {
                        authenticityToken: token,
                        objects: sendOrderLines
                    },
                    success: function (data) {
                        if (data.error == false) {
                            setTimeout(function () {
                                $("#loader").css("display", "none");
                                $("#edicontent").css("display", "block");
                                $("#valid").html("Valider").attr("disabled", false);
                                $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                                $("#errorMsg").html("Les produits ont été modifiés.");
                                setTimeout("window.location.replace(getFinalUrl('inventory'));", 2000);
                            }, 3000);
                        } else {
                            setTimeout(function () {
                                $("#loader").css("display", "none");
                                $("#edicontent").css("display", "block");
                                $("#valid").html("Valider").attr("disabled", false);
                                $("#errorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                                $("#errorMsg").html("Une erreur est survenue. Veuillez réessayer !");
                            }, 3000);
                        }
                    }
                });
            } else {
                alert("Vous n'avez pas effectué de modifications sur votre inventaire");
            }
        }
    });
});

inputFile.change(function () {
    var file = inputFile[0].files[0];
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
    var file = inputFile[0].files[0];

    if (file != null) {
        var fileName = file.name;
        var ext = fileName.split('.').pop();
        switch (ext) {
            case "xls":
                $("#verrorMsg").hide();
                loadFile(file, getFinalUrl('inventory/import'));
                break;
            case "xlsx":
                $("#verrorMsg").hide();
                loadFile(file, getFinalUrl('inventory/import'));
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

function loadFile(file, url) {
    var responseText = null;

    $("#vloader").css("display", "block");
    $("#vcontent").css("display", "none");
    $("#import-modifs").html("Veuillez patienter...").attr("disabled", true);

    var xhr = new XMLHttpRequest();

    xhr.open('POST', url);

    var form = new FormData();
    form.append('file', file);
    form.append('authenticityToken', token);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status != 200) {
                //alert("Erreur code " + xhr.status);
            } else {
                if (xhr.responseText != null) {
                    responseText = xhr.responseText;
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
                            $("#verrorMsg").html("Les inventaires ont bien été importés !");
                            $("#vcontent").css("display", "block");
                            $("#import-modifs").html("Importer").attr("disabled", false);
                            setTimeout("window.location.replace(getFinalUrl('inventory'));", 2000);
                        }, 3000);
                    }
                }

            }
        }
        return xhr.readyState;
    };
    xhr.send(form);

}

function checkIfStockExists(id, array) {
    var object = null;
    if (array.length > 0) {
        for (var j = 0, len = array.length; j < len; j++) {
            if (array[j].id == id) {
                object = array[j];
            }
        }
    }

    return object;
}
