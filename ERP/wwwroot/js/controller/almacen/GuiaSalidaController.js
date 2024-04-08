class GuiaSalidaController {
    GetGuiaSalidaCompleta(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/GetGuiaCompleta";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarGuiaSalidas(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/ListarGuiasSalida";
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
    BuscarCodigosGuiaDistribucion(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/BuscarCodigosGuiasDistribucion";
        $.post(url, obj).done(function (data) {
            //console.log(data);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    GenerarGuiaElectronica(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/GenerarTxtGuia";
        $.post(url,obj).done(function (data) {
            if (data === 'ok')
                mensaje('S', 'Documento generado para SUNAT');
            else if (data === 'no')
                console.log('');
            else if (data == 'DI')
                mensaje('S', 'Documento interno generado');
            else
                mensaje('W', data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarTipoGuia(fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/ListarTipoGuia";
        $.post(url).done(function (dataJSON) {
            var data = JSON.parse(dataJSON);
            if (data.mensaje === 'ok')
                fn(data.objeto);
            else
                mensaje("W", data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    //LISTADO DE GUIAS POREMPRESA QUE FALTAN FACTURAR
    ListarGuiaSalidaxempresaSinfacturar(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/ListarGuiaSalidaxempresaSinfacturar";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    // LISTADO DETALLE GUIAS DE EMPRESA QUE FALTAN FACTURAR
    ListarDetalleGuiaSalidaxempresaSinfacturar(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/ListarGuiaDetalleSalidaxempresaSinfacturar";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ObtenerSerieGuiaxSucursal(obj, fn) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/ObtenerSerieGuiaxSucursal";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == "ok") {
                fn(data);
            } else {
                mensaje("W","Error al obtener series de guia.")
            }
        }).fail(function (data) {
            mensajeError(data);
        });
    }

}