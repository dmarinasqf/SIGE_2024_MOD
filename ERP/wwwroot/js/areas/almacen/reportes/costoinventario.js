var cmbsucursal = document.getElementById('cmbsucursal');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');

var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

var tblreporte;

$(document).ready(function () {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('cmbsucursal');
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

function fngetreporte() {
    var obj = {
        idsucursal: cmbsucursal.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value
    };
    let controller = new ReporteController();
    controller.ReporteCostoInventario(obj, function (data) {
        if (data.length > 0) {
            try { tblreporte.clear().draw(); } catch (e) { console.log("x.x " + e); }
            limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
            crearCabeceras(data, '#tblreporte', false);
            crearCuerpo(data, '#tblreporte');
            iniciarTabla();
        }
    });
}

btnconsultar.addEventListener('click', function () {
    if (cmbsucursal.value != "" || txtfechainicio.value != "" || txtfechafin.value != "") {
        fngetreporte();
    } else {
        mensaje("W", "Llenar todos los campos");
    }
    
});
btnexportar.addEventListener('click', function () {
    if (cmbsucursal.value != "" || txtfechainicio.value != "" || txtfechafin.value != "") {
        var obj = {
            idsucursal: cmbsucursal.value,
            fechainicio: txtfechainicio.value,
            fechafin: txtfechafin.value
        };
        let controller = new ReporteController();
        controller.GenerarExcelCostoInventario(obj);
    } else {
        mensaje("W", "Llenar todos los campos");
    }
    
});