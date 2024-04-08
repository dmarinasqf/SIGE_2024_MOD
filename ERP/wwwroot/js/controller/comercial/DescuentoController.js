class DescuentoController {
    Registrar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/RegistrarEditar";
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
    RegistrarValidacionUsuario(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/RegistrarEditarValidacionUsuario";
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
    ListarDescuentos(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/ListarDescuentos";
        $.post(url, obj).done(function (data) {
            fn((data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarSucursalDescuento(id, fn) {
        var url = ORIGEN + "/Comercial/Descuento/ListarSucursalDescuento?iddescuento="+id;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    AsignarDescuentoSucursalEnBloque(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/AsignarDescuentoSucursalEnBloque";
        $.post(url,obj).done(function (data) {
            if (data.mensaje == 'ok')
                mensaje('S', 'Registro guardado');
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    GetDescuentoCompleto(id, fn) {
        var url = ORIGEN + "/Comercial/Descuento/GetDescuentoCompleto?id="+id;
        $.post(url).done(function (data) {
            fn(JSON.parse(data)[0]);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    EditarDescuento(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/EditarDescuento";
        $.post(url,obj).done(function (data) {
            if (data.mensaje == 'ok')
            {
                mensaje('S', 'Registro guardado');
                fn();
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarDescuentosxProducto(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/ListarDescuentosxProducto";
        $.post(url,obj).done(function (data) {
            fn(JSON.parse( data)[0]);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ReporteDescuentosCobrar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/GetReporteDescuentosCobrar";
        $.post(url,obj).done(function (data) {
            fn(JSON.parse( data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    //EARTCOD1008//--------------
    //EARTCOD1008.1//--------------
    ListarDescuentoCliente(obj,fn) {
        var url = ORIGEN + "/Comercial/Descuento/ListarDescuentoCliente";
        $.post(url,obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    BuscarDescuentoCliente(obj,fn) {
        var url = ORIGEN + "/Comercial/Descuento/BuscarDescuentoCliente";
        $.post(url,obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    EditarDescuentoCliente(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/EditarDescuentoCliente";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    AgregarDescuentoCliente(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/AgregarDescuentoCliente";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    //-------------------------------------//
    //-- EARTCOD1009 - PACK PROMOCIONALES--//
    //-------------------------------------//
    PromocionesPackBuscarProducto(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionesPackBuscarProducto";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionesPackAgregar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionesPackAgregar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionesPackListar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionesPackListar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionesPackbuscar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionesPackbuscar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionesPackEditar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionesPackEditar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionBuscarProductoStockVenta(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionBuscarProductoStockVenta";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionPackPedidoDetalleAgregar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionPackPedidoDetalleAgregar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    //EARTCOD1009 -- ASIGNACION DE SUCURSALES
    PromocionPackSucursales(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionPackSucursales";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionPackSucursalAgregar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionPackSucursalAgregar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionPackSucursalLista(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionPackSucursalLista";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    //EARTCOD1008.1 -06-06-2023
    //DESCUENTO PERSONAL CON OPCION DE CANALES Y TIPOS DE PRODUCTOS
    ProductosTiposListar(fn) {
        var url = ORIGEN + "/Comercial/Descuento/ProductosTiposListar";
        $.post(url).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

     //--EARTCOD1021 -12-06-2023- NUEVA OPCION PARA OBSEQUIAR UN PRODUCTO EN BASE A UNA SUMA
    ProveedoresListar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/ProveedoresListar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    LaboratoriosListar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/LaboratoriosListar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    LaboratoriosProductosListar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/LaboratoriosProductosListar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    LaboratoriosProductosListar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/LaboratoriosProductosListar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromoProductoObsequioAgregar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromoProductoObsequioAgregar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromoProductoObsequioListar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromoProductoObsequioListar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromoProductoObsequioEditar(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromoProductoObsequioEditar";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromoProductoBuscarObsequio(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromoProductoBuscarObsequio";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    PromocionBuscarProductoObsequioStockVenta(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/PromocionBuscarProductoObsequioStockVenta";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    BuscarDescuentoPorCliente(obj, fn) {
        var url = ORIGEN + "/Comercial/Descuento/BuscarDescuentoPorCliente";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    
}