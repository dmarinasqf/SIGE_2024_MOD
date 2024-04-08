//----------------------------------------
///EARTC10000
var cmbestado = document.getElementById('cmbestado');
var cmbempresa = document.getElementById('cmbempresa');
var txtcodigodocumento = document.getElementById('txtcodigodocumento');
var cmbtipo = document.getElementById('cmbtipo');

var tblreporte = document.getElementById('tblreporte');

var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

$(document).ready(function () {   
    //    let controller = new SucursalController();
    //controller.ListarSucursalxEmpresaEnCombo('cmbsucursal', 'LOCAL');
    
    //controller.ListarLaboratorio('cmblaboratorio');
});

btnconsultar.addEventListener('click', function () {
    fngetreporte();
});


btnexportar.addEventListener('click', function () {
    var obj = {
        tipo: ''
    };
    let controller = new ReporteController();
    controller.GenerarExcelGuiasTransferencias(obj);
});


function fngetreporte() {
    var obj = {
        codigo: txtcodigodocumento.value,
        estado: cmbestado.value,
        tipo: cmbtipo.value,
        idempresa: cmbempresa.value
    };
    let controller = new ReporteController();
    BLOQUEARCONTENIDO('contenedor','Cargando......')
    controller.ReporteGuiasTransferencias(obj, function (data) {

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