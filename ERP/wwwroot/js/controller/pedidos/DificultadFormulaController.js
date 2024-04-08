class DificultadFormulaController {
    //llenar combo
    LlenarCmbDificultarFormula(cmb, tipo) {
        var url = ORIGEN + '/Pedidos/DificultadFormula/ListarDificultadFormula?estado='+tipo;

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
                option.value = data[i].iddificultad;
                combo.appendChild(option);
            }
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //llenar funcion
    ListarDificultadFormula(tipo, fn) {
        var url = ORIGEN + '/Pedidos/DificultadFormula/ListarDificultadFormula?estado=' + tipo;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    //registrar o editar
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + '/Pedidos/DificultadFormula/RegistrarEditar';
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