var tblreporte = document.getElementById('tblreporte');
var txtdias = document.getElementById('txtdias');
var cmbsucursal = document.getElementById('cmbsucursal');
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

$(document).ready(function () {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbsucursal', null, null, null, true);
});

btnconsultar.addEventListener('click', function () {
    fngetreporte();
});

function fngetreporte() {
    var obj = {
        num_dias: txtdias.value,
        suc_codigo: cmbsucursal.value
    };
    let controller = new ReporteController();
    BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
    controller.ReporteProductosxVencer(obj, function (data) {
        BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x " + e); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    });

    btnexportar.addEventListener('click', function () {
        var obj = {
            suc_codigo: cmbsucursal.value
        };
        let controller = new ReporteController();
        controller.GenerarExcelProductosxVencer(obj);
    });
}

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