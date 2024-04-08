class MonedaController {
    Listar(idcmb, fn) {
        var url = ORIGEN + '/Finanzas/FMoneda/ListarHabilitados';
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var controller = MonedaController();
                controller.LLenarCombo(idcmb,data);
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
            option.value = data[j].idmoneda;
            option.text = data[j].nombre;
            option.setAttribute('cambio', data[j].tipodecambio);
            option.setAttribute('simbolo', data[j].simbolo);
            if (data[j].nombre.includes("SOL"))
                option.selected = true;
            cmb.appendChild(option);
        }
    }
}