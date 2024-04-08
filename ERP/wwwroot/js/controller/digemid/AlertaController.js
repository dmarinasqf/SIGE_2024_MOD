class AlertaController {
    RegistrarEditarAlerta(obj, fn,fnerror) {
        var url = ORIGEN + "/Digemid/Alerta/RegistrarEditarAlerta";       
       
        $.ajax({
            url: url,
            type: "POST",
            data: obj,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                if (data.mensaje == 'ok')
                    fn();
                else {
                    mensaje('W', data.mensaje);
                    fnerror();
                }
            }, error: function (data) {
                fnerror();
                mensajeError(data);
            }

        });
    }
    ListarAlertas(obj, fn) {
        var url = ORIGEN + "/Digemid/Alerta/ListarAlertas";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarAlerta(idalerta, fn) {
        var url = ORIGEN + "/Digemid/Alerta/BuscarAlerta/"+idalerta;
        $.post(url).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data.objeto);
            else 
                mensaje('W', data.mensaje);
               
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}