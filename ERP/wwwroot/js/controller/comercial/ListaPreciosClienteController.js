class ListaPreciosClienteController {
    CrearLista(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPreciosCliente/CrearListaCliente";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados', 'TC');
                fn();
            }
            else
                mensaje('W', data.mensaje, 'TC');


        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarListaCliente(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPreciosCliente/BuscarListaCliente";
        $.post(url, obj).done(function (data) {
            fn(data);


        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarProductosLista(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPreciosCliente/BuscarProductosLista";
        $.post(url, obj).done(function (data) {
            fn(data);


        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarPreciosClienteBloque(obj, fn,fnerror) {
        var url = ORIGEN + "/Comercial/ListaPreciosCliente/RegistrarPreciosClienteBloque";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    EliminarPreciosCliente(obj, fn, fnerror) {
        var url = ORIGEN + "/Comercial/ListaPreciosCliente/EliminarPreciosCliente";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    //ListarPreciosCliente
    ListarPreciosCliente(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPreciosCliente/ListarPreciosCliente";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}