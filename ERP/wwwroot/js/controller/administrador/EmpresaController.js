class EmpresaController {
    ListarEmpresas(cmb,idempresa, fn) {
        var url = ORIGEN + '/Administrador/Empresa/Listar' ;
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
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idempresa;
                if (idempresa === data[i].idempresa)
                    option.selected = true;
                combo.appendChild(option);
            }
           

        }).fail(function (data) {
            mensajeError(data);
        });
    }
}