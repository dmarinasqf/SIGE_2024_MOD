var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
var txtfechafin = document.getElementById('txtfechafin');
var txtfechainicio = document.getElementById('txtfechainicio');
var cmbsucursal = document.getElementById('cmbsucursal');
var cmbempresa = document.getElementById('cmbempresa');
var cmbprecios = document.getElementById('cmbprecios');

var tblreporte;
$(document).ready(function () {
    let controller = new EmpresaController();
    controller.ListarEmpresas('cmbempresa');
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
cmbempresa.addEventListener('click', function () {
    if (cmbempresa.value == '')  return;
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbsucursal', cmbempresa.value);
});
cmbsucursal.addEventListener('click', function () {
    if (cmbsucursal.value == '') return;
    let controller = new SucursalController();
    controller.ListarListasSucursal(cmbsucursal.value, 'cmbprecios');
});
btnconsultar.addEventListener('click', function () {
    var obj = {       
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        top: 1000,
        empresa: cmbempresa.value,
        sucursal: cmbsucursal.value,
        lista: cmbprecios.value
    };
    let controller = new ReporteController();
    controller.GetReporteMensual(obj, function (data) {
        if (data.length != 0) {
            try { tblreporte.clear().draw(); } catch (e) { console.log("x.x"); }
            limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
            crearCabeceras(data, '#tblreporte', false);
            crearCuerpo(data, '#tblreporte');
            iniciarTabla();
        } else {
            mensaje('I', 'No hay datos en la consulta');
        }
       

    });
});
btnexportar.addEventListener('click', function () {
    var obj = {
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        top: 999999,
        empresa: cmbempresa.value,
        sucursal: cmbsucursal.value,
        lista: cmbprecios.value
    };
    let controller = new ReporteController();
    controller.ExportarReporteMensual(obj);
});