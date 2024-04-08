class AAlmacenTransferenciaController {
    ListarAlmacenTransferencia(obj, fn) {
        var url = ORIGEN + "/Almacen/AAlmacenTransferencia/ListarAlmacenTransferencia";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarStockLoteProductoPorAlmacenSucursal(obj, fn) {
        var url = ORIGEN + "/Almacen/AAlmacenTransferencia/BuscarStockLoteProductoPorAlmacenSucursal";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + "/Almacen/AAlmacenTransferencia/RegistrarEditar";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
            fn(null);
        });
    }
    BuscarAlmacenTransferenciaCompleto(obj, fn) {
        var url = ORIGEN + "/Almacen/AAlmacenTransferencia/BuscarAlmacenTransferenciaCompleto";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}