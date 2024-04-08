class ReporteController {
    ReporteKardex(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/ReporteKardex";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ReporteEsencial(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/ReporteEsencial";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //string sucursal,int top, string producto
    GenerarExcelKardex(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/GenerarExcelKardex";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ReporteAnalisisProducto(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/ReporteAnalisisProducto";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ReporteAnalisisStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/ReporteAnalisisStock";
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    GenerarExcelAnalisisStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/GenerarExcelAnalisisStock";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ///EARTC10000
    GenerarExcelGuiasTransferencias(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/GenerarExcelGuiasTransferencias";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ReporteGuiasTransferencias(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/ReporteGuiasTransferencias";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ///EARTC10001
    GenerarExcelReporteGuias(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/GenerarExcelReporteGuias";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ReporteGuias(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/ReporteGuias";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ReporteCostoInventario(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/ReporteCostoInventario";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    GenerarExcelCostoInventario(obj, fn) {
        var url = ORIGEN + "/Almacen/AReporte/GenerarCostoInventario";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}