class ModulosGrupoController {
    ListarPermisos(fn) {
        var url = ORIGEN + '/Administrador/ModulosGrupo/ListarRoles';
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    ListarGrupos(idcmb,fn) {
        var url = ORIGEN + '/Administrador/ModulosGrupo/ListarGrupos';
        $.post(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var j = 0; j < data.length; j++) {
                    option = document.createElement('option');
                    option.value = data[j].idgrupo;
                    option.text = data[j].descripcion;                   
                    cmb.appendChild(option);
                }

            } else
                fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
}