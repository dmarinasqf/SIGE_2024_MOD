class AgenciaEncomiendaController {
    //llenar en combo
    ListarAgencias(cmb) {
        var url = ORIGEN + '/Maestros/AgenciaEnvio/ListarAgencias';

        $.post(url).done(function (data) {
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idagencia;
                combo.appendChild(option);
            }
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //llenar funcion
    ListarAgencias2(tipo, fn) {
        var url = ORIGEN + '/Maestros/AgenciaEnvio/ListarAgencias?tipo=' + tipo;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + '/Maestros/AgenciaEnvio/RegistrarEditar';

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