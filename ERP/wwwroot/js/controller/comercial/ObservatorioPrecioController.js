class ObservatorioPrecioController {
    ActualizarPreciosDigemid(obj,fn,fnerror) {
        var url = ORIGEN + "/Comercial/ObservatorioPrecios/ActualizarPreciosDigemid";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                mensaje('S', 'Datos guardados');
                fn(data);
            }
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
          
            mensajeError(data);
            fnerror();
        });
    }
}