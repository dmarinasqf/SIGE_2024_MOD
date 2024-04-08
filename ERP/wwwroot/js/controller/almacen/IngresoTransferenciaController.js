class IngresoTransferenciaController {
    //Registrar(obj, fn) {
    //    var url = ORIGEN + "/Almacen/AIngresoManual/Registrar";
    //    $.post(url, obj).done(function (data) {
    //        if (data.mensaje == 'ok') {
    //            alertaSwall('S', 'INGRESO GUARDADO', '');
    //            fn(data);
    //        }
    //        else
    //            mensaje('W', data.mensaje);
    //    }).fail(function (data) {
    //        fn(null);
    //        mensajeError(data);
    //    });
    //}
    
    GetIngresoTransferenciaCompleta(obj, fn) {
        var url = ORIGEN + "/Almacen/AIngresoTransferencia/GetIngresoTransferenciaCompleta";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarIngresoTransferencia(obj, fn) {
        var url = ORIGEN + "/Almacen/AIngresoTransferencia/GetListaIngresoTransferencia";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //ListarGuiaSalidaPorCargar(obj,fn) {
    //    var url = ORIGEN + "/Almacen/AIngresoTransferencia/ListarGuiasSalidaPorCargar";
    //    $.post(url, obj).done(function (data) {
    //        console.log(data);
    //        fn(data);
    //    }).fail(function (data) {
    //        fn(null);
    //        mensajeError(data);
    //    });
    //}
}