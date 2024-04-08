var MEPlblnumpedido = document.getElementById('MEPlblnumpedido');
var MEPtxttotal = document.getElementById('MEPtxttotal');
var MEPtxtpago = document.getElementById('MEPtxtpago');
var MEPtxtsaldo = document.getElementById('MEPtxtsaldo');
var MEPtipopagoverificadeuda = document.getElementById('MEPtipopagoverificadeuda');
var MEPcmbtipopagomodaladelanto = document.getElementById('MEPcmbtipopagomodaladelanto');
var MEPalertadeuda = document.getElementById('MEPalertadeuda');
var MEPbtnpagar = document.getElementById('MEPbtnpagar');
var MEPtbodydevoluciones = document.getElementById('MEPtbodydevoluciones');
var MEPtxtfechafacturacion = document.getElementById('MEPtxtfechafacturacion');
var MEPlbltotaldevolucion = document.getElementById('MEPlbltotaldevolucion');

var MEPdivfechafacturacion = document.getElementById('MEPdivfechafacturacion');


$(document).ready(function () {
    var controller = new TipoPagoController();
    controller.Listar(null, (data) => {
        var option = '<option value="">[SELECCIONE]</option>';
        for (var i = 0; i < data.length; i++) {
            if (data[i].descripcion == 'DEPOSITO' || data[i].descripcion == 'EFECTIVO' || data[i].descripcion == 'TARJETA')
                option += '<option value="' + data[i].idtipopago + '">' + data[i].descripcion + '</option>';
        }
        MEPcmbtipopagomodaladelanto.innerHTML = option;
    });
});

function MEPfnbuscardatospedido(idpedido, tipo) {
    MEPbtnpagar.innerText = tipo;
    let controller = new PedidoController();
    controller.BuscarPedidoParaEntregar(idpedido, function (data) {
        data = data.objeto;
        MEPtxttotal.value = data.pedido.total.toFixed(2);
        MEPtxtsaldo.value = data.pedido.saldo.toFixed(2);
        MEPtxtpago.value = data.pedido.saldo.toFixed(2);
        if (data.pedido.saldo > 0) {
            MEPalertadeuda.classList.remove('alert-success');
            MEPalertadeuda.classList.add('alert-danger');
            MEPalertadeuda.innerText = 'El pedido presenta saldo';
            MEPtxtpago.disabled = false;

        } else {
            MEPalertadeuda.classList.add('alert-success');
            MEPalertadeuda.classList.remove('alert-danger');
            MEPalertadeuda.innerText = 'El pedido esta pagado';
            MEPtxtpago.disabled = true;
        }
        var total = 0;
        if (data.detalle.length > 0) {
            var fila = '';

            for (var i = 0; i < data.detalle.length; i++) {
                var obj = data.detalle[i];
                fila += '<tr>';
                fila += '<td>' + obj.descripcion + '</td>';
                fila += '<td>' + obj.subtotal.toFixed(2) + '</td>';
                fila += '</tr>';
                total += obj.subtotal;
            }
            MEPtbodydevoluciones.innerHTML = fila;
        }
        MEPlbltotaldevolucion.innerText = total.toFixed(2);
    });
}


MEPbtnpagar.addEventListener('click', function () {
    if (MEPbtnpagar.innerText == 'Entregar') {
        if (MEPtxtfechafacturacion.value == '') {
            mensaje('I', 'Seleccione fecha de facturación');
            return;
        }
    }
    else if (MEPbtnpagar.innerText == 'Adelanto') {
        if (parseFloat(MEPtxtpago.value) != parseFloat(MEPtxtsaldo.value)) {
            mensaje('I', 'El monto del pago tiene que ser igual al saldo');
            return;
        }
        if (MEPcmbtipopagomodaladelanto.value == '') {
            mensaje('I', 'Seleccione tipo de pago');
            return;
        }
        
    }
        
    var obj = {
        idpedido: MEPlblnumpedido.innerText,
        fechafacturacion: MEPtxtfechafacturacion.value,
        monto: MEPtxtpago.value,
        idtipopago: MEPcmbtipopagomodaladelanto.value
    };
    let controller = new PedidoController();
    if (MEPbtnpagar.innerText == 'Entregar')
        controller.EntregarPedido(obj, function (data) {
            mensaje('S', 'Pedido ' + MEPlblnumpedido.innerText + ' entregado.');
            $('#modalentregarpedido').modal('hide');
            var fila = tbodydetalle.getElementsByClassName('selected')[0];
            fila.getElementsByClassName('estado')[0].innerHTML = '<span class="badge badge-success" style="font-size:9px"><i class="fas fa-calendar-check"></i> ENTREGADO</span>';
        });
    else if (MEPbtnpagar.innerText == 'Adelanto')
        controller.AdelantoPedido(obj, function (data) {
            mensaje('S', 'Se registro el adelanto del pedido');
            $('#modalentregarpedido').modal('hide');
            var fila = tbodydetalle.getElementsByClassName('selected')[0];
            fila.getElementsByClassName('saldo')[0].innerHTML = '0.00';
        });
});