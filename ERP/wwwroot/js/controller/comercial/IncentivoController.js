class IncentivoController {
    RegistrarIncentivos(obj,fn) {
        var url = ORIGEN + "/Comercial/Incentivo/RegistrarIncentivosJson";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados', 'TC');
                fn(data);
            }
            else
                mensaje('W', data.mensaje, 'TC');


        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarIncentivosBloque(obj, fn,fnerror) {
        var url = ORIGEN + "/Comercial/Incentivo/RegistrarIncentivosBloque";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados', 'TC');
                fn(data);
            }
            else {
                mensaje('W', data.mensaje, 'TC');
                fnerror();
            }
               
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    ExportarIncentivos(idsucursal, fn) {
        var url = ORIGEN + "/Comercial/Incentivo/DescargarExcelIncentivos?idsucursal=" + idsucursal;
        $.post(url).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}