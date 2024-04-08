class VentasController {
    RegistrarVentaDirecta(obj, fn, fnerror) {
        var url = ORIGEN + "/Ventas/Venta/VentaDirecta";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                fn(data.objeto);
                mensaje('S', 'Venta Realizada.', '');
            }
            else {
                mensaje('W', data.mensaje, '');
                fnerror();
            }
        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });

    }
    RegistrarVentaManual(obj, fn,fnerror) {
        var url = ORIGEN + "/Ventas/Venta/VentaManual";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok")
            {
                fn(data.objeto);
                alertaSwall('S', 'Venta Realizada.', '');
            }
          
                 else {
                alertaSwall('W', data.mensaje, '');
                fnerror();
            }
        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });
    }
   
    //string fechainicio, string fechafin, string sucursal, string numdocumento,int top
    GetHistorialVentas(obj, fn) {
        
    var url = ORIGEN + "/Ventas/Venta/GetHistorialVentas";
        
       $.post(url, obj).done(function (data) {
           fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
        
    }
    GetVentasMatrizParaNC(obj, fn) {
        var url = ORIGEN + "/Ventas/Venta/GetVentasMatrizParaNC";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetDetalleVentasMatrizParaNC(obj, fn) {
        var url = ORIGEN + "/Ventas/Venta/GetDetalleVentasMatrizParaNC";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }






    GetVentaCompleta(idventa, fn) {
        var url = ORIGEN + "/Ventas/Venta/GetVentaCompleta?idventa=" + idventa;
        $.post(url).done(function (data) {
            fn(JSON.parse(data));            
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetVentaCompletaParaNotaCD(idventa, fn) {
        var url = ORIGEN + "/Ventas/Venta/GetVentaCompletaParaNotaCD?idventa=" + idventa;
        $.post(url).done(function (data) {
            if (data.mensaje == 'ok')
                fn(JSON.parse(data.objeto));
            else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GenerarTxtVenta(idventa, fn) {
        var url = ORIGEN + "/Ventas/Venta/GenerarTxtVenta?idventa=" + idventa;
        $.post(url).done(function (data) {
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
    AnularVenta(idventa, fn) {
        var url = ORIGEN + "/Ventas/Venta/AnularVenta?idventa=" + idventa;
        $.post(url).done(function (data) {
            if (data.mensaje === 'ok')
                mensaje('S', 'Venta anulada');           
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ExportarVentas(obj, fn) {
        var url = ORIGEN + "/Ventas/Venta/GenerarExcelVentas";
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
    HistorialClientes(obj, fn) {
        var url = ORIGEN + "/Ventas/Venta/GetHistorialClientes";
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}