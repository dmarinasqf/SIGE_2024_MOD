class GuiaInternaDevolucionController
{
    GetGuiaCompleta(obj, fn) {
        var url = ORIGEN + "/PreIngreso/GuiaInternaDevolucion/GetGuiaCompleta";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
            fn(null);
        });
    }
    VerificarFacturaCantDevuelta(obj, fn) {
        var url = ORIGEN + "/PreIngreso/GuiaInternaDevolucion/VerificarFacturaCantDevuelta";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn(JSON.parse(data.tabla));
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
            fn(null);
        });
    }
    RegistrarEditar(obj, fn,fnerror) {
        var url = ORIGEN + "/PreIngreso/GuiaInternaDevolucion/RegistrarEditar";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data);
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
            mensajeError(data);
            fnerror();

        });
    }
    HistorialGuias(obj, fn, fnerror) {
        var url = ORIGEN + "/PreIngreso/GuiaInternaDevolucion/GetHistorialGuias";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
            fnerror();

        });
    }
    GetMotivoDevolucion(fn) {
        var url = ORIGEN + "/PreIngreso/GuiaInternaDevolucion/GetMotivoDevolucion";
        $.post(url).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
            fn(null);
        });
    }
}