class ReporteController {
    ListarProveedor(cmb, fn, isselect) {
        var url = ORIGEN + '/Compras/CProveedor/ListarProveedor';
        $.post(url).done(function (data) {

            if (cmb === null || cmb === '')
                if (fn != null) {
                    fn(data);
                    return;
                }

            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].razonsocial;//
                option.value = data[i].idproveedor;//
                combo.appendChild(option);
            }
            if (isselect) {
                $('#' + cmb).select2({
                    placeholder: 'TODOS',
                    allowClear: true
                });
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ReporteDevolucionProveedor(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteDevolucion";
        $.post(url, obj).done(function (data) {
            if (data == '[]') {
                console.log('adentro');
                mensaje('W', 'No se encontraron registros');
            }
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);

            mensajeError(data);
        });
    }
    GenerarExcelDevolucionProveedor(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelDevolucionProveedor";
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
    ReporteProductosxVencer(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteProductosxVencer";
        $.post(url, obj).done(function (data) {
            if (data == '[]') {
                console.log('adentro');
                mensaje('W', 'No se encontraron registros');
            }
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);

            mensajeError(data);
        });
    }
    GenerarExcelProductosxVencer(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelProductosxVencer";
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
    ReporteNegociacionCompras(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteNegociacionCompras";
        $.post(url, obj).done(function (data) {
            if (data == '[]') {
                console.log('adentro');
                mensaje('W', 'No se encontraron registros');
            }
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);

            mensajeError(data);
        });
    }
    GenerarExcelReporteNegociacionCompras(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelReporteNegociacionCompras";
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
    ReporteOCEmitidas(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteOCEmitidas";
        $.post(url, obj).done(function (data) {
            if (data == '[]') {
                console.log('adentro');
                mensaje('W', 'No se encontraron registros');
            }
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);

            mensajeError(data);
        });
    }
    GenerarExcelReporteOCEmitidas(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelReporteOCEmitidas";
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
    ReporteEntregaxProveedor(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteEntregaxProveedor";
        $.post(url, obj).done(function (data) {
            if (data == '[]') {
                console.log('adentro');
                mensaje('W', 'No se encontraron registros');
            }
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);

            mensajeError(data);
        });
    }
    GenerarExcelReporteEntregaxProveedor(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelReporteEntregaxProveedor";
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