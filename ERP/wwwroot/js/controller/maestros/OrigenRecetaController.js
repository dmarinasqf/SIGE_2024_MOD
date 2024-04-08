class OrigenRecetaController {
    BuscarOrigenReceta(obj, fn) {
        var url = ORIGEN + '/Maestros/OrigenReceta/BuscarOrigenReceta';

        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarOrigenRecetaId(obj, fn) {
        var url = ORIGEN + '/Maestros/OrigenReceta/BuscarORId?codigo='+obj;
        $.post(url, obj).done(function (data) {
                let controller2 = new ProvinciaController();
            controller2.Listar(data[0].dpto, data[0].provincia , 'MCC_cmbprovincia', null);
                let controller3 = new DistritoController();
            controller3.Listar(data[0].provincia, data[0].distrito, 'cmbDistrito', null);
                fn(data);               
            
        }).fail(function (data) {
            mensajeError(data);
        })
    }

    ListarOrigenReceta(tipo, fn) {
        var url = ORIGEN + '/Maestros/OrigenReceta/ListarOrienReceta?estado=' + tipo;
        $.post(url).done(function (data) {
            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    RegistrarEditar(obj, fn) {
        var url = ORIGEN + '/Maestros/OrigenReceta/RegistrarEditar';

        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados');
                fn();
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

}