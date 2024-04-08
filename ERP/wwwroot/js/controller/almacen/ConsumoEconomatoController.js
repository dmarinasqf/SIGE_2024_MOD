class AConsumoEconomatoController {
    ListarConsumoEconomato(obj, fn) {
        var url = ORIGEN + "/Almacen/AConsumoEconomato/ListarConsumoEconomato";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    Registrar(obj, fn) {
        var url = ORIGEN + "/Almacen/AConsumoEconomato/Registrar";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                alertaSwall('S', 'CONSUMO ECONOMATO GUARDADA', '');
                fn(data);
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}