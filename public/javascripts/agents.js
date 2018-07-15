var $Modal = null;
var $ModalContent = null;
var agentsInfos = $("input[type=hidden][class=results]");
var agentStatsInfos = $("input[type=hidden][class=agentStats]");
var object = null;
var account = null;
var obj_id = null;
var token = $("input[name='authenticityToken']").val();

var _agents = getData(agentsInfos, []);
var _agentStats = getData(agentStatsInfos, []);

function updateObject(container, url, update, containerBtn) {

    var firstName = container.find("input[name='firstName']").val();
    var lastName = container.find("input[name='lastName']").val();
    var nickName = container.find("input[name='nickname']").val();
    var address = container.find("input[name='adress']").val();
    var phone = container.find("input[name='phone']").val();
    var email = container.find("input[name='email']").val();
    var password = "";
    var typeAgentId = 0;
    var typeAccountId = 0;
    var login = "";

    if (!update) {
        typeAgentId = container.find("select[name='agenttype']").val();
        login = container.find("input[name='login']").val();
        password = container.find("input[name='password']").val();
        typeAccountId = container.find("select[name='accountTypes']").val();
    }

    var limitProcure = container.find("input[name='limitProcure']").val();

    var data = {
        firstName: firstName,
        lastName: lastName,
        nickName: nickName,
        address: address,
        phone: phone,
        email: email,
        typeAgentId: typeAgentId,
        typeAccountId: typeAccountId,
        login: login,
        password: password,
        limitProcure: limitProcure,
        update: update
    };

    $("#loader").css("display", "block");
    $("#edicontent").css("display", "none");
    $("" + containerBtn + "").html("Veuillez patienter...").attr("disabled", true);
    var stringData = JSON.stringify(data);
    //console.log(stringData);
    $.ajax({
        url: getFinalUrl(url),
        type: 'post',
        data: {
            authenticityToken: token,
            data: stringData
        },
        success: function (data) {
            if (data.error == false) {
                setTimeout(function () {
                    $("#loader").css("display", "none");
                    $("#edicontent").css("display", "block");
                    $("" + containerBtn + "").html("Valider").attr("disabled", false);
                    $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                    $("#errorMsg").html("L'agent a bien été enregistré");
                    setTimeout("window.location.replace(getFinalUrl('agents'));", 2000);
                }, 3000);
            } else {
                setTimeout(function () {
                    $("#loader").css("display", "none");
                    $("#edicontent").css("display", "block");
                    $("" + containerBtn + "").html("Valider").attr("disabled", false);
                    $("#errorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                    $("#errorMsg").html("Une erreur est survenue. Veuillez actualiser la page !");
                }, 3000);
            }
        }
    });

}

//Add Item in a Modal (JQuery Function)
$(".addM").click(function () {
    $Modal = $("#addModal");
    $ModalContent = $Modal.find("#addmodone");
    $ModalContent.find("#rowAccount").show();

    $ModalContent.find("select[name='agenttype']").change(function () {
        var agentTypeId = $ModalContent.find("select[name='agenttype']").val();
        if (agentTypeId != "A") {
            $ModalContent.find("#limitPRow").show();
            $("select[name='accountTypes'] option").filter(function () {
                //may want to use $.trim in here
                return $(this).text() == 'Actor';
            }).prop('selected', true);
        } else if (agentTypeId == 0) {
            $ModalContent.find("#limitPRow").hide();
            $ModalContent.find("select[name='accountTypes']").val("");
        } else {
            $ModalContent.find("#limitPRow").hide();
            $("select[name='accountTypes'] option").filter(function () {
                //may want to use $.trim in here
                return $(this).text() == 'Admin';
            }).prop('selected', true);
        }
    });

    $("#add-modifs").click(function () {

        var form = $ModalContent.find('.form-validation');
        var valid = form.valid();

        if (!valid) {
            form.data('validator').focusInvalid();
            return false;
        }

        updateObject($ModalContent, "agents/edit", false, "#add-modifs");
    });

});

//Edit Item in a Modal (JQuery Function)
$(".ediM").click(function () {
    $Modal = $("#editModal");
    $ModalContent = $Modal.find("#editmodone");
    object = null;
    obj_id = null;
    obj_id = parseInt($(this).attr("id"));

    for (var i = 0, len = _agents.length; i < len; i++) {
        if (_agents[i].id === obj_id) {
            object = _agents[i];
        }
    }

    $ModalContent.find("input[name='firstName']").val(object.firstName);
    $ModalContent.find("input[name='lastName']").val(object.lastName);
    $ModalContent.find("input[name='nickname']").val(object.nickName);
    $ModalContent.find("input[name='adress']").val(object.address);
    $ModalContent.find("input[name='phone']").val(object.phone);
    $ModalContent.find("select[name='agenttype']").val(object.typeManager.code).attr("disabled", true);

    if (object.typeManager.code !== "A") {
        for (var i = 0; i < _agentStats.length; i++) {
            if (_agentStats[i].agentId === obj_id) {
                var _agentStat = _agentStats[i];
            }
        }
        $ModalContent.find("#limitPRow").show();
        if(_agentStat != null) $ModalContent.find("input[name='limitProcure']").val(_agentStat.limitProcure);
    } else {
        $ModalContent.find("#limitPRow").hide();
    }

    if (object.account != null) {
        $ModalContent.find("#rowAccount").hide();
        $ModalContent.find("input[name='email']").val(object.account.email);
        $ModalContent.find("select[name='accountTypes']").val(object.accountType.id).attr("disabled", true);
    }

    $("#send-modifs").click(function () {

        var form = $ModalContent.find('.form-validation');
        var valid = form.valid();

        if (!valid) {
            form.data('validator').focusInvalid();
            return false;
        }

        updateObject($ModalContent, 'agents/' + obj_id + '/edit', true, "#send-modifs");
    });

});

//View Item in a Modal (JQuery Function)
$(".vieM").click(function () {
    $Modal = $("#viewModal");
    $ModalContent = $Modal.find("#viewmodone");
    object = null;
    obj_id = null;
    obj_id = parseInt($(this).attr("id"));

    for (var i = 0, len = _agents.length; i < len; i++) {
        if (_agents[i].id === obj_id) {
            object = _agents[i];
        }
    }

    //$ModalContent.find("#serial").html(object.serial);
    $ModalContent.find("#fullName").html(object.fullName);
    $ModalContent.find("#nicknamev").html(object.nickName);
    if (object.phone != null) {
        $ModalContent.find("#phonev").html(object.phone);
    } else {
        $ModalContent.find("#phonev").html("Null");
    }

    if (object.account != null) {
        //$ModalContent.find("#serialAccount").html(object.account.serialAccount);
        $ModalContent.find("#emailv").html(object.account.email);
        $ModalContent.find("#accounttypev").html(object.account.titleTypeAccount);
    }

    $("#delete-modifs").click(function () {
        var r = confirm("Voulez vous supprimer cet utilisateur ?");
        if (r) {
            $.ajax({
                url: getFinalUrl('agents/' + obj_id + '/delete'),
                type: 'post',
                data: {
                    authenticityToken: token,
                    id: obj_id
                },
                success: function () {
                    window.location.replace(getFinalUrl('agents'));
                }
            });
        }
    });

});

