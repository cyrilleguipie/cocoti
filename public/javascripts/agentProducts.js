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
                return 'Sélectionnez un produit ...';
            }
            else if (options.length > 2) {
                return options.length + ' produits sélectionnés';
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

    //recuperer tous les inputs des agents
    var agentInfos = $("input[type=hidden][class=results]");
    var _objects = getData(agentInfos, []);
    var $Modal = null;
    var $ModalContent = null;
    var object = null;
    var obj_id = null;
    var token = $("input[name='authenticityToken']").val();

    console.log(_objects);

    function updateObject(container, containerBtn) {
        var agentId = container.find("select[name='agent']").val();
        var productIds = container.find("select[id='products']").val();

        if (agentId <= 0 || productIds == null) {
            $("#errorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
            $("#errorMsg").html("Veuillez bien renseigner les champs.");
        } else {
            $("#loader").css("display", "block");
            $("#edicontent").css("display", "none");
            $("" + containerBtn + "").html("Veuillez patienter...").attr("disabled", true);
            var sendOrderLines = JSON.stringify(productIds);
            $.ajax({
                url: getFinalUrl('aproduct/edit'),
                type: 'post',
                data: {
                    authenticityToken: token,
                    agentId: agentId,
                    productIds: sendOrderLines
                },
                success: function (data) {
                    //console.log(data);
                    if (data.error == false) {
                        setTimeout(function () {
                            $("#loader").css("display", "none");
                            $("#edicontent").css("display", "block");
                            $("" + containerBtn + "").html("Valider").attr("disabled", false);
                            $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                            $("#errorMsg").html("Les produits ont été affectés.");
                            setTimeout("window.location.replace(getFinalUrl('aproduct'));", 2000);
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
    }

    //Add Item in a Modal (JQuery Function)
    $(".addM").click(function () {
        //alert("Ok");
        $Modal = $("#addModal");
        $ModalContent = $Modal.find("#addmodone");

        $ModalContent.find("select[name='agent']").removeAttr("disabled");
        $ModalContent.find("select[name='agent']").val(0);
        $ModalContent.find("select[id='products']").val(null).trigger("change");

        $("#add-modifs").click(function () {

            var form = $ModalContent.find('.form-validation');
            var valid = form.valid();

            if (!valid) {
                form.data('validator').focusInvalid()
                return false;
            }

            updateObject($ModalContent, "#add-modifs");
        });

    });

    //Edit Item in a Modal (JQuery Function)
    $(".ediM").click(function () {
        $Modal = $("#editModal");
        $ModalContent = $Modal.find("#editmodone");
        object = null;
        obj_id = null;
        obj_id = parseInt($(this).attr("id"));
        for (var i = 0, len = _objects.length; i < len; i++) {
            if (_objects[i].id === obj_id) {
                object = _objects[i];
            }
        }

        var products = [];
        for (var i = 0, len = object.products.length; i < len; i++) {
            products.push(object.products[i].product.id);
        }

        $ModalContent.find("select[name='agent']").val(object.id);
        $ModalContent.find("select[name='agent']").attr("disabled", true);
        $ModalContent.find("select[id='products']").multiselect('select', products);

        $("#send-modifs").click(function () {

            var form = $ModalContent.find('.form-validation');
            var valid = form.valid();

            if (!valid) {
                form.data('validator').focusInvalid()
                return false;
            }

            updateObject($ModalContent, "#send-modifs");
        });

    });

    //View Item in a Modal (JQuery Function)
    $(".vieM").click(function () {
        $Modal = $("#viewModal");
        $ModalContent = $Modal.find("#viewmodone");
        $("#example5").empty();
        object = null;
        obj_id = null;
        obj_id = parseInt($(this).attr("id"));
        for (var i = 0, len = _objects.length; i < len; i++) {
            if (_objects[i].id === obj_id) {
                object = _objects[i];
            }
        }

        $ModalContent.find("#chiefinfo").html(object.fullName);
        var data = [];
        for (var i = 0, len = object.products.length; i < len; i++) {
            data.push([object.products[i].product.title, object.products[i].product.productCode]);
        }

        /*      var data = [];
                var id = 0;
                for (var i = 0, len = object.products.length; i < len; i++) {
                    if (id != object.products[i].product.id) {
                        data.push([object.products[i].product.title, object.products[i].product.productCode]);
                        id = object.products[i].product.id;
                    }
                }*/


        $('#example5').DataTable({
            "dom": 'Blfrtip',
            "pageLength": 20,
            "order": [],
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
                {title: "Code produit"}
            ]
        });

        $("#delete-modifs").click(function () {
            var r = confirm('Voulez vous supprimer tous les produits affectés a cet agent ?');
            if (r) {
                $("#vloader").css("display", "block");
                $("#viecontent").css("display", "none");
                $("#delete-modifs").html("Veuillez patienter...").attr("disabled", true);
                $.ajax({
                    url: getFinalUrl('aproduct/' + obj_id + 'delete'),
                    type: 'post',
                    data: {
                        authenticityToken: token,
                        id: obj_id
                    },
                    success: function (data) {
                        if (data.error == false) {
                            setTimeout(function () {
                                $("#vloader").css("display", "none");
                                $("#viecontent").css("display", "block");
                                $("#delete-modifs").html("Supprimer").attr("disabled", false);
                                $("#verrorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                                $("#verrorMsg").html("Les produits ont été supprimés.");
                                setTimeout("window.location.replace(getFinalUrl('aproduct'));", 2000);
                            }, 3000);
                        } else {
                            setTimeout(function () {
                                $("#vloader").css("display", "none");
                                $("#viecontent").css("display", "block");
                                $("#delete-modifs").html("Supprimer").attr("disabled", false);
                                $("#verrorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                                $("#verrorMsg").html("Une erreur est survenue. Veuillez actualiser la page !");
                            }, 3000);
                        }
                    }
                });
            }

        });
    });
});
