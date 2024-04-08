class OrdenCompraController {

    //string estado, string id, string sucursaldestino
    ListarCompras(params, fn) {
        var url = ORIGEN + "/Compras/COrdenCompra/BuscarOrdenes";
        $.post(url, params).done(function (data) {
            var datos = JSON.parse(data);
            if (Array.isArray(datos) && datos.length > 0) {
                $('#numRegistros').text(datos.length);
            } else {
                mensaje('I', 'No hay datos en la consulta');
            }
            fn(datos);
            DESBLOQUEARCONTENIDO('cardreport');
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }


    BuscarOrdenCompraMasBonificaciones(obj, fn) {
        var url = ORIGEN + "/Compras/COrdenCompra/CargarOrdenCompraMasBonificaciones";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                var datos = JSON.parse(data.objeto);
                fn(datos);
            } else
                mensaje('W', data.mensaje);
            
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    EnviarEmail(obj) {
        var url = ORIGEN + "/Compras/COrdenCompra/EnviarEmail";
       
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok')
            { mensaje('S', 'Email enviado'); $('#modalcorreos').modal('hide');}
            else
                mensaje('W', data.mensaje);
           
            DESBLOQUEARCONTENIDO('modalcorreos');
        }).fail(function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
            DESBLOQUEARCONTENIDO('modalcorreos');

           
        });
    }
    GetEmailEnvio(id,fn) {
        var url = ORIGEN + "/Compras/COrdenCompra/GetEmailEnvio?id="+id;
       
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
            $('#modalprogress').modal('hide');
        });
    }
    ListarCCosto(cmb, fn) {

        var url = ORIGEN + '/Compras/COrdenCompra/ListarCCostos';
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
                option.text = data[i].nombrecentcost;
                option.value = data[i].idcodicentcost;
                
                combo.appendChild(option);
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ReporteCompras(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteCompras";
        $.post(url, obj).done(function (data) {
            //console.log(data);
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ExportarCompras(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelCompras";
        $.post(url, obj).done(function (data) {
            console.log("HOLA ESTA ES LA DATA");
            console.log(data);
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ReporteComprasDetallada(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteComprasDetallada";
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ExportarComprasDetallada(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelComprasDetallada";
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
    ReporteDistribucion(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteDistribucion";
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ExportarReporteDistribucion(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelReporteDistribucion";
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
    ReporteDistribucionDetallado(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/ReporteDistribucionDetallado";
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ExcelReporteDistribucionDetallado(obj, fn) {
        var url = ORIGEN + "/Compras/CReporte/GenerarExcelReporteDistribucionDetallado";
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