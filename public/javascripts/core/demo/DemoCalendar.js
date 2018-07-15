(function (namespace, $) {
    "use strict";

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
                return 'Sélectionnez un client ...';
            }
            else if (options.length > 2) {
                return options.length + ' client sélectionnés';
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

    //var now = new Date();
    var objects = [];
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

    function updateRoad(roadId, agentId, startDate, endDate,
                        customers_, update) {
        $('#viewModal').hide();
        $('#ediModal').show();
        $('#ediModal').modal('show');
        $('#errorMsg').hide();
        $('#ediModal').find("select[name='agent']").val(agentId);
        $('#ediModal').find("select[name='agent']").attr("disabled", true);
        $('#ediModal').find("input[name='roadId']").val(roadId);
        var start = startDate, end = endDate;
        if (!update) {
            console.log("False update");
            start = moment(startDate).format("DD/MM/YYYY");
            end = moment(endDate).format("DD/MM/YYYY");
        } else {
            console.log("True update");
            $('#ediModal').find("select[id='customers']").multiselect('deselectAll', false);
            $('#ediModal').find("select[id='customers']").multiselect('updateButtonText');
        }
        $('#ediModal').find("input[name='startDate']").val(start);
        $('#ediModal').find("input[name='endDate']").val(end);
        if (customers_ !== null && customers_.length > 0) {
            console.log("size of customers -->" + customers_);
            console.log("size of customers -->" + customers_.length);
            $('#ediModal').find("select[id='customers']").multiselect('select', customers_);
            $("select[id='customers']").multiselect('select', customers_);

        }
    }

    function viewRoad(road, startDate, endDate, data) {
        console.log("size of data -->" + data);
        console.log("size of data -->" + data.length);
        $('#ediModal').hide();
        $('#viewModal').show();
        $('#viewModal').modal('show');
        $("#example2").find("tbody").empty();
        $('#viewModal').find("input[name='roadvId']").val(road.id);
        $('#viewModal').find("input[name='startvDate']").val(moment(startDate).format("DD/MM/YYYY"));
        $('#viewModal').find("input[name='endvDate']").val(moment(endDate).format("DD/MM/YYYY"));
        $('#viewModal').find("#chieffullname").html(road.agent.fullName);
        $('#example2').DataTable({
            "dom": 'lCfrtip',
            "order": [],
            "colVis": {
                "buttonText": "Colonnes",
                "overlayFade": 0,
                "align": "right"
            },
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
                {title: "Nom"},
                {title: "Telephone"}
            ]
        });
    }

    var DemoCalendar = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = DemoCalendar.prototype;

    // =========================================================================
    // INIT
    // =========================================================================

    p.initialize = function () {
        this._enableEvents();

        this._initEventslist();
        this._initCalendar();
        this._displayDate();
    };

    // =========================================================================
    // EVENTS
    // =========================================================================

    // events
    p._enableEvents = function () {
        var o = this;

        $('#calender-prev').on('click', function (e) {
            o._handleCalendarPrevClick(e);
        });
        $('#calender-next').on('click', function (e) {
            o._handleCalendarNextClick(e);
        });
        $('.nav-tabs li').on('show.bs.tab', function (e) {
            o._handleCalendarMode(e);
        });
    };

    // =========================================================================
    // CONTROLBAR
    // =========================================================================

    p._handleCalendarPrevClick = function (e) {
        $('#calendar').fullCalendar('prev');
        this._displayDate();
    };
    p._handleCalendarNextClick = function (e) {
        $('#calendar').fullCalendar('next');
        this._displayDate();
    };
    p._handleCalendarMode = function (e) {
        $('#calendar').fullCalendar('changeView', $(e.currentTarget).data('mode'));
    };

    p._displayDate = function () {
        var selectedDate = $('#calendar').fullCalendar('getDate');
        $('.selected-day').html(moment(selectedDate).format("dddd"));
        $('.selected-date').html(moment(selectedDate).format("DD MMMM YYYY"));
        $('.selected-year').html(moment(selectedDate).format("YYYY"));
    };

    // =========================================================================
    // TASKLIST
    // =========================================================================

    p._initEventslist = function () {
        if (!$.isFunction($.fn.draggable)) {
            return;
        }
        var o = this;

        $('.list-events li ').each(function () {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                id: parseInt($(this).attr("id")),
                title: $.trim($(this).text()), // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true, // will cause the event to go back to its
                revertDuration: 0, //  original position after the drag
            });
        });
    };

    // =========================================================================
    // CALENDAR
    // =========================================================================

    p._initCalendar = function (e) {
        if (!$.isFunction($.fn.fullCalendar)) {
            return;
        }

        $('#calendar').fullCalendar({
            height: 700,
            header: false,
            editable: true,
            droppable: true,
            locale: 'fr',
            drop: function (date, allDay) {
                if (moment().format('YYYY-MM-DD') === date.format('YYYY-MM-DD') || date.isAfter(moment())) {
                    var originalEventObject = $(this).data('eventObject');
                    var copiedEventObject = $.extend({}, originalEventObject);
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.className = originalEventObject.className;

                    if (copiedEventObject.id !== "null") {
                        var road = null;
                        for (var i = 0; i < objects.length; i++) {
                            if (objects[i].agentId === copiedEventObject.id) {
                                road = objects[i];
                                break;
                            }
                        }

                        var customersList = [];
                        if (road !== null) {
                            var r = confirm("Nous avons trouvé un routing lié a cet agent ! Voulez-vous l'utilisez ?");
                            if (r === true) {
                                for (var j = 0, len = road.customers.length; j < len; j++) {
                                    customersList.push(road.customers[j].id);
                                }
                            } else {
                                $('#ediModal').find("select[id='customers']").multiselect('deselectAll', false);
                                $('#ediModal').find("select[id='customers']").multiselect('updateButtonText');
                            }
                        } else {
                            $('#ediModal').find("select[id='customers']").multiselect('deselectAll', false);
                            $('#ediModal').find("select[id='customers']").multiselect('updateButtonText');
                        }
                        updateRoad("null", copiedEventObject.id, date, date, customersList, false);
                    }
                } else {
                    warningMsg("Vous ne pouvez pas affecter un agent a une date antérieure");
                }
            },
            events: function (start, end, timezone, callback) {
                var selectedDate = $('#calendar').fullCalendar('getDate');
                var month = parseInt(moment(selectedDate).format("MM"));
                var year = 0;
                if (month == 1) {
                    month = 11;
                    year = parseInt(moment(selectedDate).format("YYYY")) - 1;
                } else if (month == 2) {
                    month = 0;
                } else {
                    month -= 2;
                }
                infoMsgFix("Actualisation des données", "Information");
                $.ajax({
                    url: '/backend/routes/test ',
                    type: 'POST',
                    data: {
                        month: month,
                        year: year,
                        start: start.format('DD/MM/YYYY'),
                        end: end.format('DD/MM/YYYY')
                    },
                    success: function (doc) {
                        clearToastrMsg();
                        if (doc.error) {
                            errorMsg("Une erreur est survenue pendant le chargement des données");
                        } else {
                            var eventSources = doc.event;
                            var events = [];
                            for (var i = 0, len = eventSources.length; i < len; i++) {
                                objects.push(eventSources[i]);
                                var event = new Object();
                                event.id = eventSources[i].id;
                                event.title = eventSources[i].agentName;
                                var startDate = new Date(eventSources[i].startDate);
                                event.start = new Date(startDate.setHours(startDate.getHours() + 3));
                                var endDate = new Date(eventSources[i].endDate);
                                event.end = new Date(endDate.setHours(endDate.getHours() + 2));
                                event.allDay = true;
                                if (eventSources[i].active === true) {
                                    event.className = "event-success";
                                } else {
                                    event.className = "event-info";
                                }
                                events.push(event);
                                event = new Object();
                            }
                            successMsg("Les données ont été actualisées");
                            callback(events);
                        }
                    },
                    failure: function () {
                        clearToastrMsg();
                        errorMsg("Une erreur est survenue pendant le chargement des données");
                    }
                });
            },
            eventLimit: true, // for all non-agenda views
            views: {
                agenda: {
                    eventLimit: 6 // adjust to 6 only for agendaWeek/agendaDay
                }
            },
            eventRender: function (event, element) {
                element.find('#date-title').html(element.find('span.fc-event-title').text());
            },
            eventDrop: function (event, delta, revertFunc) {
                revertFunc();
                var eClone = {
                    title: event.title,
                    start: event.start.clone().add(delta),
                    end: event.start.clone().add(delta)
                };
                if (moment().format('YYYY-MM-DD') === event.start.clone().add(delta).format('YYYY-MM-DD') || event.start.clone().add(delta).isAfter(moment())) {
                    for (var i = 0; i < objects.length; i++) {
                        if (objects[i].id == event.id) {
                            var object = objects[i];
                        }
                    }

                    var customersList = [];
                    for (var j = 0; j < object.customers.length; j++) {
                        customersList.push(object.customers[j].id);
                    }

                    updateRoad("null", object.agentId, eClone.start, eClone.end, customersList, false);
                } else {
                    warningMsg("Vous ne pouvez pas affecter un agent a une date antérieure");
                }
            },
            eventClick: function (calEvent, jsEvent, view) {
                for (var i = 0, len = objects.length; i < len; i++) {
                    if (objects[i].id == calEvent.id) {
                        var object = objects[i];
                    }
                }

                var data = [];
                for (var i = 0, len = object.customers.length; i < len; i++) {
                    data.push([object.customers[i].fullName, object.customers[i].phone]);
                }

                viewRoad(object, calEvent.start, calEvent.start, data);
            }
        });
    };

    $("#valid").click(function () {
        var startDate = $("input[name='startDate']").val();
        var endDate = $("input[name='endDate']").val();
        var agentId = $("select[name='agent']").val();
        var customerIdsFinal = $("select[id='customers']").val();
        var token = $("input[name='authenticityToken']").val();
        var roadId = $("input[name='roadId']").val();

        if (roadId != "null") {
            var url = getFinalUrl('routes/' + roadId + '/edit');
        } else {
            var url = getFinalUrl('routes/edit');
        }

        if (customerIdsFinal != null && customerIdsFinal.length > 0) {
            $("#loader").css("display", "block");
            $("#edicontent").css("display", "none");
            infoMsgFix("Envoi des informations", "Information");
            $("#valid").html("Veuillez patienter...").attr("disabled", true);
            var sendOrderLines = JSON.stringify(customerIdsFinal);
            $.ajax({
                url: url,
                type: 'post',
                data: {
                    authenticityToken: token,
                    sDate: startDate,
                    eDate: endDate,
                    agentId: agentId,
                    customersIds: sendOrderLines
                },
                failure: function () {
                    setTimeout(function () {
                        $("#loader").css("display", "none");
                        $("#edicontent").css("display", "block");
                        $("#valid").html("Valider").attr("disabled", false);
                        errorMsg("La session a expiré. Veuillez rafraichir la page !");
                    }, 3000);
                },
                success: function (object) {
                    $("#loader").css("display", "none");
                    $("#edicontent").css("display", "block");
                    $("#valid").html("Valider").attr("disabled", false);
                    if (object.error == false) {
                        $('#calendar').fullCalendar('refetchEvents');
                        $('#ediModal').hide();
                        if (roadId != "null") {
                            setTimeout(function () {
                                for (var i = 0; i < objects.length; i++) {
                                    if (objects[i].id == roadId) {
                                        object = objects[i];
                                    }
                                }

                                var data = [];
                                for (var i = 0, len = object.customers.length; i < len; i++) {
                                    data.push([object.customers[i].fullName, object.customers[i].phone]);
                                }
                                successMsg("Les modifications ont bien été enregistrées");
                                viewRoad(object, object.startDate, object.endDate, data);
                            }, 3000);
                        }
                    } else {
                        errorMsg(object.message);
                    }
                }
            });
        } else {
            warningMsg("Veuillez sélectionner des clients !");
        }
    });

    $("#editRoad").click(function () {
        var roadId = parseInt($("input[name='roadvId']").val());
        var startDate = $("input[name='startvDate']").val();
        var endDate = $("input[name='endvDate']").val();
        var road = null;

        for (var i = 0; i < objects.length; i++) {
            if (objects[i].id === roadId) {
                road = objects[i];
            }
        }

        if (road === null) {
            errorMsg("Impossible d'éditer les informations");
        } else {
            var customersList = [];
            for (var j = 0; j < road.customers.length; j++) {
                customersList.push(road.customers[j].id);
            }
            updateRoad(road.id, road.agentId, startDate, endDate, customersList, true);
        }
    });

    $("#exportBtn").click(function () {
        infoMsg('<strong>Veuillez sélectionner la période pour l\'export des données !</strong>');
    });

    $("#exportRoad").click(function () {
        var startDate = $("input[name='sDate']").val();
        var endDate = $("input[name='eDate']").val();
        var token = $("input[name='authenticityToken']").val();

        if (startDate.length > 0 && endDate.length > 0) {
            $(this).attr("disabled", true);
            infoMsgFix("Envoi des informations, Veuillez patienter ! ", "Informations");
            $.ajax({
                url: '/backend/routes/export',
                type: 'post',
                data: {
                    authenticityToken: token,
                    sDate: startDate,
                    eDate: endDate
                },
                failure: function () {
                    setTimeout(function () {
                        $("#exportRoad").html("Exporter").attr("disabled", false);
                        errorMsg("La session a expiré. Veuillez rafraichir la page !");
                    }, 3000);
                },
                success: function (object) {
                    if (object.error) {
                        setTimeout(function () {
                            $("#exportRoad").html("Exporter").attr("disabled", false);
                            errorMsg("Une erreur est survenue lors de l'envoi de la requete ! <br/>Veuillez contacter l'équipe technique");
                        }, 3000);
                    } else {
                        setTimeout(function () {
                            var link = null;
                            if (object.data === "") {
                                infoMsg("Aucun routing trouvé sur cette période !! ");
                            } else {
                                link = '<a href="../' + object.data + '" ' +
                                    'class= "btn btn-block ink-reaction btn-flat btn-accent" target="_blank"><b>Télecharger le fichier</b></a>';
                                successMsgFix("Export des données réussi. <br/>" + link + "");
                            }
                            $("#exportRoad").html("Exporter").attr("disabled", false);
                        }, 3000);
                    }
                }
            });
        } else {
            warningMsg("<strong>Veuillez sélectionner la période pour l'export des données !</strong>");
        }
    });

    var $inputFile = $("#contactsFile");
    $("#import-modifs").click(function () {
        var file = $inputFile[0].files[0];

        if (file != null) {
            var fileName = file.name;
            var ext = fileName.split('.').pop();
            switch (ext) {
                case "xls":
                    loadFile(file, getFinalUrl('routes/import'));
                    break;
                case "xlsx":
                    loadFile(file, getFinalUrl('routes/import'));
                    break;
                default:
                    warningMsg("Veuillez choisir un fichier au format Excel");
            }

            return false;
        } else {
            warningMsg("Veuillez choisir un fichier au format Excel");
        }
    });

    function loadFile(file, url) {
        var responseText = null;
        var token = $("input[name='authenticityToken']").val();

        $("#vloader").css("display", "block");
        $("#vcontent").css("display", "none");
        infoMsgFix("Envoi des informations", "Information");
        $("#import-modifs").html("Veuillez patienter...").attr("disabled", true);

        var xhr = new XMLHttpRequest();

        xhr.open('POST', url);

        var form = new FormData();
        form.append('file', file);
        form.append('authenticityToken', token);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status != 200) {
                    errorMsg("Une erreur est survenue lors de l'envoi de la requete ! <br/>Veuillez contacter l'équipe technique");
                } else {
                    if (xhr.responseText != null) {
                        responseText = xhr.responseText;
                        var obj = jQuery.parseJSON(responseText);
                        if (obj.error) {
                            $("#vloader").css("display", "none");
                            $("#vcontent").css("display", "block");
                            errorMsg(obj.message + " <br/>Veuillez contacter l'équipe technique\"");
                            $("#import-modifs").html("Importer").attr("disabled", false);
                        } else {
                            setTimeout(function () {
                                $("#vloader").css("display", "none");
                                $("#vcontent").css("display", "block");
                                successMsg("Les routings ont bien été importés !");
                                $("#import-modifs").html("Importer").attr("disabled", false);
                                setTimeout("window.location.replace(getFinalUrl('routes'));", 2000);
                            }, 3000);
                        }
                    }

                }
            }
            return xhr.readyState;
        };
        xhr.send(form);

    }

    // =========================================================================
    namespace.DemoCalendar = new DemoCalendar;
}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):
