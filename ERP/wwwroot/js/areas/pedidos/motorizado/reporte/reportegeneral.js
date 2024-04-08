var tblReporteGeneral;
var cmbSucursal = document.getElementById('cmbSucursal');
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
var txtfecharango = document.getElementById('txtfecharango');
var btnimprimir = document.getElementById('btnimprimir');

var ORIGEN = location.origin.toString();

$(document).ready(function () {
    if (cmbSucursal.getAttribute('tipo') == 'select') {
        let controller = new SucursalController();
        controller.ListarSucursalxEmpresaEnCombo('cmbSucursal', null, null, null, true)
    }
});

function iniciarTabla() {
    tblReporteGeneral = $('#tblReporteGeneral').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}

function fngetreporte() {
    var obj = {
        sucursal: cmbSucursal.value,
        fecha: txtfecharango.value
    };
    BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');

    let controllerMotorizado = new MotorizadoController();
    controllerMotorizado.ReporteGeneral(obj, function (data) {
        try {
            tblReporteGeneral.clear().draw();
        } catch (e) {
            console.log("x.x");
        }
        limpiarTablasGeneradas('#contenedor', 'tblReporteGeneral', false);

        data.sort(function (a, b) {
            var productoA = (a.producto && typeof a.producto === 'string') ? a.producto.toUpperCase() : '';
            var productoB = (b.producto && typeof b.producto === 'string') ? b.producto.toUpperCase() : '';

            if (productoA < productoB) {
                return -1;
            }
            if (productoA > productoB) {
                return 1;
            }
            return 0;
        });
        crearCabeceras(data, '#tblReporteGeneral', false, 12);
        crearCuerpo(data, '#tblReporteGeneral', 12);
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    });
}

btnconsultar.addEventListener('click', function () {
    fngetreporte();
});

btnexportar.addEventListener('click', function () {
    var obj = {
        sucursal: cmbSucursal.value,
        fecha: txtfecharango.value
    }
    let controllerMotorizado = new MotorizadoController();
    controllerMotorizado.GenerarExcelReporteGeneral(obj);
});

$(document).ready(function () {
    var url = ORIGEN + '/Pedidos/Motorizado/GenerarPdfReporteGeneral';
    btnimprimir.setAttribute('href', url);
});

btnimprimir.addEventListener('click', function () {
    var sucursal = cmbSucursal.value;
    var fecha = txtfecharango.value;

    var href = this.getAttribute('href') + '?sucursal=' + sucursal + '&fecha=' + fecha;
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR REPORTE GENERAL');
});