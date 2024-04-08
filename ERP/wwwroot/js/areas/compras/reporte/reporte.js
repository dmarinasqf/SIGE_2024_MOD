var tblreporte = document.getElementById('tblreporte');
var txtfecharango = document.getElementById('txtfecharango');
var cmbproveedor = document.getElementById('cmbproveedor');
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

$(document).ready(function () {
    let controller = new ReporteController();
    controller.ListarProveedor('cmbproveedor');
});

btnconsultar.addEventListener('click', function () {
    fngetreporte();
});

function fngetreporte() {
    var obj = {
        fecha: txtfecharango.value,
        idproveedor: cmbproveedor.value
    };
    let controller = new ReporteController();
    BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
    controller.ReporteDevolucionProveedor(obj, function (data) {
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
            proveedor: cmbproveedor.value
        };
        let controller = new ReporteController();
        controller.GenerarExcelDevolucionProveedor(obj);
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