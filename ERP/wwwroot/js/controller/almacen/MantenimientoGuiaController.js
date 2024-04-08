class MantenimientoGuiaController {
    Registrar(obj, fn, fnerror) {
        let url = ORIGEN + "/Almacen/AMantenimientoGuia/RegistrarEditar";;
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                alertaSwall('S', 'REGISTRO GUARDADO', '');
                fn(data);
            }
            else { mensaje('W', data.mensaje); fnerror(); }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    AnularDuplicar(obj, fn, fnerror) {
        let url = ORIGEN + "/Almacen/AMantenimientoGuia/AnularDuplicar";;
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                alertaSwall('S', 'REGISTRO ANULADO Y DUPLICADO CORRECTAMENTE', '');
                fn(data);
            }
            else { mensaje('W', data.mensaje); fnerror(); }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    Anular(obj, fnc) {
        let url = ORIGEN + "/Almacen/AMantenimientoGuia/Anular";
        $.post(url, obj).done(function (data) {
            fnc(data);
        }).fail(function (data) {
            // btnguardar.prop('disabled', false);
            console.log(data);
            mensaje("D", "Error en el servidor", 'BR');
        });
    }
    //GetGuiaSalidas(obj, fn) {
    //    let url = ORIGEN + "/Almacen/AMantenimientoGuia/ListarGuiasSalida";
    //    $.post(url, obj).done(function (data) {
    //        fn(data);
    //    }).fail(function (data) { 
    //        //fn(null);
    //        mensaje("D", "Error en el servidor");
    //    });       
    //}
}