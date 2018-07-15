/**
 * Created by ROMUALD on 17/01/2017.
 */

$(function () {
    $(".select2").multiselect({
        maxHeight: 300,
        enableFiltering: true,
        includeSelectAllOption: true,
        buttonClass: 'btn btn-link',
        buttonWidth: '150px',
        selectAllText: 'Tout sélectionner',
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: 'Rechercher',
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'Sélectionner';
            }
            else if (options.length > 3) {
                return options.length + ' commerciaux sélectionnés';
            }
            else {
                var labels = [];
                options.each(function () {
                    if ($(this).attr('label') !== undefined) {
                        labels.push($(this).attr('label'));
                    }
                    else {
                        labels.push($(this).html());
                    }
                });
                return labels.join(', ') + '';
            }
        }
    });

    $("#search").click(function () {
        var values = $("#agents").val();
        var strValues = values.join('|');
        //console.log(strValues);

        filterColumn("#datatable1", strValues, 3, true, true);
    });

    var customerInfos = $("input[type=hidden][class=results]");
    var customerTypesInfos = $("option[class=customerTypes]");
    var $Modal = null;
    var $ModalContent = null;
    var object = null;
    var customerType = null;
    var obj_id = null;
    var token = $("input[name='authenticityToken']").val();

    var _customers = getData(customerInfos, []);
    var _customerTypes = getData2(customerTypesInfos, []);

    function updateObject(container, url, update, containerBtn) {
        var fullName = container.find("input[name='fullName']").val();
        var nickName = container.find("input[name='nickname']").val();
        var address = container.find("input[name='address']").val();
        var phone = container.find("input[name='phone']").val();
        var customerTypeId = parseInt(container.find("select[name='customertype']").val());

        var data = {
            fullName: fullName,
            nickName: nickName,
            address: address,
            phone: phone,
            customerTypeId: customerTypeId
        };

        $("#loader").css("display", "block");
        $("#edicontent").css("display", "none");
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
                        $("#edicontent").css("display", "block");
                        $("" + containerBtn + "").html("Valider").attr("disabled", false);
                        $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                        $("#errorMsg").html("Le client a bien été enregistré");
                        setTimeout("window.location.replace(getFinalUrl('customers'));", 2000);
                    }, 3000);
                } else {
                    setTimeout(function () {
                        $("#loader").css("display", "none");
                        $("#edicontent").css("display", "block");
                        $("" + containerBtn + "").html("Valider").attr("disabled", false);
                        $("#errorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                        $("#errorMsg").html("Une erreur est survenue. Veuillez actualiser la page !");
                    }, 3000);
                }
            }
        });
    }

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
                                $("#verrorMsg").html("Les clients ont bien été importés !");
                                $("#vcontent").css("display", "block");
                                $("#import-modifs").html("Importer").attr("disabled", false);
                                setTimeout("window.location.replace(getFinalUrl('customers'));", 2000);
                            }, 3000);
                        }
                    }

                }
            }
            return xhr.readyState;
        };
        xhr.send(form);
    }

    //Add Item in a Modal (JQuery Function)
    $(".addM").click(function () {
        $Modal = $("#addModal");
        $ModalContent = $Modal.find("#addmodone");

        $ModalContent.find("input[name='fullName']").val("");
        $ModalContent.find("input[name='nickname']").val("");
        $ModalContent.find("input[name='address']").val("");
        $ModalContent.find("input[name='phone']").val("");
        $ModalContent.find("select[name='customertype']").val("");

        $("#add-modifs").click(function () {

            var form = $ModalContent.find('.form-validation');
            var valid = form.valid();

            if (!valid) {
                form.data('validator').focusInvalid();
                return false;
            }

            updateObject($ModalContent, "customers/edit", false, "#add-modifs");
        });
    });

    //Add Item in a Modal (JQuery Function)
    $(".ediM").click(function () {
        $Modal = $("#editModal");
        $ModalContent = $Modal.find("#editmodone");
        object = null;
        obj_id = null;
        obj_id = parseInt($(this).attr("id"));
        customerType = null;

        for (var i = 0, len = _customers.length; i < len; i++) {
            if (_customers[i].id === obj_id) {
                object = _customers[i];
            }
        }

        for (var i = 0, len = _customerTypes.length; i < len; i++) {
            if (_customerTypes[i].title === object.titleCustomertype) {
                customerType = _customerTypes[i];
            }
        }

        $ModalContent.find("input[name='fullName']").val(object.fullName);
        $ModalContent.find("input[name='nickname']").val(object.nickName);
        $ModalContent.find("input[name='address']").val(object.address);
        $ModalContent.find("input[name='phone']").val(object.phone);
        $ModalContent.find("select[name='customertype']").val(customerType.id);


        $("#send-modifs").click(function () {

            var form = $ModalContent.find('.form-validation');
            var valid = form.valid();

            if (!valid) {
                form.data('validator').focusInvalid();
                return false;
            }

            updateObject($ModalContent, 'customers/' + obj_id + '/edit', false, "#send-modifs");

        });

    });


    $(".vieM").click(function () {
        $Modal = $("#viewModal");
        $ModalContent = $Modal.find("#viewmodone");
        obj_id = null;
        object = null;
        obj_id = parseInt($(this).attr("id"));

        for (var i = 0; i < _customers.length; i++) {
            if (_customers[i].id === obj_id) {
                object = _customers[i];
            }
        }

        $ModalContent.find("#fullName").html(object.fullName);
        $ModalContent.find("#nickname").html(object.phone);
        $ModalContent.find("#address").html(object.debitDisplay);
        $ModalContent.find("#customerTypeTitle").html(object.titleCustomertype);

        $("#delete-modifs").click(function () {
            var r = confirm("Voulez vous supprimer cet client ?");
            if (r) {
                $.ajax({
                    url: getFinalUrl('customers/' + object.id + '/delete'),
                    type: 'post',
                    data: {
                        id: obj_id
                    },
                    success: function () {
                        window.location.replace(getFinalUrl('customers'));
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
                    loadFile(file, getFinalUrl('customers/import'));
                    break;
                case "xlsx":
                    $("#verrorMsg").hide();
                    loadFile(file, getFinalUrl('customers/import'));
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

});