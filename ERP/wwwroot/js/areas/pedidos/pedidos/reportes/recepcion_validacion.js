var tblreporte = document.getElementById('tblreporte');
var txtfecharango = document.getElementById('txtfecharango');
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
var cmbsucursal = document.getElementById('cmbsucursal');
var btnimprimir = document.getElementById('btnimprimir');



$(document).ready(function () {
    btnimprimir.setAttribute('href', ORIGEN + '/Pedidos/Reporte/ImprimirFormatoRecepcion_Validacion');
});


btnconsultar.addEventListener('click', function () {
    fngetreporte();
});

function fngetreporte() {
    var obj = {
        fecha: txtfecharango.value,
        sucursal: cmbsucursal.value,
    };
    let controller = new PedidoController();
    BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
    controller.ReporteRecepcionyValidacion(obj, function (data) {
        BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x " + e); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    });

}

btnexportar.addEventListener('click', function () {
    var obj = {
        tipo: ''
    };
    let controller = new PedidoController();
    controller.GenerarExcelReportevalidacion(obj);
});

btnimprimir.addEventListener('click', function () {
    var href = this.getAttribute('href');
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR RECEPCION');
});

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