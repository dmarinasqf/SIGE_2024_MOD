var MVPpedidotab = document.getElementById('MVPpedidotab');
var MVPdeliverytab = document.getElementById('MVPdeliverytab');
var MVPdepositostab = document.getElementById('MVPdepositostab');

var MVPlblnumpedido = document.getElementById('MVPlblnumpedido');

$(document).ready(function () {
    CDDEbtnconservarcambios.classList.add('ocultar');//btnguardar datos de delivery
    MP_btnagregar.classList.add('ocultar');//btn agregar pago
    cardformpago.classList.add('ocultar');//btn agregar pago
    CDDEfniniciardatosdelivery();
});
$('#modalverpedido').on('shown.bs.modal', function () {
   
    //CDDEfniniciardatosdelivery();
    //CDDEfnlimpiar();
});

MVPdeliverytab.addEventListener('click', function () {
    CDDEfnlimpiar();
    CDDEfnbuscardatosdelivery(MVPlblnumpedido.innerText);
});
MVPdepositostab.addEventListener('click', function () {
    MPfnlimpiarmodalpagos();
    MPfnbuscardepositospedido(MVPlblnumpedido.innerText);
});