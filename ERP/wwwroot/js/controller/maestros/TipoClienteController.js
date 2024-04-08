class TipoClienteController {
    ListarTipoCliente(descripcion, fn) {
        var url = ORIGEN + '/Maestros/TipoCliente/ListarTipoCliente';
        $.post(url, descripcion).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}