/**
 * Created by ROMUALD on 27/06/2017.
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

        var cBalanceTableId = "#cbalances";
        var cBalanceTable = $('' + cBalanceTableId + '').DataTable();
        if (cBalanceTableId.length > 0) {
            createCustomerBalanceTable(cBalanceTableId);
            cBalanceTable = $('' + cBalanceTableId + '').DataTable();

            $("#search").click(function () {
                var values = $("#agents").val();
                if (values === null) {
                    warningMsg("Veuillez sélectionner des commeeciaux");
                }

                if (cBalanceTable != null) cBalanceTable.draw();
            });
        }

        var agentStatTableId = "#agentStats";
        if (agentStatTableId.length > 0) {
            createAgentStatBalanceTable(agentStatTableId);

            var $Modal = null;
            var $ModalContent = null;
            var object = null;

            $(".table-responsive").on("click", ".ediM,.addM", function () {
                $Modal = $("#editModal");
                $ModalContent = $Modal.find("#editmodone");
                object = null;
                var isNew = false;
                var obj_id = $(this).attr("id");

                if (typeof obj_id === 'undefined') {
                    isNew = true;
                    obj_id = 0;
                    $ModalContent.find("#agent-container").css("display", "block");
                    $ModalContent.find("select[id='object_agentId']").val(0);
                    $ModalContent.find("input[id='object_paymentGoal']").val("");
                    $ModalContent.find("input[id='object_saleGoal']").val("");
                    $ModalContent.find("input[id='object_unpaidGoal']").val("");
                } else {
                    object = JSON.parse($("#" + obj_id).attr("data"));
                    $ModalContent.find("#agent-container").css("display", "none");
                    $ModalContent.find("select[id='object_agentId']").val(0);
                    $ModalContent.find("input[id='object_paymentGoal']").val(object.paymentGoal);
                    $ModalContent.find("input[id='object_saleGoal']").val(object.saleGoal);
                    $ModalContent.find("input[id='object_unpaidGoal']").val(object.unpaidGoal);
                }
                $("#send-modifs").click(function () {

                    var form = $ModalContent.find('.form-validation');

                    var valid = form.valid();

                    if (!valid) {
                        form.data('validator').focusInvalid();
                        warningMsg("Veuillez bien remplir les champs");
                        return false;
                    }

                    var paymentGoal = $ModalContent.find("input[id='object_paymentGoal']").val();
                    var saleGoal = $ModalContent.find("input[id='object_saleGoal']").val();
                    var unpaidGoal = $ModalContent.find("input[id='object_unpaidGoal']").val();
                    var token = $ModalContent.find("input[name='authenticityToken']").val();
                    var agentId = 0;
                    if (isNew) {
                        agentId = $ModalContent.find("select[id='object_agentId']").val();
                    }

                    $("#loader").css("display", "block");
                    $("#edicontent").css("display", "none");
                    $("#send-modifs").html("Veuillez patienter...").attr("disabled", true);
                    infoMsgFix("Envoi des données en cours, Veuillez patienter ! ", "Informations");
                    $.ajax({

                        url: getFinalUrl('reports/update'),
                        type: 'post',
                        data: {
                            authenticityToken: token,
                            id: obj_id,
                            paymentGoal: paymentGoal,
                            saleGoal: saleGoal,
                            unpaidGoal: unpaidGoal,
                            agentId: agentId
                        },
                        success: function (data) {
                            if (data.error == false) {
                                setTimeout(function () {
                                    $("#loader").css("display", "none");
                                    $("#edicontent").css("display", "block");
                                    $("#send-modifs").html("Modifier").attr("disabled", false);
                                    successMsgFix("Envoi des informations réussi. <br/> La page va se rafraichir");
                                    setTimeout("window.location.replace(getFinalUrl('reports'));", 2000);
                                }, 3000);
                            } else {
                                setTimeout(function () {
                                    $("#loader").css("display", "none");
                                    $("#edicontent").css("display", "block");
                                    $("#send-modifs").html("Modifier").attr("disabled", false);
                                    errorMsg("La session a expiré. Veuillez rafraichir la page !");
                                }, 3000);
                            }
                        }
                    });

                });

            });

            $(".table-responsive").on("click", ".vieM", function () {
                $Modal = $("#viewModal");
                $ModalContent = $Modal.find("#viewmodone");
                object = null;
                var obj_id = $(this).attr("id");

                object = JSON.parse($("#" + obj_id).attr("data"));
                if (object !== null) {

                }
                $ModalContent.find("#agentNickName").html(object.agentNickName);
                $ModalContent.find("#totalUnpaid").html(object.unpaid);
                $ModalContent.find("#totalStock").html(object.totalStock);
                $ModalContent.find("#paymentg").html(object.paymentGoal);
                $ModalContent.find("#saleg").html(object.saleGoal);
                $ModalContent.find("#unpaidg").html(object.unpaidGoal);
                $ModalContent.find("#lprocure").html(object.limitProcure);
            });
        }

        function createCustomerBalanceTable(cBalanceTableId) {
            var cBalanceDataFunc = function (d) {
                var _customParamsOr = [];
                var _sParameter = $("#agents").val();
                console.log("_sParameter-->" + _sParameter);
                if (typeof _sParameter !== 'undefined' && _sParameter !== null) {
                    if (_sParameter.length > 0) _customParamsOr = $("#agents").val();

                }
                console.log("_customParamsOr-->" + _customParamsOr);
                d.vSpecialParameters = _customParamsOr;
                $("#tableConfig").val(JSON.stringify(d));
            };

            var cBalanceColumnsDefs = [
                {
                    targets: [0],
                    name: 'agentName',
                    searchable: true
                },
                {
                    targets: [1],
                    name: 'customerSerial',
                    searchable: false
                },
                {
                    targets: [2],
                    name: 'customerNickName',
                    searchable: false
                },
                {
                    targets: [3],
                    name: 'customerSaleLimit',
                    searchable: false
                },
                {
                    targets: [4],
                    name: 'customerSale',
                    searchable: false
                },
                {
                    targets: [5],
                    name: 'customerSale30',
                    searchable: false
                },
                {
                    targets: [6],
                    name: 'customerSale60',
                    searchable: false
                },
                {
                    targets: [7],
                    name: 'customerSale90',
                    searchable: false
                },
                {
                    targets: [8],
                    name: 'customerSale91',
                    searchable: false
                },
                {
                    targets: [9],
                    name: 'agentId',
                    visible: false,
                    searchable: false
                }
            ];

            var cBalanceColumns = [
                {data: 'agentName'},
                {data: 'customerSerialDisplay'},
                {data: 'customerNickNameDisplay'},
                {data: 'customerSaleLimitDisplay'},
                {data: 'customerSaleDisplay'},
                {data: 'customerSale30Display'},
                {data: 'customerSale60Display'},
                {data: 'customerSale90Display'},
                {data: 'customerSale91Display'},
                {data: 'agentId'}
            ];

            var cBalanceCreatedRowFunc = function (row, data, index) {
                $('td', row).eq(3).attr('style', 'text-align: right');
                $('td', row).eq(4).attr('style', 'text-align: right');
                $('td', row).eq(5).attr('style', 'text-align: right');
                $('td', row).eq(7).attr('style', 'text-align: right');
                $('td', row).eq(7).attr('style', 'text-align: right');
                $('td', row).eq(8).attr('style', 'text-align: right');

                if (data.customerSerialDisplay === "Total C.") {
                    $(row).attr('style', 'font-size: 15px; font-weight: bold; background-color: beige;');
                }
            };

            new AppDatatable.simpleTable(cBalanceTableId, "/backend/fetch/cbalances", true, false,
                "data", cBalanceDataFunc, cBalanceColumnsDefs, cBalanceColumns, null, false, cBalanceCreatedRowFunc);
        }

        function createAgentStatBalanceTable(agentStatTableId) {
            var agentStatDataFunc = function (d) {
                var _customParamsOr = [];
                d.vSpecialParameters = _customParamsOr;
                $("#tableConfig").val(JSON.stringify(d));
            };

            var agentStatColumnsDefs = [
                {
                    targets: [0],
                    name: 'agentNickName',
                    searchable: true
                },
                {
                    targets: [1],
                    name: 'unpaid',
                    searchable: false
                },
                {
                    targets: [2],
                    name: 'payment',
                    searchable: false
                },
                {
                    targets: [3],
                    name: 'sale',
                    searchable: false
                },
                {
                    targets: [4],
                    name: 'limitProcure',
                    searchable: false
                },
                {
                    targets: [5],
                    name: 'actionsButtons',
                    searchable: false
                }
            ];

            var agentStatColumns = [
                {data: 'agentNickName'},
                {data: 'unpaidDisplay'},
                {data: 'paymentDisplay'},
                {data: 'saleDisplay'},
                {data: 'limitProcureDisplay'},
                {data: 'actionsButtons'}
            ];

            var agentStatCreatedRowFunc = function (row, data, index) {
                $(row).attr('id', '' + data.id);
                $(row).attr('data', '' + JSON.stringify(data) + '');
                $('td', row).eq(1).attr('style', 'text-align: right');
                $('td', row).eq(2).attr('style', 'text-align: right');
                $('td', row).eq(3).attr('style', 'text-align: right');
                $('td', row).eq(4).attr('style', 'text-align: right');
            };

            new AppDatatable.simpleTable(agentStatTableId, "/backend/fetch/agentstats", true, false,
                "data", agentStatDataFunc, agentStatColumnsDefs, agentStatColumns, null, false, agentStatCreatedRowFunc);
        }
    }
);

