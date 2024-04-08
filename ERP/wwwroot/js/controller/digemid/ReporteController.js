class ReporteController
{
    GetReporteMensual(obj, fn) {
        var url = ORIGEN + "/Digemid/Reporte/GetMaestroMensual";
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ExportarReporteMensual(obj, fn) {
        var url = ORIGEN + "/Digemid/Reporte/ExcelMaestroMensual";
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
    GetPreciosMensual(obj, fn) {
        var url = ORIGEN + "/Digemid/Reporte/GetPreciosMensual";
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ExcelPreciosMensual(obj, fn) {
        var url = ORIGEN + "/Digemid/Reporte/ExcelPreciosMensual";
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
    GetPreciosCovid(obj, fn) {
        var url = ORIGEN + "/Digemid/Reporte/GetPreciosCovid";
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ExcelPreciosCovid(obj, fn) {
        var url = ORIGEN + "/Digemid/Reporte/ExcelPreciosCovid";
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
}