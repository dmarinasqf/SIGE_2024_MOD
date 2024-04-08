class DeliveryController {
    BuscarDatosDelivery(idpedido,fn) {
        var url = ORIGEN + '/Pedidos/Delivery/BuscarDatosDelivery?idpedido=' + idpedido;
        $.post(url).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data.objeto)
            else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    CrearEntregaDelivery(obj, fn,fnerror) {
        var url = ORIGEN + '/Pedidos/Delivery/CrearEntregaDelivery';
        $.post(url,obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data.objeto)
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
                

        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });
    }
    EliminarEntregaDelivery(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Delivery/EliminarEntregaDelivery';
        $.post(url,obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn()
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
                

        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });
    }
    
}