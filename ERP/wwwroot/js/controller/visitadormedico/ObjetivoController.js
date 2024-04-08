class ObjetivoController {
    ListarObjetivos(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/Objetivo/ListarObjetivos';
        $.post(url,obj).done(function (data) {
           
            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditar(obj, fn,fnerror) {
        var url = ORIGEN + '/VisitadorMedico/Objetivo/RegistrarEditar';
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados');
                fn(data);
            } else { mensaje('W', data.mensaje); fnerror();}

        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });
    }
    ElimnarObjetivo(id, fn) {
        var url = ORIGEN + '/VisitadorMedico/Objetivo/ElimnarObjetivo?id=' + id;
        $.post(url).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Registro eliminado');

                fn(data);
            } else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
}