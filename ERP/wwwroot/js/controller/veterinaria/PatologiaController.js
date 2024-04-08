class PatologiaController {
    ListarPatologias(cmb, idpatologia, fn) {
        var url = ORIGEN + '/Veterinaria/Maestro/ListarPatologia';
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
                option.value = data[i].idpatologia;
                if (idpatologia === data[i].idpatologia)
                    option.selected = true;
                combo.appendChild(option);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + '/Veterinaria/Patologia/RegistrarEditar';
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados');
                fn(data);
            } else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    Eliminar(id, fn) {
        var url = ORIGEN + '/Veterinaria/Patologia/Eliminar?id=' + id;
        $.post(url).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Registro eliminado');

                fn(data);
            } else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    Listar(fn) {
        var url = ORIGEN + '/Veterinaria/Patologia/Listar';
        $.post(url).done(function (data) {
            fn(data);

        }).fail(function (data) {
            //console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    ListarPatologiaMascota(tipo, fn) {
        console.log('ListarPatologiaMascota');
        var url = ORIGEN + '/Maestros/Patologia/ListarPatologia?estado='+tipo;
        $.post(url).done(function (data) {
            fn(data);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditar2(obj, fn) {
        var url = ORIGEN + '/Maestros/Patologia/RegistrarEditar';

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