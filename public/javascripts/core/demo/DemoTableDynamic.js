(function (namespace, $) {
    "use strict";

    var DemoTableDynamic = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = DemoTableDynamic.prototype;

    // =========================================================================
    // INIT
    // =========================================================================

    p.initialize = function () {
        this._initDataTables();
    };

    // =========================================================================
    // DATATABLES
    // =========================================================================

    p._initDataTables = function () {
        if (!$.isFunction($.fn.dataTable)) {
            return;
        }

        // Init the demo DataTables
        //this._createDataTable1();
        //this._createDataTable2();

        if ($('#datatable1').length > 0) {
            this._createDataTable1();
        } else {
            //console.log("No datatable 1")
        }

        if ($('#sell1').length > 0) {
            this._createDataTable2();
        } else {
            //console.log("No datatable 2")
        }

        if ($('#sell2').length > 0) {
            this._createDataTable7();
        } else {
            //console.log("No datatable 2")
        }

        if ($('#example3').length > 0) {
            this._createDataTable4();
        } else {
            //console.log("No datatable 3")
        }

        if ($('#example1').length > 0) {
           this._createDataTable1();
        } else {
            //console.log("No datatable 4")
        }
    };

    p._createDataTable1 = function () {

        $('#datatable1').DataTable({
            "dom": 'Blfrtip',
            "order": [],
            "pageLength": 100,
            "colVis": {
                "buttonText": "Colonnes",
                "overlayFade": 0,
                "align": "right"
            },
            "fixedHeader": {
                "header": true,
                "headerOffset": 60
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
                "zeroRecords": "Pas de données a afficher",
                "infoEmpty": "Pas de données",
                "emptyTable":     "Pas de données",
                "lengthMenu": '_MENU_ données par page',
                "search": '<i class="fa fa-search"></i>',
                "paginate": {
                    "previous": '<i class="fa fa-angle-left"></i>',
                    "next": '<i class="fa fa-angle-right"></i>'
                }
            }
        });

        /*		$('#datatable1 tbody').on('click', 'tr', function() {
         $(this).toggleClass('selected');
         });*/
    };

    p._createDataTable2 = function () {
        var table = $('#sell1').DataTable({
            "dom": 'Blfrtip',
            "order": [],
            "scrollY": '30vh',
            "scrollCollapse": true,
            "paging": false,
            "pageLength": 10,
            "deferRender": true,
            "colVis": {
                "buttonText": "Colonnes",
                "overlayFade": 0,
                "align": "right"
            },
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                }
            ],
            "destroy": true,
            "fixedHeader": {
                "header": true,
                "headerOffset": 60
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
                "zeroRecords": "Pas de données a afficher",
                "infoEmpty": "Pas de données",
                "emptyTable":     "Pas de données",
                "lengthMenu": '_MENU_ données par page',
                "search": '<i class="fa fa-search"></i>',
                "paginate": {
                    "previous": '<i class="fa fa-angle-left"></i>',
                    "next": '<i class="fa fa-angle-right"></i>'
                }
            }
        });
    };

    p._createDataTable7 = function () {
        var table = $('#sell2').DataTable({
            "dom": 'Blfrtip',
            "order": [],
            "scrollY": '30vh',
            "scrollCollapse": true,
            "paging": false,
            "pageLength": 10,
            "deferRender": true,
            "colVis": {
                "buttonText": "Colonnes",
                "overlayFade": 0,
                "align": "right"
            },
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                }
            ],
            "destroy": true,
            "fixedHeader": {
                "header": true,
                "headerOffset": 60
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
                "zeroRecords": "Pas de données a afficher",
                "infoEmpty": "Pas de données",
                "emptyTable":     "Pas de données",
                "lengthMenu": '_MENU_ données par page',
                "search": '<i class="fa fa-search"></i>',
                "paginate": {
                    "previous": '<i class="fa fa-angle-left"></i>',
                    "next": '<i class="fa fa-angle-right"></i>'
                }
            }
        });
    };


    p._createDataTable3 = function () {

        //
        // Pipelining function for DataTables. To be used to the `ajax` option of DataTables
        //
/*        $.fn.dataTable.pipeline = function (opts) {
            // Configuration options
            var conf = $.extend({
                pages: 5,     // number of pages to cache
                url: '/backend/fetch/data',      // script url
                data: null,   // function or object with parameters to send to the server
                              // matching how `ajax.data` works in DataTables
                method: 'GET' // Ajax HTTP method
            }, opts);

            // Private variables for storing the cache
            var cacheLower = -1;
            var cacheUpper = null;
            var cacheLastRequest = null;
            var cacheLastJson = null;

            return function (request, drawCallback, settings) {
                var ajax = false;
                var requestStart = request.start;
                var drawStart = request.start;
                var requestLength = request.length;
                var requestEnd = requestStart + requestLength;

                if (settings.clearCache) {
                    // API requested that the cache be cleared
                    ajax = true;
                    settings.clearCache = false;
                }
                else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
                    // outside cached data - need to make a request
                    ajax = true;
                }
                else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
                    JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
                    JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
                ) {
                    // properties changed (ordering, columns, searching)
                    ajax = true;
                }

                // Store the request for checking next time around
                cacheLastRequest = $.extend(true, {}, request);

                if (ajax) {
                    // Need data from the server
                    if (requestStart < cacheLower) {
                        requestStart = requestStart - (requestLength * (conf.pages - 1));

                        if (requestStart < 0) {
                            requestStart = 0;
                        }
                    }

                    cacheLower = requestStart;
                    cacheUpper = requestStart + (requestLength * conf.pages);

                    request.start = requestStart;
                    request.length = requestLength * conf.pages;

                    // Provide the same `data` options as DataTables.
                    if ($.isFunction(conf.data)) {
                        // As a function it is executed with the data object as an arg
                        // for manipulation. If an object is returned, it is used as the
                        // data object to submit
                        var d = conf.data(request);
                        if (d) {
                            $.extend(request, d);
                        }
                    }
                    else if ($.isPlainObject(conf.data)) {
                        // As an object, the data given extends the default
                        $.extend(request, conf.data);
                    }

                    settings.jqXHR = $.ajax({
                        "type": conf.method,
                        "url": conf.url,
                        "data": request,
                        "cache": false,
                        "success": function (json) {
                            cacheLastJson = $.extend(true, {}, json);

                            if (cacheLower != drawStart) {
                                json.data.splice(0, drawStart - cacheLower);
                            }
                            if (requestLength >= -1) {
                                json.data.splice(requestLength, json.data.length);
                            }

                            drawCallback(json);
                        }
                    });
                } else {
                    var json = $.extend(true, {}, cacheLastJson);
                    json.draw = request.draw; // Update the echo for each response
                    json.data.splice(0, requestStart - cacheLower);
                    json.data.splice(requestLength, json.data.length);

                    drawCallback(json);
                }
            }
        };*/

        // Register an API method that will empty the pipelined data, forcing an Ajax
        // fetch on the next draw (i.e. `table.clearPipeline().draw()`)
/*        $.fn.dataTable.Api.register('clearPipeline()', function () {
            return this.iterator('table', function (settings) {
                settings.clearCache = true;
            });
        });*/

        var table =  $('#example1').DataTable({
            dom: 'Blfrtip',
            order: [],
            serverSide: true,
            processing: true,
            searching: true,
            ordering: false,
            paging: true,
            deferLoading: 90,
            select: true,
            ajax: {
                url: '/backend/fetch/data',
                dataSrc: 'data',
                "data" : function ( d ) {
                    var _customParams = [];
                    var _startDate = $('#sDate').val();
                    var _endDate = $('#eDate').val();

                    if(_startDate.length > 0){
                        _customParams.push(_startDate);
                    }

                    if(_endDate.length > 0){
                        _customParams.push(_endDate);
                    }

                    d.mode = 0;
                    if(_customParams.length > 0){
                        d.iSpecialParameter = $('#iSpecialParameter').val();
                        d.vSpecialParameters = _customParams;
                    }
                }
            },
/*            ajax: $.fn.dataTable.pipeline( {
                url: '/backend/fetch/data',
                pages: 5 // number of pages to cache
            } ),*/
            columnDefs: [
                {
                    targets: [0],
                    name: 'date',
                    visible: false,
                    searchable: false
                },
                {
                    targets: [1],
                    name: 'date',
                    searchable: false
                },
                {
                    targets: [2],
                    name: 'order.chrono',
                    searchable: false
                },
                {
                    targets: [3],
                    name: 'numBill',
                    searchable: true
                },
                {
                    targets: [4],
                    name: 'agent.nickName',
                    searchable: true
                },
                {
                    targets: [5],
                    name: 'customerAlias',
                    searchable: true
                },
                {
                    targets: [6],
                    name: 'customer.titleCustomerType',
                    searchable: false
                },
                {
                    targets: [7],
                    name: 'totalPrice',
                    searchable: false
                },
                {
                    targets: [8],
                    name: 'skus_f',
                    defaultContent: 0,
                    searchable: false
                },
                {
                    targets: [9],
                    name: 'skus_d',
                    defaultContent: 0,
                    searchable: false
                },
                {
                    targets: [10],
                    name: 'lat',
                    defaultContent: 0,
                    searchable: false
                }
            ],
            columns: [
                {data: 'order.date'},
                {data: 'dateToDisplay'},
                {data: 'order.chrono'},
                {data: 'numBill'},
                {data: 'agentnickName'},
                {data: 'customerAlias'},
                {data: 'customertitleCustomerType'},
                {data: 'totalPriceToDisplay'},
                {data: null},
                {data: null},
                {data: 'position'}
            ],
            scrollY: '30vh',
            scrollCollapse: true,
            deferRender: true,
            scroller: {
                loadingIndicator: true
            },
            destroy: true,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Exporter en Excel',
                    exportOptions: {
                        columns: "thead th:not(.noExport)"
                    }
                }
            ],
            language: {
                zeroRecords: "Pas de données a afficher",
                infoEmpty: "Pas de données",
                emptyTable: "Pas de données",
                lengthMenu: '_MENU_ données par page',
                search: '<i class="fa fa-search"></i>',
                loadingRecords: 'Chargement des données, veuillez patienter ! '
            }
        });

        var searchInput = $('#example1_filter input');
        searchInput.unbind();
        searchInput.keyup( function (e) {
            if (e.keyCode == 13) {
                table.search( this.value ).draw();
            }
            //else if()
        } );

        var table2 = $('#example3').DataTable();
        table.on( 'select', function ( e, dt, type, indexes ) {
            //alert("OK");
            if ( type === 'row' ) {
                var _idRow = table[ type ]( indexes ).nodes().to$().attr( 'id' );
                console.log("ID ROW -->"+_idRow);
                $('#iSpecialParameter1').val(_idRow);
                table2.draw();
            }
        } );
    };

    p._createDataTable4 = function () {

        var _customParamsOr = [];
        var table2 = $('#example3').DataTable({
            dom: 'Blfrtip',
            order: [],
            serverSide: true,
            processing: true,
            searching: true,
            ordering: false,
            paging: true,
            ajax: {
                url: '/backend/fetch/orderlines',
                dataSrc: 'data',
                "data" : function ( d ) {
                    var _sParameter = $('#iSpecialParameter1').val();

                    if(_sParameter != "null"){
                        _customParamsOr.push(_sParameter);
                    }

                    d.mode = 0;
                    if(_customParamsOr.length > 0){
                        d.vSpecialParameters = _customParamsOr;
                    }
                }
            },
            columnDefs: [
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
                    name: 'bill.agentName',
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
                    searchable: true
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
            ],
            columns: [
                {data: 'order.numOrder'},
                {data: 'order.date'},
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
            ],
            scrollY: '200',
            deferRender: true,
            scroller: {
                loadingIndicator: true
            },
            destroy: true,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Exporter en Excel',
                    exportOptions: {
                        columns: "thead th:not(.noExport)"
                    }
                }
            ],
            language: {
                zeroRecords: "Pas de données a afficher",
                infoEmpty: "Pas de données",
                emptyTable: "Pas de données",
                lengthMenu: '_MENU_ données par page',
                search: '<i class="fa fa-search"></i>',
                loadingRecords: 'Chargement des données, veuillez patienter ! '
            }
        });
    };

    // =========================================================================
    // DETAILS
    // =========================================================================

    p._formatDetails = function (d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>Full name:</td>' +
            '<td>' + d.name + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Extension number:</td>' +
            '<td>' + d.extn + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Extra info:</td>' +
            '<td>And any further details here (images etc)...</td>' +
            '</tr>' +
            '</table>';
    };

    // =========================================================================
    namespace.DemoTableDynamic = new DemoTableDynamic;
}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):
