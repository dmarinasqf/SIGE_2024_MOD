var btnbusqueda = $('#btnbusqueda');
var cmbgrupo = document.getElementById('cmbgrupo');
var txtsucursal = document.getElementById('txtsucursal');

var tbllista;

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = false;
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable, 'DD/MM/YYYY hh:mm A');

    fnlistarsucursal();
    fnlistarGrupos();
    fnBuscarRequerimientos();
});
function fnBuscarRequerimientos() {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: 'top', value: 100 };
    btnbusqueda.prop('disabled', true);
    var controller = new RequerimientoController();
    controller.ListarRequerimientos(obj, fnAgregarFilasTabla);
    btnbusqueda.prop('disabled', false);
}

function fnAgregarFilasTabla(data) {
    tbllista.clear().draw();
    for (var i = 0; i < data.length; i++) {
        var botonFila = '<a class="btn btn-warning btneditar ml-1" data-toggle="tooltip" data-placement="top" title="Editar" href="' + ORIGEN + '/Compras/CRequerimiento/RegistrarEditar?id=' + data[i]['idrequerimiento'] + '"><i class="fas fa-edit"></i></a >';
        if (data[i].idordencompra > 0) {
            botonFila = '<a class="btn btn-primary btnconsultar" data-toggle="tooltip" data-placement="top" title="Consultar" href="' + ORIGEN + '/Compras/CRequerimiento/RegistrarEditar?id=' + data[i]['idrequerimiento'] + '"><i class="fas fa-eye"></i></a >';
        }
        tbllista.row.add([
            botonFila,
            data[i]['idrequerimiento'],
            data[i]['GRUPO'],
            data[i]['NOMBRE'],
            moment(data[i]['fechacreacion']).format('DD/MM/YYYY hh:mm A'),
            data[i]['estado'],
        ]).draw(false);
    }
    tbllista.columns.adjust().draw(false);
}

function fnlistarsucursal() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('txtsucursal', IDSUCURSAL);
}
function fnlistarGrupos() {
    let controller = new ModulosGrupoController();
    controller.ListarGrupos('cmbgrupo');
}

$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    fnBuscarRequerimientos();
});