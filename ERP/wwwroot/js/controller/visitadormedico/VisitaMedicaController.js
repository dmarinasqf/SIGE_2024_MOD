class VisitaMedicaController {
    ListarVisitasMedicas(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/VisitaMedica/ListarVisitasMedicas';
        $.post(url, obj).done(function (data) {

            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarRegistrosConsultorioxDia(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/VisitaMedica/ListarRegistrosConsultorioxDia';
        $.post(url, obj).done(function (data) {
            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditarVisita(obj, fn,fnerror) {
        var url = ORIGEN + '/VisitadorMedico/VisitaMedica/RegistrarEditarVisita';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                mensaje('S', 'Operacion completada');
                fn();
            } else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    EliminarVisita(obj, fn, fnerror) {
        var url = ORIGEN + '/VisitadorMedico/VisitaMedica/EliminarVisita';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                mensaje('S', 'Operacion completada');
                fn();
            } else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
}