var cmbMEsucursal = document.getElementById('cmbMEsucursal');
var txtMEempleado = document.getElementById('txtMEempleado');
var tblMEtbody = document.getElementById('tblMEtbody');
var tblMEtabla;

$(document).ready(function () {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('cmbMEsucursal');
});

$('#modalempleados').on('shown.bs.modal', function () {
    fnMEbuscarempleados();
});

txtMEempleado.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnMEbuscarempleados();
});

function fnMEbuscarempleados() {
    var obj = {
        filtro: txtMEempleado.value,
        top: 20,
        sucursal: cmbMEsucursal.value
    };
    let controller = new EmpleadoController();
    controller.BuscarEmpleados(obj,function (data) {
       
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr id="' + data[i].id + '">';
            fila += '<td class="numdoc">' + data[i].documento+'</td>';
            fila += '<td class="nombres">' + data[i].nombres+'</td>';
            fila += '<td>' + data[i].sucursal+'</td>';
            fila += '<td>' + data[i].empresa+'</td>';
            fila += '<td class="text-right"><button class="btn btn-sm btn-success btnpasarempleado"><i class="fas fa-check"></i></button></td>';
            fila += '</tr>';
        }
        tblMEtbody.innerHTML = fila;
    });
}