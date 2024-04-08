var MDPbtndevolver = document.getElementById('MDPbtndevolver');
var MDPtxtmotivodevolucion = document.getElementById('MDPtxtmotivodevolucion');
var MDPlblnumpedido = document.getElementById('MDPlblnumpedido');
var MVUtxttipo = document.getElementById('MVUtxttipo');
MDPbtndevolver.addEventListener('click', function () {
    if (MDPtxtmotivodevolucion.value.trim() == '') {
        mensaje('I', 'Ingrese motivo de devolución');
        return;
    }
    MVUtxttipo.value = 'devolucion';
    $('#modalvalidarusuario').modal('show');
});

MVUbtnaceptar.addEventListener('click', function () {
    if (MVUtxttipo.value != 'devolucion')
        return;
    MVUfnvalidarcredenciales(function (data) {
        var obj = {
            idempleado: data.idempleado,
            idpedido: MDPlblnumpedido.innerText,
            motivo: MDPtxtmotivodevolucion.value
        };
        let controller = new PedidoController();
        controller.DevolverPedido(obj, function () {
            mensaje('S', 'El pedido ha sido devuelto');
            $('#modalvalidarusuario').modal('hide');
            $('#modaldevolverpedido').modal('hide');
            MDPfnlimpiar();
            var fila = tbodydetalle.getElementsByClassName('selected')[0];
            fila.getElementsByClassName('estado')[0].innerHTML = '<span class="badge badge-danger" style="font-size:9px"><i class="fas fa-truck-loading"></i> DEVUELTO</span>';
        });
    });
});
$('#modaldevolverpedido').on('hidden.bs.modal', function (e) {
    MDPfnlimpiar();
})
function MDPfnlimpiar() {
    MDPlblnumpedido.innerText = '';
    MDPtxtmotivodevolucion.value = '';  
    MVUtxtclave.value = '';  
    MVUtxtusuario.value = '';  
    //formvalidarusuario.reset();
}