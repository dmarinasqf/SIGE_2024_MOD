

var txtfecharango = document.getElementById('txtfecharango');
var tblreporte = document.getElementById('tblreporte');

var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

btnconsultar.addEventListener('click', function () {
    fngetreporte();
});


function fngetreporte() {
    var obj = {
        fecha: txtfecharango.value
    };
    BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
    let controller = new ReporteController();
    //
    controller.ReporteNegociacionCompras(obj, function (data) {

        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x " + e); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
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
btnexportar.addEventListener('click', function () {
    btnexportar.disabled = true;
    btnexportar.style.background = "#235223";
    var obj = {
        fecha: txtfecharango.value
    };
    let controller = new ReporteController();
    controller.GenerarExcelReporteNegociacionCompras(obj);
});