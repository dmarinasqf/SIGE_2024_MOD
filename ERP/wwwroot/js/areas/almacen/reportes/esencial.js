var cmblaboratorio = document.getElementById('cmblaboratorio');
var cmbsucursal = document.getElementById('cmbsucursal');

var tblreporte = document.getElementById('tblreporte');
var txtsucursal = document.getElementById('txtsucursal');
var lblnombreproducto = document.getElementById('lblnombreproducto');

var txtstockinicial = document.getElementById('txtstockinicial');
var txtstockfinal = document.getElementById('txtstockfinal');

var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

$(document).ready(function () {   
        let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbsucursal', 'LOCAL');
    
    controller.ListarLaboratorio('cmblaboratorio');
});

btnconsultar.addEventListener('click', function () {
    fngetreporte();
});


btnexportar.addEventListener('click', function () {
    var obj = {
        sucursal: cmbsucursal.value
    };
    let controller = new ReporteController();
    controller.GenerarExcelEsencial(obj);
});


function fngetreporte() {
    var obj = {
        sucursal: cmbsucursal.value,
        laboratorio: cmblaboratorio.value
    };
    let controller = new ReporteController();
    BLOQUEARCONTENIDO('contenedor','Cargando......')
    controller.ReporteEsencial(obj, function (data) {

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

//function listar() {
//    const $cmbalerta = document.getElementById('cmbalerta');
//    let value = ['0','1','2'];
//    let text = ['TODOS', 'SI', 'NO'];
//    for (var i = 0; i < value.length; i++) {
//        const option = document.createElement('option');
//        option.value = value[i];
//        option.text = text[i];
//        $cmbalerta.appendChild(option);
//    }
//}