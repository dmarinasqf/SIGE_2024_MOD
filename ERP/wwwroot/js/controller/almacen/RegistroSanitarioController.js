class RegistroSanitarioController {
     RegistrarEditar(obj, fn) {
         var url = ORIGEN + "/Almacen/RegistroSanitario/RegistrarEditar";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                alertaSwall('S', 'DATOS GUARDADOS', '');
                fn(data);
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarxProducto(idproducto, fn) {
        var url = ORIGEN + "/Almacen/RegistroSanitario/ListarxProducto?idproducto=" + idproducto;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    } Buscar(id, fn) {
        var url = ORIGEN + "/Almacen/RegistroSanitario/Buscar/" + id;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}