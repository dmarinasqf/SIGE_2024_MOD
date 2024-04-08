

var tbllista;
var CABECERA = [];
var DETALLE = [];
var spiner = $('#spinners');
var btnConsultar = $('#btnConsultar');
var txtidsucursalconsulta = $('#txtidsucursalconsulta');
var txtfechainicio = '';
var txtfechafin = '';
$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
       
        //"language": LANGUAGETABLE()
    });
 
    listarventas();

});



$('#btnConsultar').click(function (e) {
    listarventas();
});
$('#btnexportar').click(function (e) {
    descargarReporte();
});


function listarventas() {

    $('#btnConsultar').prop('disabled', true);
    spiner.removeClass('mostrar');

    var url = ORIGEN + '/Vinali/Vinali/GetReporteVentas';
    var obj = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        //sucursal: txtidsucursalconsulta.val(),
        tipoconsulta: 'CONSULTA'
    };
    $.post(url, obj).done(function (data) {
        console.log(data);
        tbllista.clear().draw(false);
     
        CABECERA = data;
        for (var i = 0; i < CABECERA.length; i++) {
            var fila = tbllista.row.add([
             
                moment(CABECERA[i]['FECHA']).format('DD/MM/YYYY hh:mm'),
                CABECERA[i]['EMPRESA'],
                CABECERA[i]['SUCURSAL'],
                CABECERA[i]['DOCUMENTO'],
                CABECERA[i]['NUMDOCUMENTO'],
                CABECERA[i]['TIPOVENTA'],
                CABECERA[i]['CLIENTE'],
                CABECERA[i]['IMPORTE'].toFixed(2),
                CABECERA[i]['USUARIO'],

            ]).draw(false).node();
        }
        tbllista.columns.adjust().draw();
        $('#btnConsultar').prop('disabled', false);
    }).fail(function (data) {

        $('#btnConsultar').prop('disabled', false);
     
    });

}

function descargarReporte() {
    spiner.removeClass('mostrar');
    $('#btnexportar').prop('disabled', true);
    var url = ORIGEN + '/Vinali/Vinali/GetReporteVentas';
    var obj = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        //sucursal: txtidsucursalconsulta.val(),
        tipoconsulta: 'EXPORTACION'
    };
    $.post(url, obj).done(function (data) {
     
        $('#btnexportar').prop('disabled', false);
        var url = location.origin.toString();
        location.href = ORIGEN + data.objeto;
      
    }).fail(function (data) {
     
        $('#btnexportar').prop('disabled', false);
        mensaje("D", 'Error en el servidor.');
       
    });
}
function generartxt(idventa) {

    var url = ORIGEN + '/Venta/Factura/generartxt?idventa=' + idventa;

    $.post(url, obj).done(function (data) {
        console.log(data);

    }).fail(function (data) {
        console.log(data);

    });
}