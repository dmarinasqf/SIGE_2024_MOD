var tblproformas;


var btnbusqueda = $('#btnbusqueda');
var txtfechaconsulta = $('#txtfechaconsulta');
var txtnumproformas = $('.numproformas');


$(document).ready(function () {
    tblproformas = $('#tblproformas').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": true,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        //dom: 'Bfrtip',
        responsive: true,
        //buttons: BOTONESDATATABLE('LISTA DE GRUPOS ', 'V', false),
        "order": [[4, "desc"]],
        "language": LENGUAJEDATATABLE(),  
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                }]       
    });
});

$('#tblproformas tbody').on('click', 'tr', function () {
    $(this).toggleClass('selected');
    var numproformas = tblproformas.rows('.selected').data().length;
    if (numproformas === 0)
        btnnext2.prop('disabled', true);
    else
        btnnext2.prop('disabled', false);

    txtnumproformas.text(numproformas);
});

function listarProformasproveedor(idproveedor) {
    var url = ORIGEN + "/Compras/CCotizacion/BuscarCotizacionxProveedor";
    var obj = {
        proveedor: idproveedor
    };
    $.post(url, obj).done(function (data) {
      
        if (data != null) {
            data = JSON.parse(data);
            tblproformas.clear().draw(false);
            if (data.length === 0)
                mensaje('I','No hay proformas terminadas para el proveedor seleccionado');
            for (var i = 0; i < data.length; i++) {
                tblproformas.row.add([
                    data[i]['ID'],
                    data[i]['COD'],
                    data[i]['RUCPROVEEDOR'],
                    data[i]['RAZONSOCIAL'],
                    moment(data[i]['FECHA']).format('DD/MM/YYYY hh:mm:ss'),
                    data[i]['FEVENCIMIENTO'],
                    data[i]['CONTACTO'],
                    data[i]['REPRESENTANTE'],                    
                    data[i]['ESTADO'],
                    data[i]['TOTAL'].toFixed(2),
                    data[i]['USUARIO'],
                ]).draw(false);
            
            }
            tblproformas.columns.adjust().draw();
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}
   
   
  
   