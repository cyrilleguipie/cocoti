$(function () {

    console.log("Load file");
    var hotelTableId = "#hotelTable";
    if (hotelTableId.length > 0) {
        createHotelTable(hotelTableId);
    }

    function createHotelTable(tableId) {
        var scrollX = false;
        var createdRowFunc = function () {
            
        };

        var hotelDataFunc = function (d) {
            $("#tableConfig").val(JSON.stringify(d));
        };

        var columnsDefs = [
            {
                targets: [0],
                name: 'name',
                searchable: true
            },
            {
                targets: [1],
                name: 'address',
                searchable: true
            },
            {
                targets: [2],
                name: 'city',
                searchable: true
            },
            {
                targets: [3],
                name: 'postalCode',
                searchable: true
            },
            {
                targets: [4],
                name: 'fax',
                searchable: true
            },
            {
                targets: [5],
                name: 'actionsButtons',
                searchable: false
            }
        ];

        var columns = [
            {data: 'name'},
            {data: 'address'},
            {data: 'city'},
            {data: 'postalCode'}, //
            {data: 'fax'},
            {data: 'actionsButtons'}
        ];

        var hotelParams = function () {
        };

        var agentStatCreatedRowFunc = function (row, data, index) {
            /*        $(row).attr('id', '' + data.id);
             $(row).attr('data', '' + JSON.stringify(data) + '');
             $('td', row).eq(1).attr('style', 'text-align: right');
             $('td', row).eq(2).attr('style', 'text-align: right');
             $('td', row).eq(3).attr('style', 'text-align: right');
             $('td', row).eq(4).attr('style', 'text-align: right');*/
        };

        console.log("Start dataTable");

        new AppDatatable.simpleTable(tableId, "/hotels/fetch/data", true, true,
            "data", hotelDataFunc, columnsDefs, columns, hotelParams, scrollX, createdRowFunc);
    }
});