var MTPlblnumpedido = document.getElementById('MTPlblnumpedido');
var MTPcmblaboratorio = document.getElementById('MTPcmblaboratorio');
var MTPbtntransferir = document.getElementById('MTPbtntransferir');

$(document).ready(() => {
    let controller = new SucursalController();
    controller.ListarSucursalesByTipoLocal('MTPcmblaboratorio', 'PRODUCCIÓN');
});

MTPbtntransferir.addEventListener('click', function () {
    if (MTPcmblaboratorio.value == '') {
        mensaje('I', 'Seleccione laboratorio');
        return;
    }
    MVUtxttipo.value = 'transferencia';
    $('#modalvalidarusuario').modal('show');
});
MVUbtnaceptar.addEventListener('click', function () {
   
    if (MVUtxttipo.value != 'transferencia')
        return;
    MVUfnvalidarcredenciales(function (data) {
        var obj = {
            idempleado: data.idempleado,
            idpedido: MTPlblnumpedido .innerText,
            laboratorio: MTPcmblaboratorio.value
        };
        let controller = new LaboratorioPedidoController();
        controller.TransferirPedido(obj, function () {
            mensaje('S', 'El pedido ha sido transferido');
            $('#modalvalidarusuario').modal('hide');
            $('#modaltransferirpedido').modal('hide');
            MTPfnlimpiar();
            var fila = tbodydetalle.getElementsByClassName('selected')[0];
            var hijo = document.getElementById('row' + obj.idpedido);
            fila.remove();
            hijo.remove();
        });
    });
});
$('#modaltransferirpedido').on('hidden.bs.modal', function (e) {
    MTPfnlimpiar();
});
function MTPfnlimpiar() {
    MTPcmblaboratorio.value = '';   
    MVUtxtclave.value = '';
    MVUtxtusuario.value = '';  
    MTPlblnumpedido.innerText = '';
}