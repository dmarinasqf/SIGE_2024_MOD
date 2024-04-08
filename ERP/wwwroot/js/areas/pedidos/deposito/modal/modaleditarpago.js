var MED_txtnumoperacion = document.getElementById('MED_txtnumoperacion');
var MED_txtobservacion = document.getElementById('MED_txtobservacion');
var MED_txtxtidpago = document.getElementById('MED_txtxtidpago');
var MED_txtsistema = document.getElementById('MED_txtsistema');
var formeditardatospago = document.getElementById('formeditardatospago');
$(document).ready(function () {

});

formeditardatospago.addEventListener('submit', function (e) {
    e.preventDefault();
    var obj = $('#formeditardatospago').serializeArray();
    var url = ORIGEN + '/Pagos/ActualizarPago';

    $.post(url, obj).done(function (data) {
        if (data.mensaje === 'ok') {
            mensaje('S', 'Datos guardados');
            $('#modaleditarpago').modal('hide');
            formeditardatospago.reset();
        }
        else
            mensaje('W', data.mensaje);

    }).fail(function (data) {
        mensajeError(data);
    });
});