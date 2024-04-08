class ProcedimientoController {

    ListarProcedimiento(obj, fn) {
        var url = ORIGEN + "/Procedimiento/Procedimiento/ListarProcedimiento";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ListadoTipoProcedimiento(cmb, fn, isselect) {
        var url = ORIGEN + "/Procedimiento/Procedimiento/ListadoTipoProcedimiento";
        $.post(url).done(function (data) {

            if (cmb === null || cmb === '')
                if (fn != null) {
                    fn(data);
                    return;
                }
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '0';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                //cmbtipoprocedimiento.prepend('<option value= ' + data[i].tipodeproc_codido + ' costo="' + data[i].costo + '">' + data[i].descripcion + '</option>');
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].tipodeproc_codido;
                option.setAttribute('costo', data[i].costo);
                combo.appendChild(option);
            }
            if (isselect) {
                $('#' + cmb).select2({
                    placeholder: 'TODOS',
                    allowClear: true
                });
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }

    RegistrarProcedimiento(obj, fn) {
        console.log(obj);
        var url = ORIGEN + "/Procedimiento/Procedimiento/RegistrarProcedimiento";
        $.post(url, obj).done(function (data) {
            fn(data);
            if (data.mensaje == "ok") {
                mensaje("S", "Datos guardados correctamente.");
                $('#modalregistrarprocedimiento').modal('hide');
                //console.log(data);
                limpiar();
                btnGuardar.setAttribute("disabled", false);
            }
            else {
                mensaje('W', data.mensaje);
                btnGuardar.setAttribute("disabled", false);
            }
        }).fail(function (data) {
            fn(null);
            btnGuardar.setAttribute("disabled", false);
            //console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }

    BuscarProcedimiento(codigo,fn) {
        var url = ORIGEN + '/Procedimiento/Procedimiento/BuscarPedidoCompleto/' + codigo;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }

}