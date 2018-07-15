$(function () {

    var searchBox = $('#customer-search-container');
    var searchMsg = $('#customer-search-msg');
    var resetBtn = $('#btn-reset');
    var resetOrganismBtn = $('#btn-organism-reset');
    var listDiv = $('#resultList');
    var nameHotelInput = $('#name-hotel-search');
    var cityHotelInput = $('#city-hotel-search');
    var submitHotelInput = $('#submit-hotel-search');
    var commodityInput = $('select[name="commodity"]');
    var proximityInput = $('select[name="proximity"]');
    var resultHotelDiv = $('#resultHotelDiv');
    var resultHotelContainer = $('#resultHotelContainer');
    var resultHotelList = $('#resultHotelList');
    var searchOrganismBox = $('#organism-search-container');
    var resultOrganismDiv = $('#resultOrganismDiv');
    var resultOrganismContainer = $('#resultOrganismContainer');
    var resultOrganismList = $('#resultOrganismList');
    var startDate = null;
    var endDateInput = $('#endDate');
    var nbDaysInput = $('#nbDays');

    var resultSearch = [];
    var resultHotel = [];
    var resultOrganism = [];

    $('input[name="startDate"]').daterangepicker({
            "singleDatePicker": true,
            "locale": {
                "format": 'DD/MM/YYYY'
            }
        },
        function (start, end, label) {

            startDate = start;
        }
    );

    endDateInput.daterangepicker({
            "singleDatePicker": true,
            "locale": {
                "format": 'DD/MM/YYYY'
            }
        },
        function (start, end, label) {
            if (startDate !== null) {
                var days = moment(start).diff(startDate, 'days');
                nbDaysInput.val(days);
            } else {
                alert("Please select a startDate");
            }
        }
    );

    submitHotelInput.click(function () {
        if (!nameHotelInput.val() && !cityHotelInput.val()) {
            alert("Veuillez renseigner le nom et la ville pour la recherche !");
        } else {
            filterHotel(nameHotelInput.val(), cityHotelInput.val());
        }
        //console.log($(this).val());
    });

    commodityInput.focusout(function () {
        console.log($(this).val());
        filterHotel($(this).val(), $(this).val());
    });

    proximityInput.focusout(function () {
        console.log($(this).val());
        filterHotel($(this).val(), $(this).val());
    });

    searchBox.keyup(function (event) {

        $("#resultList").empty();

        if (!searchBox.val()) {
            listDiv.css('display', 'none');
        } else {
            listDiv.css('display', 'block');
        }

        $.ajax({
            type: "GET",
            url: '/api/v1/placements/customer',
            data: {'query': searchBox.val()},
            dataType: 'json',
            success: function (response) {
                if (response.length > 0) {

                    resultSearch = response;
                    var html = "<ul>";
                    $.each(response, function (index, member) {

                        html += '<li id="row' + response[index].id + '" class="result-item" onclick="fillClientInfos(' + response[index].id + ')"' +
                            'style="border-bottom: 1px solid;">' +
                            '' + response[index].customer.lastname + '|' + response[index].customer.firstname + ',' +
                            '</li>';
                    });

                    html += "</ul>";

                    listDiv.append(html);

                } else {
                    searchMsg.show();
                    searchMsg.html("Aucun client retrouve");
                    searchMsg.fadeOut(5000);
                }
            }
        });
    });

    searchOrganismBox.keyup(function (event) {

        resultOrganismList.find("tbody").empty();
        if (!searchOrganismBox.val()) {
            return false;
        } else {

            $.ajax({
                type: "GET",
                url: '/api/v1/organisms/search',
                data: {'query': searchOrganismBox.val()},
                dataType: 'json',
                success: function (response) {
                    if (response.length > 0) {
                        resultOrganism = response;
                        var html = '';
                        $.each(response, function (index, member) {

                            html += '<tr class= "selectOrganism" id="' + response[index].id + '">';
                            html += '<td>' + response[index].label + '</td>';
                            html += '<td>' + response[index].city + '</td>';
                            html += '<td>' + response[index].postalCode + '</td>';
                            html += '<td>' + response[index].tel + '</td>';
                            html += '<td>' + response[index].fax + '</td>';
                            html += '</td>'
                        });

                        resultOrganismContainer.css("display", "block");
                        if ($('tbody', resultOrganismList).length > 0) {
                            resultOrganismList.append(html);
                        }

                    } else {
                        resultOrganismContainer.css("display", "none");
                        resultOrganismDiv.append('<div class="alert alert-info" role="alert">' +
                            '<strong>Désolé ! </strong>Aucun organisme ne correspond a vos critères de recherche.</div>');
                    }
                }
            });
        }
    });

    resetBtn.on('click', function () {
        searchBox.val("");
        $("#resultList").empty();
    });

    resetOrganismBtn.on('click', function () {
        searchOrganismBox.val("");
        resultOrganismList.find("tbody").empty();
    });

    function getPlacementByCustomerId(cId, placements) {
        if (cId <= 0) return false;

        if (placements.length <= 0) return false;

        for (var i = 0, len = placements.length; i < len; i++) {
            if (placements[i].id === cId) {
                return placements[i].customer;
            }
        }

        return null;
    }

    function getHotelById(cId, hotels) {
        if (cId <= 0) return false;

        if (hotels.length <= 0) return false;

        for (var i = 0, len = hotels.length; i < len; i++) {
            if (hotels[i].id === cId) {
                return hotels[i];
            }
        }

        return null;
    }

    function filterHotel(name, city) {
        resultHotelList.find("tbody").empty();

        $.ajax({
            type: "GET",
            url: '/api/v1/hotels/find',
            data: {
                name: name,
                city: city
            },
            dataType: 'json',
            success: function (response) {
                console.log(response);
                //resultHotelDiv.css("display", "block");
                if (response.length > 0) {
                    resultHotel = response;
                    var html = '';
                    $.each(response, function (index, member) {

                        html += '<div class="property-item">';
                        html += '<a class="item-media-w"><div class="item-media" style="background-image: url(/images/property2.jpg)"></div>';
                        html += '</a><div class="item-info">';
                        html += '<div class="item-features">';
                        if (response[index].commodity !== null) {
                            if (response[index].commodity.microwave) {
                                html += '<div class="feature">Micro-ondes</div>';
                            }
                            if (response[index].commodity.kitchen) {
                                html += '<div class="feature">Micro-ondes</div>';
                            }
                            if (response[index].commodity.wifi) {
                                html += '<div class="feature">Micro-ondes</div>';
                            }
                            if (response[index].commodity.wcPerBearing) {
                                html += '<div class="feature">Micro-ondes</div>';
                            }
                            if (response[index].commodity.wcPerRoom) {
                                html += '<div class="feature">Micro-ondes</div>';
                            }
                            if (response[index].commodity.bathPerRoom) {
                                html += '<div class="feature">Micro-ondes</div>';
                            }
                            //other
                            if (response[index].commodity.other !== "") {
                                html += '<div class="feature">response[index].commodity.other</div>';
                            }
                        }
                        html += '</div>';
                        html += '<h3 class="item-title"><a>' + response[index].name + '</a></h3>';
                        html += '<div class="item-reviews"></div><div class="item-price-buttons">';
                        html += '<div class="item-price"><strong>' + response[index].firstPrice + ' € </strong><span>/par nuitée</span></div>';
                        html += '<div class="item-buttons"><a class="btn btn-outline-primary selectHotel" id="' + response[index].id + '">';
                        html += '<span>Selectionner</span><i class="os-icon os-icon-arrow-2-right"></i></a></div>';
                        html += '</div></div></div>';

                        /*                        html += '<tr onclick="fillHotelDetails(' + response[index].id + ')">';
                         html += '<td>' + response[index].name + '</td>';
                         html += '<td>' + response[index].city + '</td>';
                         html += '<td>' + response[index].postalCode + '</td>';
                         html += '<td>' + response[index].tel + '</td>';
                         html += '<td>' + response[index].fax + '</td>';
                         html += '</td>'*/
                    });

                    resultHotelDiv.html(html);

                    /*               resultHotelContainer.css("display", "block");
                     if ($('tbody', resultHotelList).length > 0) {
                     resultHotelList.append(html);
                     }*/

                } else {
                    //resultHotelContainer.css("display", "none");

                    resultHotelDiv.html('<div class="alert alert-info" role="alert">' +
                        '<strong>Désolé ! </strong>Aucun hotel ne correspond a vos critères de recherche.</div>');
                }
            }
        });
    }


    resultHotelDiv.on("click", ".selectHotel", function () {
        var obj_id = parseInt($(this).attr("id"));


        if(typeof obj_id !== 'undefined' && obj_id !== null){
            fillHotelDetails(obj_id)
        }
    });

    resultOrganismList.on("click", ".selectOrganism", function () {
        var obj_id = parseInt($(this).attr("id"));


        if(typeof obj_id !== 'undefined' && obj_id !== null){
            fillOrganismDetails(obj_id)
        }
    });

    function fillHotelDetails(hId) {
        if (hId <= 0) return false;

        var hotel = getHotelById(hId, resultHotel);

        if (hotel !== null && typeof hotel !== "undefined") {
            /*            $("#hotel-detail").css("display", "flex");

             $("#hotel-detail").find("#hotel_id").val(hotel.id);
             $("#hotel-detail").find("#hotel-detail-name").html(hotel.label);
             $("#hotel-detail").find("#hotel-detail-city").html(hotel.city);
             $("#hotel-detail").find("#hotel-detail-address").html(hotel.address);
             $("#hotel-detail").find("#hotel-detail-secondAddress").html(hotel.secondAddress);
             $("#hotel-detail").find("#hotel-detail-postalCode").html(hotel.postalCode);
             $("#hotel-detail").find("#hotel-detail-tel").html(hotel.tel);
             $("#hotel-detail").find("#hotel-detail-fax").html(hotel.fax);
             $("#hotel-detail").find("#hotel-detail-firstPrice").html(hotel.firstPrice + ' Euros (£)');
             $("#hotel-detail").find("#hotel-detail-secondPrice").html(hotel.secondPrice + ' Euros (£)');
             $("#hotel-detail").find("#hotel-detail-thirdPrice").html(hotel.thirdPrice + ' Euros (£)');
             $("#hotel-detail").find("#hotel-detail-otherPrice").html(hotel.otherPrice + ' Euros (£)');*/

            $("input[name='sum-h-name']").val(hotel.name);
            $("input[name='sum-h-city']").val(hotel.city);
            $("#sum-h-1stPrice").html(hotel.firstPrice + ' Euros (£)');
            $("#sum-h-2ndPrice").html(hotel.secondPrice + ' Euros (£)');
            $("#sum-h-3rdPrice").html(hotel.thirdPrice + ' Euros (£)');
            $("#sum-h-4thPrice").html(hotel.otherPrice + ' Euros (£)');
            $('.step-trigger[href="#stepContent3"]').click();
        }
    }

    function fillOrganismDetails(oId) {
        if (oId <= 0) return false;

        var hotel = getHotelById(oId, resultOrganism);

        if (hotel !== null || typeof hotel !== "undefined") {
            $("#organism-detail").css("display", "flex");

            $("#organism-detail").find("#organism_id").val(hotel.id);
            $("#organism-detail").find("#organism-detail-name").html(hotel.label);
            $("#organism-detail").find("#organism-detail-city").html(hotel.city);
            $("#organism-detail").find("#organism-detail-address").html(hotel.address);
            $("#organism-detail").find("#organism-detail-secondAddress").html(hotel.secondAddress);
            $("#organism-detail").find("#organism-detail-postalCode").html(hotel.postalCode);
            $("#organism-detail").find("#organism-detail-tel").html(hotel.tel);
            $("#organism-detail").find("#organism-detail-fax").html(hotel.fax);
            $("#organism-detail").find("#organism-detail-firstPrice").html(hotel.firstPrice + ' Euros (£)');
            $("#organism-detail").find("#organism-detail-secondPrice").html(hotel.secondPrice + ' Euros (£)');
            $("#organism-detail").find("#organism-detail-thirdPrice").html(hotel.thirdPrice + ' Euros (£)');
            $("#organism-detail").find("#organism-detail-otherPrice").html(hotel.otherPrice + ' Euros (£)');

            $("input[name='sum-o-name").val(hotel.label);
            $("input[name='sum-o-city").val(hotel.city);
            $("#sum-o-1stPrice").val(hotel.firstPrice + ' Euros (£)');
            $("#sum-o-2ndPrice").val(hotel.secondPrice + ' Euros (£)');
            $("#sum-o-3rdPrice").val(hotel.thirdPrice + ' Euros (£)');
            $("#sum-o-4thPrice").val(hotel.otherPrice + ' Euros (£)');


        }
    }

    function fillClientInfos(pId) {
        var customer = getPlacementByCustomerId(pId, resultSearch);

        if (customer !== null || typeof customer !== "undefined") {
            $("#row" + pId).css("background-color", "gray");
            searchBox.css("border-color", "blue");
            searchBox.val(customer.lastname);

            $("select[name='customer.civility']").val(customer.civility);
            $("input[name='customer.lastName']").val(customer.lastname);
            $("input[name='customer.firstName']").val(customer.firstname);
            $("input[name='customer.address']").val(customer.address);
            $("input[name='customer.secondAdress']").val(customer.secondAddress);
            $("input[name='customer.postalCode']").val(customer.postalCode);
            $("input[name='customer.city']").val(customer.city);
            $("input[name='customer.phone']").val(customer.phone);
            $("input[name='customer.fax']").val(customer.fax);
            $("input[name='customer.pax']").val(customer.pax);
            $("input[name='customer.facturedChildNumber']").val(customer.facturedChildNumber);
            $("input[name='customer.unFacturedChildNumber']").val(customer.unFacturedChildNumber);
            $("input[name='customer.famillyComposition']").val(customer.famillyComposition);
            $("input[name='customer.nationality']").val(customer.nationality);
            $("input[name='customer.observation']").val(customer.observation);

            $("input[name='sum-c-name']").val(customer.lastname + ' ' + customer.firstname);
            $("input[name='sum-c-city']").val(customer.city);
            $("input[name='sum-c-tel']").val(customer.phone);

            //$("#resultList").empty();
        }
    }

});
