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
                mensaje('I', 'No hay proformas terminadas para el proveedor seleccionado');
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
                    '<button class="btn btn-sm btn-success btnpasarproforma"><i class="fas fa-check"></i></button>',
                ]).draw(false);

            }
            tblproformas.columns.adjust().draw();
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}

$('#tblproformas tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblproformas.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});