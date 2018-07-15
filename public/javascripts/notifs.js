/**
 * Created by ROMUALD on 11/09/2017.
 */

$(function () {
    $(".select2").multiselect({
        maxHeight: 300,
        enableFiltering: true,
        includeSelectAllOption: true,
        buttonClass: 'btn btn-link',
        buttonWidth: '150px',
        selectAllText: 'Tout sélectionner',
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: 'Rechercher',
        enableClickableOptGroups: true,
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'Sélectionnez un destinataire ...';
            }
            else if (options.length > 2) {
                return options.length + ' destinataires sélectionnés';
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

    var $Modal = null;
    var $ModalContent = null;
    var token = $("input[name='authenticityToken']").val();

    function updateObject(container, url, update, containerBtn) {
        var title = container.find("input[id='title_']").val();
        var content = container.find("textarea[id='content_']").val();
        var agentIds = container.find("select[id='agents_']").val();

/*        var data = {
            authenticityToken: token,
            title: title,
            content: content,
            agentIds: JSON.stringify(agentIds)
        };*/

        $("#loader").css("display", "block");
        $("#edicontent").css("display", "none");
        $("" + containerBtn + "").html("Veuillez patienter...").attr("disabled", true);
        var dataString = JSON.stringify(agentIds);
        $.ajax({
            url: getFinalUrl(url),
            type: 'post',
            data: {
                authenticityToken: token,
                title: title,
                content: content,
                agentsIds: dataString
            },
            success: function (data) {
                if (data.error == false) {
                    setTimeout(function () {
                        $("#loader").css("display", "none");
                        $("#edicontent").css("display", "block");
                        $("" + containerBtn + "").html("Valider").attr("disabled", false);
                        $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                        $("#errorMsg").html("La notification a été enregistré.");
                        setTimeout("window.location.replace(getFinalUrl('notifications'));", 2000);
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
        //alert("Ok");
        $Modal = $("#addModal");
        $ModalContent = $Modal.find("#addmodone");

        $ModalContent.find("input[id='title_']").val("");
        $ModalContent.find("textarea[id='content_']").val("");
        $ModalContent.find("select[id='agents_']").val(null).trigger("change");

        $("#add-modifs").click(function () {

            var form = $ModalContent.find('.form-validation');
            var valid = form.valid();

            if (!valid) {
                form.data('validator').focusInvalid();
                return false;
            }

            updateObject($ModalContent, 'notifications/update', false, "#add-modifs");
        });

    });

});
