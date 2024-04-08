class EspecialidadController {
    //llenar en combo
    ListarEspecialidadCmb(cmb, estado, isselect) {
        var url = ORIGEN + '/Administrador/Especialidad/ListarEspecialidad?estado='+estado;

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
                option.value = data[i].idEsecialidad;
                combo.appendChild(option);
            }
            if (isselect) {
                $('#' + cmb).select2({
                    placeholder: 'TODOS',
                    allowClear: true,
                    width: '100%',
                });
            }
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    
}