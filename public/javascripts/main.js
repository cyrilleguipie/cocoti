/**
 * Created by YANNICK on 25/07/2017.
 *
 * Get Base Url for Ajax requests and Filter By Agents
 */

$(function ($) {

    var message = function () {
        toastr.options.closeButton = false;
        toastr.options.progressBar = false;
        toastr.options.debug = false;
        toastr.options.preventDuplicates = true;
        toastr.options.positionClass = 'toast-bottom-left';
        toastr.options.showDuration = 333;
        toastr.options.hideDuration = 333;
        toastr.options.timeOut = 4000;
        toastr.options.extendedTimeOut = 4000;
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'swing';
        toastr.options.showMethod = 'slideDown';
        toastr.options.hideMethod = 'slideUp';
    };

    message();

});

function errorMsg(msg) {
    clearToastrMsg();
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.error(msg, "<i class=\"md md-notifications-none\"></i> Erreur !");
}

function successMsg(msg) {
    clearToastrMsg();
    toastr.success(msg, "<i class=\"md md-done\"></i> Réussite !");
}

function successMsgFix(msg) {
    clearToastrMsg();
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.success(msg, "<i class=\"md md-done\"></i> Réussite !");
}

function warningMsg(msg) {
    clearToastrMsg();
    toastr.warning(msg, "<i class=\"md md-warning\"></i> Attention !");
}

function infoMsgFix(msg, title) {
    clearToastrMsg();
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.info(msg, "<i class=\"md md-info-outline\"></i> " + title);
}

function infoMsg(msg) {
    clearToastrMsg();
    toastr.info(msg, "<i class=\"md md-info-outline\"></i> Info");
}

function clearToastrMsg() {
    toastr.clear();
    toastr.options.timeOut = 4000;
    toastr.options.extendedTimeOut = 4000;
}

function messageWithAction(message, title) {
    toastr.clear();
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.info(message, title);

}

function getBasePathNameUrl() {
    var pathArray = window.location.pathname.split('/');
    return '/' + pathArray[1];
}

function getFinalUrl(endpoint) {
    var base_url = getBasePathNameUrl();

    if (base_url === "/backend") {
        return base_url + '/' + endpoint;
    } else {
        return base_url + '/backend/' + endpoint;
    }
}

function filterColumn(dataTable, searchVal, i, regex, smSearch) {
    $(dataTable).DataTable().column(i).search(
        searchVal,
        regex,
        smSearch
    ).draw();
}

function getData(inputs, data) {
    if (data.length > 0) return false;

    if (inputs.length < 0) return false;

    var value = null;
    inputs.each(function () {
        if ($(this).val().length > 0) {
            value = $.parseJSON($(this).val());
            data = data.concat(value);
        }
    });

    return data;
}

function getData2(inputs, data) {
    if (data.length > 0) return false;

    if (inputs.length < 0) return false;

    var value = null;
    inputs.each(function () {
        if ($(this).attr("json").length > 0) {
            value = $.parseJSON($(this).attr("json"));
            data = data.concat(value);
        }
    });

    return data;
}



