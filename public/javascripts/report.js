$content = $('#content');
$report_1 = $content.find("#report-1");
$report_2 = $content.find("#report-2");
/*$report_3 = $content.find("#report-3");
$report_4 = $content.find("#report-4");*/
var _agentProcures = $.parseJSON($("#agentProcures").val());
var _billUnpaidByAgents = $.parseJSON($("#billUnpaidByAgents").val());
var _billUnpaidByCustomers = $.parseJSON($("#billUnpaidByCustomers").val());

var no_report = '<h4 style="text-align: center;font-family: monospace;color: red;"> Aucun état disponible pour le moment!</h4>';

var report = {

    loadBillUnpaidByAgentReport: function (element) {
          var reportData = [];
          jQuery.each(_billUnpaidByAgents, function () {
              var temp = {};
              console.log(this);
              temp.agent = this.agentNickName;
              temp.totalPaid = this.totalPaid;
              reportData.push(temp);
          });

          reportData.sort(function (a, b) {
              return b.totalPaid - a.totalPaid;
          });

          if(reportData.length > 0){
              new Morris.Bar({
                                  // ID of the element in which to draw the chart.
                  element: element,
                  // Chart data records -- each entry in this array corresponds to a point on
                  // the chart.
                  data: reportData,

                  resize: true,

                  // The name of the data record attribute that contains x-values.
                  xkey: 'agent',
                  // A list of names of data record attributes that contain y-values.
                  ykeys: ['totalPaid'],
                  // Labels for the ykeys -- will be displayed when you hover over the
                  // chart.
                  labels: ['Montant total'],
                  barColors: $('#report-1').data('colors').split(',')
              });
          } else {
              $report_1.html(no_report);
          }
      },

    loadBillUnpaidByCustomerReport: function (element) {
          var reportData = [];
          jQuery.each(_billUnpaidByCustomers, function () {
              var temp = {};
              console.log(this);
              temp.customer = this.customerNickName;
              temp.totalPaid = this.totalPaid;
              reportData.push(temp);
          });

          reportData.sort(function (a, b) {
              return b.totalPaid - a.totalPaid;
          });

          if(reportData.length > 0){
              new Morris.Bar({
                                  // ID of the element in which to draw the chart.
                  element: element,
                  // Chart data records -- each entry in this array corresponds to a point on
                  // the chart.
                  data: reportData,

                  resize: true,

                  // The name of the data record attribute that contains x-values.
                  xkey: 'customer',
                  // A list of names of data record attributes that contain y-values.
                  ykeys: ['totalPaid'],
                  // Labels for the ykeys -- will be displayed when you hover over the
                  // chart.
                  labels: ['Montant total'],
                  barColors: $('#report-2').data('colors').split(',')
              });
          } else {
              $report_2.html(no_report);
          }
      },

/*
    loadTableclothReport: function (url, element) {
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            crossDomain: true,
            success: function (response) {
                var reportData = [];

                jQuery.each(response, function () {
                    var temp = {};
                    tablier = jQuery.parseJSON(this.tablier);
                    nappe = jQuery.parseJSON(this.nappe);

                    temp.retailer = this.retailer.fullName;
                    temp.ratingTablier = tablier.note;
                    temp.ratingTablecloth = nappe.note;
                    reportData.push(temp);
                });

                reportData.sort(function (a, b) {
                    return (b.ratingTablier + b.ratingTablecloth) - (a.ratingTablier + a.ratingTablecloth);
                });

                if(reportData.length > 0){

                    new Morris.Bar({
                        // ID of the element in which to draw the chart.
                        element: element,
                        // Chart data records -- each entry in this array corresponds to a point on
                        // the chart.
                        data: reportData,

                        resize: true,

                        // The name of the data record attribute that contains x-values.
                        xkey: 'retailer',
                        // A list of names of data record attributes that contain y-values.
                        ykeys: ['ratingTablier', 'ratingTablecloth'],
                        // Labels for the ykeys -- will be displayed when you hover over the
                        // chart.
                        labels: ['Note d\'évaluation du tablier', "Note d\'évaluation de la nappe"]
                    });

                } else {
                    //$report_3.html(no_report);
                }


            }
        });
    },

    loadGlobalReport: function (url, element) {
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            crossDomain: true,
            success: function (response) {
                var reportData = [];

                jQuery.each(response, function () {
                    var temp = {};
                    presentoir = jQuery.parseJSON(this.presentoir);
                    tablier = jQuery.parseJSON(this.tablier);
                    nappe = jQuery.parseJSON(this.nappe);

                    temp.retailer = this.retailer.fullName;
                    temp.ratingPresentation = presentoir.note;
                    temp.ratingPlanogram = this.presentoirScore;
                    temp.ratingAvailability = this.productAvailabilityScore;
                    temp.ratingTablier = tablier.note;
                    temp.ratingNappe = nappe.note;
                    temp.rating = presentoir.note;
                    temp.rating += this.presentoirScore;
                    temp.rating += this.productAvailabilityScore;
                    temp.rating += tablier.note;
                    temp.rating += nappe.note;
                    temp.rating /= 5;
                    temp.rating = Math.round(temp.rating).toFixed(2);
                    reportData.push(temp);
                });

                reportData.sort(function (a, b) {
                    return (b.rating) - (a.rating);
                });

                if(reportData.length > 0){

                    new Morris.Bar({
                        // ID of the element in which to draw the chart.
                        element: element,
                        // Chart data records -- each entry in this array corresponds to a point on
                        // the chart.
                        data: reportData,

                        resize: true,

                        // The name of the data record attribute that contains x-values.
                        xkey: 'retailer',
                        // A list of names of data record attributes that contain y-values.
                        ykeys: ['rating', 'ratingPresentation', 'ratingPlanogram', 'ratingAvailability', 'ratingTablier', 'ratingNappe'],
                        // Labels for the ykeys -- will be displayed when you hover over the
                        // chart.
                        labels: ['Note Globale', 'Note de présentation du présentoir', 'Note du planogramme', 'Note de disponibilité des produits', 'Note sur tablier', 'Note sur la Nappe']
                    });

                } else {
                    $content.html(no_report);
                }


            }
        });
    },
    loadRetailerReport: function (url, element, idRetailer) {
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            crossDomain: true,
            success: function (response) {
                var reportData = [];

                jQuery.each(response, function () {
                    var temp = {};
                    console.log(this);
                    temp.label = this.areaTitle;
                    temp.value = this.quantity;
                    reportData.push(temp);
                });

                if(reportData.length > 0){
                    new Morris.Donut({
                        // ID of the element in which to draw the chart.
                        element: element,
                        // Chart data records -- each entry in this array corresponds to a point on
                        // the chart.
                        data: reportData,
                        resize : true
                    });
                }  else {
                    $report_2.html(no_report);
                }



            }
        });

    }
*/

};
