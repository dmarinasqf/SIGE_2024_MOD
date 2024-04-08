class PedidoController {

    RegistrarPedido(obj,fn,fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/RegistrarPedido';

        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                fngetadelanto(data.objeto.idpedido);
                fn(data.objeto);
            }
            else {
                fnerror();
            }
        }).fail(function (data) {
            fnerror();
        });
    }
    EliminarPedido(id, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/EliminarPedido/'+id;

        $.post(url).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else 
                mensaje('W', data.mensaje);                         
        }).fail(function (data) {          
            mensajeError(data);
        });
    }
    DevolverPedido(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/DevolverPedido';
        $.post(url,obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else 
                mensaje('W', data.mensaje);                         
        }).fail(function (data) {          
            mensajeError(data);
        });
    }
    EntregarPedido(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/EntregarPedido';
        $.post(url,obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else 
                mensaje('W', data.mensaje);                         
        }).fail(function (data) {          
            mensajeError(data);
        });
    }
    AdelantoPedido(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/AdelantoPedido';
        $.post(url,obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else 
                mensaje('W', data.mensaje);                         
        }).fail(function (data) {          
            mensajeError(data);
        });
    }
    BuscarPedidoParaEntregar(id, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/BuscarPedidoParaEntregar/'+id;
        $.post(url).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data);
            else 
                mensaje('W', data.mensaje);                         
        }).fail(function (data) {          
            mensajeError(data);
        });
    }


    RegistrarImagenPedido(obj,fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/RegistrarImagenPedido';
       
        $.ajax({
            url: url,
            type: "POST",
            data: obj,          
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                if (data.mensaje === 'ok') {
                    mensaje('S', 'Imagenes o pdf actualizadas');
                } else
                    mensaje('W', data.mensaje);
            }, error: function (data) {
                mensajeError(data);                
            }

        });
    }
    // imagen bit
    RegistrarImagenPedidobit(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/RegistrarImagenPedidoBit';

        $.ajax({
            url: url,
            type: "POST",
            data: obj,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                if (data.message === 'ok') {
                    mensaje('S', 'Imagenes Guardadas');
                }  else
                    mensaje('W', data.mensaje);
            }, error: function (data) {
                mensajeError(data);
            }

        });
    }

    ListarArchivosPedidobit(idpedido, fn) {
        var url = ORIGEN + '/Pedidos/Pedido/listartablaimagenpedidobit?idpedido=' + idpedido;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }

    EditarImagenPedidobit(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/editarImagenPedidobit';

        $.ajax({
            url: url,
            type: "POST",
            data: obj,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                if (data.message === 'ok') {
                    mensaje('S', 'Imagenes o pdf actualizados');
                } else
                    mensaje('W', data.mensaje);
            }, error: function (data) {
                mensajeError(data);
            }

        });
    }


    ListarArchivosPedidobitaimagen(idpedido, fn) {
        var url = ORIGEN + '/Pedidos/Pedido/listartablaimagenpedidobitaimagen?idpedido=' + idpedido;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }

    //FIN IMAGEN BIT

    ListarPedidosVista(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/ListarPedidosVista';

        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    HistorialPedidoPacCli(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/HistorialPedidoPacCli';

        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    EditarPedido(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/EditarPedido';

        $.post(url,obj).done(function (data) {
            if (data.mensaje === 'ok') {
                fn();
            } else { mensaje('W', data.mensaje); fnerror();}
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    BuscarPagosPedido(idpedido, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/BuscarPagosPedido?idpedido=' + idpedido;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }  
    BuscarDetallePedido(idpedido, fn) {
        var url = ORIGEN + '/Pedidos/Pedido/BuscarDetallePedido?idpedido=' + idpedido;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    BuscarPedidoCompleto(idpedido, fn) {
        var url = ORIGEN + '/Pedidos/Pedido/BuscarPedidoCompleto/' + idpedido;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();  //TEMPOEART1000 obs
            mensajeError(data);
        });
    }
    BuscarPedidoParaFacturar(idpedido, fn,fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/BuscarPedidoParaFacturar?idpedido=' + idpedido;

        $.post(url).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data.objeto);
            else { mensaje('W', data.mensaje); fnerror();}
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }


    ListarArchivosPedido(idpedido, fn) {
        var url = ORIGEN + '/Pedidos/Pedido/ListarArchivosPedido?idpedido=' + idpedido;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }


    DatosAdicionalesDetallePrecio(obj, fn) {
        var url = ORIGEN + '/Pedidos/Pedido/DatosAdicionalesDetallePrecio';

        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    Listarxproductocliente(obj, fn) {
        var url = ORIGEN + "/Pedidos/Pedido/listarxproductocliente";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    RegistrarAdelanto(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Pedido/RegistarAdelanto';

        $.post(url, obj).done(function (data) {
            /*if (data.mensaje == 'ok')
                fn(data.objeto);
            else {
                fnerror();
            }*/
        }).fail(function (data) {
            fnerror();
            mensajeError(data,'adelanto');
        });
    }

    ListarLineaAtencionCombo(cmb) {
        var url = ORIGEN + '/Pedidos/Pedido/ListarLineaAtencion';

        $.post(url).done(function (data) {
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[TODOS]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].nombre;
                option.value = data[i].idLineaAtencion;
                combo.appendChild(option);
            }
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    ReporteRecepcionyValidacion(obj, fn) {
        var url = ORIGEN + "/Pedidos/Reporte/ReporteRecepcion_Validacion";
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
    GenerarExcelReportevalidacion(obj, fn) {
        var url = ORIGEN + "/Pedidos/Reporte/GenerarExcelReportevalidacion";
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
    //BuscarNumeroPedidosPendientes(obj, fn) {
    //    var url = ORIGEN + "/Pedidos/Pedido/BuscarNumeroPedidosPendientes";
    //    $.post(url, obj).done(function (data) {
    //        fn(data);
    //    }).fail(function (data) {
    //        fn(null);
    //        mensajeError(data);
    //    });
    //}
    //fngetadelanto(idpedido) {
    //var obj;
    //var monto = lbltotal.innerText;
    //var idpago = cmbtipopago.value;
    //var pagado = txtadelanto.value;
    //var ttarjeta = '', ntarjeta = ''; //= cmbtipotarjeta.value;
    //if (idpago == '10004') {
    //    ttarjeta = cmbtipotarjeta.value;
    //    ntarjeta = txtnumtarjeta.value;
    //}
    //if (monto > 0) {
    //    obj = {
    //        idtipopago: idpago,
    //        total: monto,
    //        pagado: pagado,
    //        numtarjeta: ntarjeta,
    //        idtipotarjeta: ttarjeta,
    //        iddpedido : idpedido
    //    }
    //    let controller = new PedidoController();
    //    controller.RegistrarAdelanto(obj);
    // }
    //}
    //listarxproductocliente

    // LISTAR PEDIDO 
    Listartipopedido(fn) {
        var url = ORIGEN + '/Pedidos/Pedido/Listartipopedido' ;
        $.post(url).done(function (data) {
            console.log(data);
            fn(data);
        }).fail(function (data) {
            fnerror();  //TEMPOEART1000 obs
            mensajeError(data);
        });
    }

    ListarverificionDescuentoGlobal(obj,fn) {
        var url = ORIGEN + "/Pedidos/Pedido/verificionDescuentoGlobal";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}