(function (namespace, $) {
    "use strict";

    var DemoPageMaps = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = DemoPageMaps.prototype;

    // =========================================================================
    // MEMBERS
    // =========================================================================

    p.map = null;
    p.objects = []; //$.parseJSON($("#result_id").val());
    console.log(p.objects);

    // =========================================================================
    // INIT
    // =========================================================================

    p.initialize = function () {
        var now = new Date();
        $('#s-date').datepicker({
            language: 'fr',
            format: 'dd/mm/yyyy',
            pickTime: true,
            pickSeconds: false,
            pick12HourFormat: false,
            endDate: now,
            autoclose: true,
            todayHighlight: true
        });
        //this._initBasicMap();
        this._initMarkerMap();
        //this._initPolygonMap();
        //this._initNoControlMap();
    };

    // =========================================================================
    // BASIC MAP
    // =========================================================================

    p._initBasicMap = function () {
        if (typeof GMaps === 'undefined') {
            return;
        }
        if ($('#map-details').length === 0) {
            return;
        }

        var basicMap = new GMaps({
            div: '#map-details',
            lat: 5.360143,
            lng: -4.009607,
            zoom: 10
        });

        $(".seeMSELL").click(function () {
            console.log("selected");
            basicMap.removeMarkers();
            var obj_id = $(this).attr("id");
            for (var i = 0; i < p.objects.length; i++) {
                if (p.objects[i].id == obj_id) {
                    var object = p.objects[i];
                }
            }

            basicMap.addMarker({
                lat: object.lat,
                lng: object.lng,
                title: 'Plateau',
                click: function (e) {
                    alert('You clicked in this marker');
                }
            });
        });
    };

    // =========================================================================
    // MARKER MAP
    // =========================================================================

    p._initMarkerMap = function () {
        if (typeof GMaps === 'undefined') {
            return;
        }
        if ($('#marker-map').length === 0) {
            return;
        }

        var markerMap = new GMaps({
            div: '#marker-map',
            lat: 5.360143,
            lng: -4.009607,
            zoom: 10
        });

        $("#search").click(function () {

            var form = $("#content").find('.form-validation');
            var valid = form.valid();

            if (!valid) {
                form.data('validator').focusInvalid();
                return false;
            }

            var dateToDisplay = $("input[name=sDate]").val();
            var agentId = $("select[name=agents]").val();
            var token = $("input[name='authenticityToken']").val();

            if (dateToDisplay != "Invalid Date" && agentId > 0) {
                $("#loadModal").modal("show");

                $.ajax({
                    url: getFinalUrl('map/get/data'),
                    type: 'post',
                    data: {
                        authenticityToken: token,
                        date: dateToDisplay,
                        agentId: agentId

                    },
                    success: function (data) {
                        console.log(data);
                        $("#loadModal").find("#pending-box").hide();
                        if (data.error === false) {
                            if (data.data === "") {
                                $("#loadModal").find("#successMsg").html("Aucune visite pour ce commercial sur cette date !! ");
                                $("#loadModal").find("#success-box").show();
                                setTimeout(function () {
                                    $("#loadModal").find("#success-box").hide();
                                    $("#loadModal").modal("toggle");
                                    $("#loadModal").find("#pending-box").show();
                                }, 1500);
                            } else {
                                console.log("LENGTH VISIT --> " + data.data.length);
                                markerMap.removeMarkers();
                                var count = 0;
                                for (var i = 0, len = data.data.length; i < len; i++) {
                                    if (data.data[i].lat > 0) {
                                        count++;

                                        markerMap.addMarker({
                                            lat: data.data[i].lat,
                                            lng: data.data[i].lng,
                                            title: data.data[i].comment,
                                            click: function (e) {
                                                alert('You clicked in this point');
                                            }
                                        });
                                    }
                                }
                                console.log("LENGTH COUNT --> " + count);
                                $("#loadModal").find("#successMsg").html("Visites ajoutées sur la carte !! ");
                                $("#loadModal").find("#success-box").show();
                                setTimeout(function () {
                                    $("#loadModal").find("#success-box").hide();
                                    $("#loadModal").modal("toggle");
                                    $("#loadModal").find("#pending-box").show();
                                }, 1500);
                            }
                        } else {

                        }
                    }
                });
            } else {
                alert("Aucune date ou aucun agent sélectionné ! ");
            }
        });
    };

    // =========================================================================
    // POLYGON MAP
    // =========================================================================

    p._initPolygonMap = function () {
        if (typeof GMaps === 'undefined') {
            return;
        }
        if ($('#polygon-map').length === 0) {
            return;
        }

        var polyMap = new GMaps({
            div: '#polygon-map',
            lat: -12.043333,
            lng: -77.028333
        });


        var path = [[-12.040397656836609, -77.03373871559225], [-12.040248585302038, -77.03993927003302], [-12.050047116528843, -77.02448169303511], [-12.044804866577001, -77.02154422636042]];

        polyMap.drawPolygon({
            paths: path, // pre-defined polygon shape
            strokeColor: '#BBD8E9',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#BBD8E9',
            fillOpacity: 0.6
        });
    };

    // =========================================================================
    // NO CONTROL MAP
    // =========================================================================

    p._initNoControlMap = function () {
        if (typeof GMaps === 'undefined') {
            return;
        }
        if ($('#no-control-map').length === 0) {
            return;
        }


        var noControlMap = new GMaps({
            div: '#no-control-map',
            lat: 52.376950,
            lng: 4.898365,
            zoom: 7,
            disableDefaultUI: true
        });
    };

    // =========================================================================
    namespace.DemoPageMaps = new DemoPageMaps;
}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):
