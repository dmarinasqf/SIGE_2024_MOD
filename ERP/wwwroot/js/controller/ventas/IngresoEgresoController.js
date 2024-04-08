class IngresoEgresosController {

    RegistrarEgreso(obj, fn,fnerror) {
        var url = ORIGEN + "/Ventas/IngresoEgresos/RegistrarEgreso";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                alertaSwall('S', 'EGRESO GUARDADO CORRECTAMENTE','');
            }
            else
                alertaSwall('W', data.mensaje, '');
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });
    }
    ListarTipoEgresos(idcmb, fn) {
        var url = ORIGEN + "/Ventas/IngresoEgresos/ListarTipoEgresos";
        $.post(url,).done(function (data) {
            
            var cmb = document.getElementById(idcmb);
            cmb.innerHTML = '';
            var option = document.createElement('option');
            option.value = '';
            option.text = '[SELECCIONE]';
            cmb.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.value = data[i].tipoegreso_codigo;
                option.text = data[i].descripcion;                
                cmb.appendChild(option);
            }
        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });
    }

}