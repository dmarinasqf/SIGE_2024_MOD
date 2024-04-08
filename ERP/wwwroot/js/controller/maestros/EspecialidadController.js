class EspecialidadController {
        
    //llenar funcion
    Listar(tipo, fn) {
        var url = ORIGEN + '/Maestros/Especialidad/getListar?tipo=' + tipo;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + '/Maestros/Especialidad/RegistrarEditar';

        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados');
                fn();
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}