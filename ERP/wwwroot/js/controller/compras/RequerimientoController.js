class RequerimientoController {
    ListarRequerimientos(obj, fn) {
        var url = ORIGEN + "/Compras/CRequerimiento/ListarRequerimientos";
        $.post(url, obj).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarRequerimientoCompleto(idrequerimiento, fn) {
        var url = ORIGEN + "/Compras/CRequerimiento/BuscarRequerimientoCompleto?idrequerimiento=" + idrequerimiento;
        $.post(url, idrequerimiento).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + "/Compras/CRequerimiento/RegistrarEditar";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                fn(data);
            } else {
                alertaSwall('W', data.mensaje, '');
                fn(data);
            }
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}