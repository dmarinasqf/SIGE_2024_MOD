var cmbsucursal = document.getElementById('cmbsucursal');
var txtcodproducto = document.getElementById('txtcodproducto');
var txtproducto = document.getElementById('txtproducto');
var btnbuscar = document.getElementById('btnbuscar');


var tbodystock = document.getElementById('tbodystock');
var formregistro = document.getElementById('formregistro');
var txtidstock = document.getElementById('txtidstock');
var txtidproducto = document.getElementById('txtidproducto');
var txtproductoedit = document.getElementById('txtproductoedit');
var txtalmacen = document.getElementById('txtalmacen');
var txtfechaingreso = document.getElementById('txtfechaingreso');
var txtfechavencimiento = document.getElementById('txtfechavencimiento');
var txtlote = document.getElementById('txtlote');
var txtregsanitario = document.getElementById('txtregsanitario');
var txtmultiplo = document.getElementById('txtmultiplo');
//var txtmultiploblister = document.getElementById('txtmultiploblister');
var txtcantidad = document.getElementById('txtcantidad');
var btneditar = document.getElementById('btneditar');

$(document).ready(function () {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('cmbsucursal');
});

$(document).on('click', '.btnpasarproducto', function () {
    var fila = tbl_CBPtabla.row($(this).parents('tr')).data();
    txtproducto.value = this.parentNode.parentNode.getElementsByClassName('nombreproducto')[0].innerText;
    txtcodproducto.value = fila[1];
   
    $('#modalproductos').modal('hide');
});
txtproducto.addEventListener('dblclick', function () {
    $('#modalproductos').modal('show');
});
btnbuscar.addEventListener('click', function () {
    if (txtproducto.value!='')
        fngetreporte(1000);
});
$(document).on('dblclick', '#tbodystock tr', function () {
    var fila = this;
    let controller = new StockController();
    console.log(fila.getAttribute('id'));
    controller.BuscarStock(fila.getAttribute('id'), function (data) {
        console.log(data);
        txtidstock.value = data.idstock;
        txtproductoedit.value = data.nombre;
        txtalmacen.value = data.areaalmacen;
        txtfechavencimiento.value = data.fechavencimiento;
        txtfechaingreso.value = data.fechaingreso
        txtlote.value = data.lote;
        txtregsanitario.value = data.regsanitario;
        txtmultiplo.value = data.multiplo;
        //txtmultiploblister.value = data.multiploblister;
        txtcantidad.value = data.candisponible;
    });
});

formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    var obj = $('#formregistro').serializeArray();
    let controller = new StockController();
    controller.ActualizarStock(obj, function (data) { fngetreporte(1000); });
});
function fngetreporte(top) {
    if (top == null || top == '')
        top = 100;
    var obj = {
        producto: txtcodproducto.value,
        top: top,
        sucursal: cmbsucursal.value
    };
    let controller = new StockController();
    controller.ReporteStock(obj, function (data) {
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr id="' + data[i].idstock + '">';
            fila += '<td>'+data[i].sucursal+'</td>';
            fila += '<td>' + data[i].areaalmacen+'</td>';
            fila += '<td>' + data[i].producto+'</td>';
            fila += '<td>' + data[i].laboratorio+'</td>';
            fila += '<td>' + data[i].stockactual+'</td>';
            fila += '<td>' + data[i].multiplo+'</td>';
            fila += '<td>' + data[i].lote+'</td>';
            fila += '<td>' + data[i].fechavencimiento+'</td>';
            fila += '</tr>';
        }
        tbodystock.innerHTML = fila;
    });
}