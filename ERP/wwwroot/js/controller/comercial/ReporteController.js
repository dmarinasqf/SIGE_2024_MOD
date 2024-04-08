class ReporteController {
    ReporteVentasvsCompras(obj, fn) {
        var url = ORIGEN + "/Comercial/Reporte/ReporteVentasvsCompra";
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ExportarVentasvsCompras(obj, fn) {
        var url = ORIGEN + "/Comercial/Reporte/GenerarExcelVentasvsCompras";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    ReporteVentas(obj, fn) {
        var url = ORIGEN + "/Comercial/Reporte/ReporteVentas";
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ExportarVentas(obj, fn) {
        var url = ORIGEN + "/Comercial/Reporte/GenerarExcelVentas";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ReporteCompras(obj, fn) {
        var url = ORIGEN + "/Comercial/Reporte/ReporteCompras";
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
} 