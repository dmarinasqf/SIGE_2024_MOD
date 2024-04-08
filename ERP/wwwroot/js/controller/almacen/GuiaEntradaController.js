class GuiaEntradaController {
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
    
    

    GetGuiaEntradaCompleta(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaEntrada/GetGuiaEntradaCompleta";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarGuiasEntrada(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaEntrada/GetListaGuiasEntrada";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarGuiaSalidaPorCargar(obj,fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/ListarGuiasSalidaPorCargar";
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}