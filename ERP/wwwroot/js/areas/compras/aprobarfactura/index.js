var tbllista;


var btnbusqueda = $('#btnbusqueda');
var txtnumfactura = document.getElementById('txtnumfactura');
var txtnumpreingreso = document.getElementById('txtnumpreingreso');
var txtnumordencompra = document.getElementById('txtnumordencompra');
var cmbestado = document.getElementById('cmbestado');


$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = false;
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable, 'DD/MM/YYYY hh:mm A');

    fnBuscarFacturas();
});

function fnBuscarFacturas() {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: 'top', value: 100 };
    btnbusqueda.prop('disabled', true);
    var controller = new AprobarFacturaController();
    controller.ListarFacturas(obj, fnAgregarFilasTabla);
    btnbusqueda.prop('disabled', false);
}

function fnAgregarFilasTabla(data) {
    tbllista.clear().draw();
    for (var i = 0; i < data.length; i++) {
        var btnLista = '<a class="btn btn-md btn-outline-success font-10" data-toggle="tooltip" data-placement="top" title="Aprobar Factura" href="' + ORIGEN + '/Compras/CAprobarFactura/AprobarFactura?id=' + data[i]['IDFACTURA'] + '"><i class="fas fa-check"></i></a>';
        if (data[i]['ESTADOFACT'] == "APROBADO") {
            btnLista = '<a class="btn btn-md btn-outline-info font-10" data-toggle="tooltip" data-placement="top" title="Ver Factura" href="' + ORIGEN + '/Compras/CAprobarFactura/AprobarFactura?id=' + data[i]['IDFACTURA'] + '"><i class="fas fa-eye"></i></a>' + 
                '<button class="btn btn-sm btn-outline-dark btnimprimir font-10" data-toggle="tooltip" data-placement="top" title="Imprimir Factura" target = "_blank" href="' + ORIGEN + '/Compras/CAprobarFactura/Imprimir/' + data[i]['IDFACTURA'] + '"><i class="fas fa-print"></i></button>';
        } else if (data[i]['ESTADOFACT'] == "ANULADO") {
            btnLista = '<a class="btn btn-md btn-outline-danger font-10" data-toggle="tooltip" data-placement="top" title="Ver Factura" href="' + ORIGEN + '/Compras/CAprobarFactura/AprobarFactura?id=' + data[i]['IDFACTURA'] + '"><i class="fas fa-eye"></i></a>';
        }
        tbllista.row.add([
            '<div class="btn-group btn-group-sm">' +
            //'<a class="btn btn-sm btn-outline-warning font-10" data-toggle="tooltip" data-placement="top" title="Editar Factura" href="' + ORIGEN + '/PreIngreso/PIPreingreso/Registrar/' + data[i]['ID'] + "?idfactura=" + data[i]['IDFACTURA'] + '"><i class="fas fa-edit"></i></a>' +
            /*'<button class="btn btn-sm btn-outline-info btnimprimir font-10" data-toggle="tooltip" data-placement="top" title="Imprimir Preingreso" target="_blank" href="' + ORIGEN + '/PreIngreso/PIPreingreso/Imprimir/' + data[i]['ID'] + '"><i class="fas fa-print"></i></button>' +*/
            /*'<button class="btn btn-sm btn-outline-dark font-10" onclick="verfacturas(' + data[i]['ID'] + ')" data-toggle="tooltip" data-placement="top" title="Facturas de preingreso" ><i class="fas fa-file-invoice"></i></button>' +*/
            btnLista +
            '</div>',
            data[i]['NUMFACTURA'],
            data[i]['NUMPREINGRESO'],
            data[i]['NUMORDENCOMPRA'],
            data[i]['PROVEEDOR'],
            moment(data[i]['FECHAAPROBACION']).format('DD/MM/YYYY hh:mm A'),
            data[i]['ESTADOFACT'],
        ]).draw(false);
    }
    tbllista.columns.adjust().draw(false);
}

$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    fnBuscarFacturas();
});

txtnumfactura.addEventListener('keyup', function () {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: 'top', value: 100 };
    var controller = new AprobarFacturaController();
    controller.ListarFacturas(obj, fnAgregarFilasTabla);
});
txtnumpreingreso.addEventListener('keyup', function () {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: 'top', value: 100 };
    var controller = new AprobarFacturaController();
    controller.ListarFacturas(obj, fnAgregarFilasTabla);
});
txtnumordencompra.addEventListener('keyup', function () {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: 'top', value: 100 };
    var controller = new AprobarFacturaController();
    controller.ListarFacturas(obj, fnAgregarFilasTabla);
});
cmbestado.addEventListener('change', function () {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: 'top', value: 100 };
    var controller = new AprobarFacturaController();
    controller.ListarFacturas(obj, fnAgregarFilasTabla);
});

$(document).on('click', '.btnimprimir', function () {
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR FACTURA');
});
