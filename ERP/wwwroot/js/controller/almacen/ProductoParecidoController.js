class ProductoParecidoController {
    ListarProductosAgrupados(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoParecido/ListarProductosAgrupados";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarProductosParecidos(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoParecido/ListarProductosParecidos";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarInicioInventario(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoParecido/RegistrarProductoParecido";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}