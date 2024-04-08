class PrincipioActivoController {
    RegistrarEditar(obj,fn) {
        var url = ORIGEN + "/Almacen/APrincipioActivo/RegistrarEditar";
    
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Datos guardados');
                fn(data);           
            } else
                mensaje('W', data.mensaje);          
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarRegistros(obj, fn) {
        var url = ORIGEN + "/Almacen/APrincipioActivo/BuscarRegistros";    
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}