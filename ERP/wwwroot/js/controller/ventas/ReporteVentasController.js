class ReporteVentasController {
    
    ExportarIncentivos(obj, fn) {
        var url = ORIGEN + "/Ventas/Reporte/GenerarExcelIncentivos";
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
    GetIncentivos(obj, fn) {
        var url = ORIGEN + "/Ventas/Reporte/GetReporteIncentivos";
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ExportarReporteVentas(obj, fn) {
        var url = ORIGEN + "/Ventas/Reporte/GenerarExcelreporteVentas";
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
    GetReporteVentas(obj, fn) {
        var btnconsulta = document.getElementById('btnconsultar');
        var imgload = document.getElementById('imgload');
        var url = ORIGEN + "/Ventas/Reporte/GetReporteVentas";
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
            btnconsulta.disabled = false;
            imgload.style.visibility = 'hidden';
        }).fail(function (data) {
            mensajeError(data);
            btnconsulta.disabled = false;
            imgload.style.visibility = 'hidden';
        });
    }
    GenerarExcelreporteVentasVinali(obj, fn) {
        var url = ORIGEN + "/Ventas/Reporte/GenerarExcelreporteVentasVinali";
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
    GetReporteVentasVinali(obj, fn) {
        var url = ORIGEN + "/Ventas/Reporte/GetReporteVentasVinali";
        $.post(url, obj).done(function (data) {
          
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    DescargarExcelReporteIncentivoDetallado(obj, fn) {
        var url = ORIGEN + "/Ventas/Reporte/DescargarExcelReporteIncentivoDetallado";
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
    ReporteIncentivosDetallado(obj, fn) {
        var url = ORIGEN + "/Ventas/Reporte/ReporteIncentivosDetallado";
        $.post(url, obj).done(function (data) {

            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}