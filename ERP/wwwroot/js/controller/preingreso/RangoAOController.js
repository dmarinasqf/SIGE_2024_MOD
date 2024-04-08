class RangoAOController {
   
    ListarHabilitados(id, fn) {
        var url = ORIGEN + "/PreIngreso/PIRangoMuestraAO/ListarHabilitados";
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}