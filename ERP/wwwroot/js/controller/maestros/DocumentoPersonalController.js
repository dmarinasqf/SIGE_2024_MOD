class DocumentoPersonalController {
    Listar(idcmb,fn) {
        var url = ORIGEN + '/Maestros/DocumentoPersonal/Listar';
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
                    option.value = data[j].iddocumento;
                    option.text = data[j].descripcion;
                    option.setAttribute('codigosunat', data[j].codigosunat);
                    option.setAttribute('longitud', data[j].longitud);
                    cmb.appendChild(option);
                }

            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}