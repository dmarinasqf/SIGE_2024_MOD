var MBPS_tbodytblproductos = document.getElementById('MBPS_tbodytblproductos');
var MBPS_txtfiltro = document.getElementById('MBPS_txtfiltro');

$(document).ready(function () {
   
});

MBPS_txtfiltro.addEventListener('keyup', function () {
    if (MBPS_txtfiltro.value.length % 2 === 0) {
        MBPS_fnbuscardatos();
    }
});
$('#modalproinsstockdistinct').on('show.bs.modal', function (e) {
    MBPS_fnbuscardatos();
})
function MBPS_fnbuscardatos() {
    var obj = {
        top: 20,
        producto: MBPS_txtfiltro.value.toUpperCase().trim(),
        sucursal:IDSUCURSAL
       
    };
    let controller = new StockController();
    controller.GetProductosConStock(obj, MBPS_fnllenartabla);
}
function MBPS_fnllenartabla(data) {
  
    MBPS_tbodytblproductos.innerHTML = '';
    var fila = '';
    for (var i = 0; i < data.length; i++) {
        fila += '<td class="codigoproducto">' + data[i].codigoproducto + '</td>';
        fila += '<td class="nombre">' + data[i].nombre + '</td>';
        fila += '<td class="tipoproducto">' + data[i].idtipoproducto + '</td>';
        fila += '<td class="laboratorio">' + data[i].laboratorio + '</td>';
        
        fila += '<td ><button class="btn btn-sm btn-success MBPS_btnseleccionarstock" idstock="' + data[i].idproducto + '"><i class="fas fa-check"></i></button></td>';

        fila += '</tr>';

    }
    MBPS_tbodytblproductos.innerHTML = fila;
}
