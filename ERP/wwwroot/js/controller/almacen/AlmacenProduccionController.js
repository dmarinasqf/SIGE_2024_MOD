class AAlmacenProduccionController {
    ListarAlmacenTransferencia(obj, fn) {
        var url = ORIGEN + "/Almacen/AAlmacenTransferencia/ListarAlmacenTransferencia";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + "/Almacen/AAlmacenProduccion/RegistrarEditar";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
            fn(null);
        });
    }
}