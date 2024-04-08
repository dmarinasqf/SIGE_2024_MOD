class CajaChicaController {
    
    //--EARTCOD1024---FUNCION VALIDAR RENDICION----------------------------------

    CajaChicaValidarRendicionListar(obj,fn) {
        var url = ORIGEN + "/Contabilidad/AsignarCajaChica/CajaChicaValidarRendicionListar";
        $.post(url,obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    CajaChicaValidarEstado(obj, fn) {
        var url = ORIGEN + "/Contabilidad/AsignarCajaChica/CajaChicaValidarEstado";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}