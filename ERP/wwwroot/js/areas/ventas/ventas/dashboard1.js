var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var cmbsucursal = document.getElementById('cmbsucursal');
var btnconsultar = document.getElementById('btnconsultar');
var btndiario = document.getElementById('btndiario');
var btnmensual = document.getElementById('btnmensual');
var btnanual = document.getElementById('btnanual');

$(document).ready(function () {
    txtfechafin.value = moment().format('YYYY-MM-DD');
    txtfechainicio.value = moment().add(-10, 'd').format('YYYYY-MM-DD');
    if(cmbsucursal.getAttribute('tipo')=='combo')
        fnlistarsucursales();
});
function fnlistarsucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('cmbsucursal',IDSUCURSAL);
}

cmbsucursal.addEventListener('change', function () {
    IDSUCURSAL = cmbsucursal.value;
});
