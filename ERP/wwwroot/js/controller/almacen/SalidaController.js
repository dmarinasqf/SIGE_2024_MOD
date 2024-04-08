class ASalidaManualController {
    Registrar(obj, fn) {

        var url = ORIGEN + "/Almacen/ASalida/Registrar";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                alertaSwall('S', 'SALIDA GUARDADA', '');
                fn(data);
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //string sucursal, string fechainicio, string fechafin, int top
    GetHistorial(obj, fn) {

        var url = ORIGEN + "/Almacen/ASalida/getHistorialSalidas";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}