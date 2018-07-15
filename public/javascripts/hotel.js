$(function () {

    $(".select3").multiselect({
        maxHeight: 300,
        enableFiltering: true,
        includeSelectAllOption: true,
        buttonClass: 'btn btn-link',
        buttonWidth: '150px',
        selectAllText: 'Tout sélectionner',
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: 'Rechercher',
        enableClickableOptGroups: true,
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'Sélectionnez une commodité ...';
            }
            else if (options.length > 2) {
                return options.length + ' commodités sélectionnés';
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

    var addProximity = $("#addProximity");
    var addProximityContainer = $("#addProximityContainer");
    var addProximitInput = $("#proximityLabel");
    var proximitSelect = $("#proximity");
    var addProximityBtn = $("#addProximityBtn");
    var roomLabel = $("select[name='roomType']");
    var roomPrice = $("input[name='roomPrice']");
    var roomNumber = $("input[name='roomNumber']");
    var roomCommodity = $("select[name='commodity']");
    var saveRoom = $("#saveRoom");
    var tableRoom = $("#roomDetails");
    var addCommodity = $("#addCommodity");
    var addCommodityContainer = $("#addCommodityContainer");
    var addCommodityInput = $("#commodityLabel");
    var commoditySelect = $("#commodity");
    var addCommodityBtn = $("#addCommodityBtn");
    var saveProximity = $("#saveProximity");
    var tableProximity = $("#proximityDetails");
    var saveCommodity = $("#saveCommodity");
    var conventionFile = $("#conventionFileUri");
    var conventionInputHidden = $("input[name='housingForm.convention.conventionFileUri']");
    var qualityCharterFile = $("#qualityCharterFile");
    var qualityCharterInputHidden = $("input[name='housingForm.housing.partnership.qualityCharterFile']");
    var securityCheckListFile = $("#securityCheckListFile");
    var securityCheckListInputHidden = $("input[name='housingForm.housing.partnership.securityCheckListFile']");
    var kbisFile = $("#kbisFile");
    var kbisInputHidden = $("input[name='housingForm.housing.partnership.kbisFile']");
    var licensingFile = $("#licensingFile");
    var licensingInputHidden = $("input[name='housingForm.housing.partnership.licensingFile']");
    var securityRegistryFile = $("#securityRegistryFile");
    var securityRegistryInputHidden = $("input[name='housingForm.housing.partnership.securityRegistryFile']");
    var insuranceFile = $("#insuranceFileUri");
    var insuranceInputHidden = $("input[name='housingForm.insurance.insuranceFileUri']");

    var rooms = $(".rooms");
    var roomMsg = $("#update-commodity-to-room");
    var roomInput = $("#room-help-input");
    var roomMsg2 = $("#commodity-help-box");

    $("#roomDetails").on("click", ".rooms", function () {
        if ($(this).is(":checked")) {
            var check = roomInput.val();
            if (check != -1) {
                $("#commodity").multiselect('deselectAll', false);
                $("#commodity").multiselect('updateButtonText');
                roomMsg2.html("Impossible de modifier deux chambres simultanément");
                $(this).prop("checked", false);
                resetRoomForm(0, "", null, "");
            } else {
                roomMsg2.html("");
                var ind = parseInt($(this).attr("id"));
                console.log(ind);
                var roomTypeName = $("input[name='housingForm.rooms[" + ind + "].roomTypeName']").val();
                console.log(roomTypeName);
                var price = $("input[name='housingForm.rooms[" + ind + "].price']").val();
                console.log(price);
                var commodityString = $("input[name='housingForm.rooms[" + ind + "].commodityString']").val();
                //console.log(commodityString);
                var commodities = commodityString.split(",");
                //console.log(commodities);
                var number = $("input[name='housingForm.rooms[" + ind + "].number']").val();
                roomInput.val(ind);
                resetRoomForm(roomTypeName, price, commodities, number);
            }
        } else {
            roomMsg2.html("");
            roomInput.val(-1);
            $("#commodity").multiselect('deselectAll', false);
            $("#commodity").multiselect('updateButtonText');
            resetRoomForm(0, "", null, "");
        }
    });

    function resetRoomForm(type, price, commodity, number) {
        roomLabel.val(type);

/*        roomLabel.find("option").filter(function () {
            return this.text == type;
        }).attr('selected', true);*/
        roomPrice.val(price);
        roomNumber.val(number);
        var selectedValues = commodity;
        $("#commodity").multiselect('select', selectedValues);
    }

    $("#send-fax").click(function () {

    });

    $("#send-email").click(function () {

    });

    $("#delete").click(function () {

    });

    $('#convention_startdate').daterangepicker({
            "singleDatePicker": true,
            "locale": {
                "format": 'DD/MM/YYYY'
            }
        },
        function (start, end, label) {
            $('input[name="convention.startDate"]').val(start.format('DD/MM/YYYY'));
        }
    );

    $('#convention_enddate').daterangepicker({
            "singleDatePicker": true,
            "locale": {
                "format": 'DD/MM/YYYY'
            }
        },
        function (start, end, label) {
            $('input[name="convention.endDate"]').val(start.format('DD/MM/YYYY'));
        }
    );

    $('#insurance_startdate').daterangepicker({
            "singleDatePicker": true,
            "locale": {
                "format": 'DD/MM/YYYY'
            }
        },
        function (start, end, label) {
            $('input[name="insurance.startDate"]').val(start.format('DD/MM/YYYY'));
        }
    );

    $('#insurance_enddate').daterangepicker({
            "singleDatePicker": true,
            "locale": {
                "format": 'DD/MM/YYYY'
            }
        },
        function (start, end, label) {
            $('input[name="insurance.endDate"]').val(start.format('DD/MM/YYYY'));
        }
    );

    conventionFile.change(function () {
        var file = conventionFile[0].files[0];
        var fileName = file.name;
        var ext = fileName.split('.').pop();

        switch (ext) {
            case "pdf" :
                loadFile(file, conventionInputHidden);
                break;
            default:
                alert("Veuillez choisir un fichier avec un format correct");
        }
    });

    qualityCharterFile.change(function () {
        var file = qualityCharterFile[0].files[0];
        var fileName = file.name;
        var ext = fileName.split('.').pop();

        switch (ext) {
            case "pdf" :
                loadFile(file, qualityCharterInputHidden);
                break;
            default:
                alert("Veuillez choisir un fichier avec un format correct");
        }
    });

    securityCheckListFile.change(function () {
        var file = securityCheckListFile[0].files[0];
        var fileName = file.name;
        var ext = fileName.split('.').pop();

        switch (ext) {
            case "pdf" :
                loadFile(file, securityCheckListInputHidden);
                break;
            default:
                alert("Veuillez choisir un fichier avec un format correct");
        }
    });

    kbisFile.change(function () {
        var file = kbisFile[0].files[0];
        var fileName = file.name;
        var ext = fileName.split('.').pop();

        switch (ext) {
            case "pdf" :
                loadFile(file, kbisInputHidden);
                break;
            default:
                alert("Veuillez choisir un fichier avec un format correct");
        }
    });

    licensingFile.change(function () {
        var file = licensingFile[0].files[0];
        var fileName = file.name;
        var ext = fileName.split('.').pop();

        switch (ext) {
            case "pdf" :
                loadFile(file, licensingInputHidden);
                break;
            default:
                alert("Veuillez choisir un fichier avec un format correct");
        }
    });

    securityRegistryFile.change(function () {
        var file = securityRegistryFile[0].files[0];
        var fileName = file.name;
        var ext = fileName.split('.').pop();

        switch (ext) {
            case "pdf" :
                loadFile(file, securityRegistryInputHidden);
                break;
            default:
                alert("Veuillez choisir un fichier avec un format correct");
        }
    });

    insuranceFile.change(function () {
        var file = insuranceFile[0].files[0];
        var fileName = file.name;
        var ext = fileName.split('.').pop();

        switch (ext) {
            case "pdf" :
                loadFile(file, insuranceInputHidden);
                break;
            default:
                alert("Veuillez choisir un fichier avec un format correct");
        }
    });

    function loadFile(file, container) {
        var responseText = null;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "/api/v1/files/");

        var form = new FormData();
        form.append('file', file);
        form.append('_csrf', $("input[name='_csrf']").val());

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status != 200) {
                    console.log("Erreur code " + xhr.status);
                } else {
                    if (xhr.responseText != null) {
                        responseText = xhr.responseText;
                        container.val(responseText);
                        console.log(responseText);
                    }

                }
            }
            return xhr.readyState;
        };
        xhr.send(form);

    }

    var sector = $("input[name='housingTypedisplay']").val();

    if (sector) {
        $("select[name='housingForm.housingType']").val(sector);
    } else {
        console.log("No value for sector");
    }


    $('input[type=radio][name="housingForm.housing.deal"]').click(function () {
        var v = parseInt($("input[type=radio][name='housingForm.housing.deal']:checked").attr("v"));
        if (v === 0) {
            $("#partner-block").show();
        } else {
            $("#partner-block").hide();
        }
    });

    $('input[type=radio][name="housingForm.housing.partnership.hasContract"]').click(function () {
        var v = parseInt($("input[type=radio][name='housingForm.housing.partnership.hasContract']:checked").attr("v"));
        if (v === 0) {
            $("#contractRow").show();
        } else {
            $("#contractRow").hide();
        }
    });

    $('input[type=radio][name="housingForm.housing.partnership.hasQualityCharter"]').click(function () {
        var v = parseInt($("input[type=radio][name='housingForm.housing.partnership.hasQualityCharter']:checked").attr("v"));
        if (v === 0) {
            $("#qualityCharterFileContainer").show();
        } else {
            $("#qualityCharterFileContainer").hide();
        }
    });

    $('input[type=radio][name="housingForm.housing.partnership.hasSecurityCheckList"]').click(function () {
        var v = parseInt($("input[type=radio][name='housingForm.housing.partnership.hasSecurityCheckList']:checked").attr("v"));
        if (v === 0) {
            $("#securityCheckListFileContainer").show();
        } else {
            $("#securityCheckListFileContainer").hide();
        }
    });

    $('input[type=radio][name="housingForm.housing.partnership.hasKbis"]').click(function () {
        var v = parseInt($("input[type=radio][name='housingForm.housing.partnership.hasKbis']:checked").attr("v"));
        if (v === 0) {
            $("#kbisFileContainer").show();
        } else {
            $("#kbisFileContainer").hide();
        }
    });

    $('input[type=radio][name="housingForm.housing.partnership.hasLicensing"]').click(function () {
        var v = parseInt($("input[type=radio][name='housingForm.housing.partnership.hasLicensing']:checked").attr("v"));
        if (v === 0) {
            $("#licensingFileContainer").show();
        } else {
            $("#licensingFileContainer").hide();
        }
    });

    $('input[type=radio][name="housingForm.housing.partnership.hasSecurityRegistry"]').click(function () {
        var v = parseInt($("input[type=radio][name='housingForm.housing.partnership.hasSecurityRegistry']:checked").attr("v"));
        if (v === 0) {
            $("#securityRegistryFileContainer").show();
        } else {
            $("#securityRegistryFileContainer").hide();
        }
    });

    $('input[type=radio][name="housingForm.housing.partnership.hasInsurance"]').click(function () {
        var v = parseInt($("input[type=radio][name='housingForm.housing.partnership.hasInsurance']:checked").attr("v"));
        if (v === 0) {
            $("#insuranceRow").show();
        } else {
            $("#insuranceRow").hide();
        }
    });

    addProximity.click(function () {
        addProximityContainer.show();

        addProximityBtn.click(function () {
            if (!addProximitInput.val()) {
                alert("Veuillez renseigner la proximité");
            } else {
                $.ajax({
                    url: "/api/v1/proximities/add",
                    type: "POST",
                    data: {
                        'name': addProximitInput.val(),
                        '_csrf': $("input[name='_csrf']").val()
                    },
                    success: function (data) {
                        console.log(data);
                        var newOption = $('<option>');
                        newOption.text(data.label);
                        newOption.attr('value', data.id);
                        proximitSelect.append(newOption);
                        addProximitInput.val("");
                        addProximityContainer.hide();
                    },
                    error: function (jXHR, textStatus, errorThrown) {
                        console.log("Error");
                    }
                });
            }
        })
    });

    addCommodity.click(function () {
        addCommodityContainer.show();

        addCommodityBtn.click(function () {
            if (!addCommodityInput.val()) {
                alert("Veuillez renseigner la commodité");
            } else {
                $.ajax({
                    url: "/api/v1/commodities/add",
                    type: "POST",
                    data: {
                        'name': addCommodityInput.val(),
                        '_csrf': $("input[name='_csrf']").val()
                    },
                    success: function (data) {
                        console.log(data);
                        var newOption = $('<option>');
                        newOption.text(data.label);
                        newOption.attr('value', data.id);
                        commoditySelect.append(newOption);
                        addCommodityInput.val("");
                        addCommodityContainer.hide();
                    },
                    error: function (jXHR, textStatus, errorThrown) {
                        console.log("Error");
                    }
                });
            }
        })
    });

    saveCommodity.click(function () {
        var id = commoditySelect.val();
        var text = commoditySelect.find('option:selected').text();
        var trCount = $('tbody', tableCommodity).children('tr').length;
        var tr = createTr("commodities" + trCount + ".id", "commodities[" + trCount + "].id", id, text);

        if ($('tbody', tableCommodity).length > 0) {
            $(tableCommodity).append(tr);
        }

        commoditySelect.val(0);
    });

    saveProximity.click(function () {
        var id = proximitSelect.val();
        var text = proximitSelect.find('option:selected').text();
        var trCount = $('tbody', tableProximity).children('tr').length;
        var tr = createTr("housingForm.proximities" + trCount + ".id", "housingForm.proximities[" + trCount + "].id", id, text);

        if ($('tbody', tableProximity).length > 0) {
            $(tableProximity).append(tr);
        }
        proximitSelect.val(0);
    });

    function checkIfRoomTypeExists(value) {
        var bool = false;
        $('#roomDetails > tbody > tr').each(function () {
            if ($(this).find("td").eq(1).html() == value) {
                bool = true;
            }
        });

        return bool;
    }

    saveRoom.click(function () {
        var id = roomLabel.val();
        var text = roomLabel.find('option:selected').text();
        var price = roomPrice.val();
        var commodityString = roomCommodity.val().join();
        var number = roomNumber.val();
        var trCount = 0, tr = null;

        if (parseInt(roomInput.val()) !== -1) {
            roomMsg2.html("");
            trCount = roomInput.val();

            tr = createRoomTypeTr("rooms[" + trCount + "].id", "rooms[" + trCount + "].id", text, price, trCount, commodityString, number);

            if ($('tbody', tableRoom).length > 0) {
                $('#roomDetails > tbody > tr').eq(trCount).remove();
                //if(trCount == 0){
                  //  trCount = 1;
                //}
                $('#roomDetails > tbody > tr').eq(trCount - 1).after(tr);
            }
            roomInput.val(-1);
            roomLabel.val("");
            roomPrice.val("");
            roomNumber.val("");
            $("#commodity").multiselect('deselectAll', false);
            $("#commodity").multiselect('updateButtonText');
        } else {
            if (!checkIfRoomTypeExists(text)) {
                roomMsg2.html("");
                trCount = $('tbody', tableRoom).children('tr').length;
                tr = createRoomTypeTr("rooms[" + trCount + "].id", "rooms[" + trCount + "].id", text, price, trCount, commodityString, number);
                if ($('tbody', tableRoom).length > 0) {
                    $(tableRoom).append(tr);

                }
                roomInput.val(-1);
                roomLabel.val("");
                roomPrice.val("");
                roomNumber.val("");
                $("#commodity").multiselect('deselectAll', false);
                $("#commodity").multiselect('updateButtonText');
            } else {
                roomMsg2.html("Ce type de chambre existe déja dans l'hotel ! Veuillez modifier la chambre existante !");
            }
        }
    });

    function createTr(id, name, value, label) {
        var tr = '<tr>';
        tr += '<input type="hidden" id="' + id + '" name="' + name + '" value="' + value + '">';
        tr += '<td>' + label + '</td>';
        tr += '</tr>';
        return tr;
    }

    function createRoomTypeTr(id, name, roomLabel, roomPrice, index, commodityString, number) {
        var tr = '<tr>';
        tr += '<td>';
        tr += '<input type="hidden" name="housingForm.rooms[' + index + '].id" class="rooms[' + index + ']" value="0">';
        tr += '<input type="hidden" name="housingForm.rooms[' + index + '].roomTypeName" class="rooms[' + index + ']" value="' + roomLabel + '">';
        tr += '<input type="hidden" name="housingForm.rooms[' + index + '].price" class="rooms[' + index + ']" value="' + roomPrice + '">';
        tr += '<input type="hidden" name="housingForm.rooms[' + index + '].commodityString" class="rooms[' + index + ']" value="' + commodityString + '">';
        tr += '<input type="hidden" name="housingForm.rooms[' + index + '].number" class="rooms[' + index + ']" value="' + number + '">';
        tr += '<input type="checkbox" name="rooms[' + index + ']" class="rooms" id="' + index + '">';
        tr += '</td>';
        tr += '<td>' + roomLabel + '</td>';
        tr += '<td>' + roomPrice + '</td>';
        tr += '<td>' + number + '</td>';
        tr += '<td id="commodityRow">' + commodityString + '</td>';
        tr += '</tr>';
        return tr;
    }

});

