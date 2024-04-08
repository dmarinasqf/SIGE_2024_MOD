var tbllista;


var btnbusqueda = $('#btnbusqueda');
var txtfechaconsulta = $('#txtfechaconsulta');
var txtcodpreingreso = document.getElementById('txtcodpreingreso');
var txtcodigororden = document.getElementById('txtcodigororden');
var txtcodigofactura = document.getElementById('txtcodigofactura');


$(document).ready(function () {
    iniciarTablaVista();
});
function iniciarTablaVista() {
   
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = false;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable);
    fnBuscarPreingresos();
}

$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

txtcodpreingreso.addEventListener('keyup', function () {
    fnBuscarPreingresos();
});
txtcodigororden.addEventListener('keyup', function () {
    fnBuscarPreingresos();
});
txtcodigofactura.addEventListener('keyup', function () {
    fnBuscarPreingresos();
});
$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    fnBuscarPreingresos();
  
});

function fnBuscarPreingresos() {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { value: 100, name: 'top' };
    //btnbusqueda.prop('disabled', true);
    var controller = new PreingresoController();
    controller.ListarPreingresos(obj, fnAgregarFilasTabla);   
}

function fnAgregarFilasTabla(data) {
    console.log(data);
    tbllista.clear().draw();
    for (var i = 0; i < data.length; i++) {
        tbllista.row.add([
            '<div class="btn-group btn-group-sm">' +
            '<a class="btn btn-sm btn-outline-warning  font-10" data-toggle="tooltip" data-placement="top" title="Editar Preingreso" href="' + ORIGEN + '/PreIngreso/PIPreingreso/Registrar/' + data[i]['ID'] + "?idfactura=" + data[i]['IDFACTURA'] + '"><i class="fas fa-edit"></i></a>' +
            '<button class="btn btn-sm btn-outline-info   btnimprimir font-10" data-toggle="tooltip" data-placement="top" title="Imprimir Preingreso" target="_blank" href="' + ORIGEN + '/PreIngreso/PIPreingreso/Imprimir/' + data[i]['ID'] + '"><i class="fas fa-print"></i></button>' +
            '<button class="btn btn-sm btn-outline-dark font-10" onclick="verfacturas(' + data[i]['ID'] + ')" data-toggle="tooltip" data-placement="top" title="Facturas de preingreso" ><i class="fas fa-file-invoice"></i></button>' +
            '<a class="btn btn-sm btn-outline-success   font-10" data-toggle="tooltip" data-placement="top" title="Aprobar factura" href="' + ORIGEN + '/Compras/CAprobarFactura/AprobarFactura?id=' + data[i]['IDFACTURA'] + '" target="_blank"><i class="fas fa-check"></i></a>' +
            //'<a class="btn btn-sm btn-outline-danger waves-effect  font-10" data-toggle="tooltip" data-placement="top" title="Generar Pdf" target="_blank" href="/PreIngreso/PIPreingreso/GenerarPDF/' + data[i]['ID'] + '"><i class="fas fa-file-pdf"></i></a>' +
            '</div>',
            data[i]['CODIGO'],
            data[i]['CODIGOORDEN'],
            data[i]['FACTURAS'],
           moment( data[i]['FECHA']).format('DD/MM/YYYY hh:mm A'),
            data[i]['RAZONSOCIAL'],
            data[i]['USERNAME'],
            data[i]['ESTADO']
        ]).draw(false);
    }
    tbllista.columns.adjust().order([4, 'desc']).draw(false);
}
function verfacturas(id) {
    var obj = new _FacturasPreingreso();
    obj.fnListarFacturasPreingresoSinCheck(id);
    
}
$(document).on('click', '.btnimprimir', function () {
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR PREINGRESO COMPLETO');
});
