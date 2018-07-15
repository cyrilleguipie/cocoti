$(function () {

    var orderlinesTableId = "#orderlines"; //createOrderlineTable
    if (orderlinesTableId.length > 0) {
        createOrderlineTable(orderlinesTableId);
    }

    var billTableId = "#bills";
    var mode = parseInt($('#mode').val());

    if (billTableId.length > 0) {
        createBillTable(billTableId, mode);

        $("#sync").click(function () {
            infoMsgFix("Envoi des données en cours, Veuillez patienter ! ", "Informations");
            $.ajax({
                url: '/backend/reload/dolphin',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (!data.error) {
                        setTimeout(function () {
                            successMsg("La synchronisation a été lancée !!");
                            setTimeout("window.location.replace('/backend/procures');", 2000);
                        }, 3000);
                    } else {
                        errorMsg("La session a expiré. Veuillez rafraichir la page !");
                    }
                }
            });
        });

        $(".table-responsive").on("click", ".resend", function () {
            var obj_id = $(this).attr("id");
            infoMsgFix("Envoi des données en cours, Veuillez patienter ! ", "Informations");
            $.ajax({
                url: '/backend/resend/dolphin',
                type: 'post',
                data: {
                    id: obj_id
                },
                success: function (data) {
                    if (!data.error) {
                        setTimeout(function () {
                            successMsg("Le renvoi de la commmande a été lancée !!");
                            setTimeout("window.location.replace('/backend/commands');", 2000);
                        }, 3000);
                    } else {
                        errorMsg("La session a expiré. Veuillez rafraichir la page !");
                    }
                }
            });
        });
    }

    //var now = new Date();
    var dataTable = $('#bills').DataTable();

    $('#s-date').datepicker({
        language: 'fr',
        format: 'dd/mm/yyyy',
        pickTime: true,
        pickSeconds: false,
        pick12HourFormat: false,
        //endDate: now,
        autoclose: true,
        todayHighlight: true
    });

    $('#e-date').datepicker({
        language: 'fr',
        format: 'dd/mm/yyyy',
        pickTime: true,
        pickSeconds: false,
        pick12HourFormat: false,
        //endDate: now,
        autoclose: true,
        todayHighlight: true
    });

    $('#search').click(function () {
        var startDate = $('#s-date').datepicker('getDate');
        var endDate = $('#e-date').datepicker('getDate');
        if (startDate != "Invalid Date" && endDate != "Invalid Date") {
            $('#reset').attr("disabled", false);
            dataTable.draw();
        } else {
            warningMsg("Aucune date sélectionnée");
        }
    });

    $('#reset').click(function () {
        $('#s-date').datepicker('setDate', "");
        $('#e-date').datepicker('setDate', "");
        dataTable.draw();
        $('#reset').attr("disabled", true);
    });

    function createBillTable(tableId, mode) {
        var submitSearchBills = [];
        var columnsDefs = [];
        var columns = [];
        var scrollX = false;
        var createdRowFunc = null;

        var billDataFunc = function (d) {
            var _customParams = [];
            var _startDate = $('#sDate').val();
            var _endDate = $('#eDate').val();
            if (_startDate.length > 0) {
                _customParams.push(_startDate);
            }
            if (_endDate.length > 0) {
                _customParams.push(_endDate);
            }
            d.mode = parseInt($('#mode').val());
            if (_customParams.length > 0) {
                d.iSpecialParameter = $('#iSpecialParameter').val();
                d.vSpecialParameters = _customParams;
            }
            $("#billConfig").val(JSON.stringify(d));
        };

        if (mode === 0) {
            scrollX = true;
            columnsDefs = [
                {
                    targets: [0],
                    name: 'date',
                    searchable: false
                },
                {
                    targets: [1],
                    name: 'order.chrono',
                    searchable: false
                },
                {
                    targets: [2],
                    name: 'numBill',
                    searchable: true
                },
                {
                    targets: [3],
                    name: 'agent.nickName',
                    searchable: true
                },
                {
                    targets: [4],
                    name: 'customerAlias',
                    searchable: false
                },
                {
                    targets: [5],
                    name: 'customer.titleCustomertype',
                    searchable: false
                },
                {
                    targets: [6],
                    name: 'totalPrice',
                    searchable: false
                },
                {
                    targets: [7],
                    name: 'skus_f',
                    searchable: false
                },
                {
                    targets: [8],
                    name: 'skus_d',
                    searchable: false
                },
                {
                    targets: [9],
                    name: 'position',
                    searchable: false
                }
            ];

            columns = [
                {data: 'dateDisplay'},
                {data: 'order.chrono'},
                {data: 'numBill'},
                {data: 'agentnickName'}, //
                {data: 'customerAlias'},
                {data: 'customertitleCustomerType'},
                {data: 'totalPriceToDisplay'},
                {data: 'skus_display'},
                {data: 'skus_display'},
                {data: 'position'}
            ];

            createdRowFunc = function (row, data, index) {
                $('td', row).eq(6).attr('style', 'text-align: right');
                $('td', row).eq(9).attr('style', 'text-align: right');
            };
        } else if (mode === 1) {
            columnsDefs = [
                {
                    targets: [0],
                    name: 'date',
                    searchable: false
                },
                {
                    targets: [1],
                    name: 'updatedDate',
                    searchable: false
                },
                {
                    targets: [2],
                    name: 'numBill',
                    searchable: true
                },
                {
                    targets: [3],
                    name: 'agent.nickName',
                    searchable: true
                },
                {
                    targets: [4],
                    name: 'customer.titleCustomertype',
                    searchable: false
                },
                {
                    targets: [5],
                    name: 'statut',
                    searchable: false
                },
                {
                    targets: [6],
                    name: 'totalPrice',
                    searchable: false
                }
            ];

            columns = [
                {data: 'dateDisplay'},
                {data: 'updatedDateDisplay'},
                {data: 'numBill'},
                {data: 'agentnickName'},
                {data: 'customertitleCustomerType'},
                {data: 'statusDisplay'},
                {data: 'totalPriceToDisplay'}
            ];

            createdRowFunc = function (row, data, index) {
                $('td', row).eq(6).attr('style', 'text-align: right');
            };
        } else {
            columnsDefs = [
                {
                    targets: [0],
                    name: 'date',
                    searchable: false
                },
                {
                    targets: [1],
                    name: 'numBill',
                    searchable: true
                },
                {
                    targets: [2],
                    name: 'agent.nickName',
                    searchable: true
                },
                {
                    targets: [3],
                    name: 'customer.titleCustomertype',
                    searchable: false
                },
                {
                    targets: [4],
                    name: 'totalPrice',
                    searchable: false
                },
                {
                    targets: [5],
                    name: 'inRoad',
                    searchable: false
                },
                {
                    targets: [6],
                    name: 'order.id',
                    searchable: false
                },
                {
                    targets: [7],
                    name: 'balance',
                    searchable: false
                },
                {
                    targets: [8],
                    name: 'statut',
                    searchable: false
                }
            ];

            columns = [
                {data: 'dateDisplay'},
                {data: 'numBill'},
                {data: 'agentnickName'},
                {data: 'customertitleCustomerType'},
                {data: 'totalPriceToDisplay'},
                {data: 'skus_display'},
                {data: 'dcXxxxDisplay'},
                {data: 'statusCommandDisplay'},
                {data: 'actionsCommandDisplay'}
            ];

            createdRowFunc = function (row, data, index) {
                $('td', row).eq(4).attr('style', 'text-align: right');
                $('td', row).eq(8).attr('class', 'status');
            };
        }

        var billParams = function () {
            var table = $('#bills').DataTable();
            /*        var searchInput = $('#test1_filter input');
                    searchInput.unbind();
                    searchInput.keyup(function (e) {
                        if (e.keyCode == 13) {
                            table.search(this.value).draw();
                        }
                    });*/

            var table2 = $('#orderlines').DataTable();
            table.on('select', function (e, dt, type, indexes) {
                if (type === 'row') {
                    var _idRow = table[type](indexes).nodes().to$().attr('id');
                    submitSearchBills.push(_idRow);
                    $('#iSpecialParameter1').val(submitSearchBills);
                    table2.draw();
                }
            });

            table.on('deselect', function (e, dt, type, indexes) {
                if (type === 'row') {
                    var _idRow = table[type](indexes).nodes().to$().attr('id');
                    submitSearchBills = jQuery.grep(submitSearchBills, function (value) {
                        return value !== _idRow;
                    });
                    if (submitSearchBills.length <= 0) {
                        $('#iSpecialParameter1').val("null");
                    } else {
                        $('#iSpecialParameter1').val(submitSearchBills);
                    }
                    table2.draw();
                }
            });
        };

        var agentStatCreatedRowFunc = function (row, data, index) {
            $(row).attr('id', '' + data.id);
            $(row).attr('data', '' + JSON.stringify(data) + '');
            $('td', row).eq(1).attr('style', 'text-align: right');
            $('td', row).eq(2).attr('style', 'text-align: right');
            $('td', row).eq(3).attr('style', 'text-align: right');
            $('td', row).eq(4).attr('style', 'text-align: right');
        };

        new AppDatatable.scrollySpecialTable(tableId, "/backend/fetch/data", true, true,
            "data", billDataFunc, columnsDefs, columns, billParams, submitSearchBills, scrollX, createdRowFunc);
    }

    function createOrderlineTable(tableId) {
        var orderlinesDataFunc = function (d) {
            var _customParamsOr = [];
            var _sParameter = $('#iSpecialParameter1').val();

            if (_sParameter != "null") {
                //_customParamsOr.push(_sParameter);
                _customParamsOr = _sParameter.split(",");
            }

            d.mode = parseInt($('#mode').val());
            if (_customParamsOr.length > 0) {
                d.vSpecialParameters = _customParamsOr;
            }
            $("#orderlineConfig").val(JSON.stringify(d));
        };

        var orderlinesColumnsDefs = [
            {
                targets: [0],
                name: 'numOrder',
                searchable: true
            },
            {
                targets: [1],
                name: 'date',
                searchable: false
            },
            {
                targets: [2],
                name: 'bill.nickName',
                searchable: false
            },
            {
                targets: [3],
                name: 'bill.customerAlias',
                searchable: false
            },
            {
                targets: [4],
                name: 'product.title',
                searchable: true
            },
            {
                targets: [5],
                name: 'product.titleCategorie',
                searchable: true
            },
            {
                targets: [6],
                name: 'product.numberOfPieces',
                searchable: false
            },
            {
                targets: [7],
                name: 'titleQuantityUnit',
                searchable: false
            },
            {
                targets: [8],
                name: 'unitPrice',
                searchable: false
            },
            {
                targets: [9],
                name: 'totalQuantity',
                searchable: false
            },
            {
                targets: [10],
                name: 'totalPrice',
                searchable: false
            }
        ];

        var orderlinesColumns = [
            {data: 'order.numOrder'},
            {data: 'dateToDisplay'},
            {data: 'bill_agentName'},
            {data: 'bill_customerAlias'},
            {data: 'product.title'},
            {data: 'product.titleCategory'},
            {data: 'product.numberOfPieces'},
            {data: 'quantityUnitDisplay'},
            {data: 'saleTypeDisplay'},
            {data: 'unitPriceToDisplay'},
            {data: 'totalQuantity'},
            {data: 'totalPriceToDisplay'}
        ];

        new AppDatatable.scrollySimpleTable(tableId, "/backend/fetch/orderlines", true, false,
            "data", orderlinesDataFunc, orderlinesColumnsDefs, orderlinesColumns, null);
    }
});



