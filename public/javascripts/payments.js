var _results = $.parseJSON($("#result_id").val());

function formatPrice(element1, element2) {
    var priceInputs = $(element1);

    priceInputs.each(function () {
        var value = $(this).val();
        var sid = parseInt($(this).attr('v'));
        var re = /,/gi;
        var res = /XOF/gi;
        var newValue = value.replace(re, " ");
        var nValue = newValue.replace(res, "");
        var idStr = element2 + sid;
        $(idStr).append(nValue);
    });
}

function formatDate(date) {
    var monthNames = [
        "01", "02", "03",
        "04", "05", "06", "07",
        "08", "09", "10",
        "11", "12"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    return day + '/' + monthNames[monthIndex] + '/' + year + ' '+ hour+':'+minutes;
}

function getDataWithDataContent(dtContent, dtContent1) {
    var dataTmp = [];
    for (var i = 0, len = dtContent.length; i < len; i++) {
        for (var j = 0, leng = dtContent1.length; j < leng; j++) {
            if (dtContent[i][3] == dtContent1[j][0]) {
                dataTmp.push(dtContent1[j]);
            }
        }
    }
    return dataTmp;
}

function getDataWithObjects(bills) {
    var dataTmp = [];
    var paymentId;
    var billsOperations;
    for (var i = 0, len = bills.length; i < len; i++) {

        paymentId = bills[i].id;
        billsOperations = bills[i].billOperations;

        for (var j = 0, leng = billsOperations.length; j < leng; j++) {

            if(billsOperations[j].bill != null){
                var date = new Date(billsOperations[j].date);
                dataTmp.push([paymentId,
                    formatDate(date),
                    billsOperations[j].bill.numBill,
                    billsOperations[j].bill.agentName,
                    billsOperations[j].customerFullName,
                    billsOperations[j].totalOperation,
                    billsOperations[j].bill.remainingAmount,
                    billsOperations[j].billTotal]);
            } else {
                console.log(billsOperations[j]);
            }
        }
    }

    return dataTmp;
}

function reloadTable(content) {
    $('#sell2').DataTable({
        "dom": 'Blfrtip',
        "order": [],
        "scrollY": '30vh',
        "scrollCollapse": true,
        "paging": false,
        "colVis": {
            "buttonText": "Colonnes",
            "overlayFade": 0,
            "align": "right"
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
            "emptyTable": "Pas de données",
            "lengthMenu": '_MENU_ données par page',
            "search": '<i class="fa fa-search"></i>',
            "paginate": {
                "previous": '<i class="fa fa-angle-left"></i>',
                "next": '<i class="fa fa-angle-right"></i>'
            }
        },
        "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ],
        destroy: true,
        data: content,
        columns: [
            {title: "Id"},
            {title: "Date recouvrement"},
            {title: "N° Facture"},
            {title: "Commercial"},
            {title: "Client"},
            {title: "Montant recouvrement"},
            {title: "Reste a payer"},
            {title: "Montant total facture"}
        ]
    });
}

formatPrice(".tPrice", ".tPriceRow");

var data = getDataWithObjects(_results);
var data2 = [];
var _now = new Date();
var now = new Date(_now.getTime() + 24 * 3600 * 1000);
var dataTable = $('#sell1').DataTable();
var dataContent = dataTable.rows().data();

reloadTable(data);

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

    if (startDate != "Invalid Date" && endDate != "Invalid Date") {
        dataTable.draw();
        $('#reset').removeAttr("disabled");
        var dContent = dataTable.rows({search: 'applied'}).data();
        var newData = getDataWithDataContent(dContent, data);

        $.fn.dataTable.ext.search.pop();
        if (newData.length > 0) {
            reloadTable(newData);
        } else {
            reloadTable(data);
            console.log("EMPTY");
        }
    } else {
        alert("Aucune date sélectionnée");
    }
});

$('#reset').click(function () {
    $.fn.dataTable.ext.search.pop();
    dataTable.clear().draw();
    dataTable.rows.add(dataContent); // Add new data
    dataTable.column(0).visible(false);
    dataTable.draw(); // Redraw the DataTable
    reloadTable(data);
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
        for (var j = 0, len = data.length; j < len; j++) {
            if (data[j][0] == orderNum) {
                data2.push(data[j]);
            }
        }
    } else {
        data2 = jQuery.grep(data2, function (value) {
            return value[0] != orderNum;
        });
    }

    $.fn.dataTable.ext.search.pop();
    if (data2.length > 0) {
        reloadTable(data2);
    } else {
        var dContent = dataTable.rows({search: 'applied'}).data();

        if (dContent.length > 0) {
            var newData = getDataWithDataContent(dContent, data);

            if (newData.length > 0) {
                reloadTable(newData);
            } else {
                reloadTable(data);
            }
        } else {
            reloadTable(data);
        }
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


