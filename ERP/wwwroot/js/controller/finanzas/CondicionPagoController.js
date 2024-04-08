class CondicionPagoController {
    Listar(idcmb, fn) {
        var url = ORIGEN + '/Finanzas/FCondicionPago/ListarHabilitadas';
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var controller =new CondicionPagoController();
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
            option.value = data[j].idcondicionpago;
            option.text = data[j].descripcion;           
            cmb.appendChild(option);
        }
    }
}
