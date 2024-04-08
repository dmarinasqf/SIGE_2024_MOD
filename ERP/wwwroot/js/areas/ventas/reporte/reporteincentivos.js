var txtnombresempleado = document.getElementById('txtnombresempleado');
var txtidempleado = document.getElementById('txtidempleado');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var cmbtipo = document.getElementById('cmbtipo');
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

$(document).ready(function () {
    init() 
});
function init() {
    let sucucontroller = new SucursalController();
    sucucontroller.ListarTodasSucursales('cmbsucursales', null, function () {
        var demo1 = $('#cmbsucursales').bootstrapDualListbox({
            nonSelectedListLabel: 'Non-selected',
            selectedListLabel: 'Selected',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: true,
        });
        var container1 = demo1.bootstrapDualListbox('getContainer');
        container1.find('.btn').removeClass('btn-default').addClass('btn-xs btn-outline-info btn-h-outline-info btn-bold m-0')
            .find('.glyphicon-arrow-right').attr('class', 'fa fa-arrow-right').end()
            .find('.glyphicon-arrow-left').attr('class', 'fa fa-arrow-left')
    });
    let empcontroller = new EmpleadoController();
    empcontroller.ListarEmpleadosDatosBasicosCombo({},'cmbempleados','documento', function (data) {
        var demo1 = $('#cmbempleados').bootstrapDualListbox({
            nonSelectedListLabel: 'Non-selected',
            selectedListLabel: 'Selected',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: true,
        });
        var container1 = demo1.bootstrapDualListbox('getContainer');
        container1.find('.btn').removeClass('btn-default').addClass('btn-xs btn-outline-info btn-h-outline-info btn-bold m-0')
            .find('.glyphicon-arrow-right').attr('class', 'fa fa-arrow-right').end()
            .find('.glyphicon-arrow-left').attr('class', 'fa fa-arrow-left')
    });
};

function iniciarTabla() {
    tblreporte = $('#tblreporte').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}
function fngetreporte(top) {
    //if (fngetempleados() == '')
    //    return;
    //if (fngetsucursales() == '')
    //    return;

    var obj = {
        top: 1000,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        empleados: fngetempleados(),
        sucursales: fngetsucursales(),
        tipo: cmbtipo.value
    };
    let controller = new ReporteVentasController();
    controller.ReporteIncentivosDetallado(obj, function (data) {
        console.log(data);
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x"); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();

    });
}

txtfechainicio.addEventListener('change', function () {
    txtfechafin.setAttribute('min', moment(txtfechainicio.value).format('YYYY-MM-DD'));
});

$(document).on('click', '.btnpasarempleado', function () {
    var fila = this.parentNode.parentNode;
    $('#modalempleados').modal('hide');
    var idempleado = fila.getAttribute('id');
    txtidempleado.value = idempleado;
    txtnombresempleado.value = fila.getElementsByTagName('td')[1].innerText;   
});

btnexportar.addEventListener('click', function () {
    //if (fngetempleados() == '')
    //    return;
    //if (fngetsucursales() == '')
    //    return;

    var obj = {        
        top: 999999,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        empleados: fngetempleados(),
        sucursales: fngetsucursales(),
        tipo:cmbtipo.value
    };
    let controller = new ReporteVentasController();
    controller.DescargarExcelReporteIncentivoDetallado(obj);
});
btnconsultar.addEventListener('click', function () {
    fngetreporte(1000);
});
function fngetsucursales() {
    var options = $('select[name="cmbsucursales[]_helper2"]').find('option');
    var sucursales = '';
    for (var i = 0; i < options.length; i++) {
        if (options[i].value != '') {
            if (options.length - 1 != i)
                sucursales += options[i].value + '|';
            else
                sucursales += options[i].value;
        }
    }
    return sucursales;
}
function fngetempleados() {
    var options = $('select[name="cmbempleados[]_helper2"]').find('option');
    var empleados = '';
    for (var i = 0; i < options.length; i++) {
        if (options[i].value != '') {
            if (options.length - 1 != i)
                empleados += options[i].value + '|';
            else
                empleados += options[i].value;
        }
    }
    return empleados;
}