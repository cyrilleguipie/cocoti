$(function() {
    var webroot = $('#webroot').val();

    $('.indexSlider').bxSlider({
        auto: true,
        controls: false,
        pager: true,
        mode: 'horizontal',
		randomStart: false,
		autoHover: true
		
    });

    $('#produit-success').modal('show');

    $('.connexion').click(function(){
        var val = $('.connexion:checked').val();
        $('#connexion_precommande').val(val);
    });

    $('#localite').change(function(){
        var id = $(this).val(); 
        var data = 'communeIdChange=' + id ;             
        
        $.ajax({
            type : 'GET',
            url: webroot + 'process/result.php',
            data : data,
            success : function(server_response) {
                $('#produit-form .modal-content .modal-body .modal-inject #pv').html(server_response);
            }
        });
    });
});
/**
     * DataTables
     */

    $('.datatable').dataTable({
        "sPaginationType": "bs_normal",
        "oLanguage": {
            "sProcessing":     "Traitement en cours...",
            "sSearch":         "Rechercher&nbsp; :",
            "sLengthMenu":     "Afficher _MENU_ &eacute;l&eacute;ments",
            "sInfo":           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
            "sInfoEmpty":      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
            "sInfoFiltered":   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
            "sInfoPostFix":    "",
            "sLoadingRecords": "Chargement en cours...",
            "sZeroRecords":    "Aucun &eacute;l&eacute;ment &agrave; afficher",
            "sEmptyTable":     "Aucune donn&eacute;e disponible dans le tableau",
            "oPaginate": {
                "sFirst":      "",
                "sPrevious":   "",
                "sNext":       "",
                "sLast":       ""
            },
            "oAria": {
                "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
                "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
            }
        }
    }); 

    $('.datatable').each(function(){
        var datatable = $(this);
        // SEARCH - Add the placeholder for Search and Turn this into in-line form control
        var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
        search_input.attr('placeholder', 'Recherche');
        search_input.addClass('form-control input-sm');
        // LENGTH - Inline-Form control
        var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
        length_sel.addClass('form-control input-sm');
        datatable.bind('page', function(e){
            window.console && console.log('pagination event:', e) //this event must be fired whenever you paginate
        });
    });

   $(document).ready(function() {
        $(".remove").click(function() {
            $(".connexion").removeAttr("checked");
        });
    });