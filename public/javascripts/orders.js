var data2 = [];
var now = new Date();
var dataTable = $('#sell1').DataTable();
var dataTable2 = $('#sell2').DataTable();
var dataContent = dataTable.rows().data();
var data = dataTable2.rows().data();
var strValues = [];

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

$('#e-date').datepicker({
    language: 'fr',
    format: 'dd/mm/yyyy',
    pickTime: true,
    pickSeconds: false,
    pick12HourFormat: false,
    endDate: now,
    autoclose: true,
    todayHighlight: true
});

$('#search').click(function () {
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var date = new Date(data[0]);
            if (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()) {
                return true;
            }

            return false;
        }
    );

    var startDate = $('#s-date').datepicker('getDate');
    var endDate = $('#e-date').datepicker('getDate');

    if (startDate !== "Invalid Date" && endDate !== "Invalid Date") {
        dataTable.draw();
        dataTable2.draw();
        $.fn.dataTable.ext.search.pop();
        $('#reset').removeAttr("disabled");
    } else {
        alert("Aucune date sélectionnée");
    }
});

$('#reset').click(function () {
    $.fn.dataTable.ext.search.pop();
    resetDatatables(true);
    $('#reset').attr("disabled", true);
});

$('#sell1 tbody').on('click', 'tr', function () {
    $(this).toggleClass('selected');
    var orderNum = $(this).attr("v");
    var mode = false;

    if ($(this).hasClass('selected')) {
        mode = true;
    }

    if (mode) {
        strValues.push(orderNum);
    } else {
        strValues = jQuery.grep(strValues, function (value) {
            return value !== orderNum;
        });
    }

    if (strValues.length > 0) {
        var stringSearch = strValues.join('|');
        filterColumn("#sell2", stringSearch, 1, true, true);
    } else {
        resetDatatables(false);
    }
});

$("#sync").click(function () {
    $.ajax({
        url: '/backend/reload/dolphin',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if (!data.error) {
                setTimeout(function () {
                    alert("La synchronisation a été lancée !!");
                    setTimeout("window.location.replace('/backend/procures');", 2000);
                }, 3000);
            }
        }
    });
});

function resetDatatables(allTables) {
    $.fn.dataTable.ext.search.pop();
    if (allTables) {
        dataTable.search('').draw();
        /*        dataTable.clear().draw();
                dataTable.rows.add(dataContent); // Add new data
                dataTable.column(0).visible(false);
                dataTable.draw(); // Redraw the DataTable*/
    }
    dataTable2.search('').draw();
    /*    dataTable2.clear().draw();
        dataTable2.rows.add(data); // Add new data
        dataTable2.column(0).visible(false);
        dataTable2.draw(); // Redraw the DataTable*/
}


