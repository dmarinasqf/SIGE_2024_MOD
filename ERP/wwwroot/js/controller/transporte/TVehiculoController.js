class VehiculoController {
    //string int? idempresa
    ListarVehiculosxEmpresa(obj, fn) {
        var url = ORIGEN + "/Transporte/Vehiculo/ListarVehiculosxEmpresa";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarVehiculosxEmpresaEnCombo(cmb, params, fn, id) {        
        var url = ORIGEN + '/Transporte/Vehiculo/ListarVehiculosxEmpresa';
        $.post(url, params).done(function (data) {

           
            if (data.mensaje == "ok") {
                let datos = data.objeto;
                var combo = document.getElementById(cmb);
                combo.innerHTML = '';
                var option = document.createElement('option');
                option.text = '[SELECCIONE]';
                option.value = '';
                combo.appendChild(option);
                for (let i = 0; i < datos.length; i++) {
                    option = document.createElement('option');
                    option.text = datos[i].marca + ' ' + datos[i].modelocarro;
                    option.value = datos[i].idvehiculo;
                    if (id === datos[i].idvehiculo)
                        option.selected = true;
                    combo.appendChild(option);
                }
                if (cmb == null || cmb == '')
                    if (fn != null)
                        fn(data);
            } else
                mensajeError(data.mensaje);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarVehiculoxid(obj, fn) {
        var url = ORIGEN + "/Transporte/Vehiculo/BuscarVehiculoxId";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}