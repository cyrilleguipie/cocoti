    $(function () {
        $(".select2").select2();
        var now = new Date();
        $('#e-date').datepicker({
            language : 'fr',
            format: 'dd/mm/yyyy',
            pickTime : true,
            pickSeconds : false,
            pick12HourFormat: false,
            startDate : now,
            autoclose: true,
            todayHighlight: true
        });
        $('#s-date').datepicker({
            language : 'fr',
            format: 'dd/mm/yyyy',
            pickTime : true,
            pickSeconds : false,
            pick12HourFormat: false,
            startDate : now,
            autoclose: true,
            todayHighlight: true
        });
    });

    var _objects = $.parseJSON($("#result_id").val());
    var _products = $.parseJSON($("#products_id").val());

      //Add Item in a Modal (JQuery Function)
      $(".addM").click(function () {
          //alert("Ok");
          $Modal = $("#addModal");
          $ModalContent = $Modal.find("#addmodone");

          $ModalContent.find("input[name='sDate']").val("");
          $ModalContent.find("input[name='eDate']").val("");
          $ModalContent.find("input[name='title']").val("");
          $ModalContent.find("input[name='description']").val("");
          $ModalContent.find("select[id='products']").val(null).trigger("change");
          $ModalContent.find("#step3").empty();

          $("#add-modifs").click(function () {

              var form = $('#rootwizard2').find('.form-validation');
              var valid = form.valid();
              if(!valid) {
                  form.data('validator').focusInvalid();
                  return false;
              }

              var startDate       = $ModalContent.find("input[name='sDate']").val();
              var endDate         = $ModalContent.find("input[name='eDate']").val();
              var title           = $ModalContent.find("input[name='title']").val();
              var description     = $ModalContent.find("textarea[name='description']").val();

              productIds = [];
              $("input[name='productsPrices']").each(function () {
                    console.log($(this).val());
                    var product = new Object();
                    product.id = parseInt($(this).attr("id"));
                    product.discountPrice = parseInt($(this).val());
                    productIds.push(product);
              });
              console.log(productIds);

              if(productIds.length > 0){
                  var data = JSON.stringify(productIds);
                  $.ajax({

                      url: "/backend/promotions/edit",
                      type: 'post',
                      data: {
                          sDate : startDate,
                          eDate : endDate,
                          title: title,
                          description : description,
                          data : data
                      },
                      success: function () {
                          //alert("Ok");
                          window.location.replace("/backend/promotions");
                      }
                  });
              } else {
                  alert("Veuillez sélectionner des produits");
              }

          });

      });

        //Edit Item in a Modal (JQuery Function)
        $(".ediM").click(function () {
            $Modal = $("#editModal");
            $ModalContent = $Modal.find("#editmodone");

            var obj_id = $(this).attr("id");
            console.log(obj_id);
            for (var i = 0; i < _objects.length; i++) {
                if (_objects[i].id == obj_id) {
                    var object = _objects[i];
                }
            }

            var products = [] ;
            var id = 0;
            for(var i = 0, len = object.products.length; i < len; i++){
                if(id != object.products[i].productPrice.product.id){
                    products.push(object.products[i].productPrice.product.id);
                    id =  object.products[i].productPrice.product.id;
                }
            }

          var startDate = new Date(object.startDate);
          var endDate = new Date(object.endDate);

          $ModalContent.find("input[name='sDate']").val(startDate.getDate()+"/"+startDate.getMonth()+"/"+startDate.getFullYear());
          $ModalContent.find("input[name='eDate']").val(endDate.getDate()+"/"+endDate.getMonth()+"/"+endDate.getFullYear());
          $ModalContent.find("input[name='title']").val(object.title);
          $ModalContent.find("textarea[name='description']").val(object.description);
          $ModalContent.find("select[id='products']").val(products).trigger("change");

          $("#send-modifs").click(function () {

              var startDate       = $ModalContent.find("input[name='sDate']").val();
              var endDate         = $ModalContent.find("input[name='eDate']").val();
              var title           = $ModalContent.find("input[name='title']").val();
              var description     = $ModalContent.find("textarea[name='description']").val();
              productIds          = $ModalContent.find("select[id='products']").val();

              if(productIds.length > 0){
                  var data = JSON.stringify(productIds);
                  $.ajax({

                      url: "/backend/promotions/"+obj_id+"/edit",
                      type: 'post',
                      data: {
                          sDate : startDate,
                          eDate : endDate,
                          title: title,
                          description : description,
                          data : data
                      },
                      success: function () {
                          //alert("Ok");
                          window.location.replace("/backend/promotions");
                      }
                  });
              } else {
                  alert("Veuillez sélectionner des produits");
              }

          });
        });


      //View Item in a Modal (JQuery Function)
      $(".vieM").click(function () {
        //alert("Ok");
        $Modal = $("#viewModal");
        $ModalContent = $Modal.find("#viewmodone");
        $("#example3").find("tbody").empty();

        var obj_id = $(this).attr("id");
        console.log(obj_id);
        for (var i = 0; i < _objects.length; i++) {

            if (_objects[i].id == obj_id) {
                var object = _objects[i];
                console.log(object);
            }
        }

        var startDate = new Date(object.startDate);
        var endDate = new Date(object.endDate);

        $ModalContent.find("#title").html(object.title);
        $ModalContent.find("#description").html(object.description);
        $ModalContent.find("#startDate").html(startDate.getDate()+"/"+startDate.getMonth()+"/"+startDate.getFullYear());
        $ModalContent.find("#endDate").html(endDate.getDate()+"/"+endDate.getMonth()+"/"+endDate.getFullYear());

          var products = [] ;
          var id = 0;
          for(var i = 0, len = object.products.length; i < len; i++){
              if(id != object.products[i].productPrice.product.id){
                  products.push(object.products[i].productPrice.product.id);
                  id =  object.products[i].productPrice.product.id;
              }
          }

        for(var j = 0; j < products.length; j++) {
            $("#example3").each(function () {
                 var tds = '<tr>';
                 tds += '<td>' + products[j].title + '</td>';
                 tds += '<td>' + products[j].productCode + '</td>';
                 tds += '<td>' + products[j].barcode + '</td>';
                 tds += '<td>' + products[j].titleCategory + '</td>';
                 tds += '</tr>';
                 if ($('tbody', this).length > 0) {
                      $(this).append(tds);
                 }
             });
        }

        $("#delete-modifs").click(function () {
            var r = confirm("Voulez vous supprimer cette promotion ?");
            if(r){
                $("#delete-modifs").html("Veuillez patienter...").attr("disabled", true);
                $.ajax({
                    url: "/backend/promotions/" + obj_id + "/delete",
                    type: 'post',
                    data: {
                        id: obj_id
                    },
                    success: function (data) {
                        if(data.error == false){
                            setTimeout(function () {
                                $("#delete-modifs").html("Supprimer").attr("disabled", false);
                                $("#errorMsg").removeAttr("class").attr("class", "alert alert-success").show();
                                $("#errorMsg").html("La promotion a été supprimée.");
                                setTimeout("window.location.replace('/backend/promotions');", 2000);
                            }, 3000);
                        } else {
                            setTimeout(function () {
                                $("#delete-modifs").html("Supprimer").attr("disabled", false);
                                $("#errorMsg").removeAttr("class").attr("class", "alert alert-danger").show();
                                $("#errorMsg").html("Une erreur est survenue. Veuillez réessayer !");
                            }, 3000);
                        }
                    }
                });
            }
        });
     });