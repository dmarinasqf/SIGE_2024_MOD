class TipoPagoController {
    Listar(idcmb, fn) {
        var url = ORIGEN + '/Finanzas/FTipoPago/ListarHabilitados';
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var controller = new TipoPagoController();
                controller.LLenarCombo(idcmb, data);
            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    LLenarCombo(idcmb, data) {
        var cmb = document.getElementById(idcmb);
        cmb.innerHTML = '';
        var option = document.createElement('option');
        option.value = '';
        option.text = '[SELECCIONE]';
        cmb.appendChild(option);
        for (var j = 0; j < data.length; j++) {
            option = document.createElement('option');
            option.value = data[j].idtipopago;
            option.text = data[j].descripcion;
            if (data[j].descripcion.includes("EFECTIVO"))
                option.selected=true;
            cmb.appendChild(option);
        }
    }
    LLenarComboParaVena(idcmb, data) {
        var cmb = document.getElementById(idcmb);
        cmb.innerHTML = '';
        var option = document.createElement('option');
        option.value = '';
        option.text = '[SELECCIONE]';
        cmb.appendChild(option);
        for (var j = 0; j < data.length; j++) {
            option = document.createElement('option');
            option.value = data[j].idtipopago;
            option.text = data[j].descripcion;
            if (data[j].descripcion.includes("EFECTIVO"))
                option.selected = true;
            if (data[j].descripcion.includes("EFECTIVO") || data[j].descripcion.includes("TARJETA")
                || data[j].descripcion.includes("CREDITO") || data[j].descripcion.includes("TRANSFERENCIA"))
               cmb.appendChild(option);
        }
    }
}