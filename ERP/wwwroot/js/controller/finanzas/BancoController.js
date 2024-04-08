class BancoController {
    ListarTipoTarjeta(idcmb, fn) {
        var url = ORIGEN + '/Finanzas/FBanco/ListarTipoTarjeta';
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var j = 0; j < data.length; j++) {
                    option = document.createElement('option');
                    option.value = data[j].idtipotarjeta;
                    option.text = data[j].descripcion;                                    
                    cmb.appendChild(option);
                }
            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarBancosHabilitados(idcmb, fn) {
        var url = ORIGEN + '/Finanzas/FBanco/ListarBancosHabilitados';
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var j = 0; j < data.length; j++) {
                    option = document.createElement('option');
                    option.value = data[j].idbanco;
                    option.text = data[j].descripcion;                                    
                    cmb.appendChild(option);
                }
            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCuentasHabilitados(idcmb,idbanco, fn) {
        var url = ORIGEN + '/Finanzas/FBanco/ListarCuentasHabilitados?idbanco=' + idbanco;
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var j = 0; j < data.length; j++) {
                    option = document.createElement('option');
                    option.value = data[j].idcuenta;
                    option.text = data[j].descripcion;                                    
                    cmb.appendChild(option);
                }
            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}