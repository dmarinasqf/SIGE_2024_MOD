class EmpresaTransporte {
    //Lista todas las empresas de transporte
    ListarEmpresasTransporte(obj, fn) {
        var url = ORIGEN + "/Transporte/EmpresaTransporte/ListarEmpresasTransporte";
        $.post(url, obj).done(function (data) {           
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarEmpresasTransporteEnCombo(cmb, fn, id) {
        var url = ORIGEN + '/Transporte/EmpresaTransporte/ListarEmpresasTransporte';
        $.post(url).done(function (data) {

            if (data.mensaje == "ok") {
                let datos = data.objeto;
                var combo = document.getElementById(cmb);
                combo.innerHTML = '';
                var option = document.createElement('option');
                option.text = '[SELECCIONE]';
                option.value = '';
                combo.appendChild(option);
                for (var i = 0; i < datos.length; i++) {
                    option = document.createElement('option');
                    option.text = datos[i].razonsocial;
                    option.value = datos[i].idempresa;
                    if (id === datos[i].idempresa)
                        option.selected = true;
                    combo.appendChild(option);
                }
                if (cmb === null || cmb === '')
                    if (fn != null)
                        fn(datos);
            } else
                mensajeError(data.mensaje);
            

        }).fail(function (data) {
            mensajeError(data);
        });
    }
}