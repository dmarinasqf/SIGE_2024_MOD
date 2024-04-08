var btnbusqueda = $('#btnbusqueda');

var tblrequerimiento;

$(document).ready(function () {
    tblrequerimiento = $('#tblrequerimiento').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": true,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        //dom: 'Bfrtip',
        responsive: true,
        //buttons: BOTONESDATATABLE('LISTA DE GRUPOS ', 'V', false),
        "order": [[4, "desc"]],
        "language": LENGUAJEDATATABLE(),
        //"columnDefs": [
        //    {
        //        "targets": [0],
        //        "visible": false,
        //        "searchable": false
        //    }]
    });
    //var datatable = new DataTable();
    //datatable.searching = true;
    //datatable.lengthChange = true;
    //datatable.ordering = false;
    //var util = new UtilsSisqf();
    //tblrequerimiento = util.Datatable('tblrequerimiento', false, datatable, 'DD/MM/YYYY hh:mm A');
    fnlistarsucursal();
    fnlistarGrupos();
    fnBuscarRequerimientos();

    fnBuscarRequerimientos();
});
function fnBuscarRequerimientos() {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: 'top', value: 100 };
    obj[obj.length] = { name: 'tipoConsulta', value: "MODALORDEN" };
    btnbusqueda.prop('disabled', true);
    var controller = new RequerimientoController();
    controller.ListarRequerimientos(obj, fnAgregarFilasTabla);
    btnbusqueda.prop('disabled', false);
}

function fnAgregarFilasTabla(data) {
    tblrequerimiento.clear().draw();
    for (var i = 0; i < data.length; i++) {
        tblrequerimiento.row.add([
            data[i]['idrequerimiento'],
            data[i]['GRUPO'],
            data[i]['NOMBRE'],
            moment(data[i]['fechacreacion']).format('DD/MM/YYYY hh:mm A'),
            data[i]['estado'],
            '<button class="btn btn-sm btn-success btnpasarrequerimiento"><i class="fas fa-check"></i></button>',
        ]).draw(false);
    }
    tblrequerimiento.columns.adjust().draw(false);
}

$('#tblrequerimiento tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblrequerimiento.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

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