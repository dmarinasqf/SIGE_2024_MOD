class LibroRecetasController {

    codigoLibroRecetas(tipo, sucursalcliente, iddetalle , fn) {
        var url = ORIGEN + '/LibroRecetas/LibroReceta/GetCodigoLibroRecetas';
        var obj = {
            tipo: tipo,
            sucursalcliente: sucursalcliente,
            iddetalle: iddetalle
        };

        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}