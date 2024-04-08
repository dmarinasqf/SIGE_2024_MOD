class ASalidaTransferenciaController {
    //recibe parametros string codigo, string idsucursalorigen, string idsucursaldestino, string fecha, string estadoguia
    GetHistorial(obj, fn) {
        var url = ORIGEN + "/Almacen/ASalidaTransferencia/ListarSalidaTransferencia";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //recibe parametros string codigo, string idsucursalorigen, string idsucursaldestino, string estado
    GetSalidasTransferenciaxCargar(obj, fn) {
        var url = ORIGEN + "/Almacen/ASalidaTransferencia/ListarSalidaTransferenciaPorCargar";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //recibe parametros string id
    GetSalidaTransferencia(obj, fn) {
        var url = ORIGEN + "/Almacen/ASalidaTransferencia/GetSalidaTransferenciaCompleta";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}