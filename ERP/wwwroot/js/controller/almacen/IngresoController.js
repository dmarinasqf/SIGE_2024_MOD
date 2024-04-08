class IngresoManualController {
    Registrar(obj, fn,fnerror) {

        var url = ORIGEN + "/Almacen/AIngreso/Registrar";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
            {
                alertaSwall('S', 'INGRESO GUARDADO', '');
                fn(data);
            }
            else
                mensaje('W', data.mensaje);
            fnerror();
        }).fail(function (data) {            
            mensajeError(data);
            fnerror();
        });
    }
    //string sucursal, string fechainicio, string fechafin, int top
    GetHistorial(obj, fn) {

        var url = ORIGEN + "/Almacen/AIngreso/getHistorialIngresos";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}