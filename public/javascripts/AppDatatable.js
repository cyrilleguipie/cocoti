// =========================================================================
// DATATABLES SERVER-SIDE
// =========================================================================

var AppDatatable = {

    container: null,
    ajaxUri: null,
    searching: true,
    select: false,
    dataSrc: "data",
    dataFunc: null,
    columnsDefs: null,
    columns: null,
    params: null,
    pageLength: 100,

    scrollySimpleTable: function (container, ajaxUri, searching, select, dataSrc, dataFunc,
                                  columnsDefs, columns, params, createdRowFunc) {

        if (typeof container === 'undefined' || container === null
            || typeof ajaxUri === 'undefined' || ajaxUri === null
            || typeof dataFunc === 'undefined' || dataFunc === null
            || typeof columnsDefs === 'undefined' || columnsDefs === null
            || typeof columns === 'undefined' || columns === null) {
            return;
        }

        this.container = container;
        this.ajaxUri = ajaxUri;
        this.searching = searching;
        this.select = select;
        this.dataSrc = dataSrc;
        this.dataFunc = dataFunc;
        this.columnsDefs = columnsDefs;
        this.columns = columns;
        this.params = params;

        if (!$.isFunction($.fn.dataTable)) {
            return;
        }

        $('' + this.container + '').DataTable({
            dom: 'Blfrtip',
            order: [],
            serverSide: true,
            processing: true,
            searching: this.searching,
            ordering: false,
            paging: true,
            pageLength: 100,
            deferLoading: 90,
            select: this.select,
            rowId: 'DT_RowId',
            ajax: {
                url: this.ajaxUri,
                type: 'POST',
                dataSrc: this.dataSrc,
                "data": this.dataFunc
            },
            columnDefs: this.columnsDefs,
            columns: this.columns,
            scrollY: '200',
            scrollX: true,
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
                    },
                    action: function (e, dt, node, config) {
                        var _config = $("#orderlineConfig").val();
                        var path = $("#exportOrderlinePath").val();
                        if (_config === null || typeof _config === 'undefined'
                            || typeof path === 'undefined' || path === null) {
                            return false;
                        } else {
                            _config = JSON.parse(_config);
                            infoMsgFix("Export des données en cours, Veuillez patienter ! ", "Informations");
                            $.ajax({
                                url: path,
                                type: 'post',
                                data: _config,
                                failure: function () {
                                    errorMsg("La session a expiré. Veuillez rafraichir la page !");
                                    return false;
                                },
                                success: function (object) {
                                    console.log(object);
                                    if (object.error) {
                                        setTimeout(function () {
                                            errorMsg("Une erreur est survenue lors de l'envoi de la requete ! <br/>Veuillez contacter l'équipe technique");
                                            return false;
                                        }, 3000);
                                    } else {
                                        setTimeout(function () {
                                            var link = null;
                                            if (object.data === "") {
                                                infoMsg("Aucune donnée a exporter !! ");
                                            } else {
                                                link = '<a href="../' + object.data + '" ' +
                                                    'class= "btn btn-block ink-reaction btn-flat btn-accent" target="_blank"><b>Télecharger le fichier</b></a>';
                                                successMsgFix("Export des données réussi. <br/>" + link + "");
                                            }
                                            return false;
                                        }, 3000);
                                    }
                                }
                            });
                        }
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
            },
            createdRow: createdRowFunc
        });

        if (params !== null) {
            params();
        }
    },
    scrollySpecialTable: function (container, ajaxUri, searching, select, dataSrc, dataFunc,
                                   columnsDefs, columns, params, submitSearchBills, scrollX, createdRowFunc) {

        if (typeof container === 'undefined' || container === null
            || typeof ajaxUri === 'undefined' || ajaxUri === null
            || typeof dataFunc === 'undefined' || dataFunc === null
            || typeof columnsDefs === 'undefined' || columnsDefs === null
            || typeof columns === 'undefined' || columns === null) {
            return;
        }


        this.container = container;
        this.ajaxUri = ajaxUri;
        this.searching = searching;
        this.select = select;
        this.dataSrc = dataSrc;
        this.dataFunc = dataFunc;
        this.columnsDefs = columnsDefs;
        this.columns = columns;
        this.params = params;

        if (!$.isFunction($.fn.dataTable)) {
            return;
        }


        $('' + this.container + '').DataTable({
            dom: 'Blfrtip',
            order: [],
            serverSide: true,
            processing: true,
            searching: this.searching,
            ordering: false,
            paging: true,
            pageLength: 100,
            deferLoading: 90,
            select: {
                style: 'multi',
                selector: 'td:not(.status)'
            },
            rowId: 'DT_RowId',
            ajax: {
                url: this.ajaxUri,
                type: 'POST',
                dataSrc: this.dataSrc,
                "data": this.dataFunc
            },
            columnDefs: this.columnsDefs,
            columns: this.columns,
            /*            fixedHeader: {
                            header: true,
                            headerOffset: 60
                        },*/
            scrollY: '200',
            scrollX: scrollX,
            //scrollCollapse: true,
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
                    },
                    action: function (e, dt, node, config) {
                        var _config = $("#billConfig").val();
                        var path = $("#exportBillPath").val();
                        if (_config === null || typeof _config === 'undefined'
                            || typeof path === 'undefined' || path === null) {
                            return false;
                        } else {
                            _config = JSON.parse(_config);
                            infoMsgFix("Export des données en cours, Veuillez patienter ! ", "Informations");
                            $.ajax({
                                url: path,
                                type: 'post',
                                data: _config,
                                failure: function () {
                                    errorMsg("La session a expiré. Veuillez rafraichir la page !");
                                    return false;
                                },
                                success: function (object) {
                                    if (object.error) {
                                        setTimeout(function () {
                                            errorMsg("Une erreur est survenue lors de l'envoi de la requete ! <br/>Veuillez contacter l'équipe technique");
                                            return false;
                                        }, 3000);
                                    } else {
                                        setTimeout(function () {
                                            var link = null;
                                            if (object.data === "") {
                                                infoMsg("Aucune donnée a exporter !! ");
                                            } else {
                                                link = '<a href="../' + object.data + '" ' +
                                                    'class= "btn btn-block ink-reaction btn-flat btn-accent" target="_blank"><b>Télecharger le fichier</b></a>';
                                                successMsgFix("Export des données réussi. <br/>" + link + "");
                                            }
                                            return false;
                                        }, 3000);
                                    }
                                }
                            });
                        }
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
            },
            rowCallback: function (row, data) {
                if ($.inArray(data.DT_RowId, submitSearchBills) !== -1) {
                    $(row).addClass('selected');
                }
            },
            createdRow: createdRowFunc
        });

        if (params !== null) {
            params();
        }
    },
    simpleTable: function (container, ajaxUri, searching, select, dataSrc, dataFunc, columnsDefs, columns,
                           params, order, createdRowFunc) {
        if (typeof container === 'undefined' || container === null
            || typeof ajaxUri === 'undefined' || ajaxUri === null
            || typeof dataFunc === 'undefined' || dataFunc === null
            || typeof columnsDefs === 'undefined' || columnsDefs === null
            || typeof columns === 'undefined' || columns === null
            || typeof createdRowFunc === 'undefined' || createdRowFunc === null) {
            return;
        }
        if (typeof order === 'undefined' || order === null) {
            order = false;
        }

        this.container = container;
        this.ajaxUri = ajaxUri;
        this.searching = searching;
        this.select = select;
        this.dataSrc = dataSrc;
        this.dataFunc = dataFunc;
        this.columnsDefs = columnsDefs;
        this.columns = columns;
        this.params = params;

        if (!$.isFunction($.fn.dataTable)) {
            return;
        }

        $('' + this.container + '').DataTable({
            dom: 'Blfrtip',
            order: [],
            serverSide: true,
            processing: true,
            searching: this.searching,
            ordering: order,
            paging: true,
            pageLength: 100,
            colVis: {
                buttonText: "Colonnes",
                overlayFade: 0,
                align: "right"
            },
            ajax: {
                url: this.ajaxUri,
                type: 'POST',
                dataSrc: this.dataSrc,
                "data": this.dataFunc
            },
            columnDefs: this.columnsDefs,
            columns: this.columns,
            fixedHeader: {
                header: true,
                headerOffset: 60
            },
            destroy: true,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Exporter en Excel',
                    exportOptions: {
                        columns: "thead th:not(.noExport)"
                    },
                    action: function (e, dt, node, config) {
                        var _config = $("#tableConfig").val();
                        var path = $("#exportPath").val();
                        if (_config === null || typeof _config === 'undefined'
                            || typeof path === 'undefined' || path === null) {
                            return false;
                        } else {
                            _config = JSON.parse(_config);
                            console.log("Start Export Data");
                            //infoMsgFix("Export des données en cours, Veuillez patienter ! ", "Informations");
                            $.ajax({
                                url: path,
                                type: 'post',
                                data: _config,
                                failure: function () {
                                    //errorMsg("La session a expiré. Veuillez rafraichir la page !");
                                    return false;
                                },
                                success: function (object) {
                                    if (object.error) {
                                        setTimeout(function () {
                                            //errorMsg("Une erreur est survenue lors de l'envoi de la requete ! <br/>Veuillez contacter l'équipe technique");
                                            return false;
                                        }, 3000);
                                    } else {
                                        setTimeout(function () {
                                            var link = null;
                                            if (object.data === "") {
                                                //infoMsg("Aucune donnée a exporter !! ");
                                            } else {
                                                link = '<a href="../' + object.data + '" ' +
                                                    'class= "btn btn-block ink-reaction btn-flat btn-accent" target="_blank"><b>Télecharger le fichier</b></a>';
                                                //successMsgFix("Export des données réussi. <br/>" + link + "");
                                            }
                                            return false;
                                        }, 3000);
                                    }
                                }
                            });
                        }
                    }
                }
            ],
            language: {
                zeroRecords: "Pas de données a afficher",
                infoEmpty: "Pas de données",
                emptyTable: "Pas de données",
                lengthMenu: '_MENU_ données par page',
                search: '<i class="fa fa-search"></i>',
                loadingRecords: 'Chargement des données, veuillez patienter ! ',
                processing: "Chargement des données, veuillez patienter ! "
            },
            createdRow: createdRowFunc
        });

        if (params !== null) {
            params();
        }
    }
};