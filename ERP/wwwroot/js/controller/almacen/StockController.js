class StockController {
    //string producto, int sucursal, string idalmacensucursal, int top
    ListarProductosConStockDistint(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/ListarProductosConStockDistint";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //int idproducto, int sucursal, string idalmacensucursal
    GetStockProductosxLote(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/GetStockProductosxLote";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    GetStockProductosParaVenta(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/GetStockProductosParaVenta";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    GetStockProductoxDescuento(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/GetStockProductoxDescuento";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    CerarStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/CerarStock";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    CargarStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/CargarStock";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //string producto, string sucursal, string tipoproducto, int top
    GetProductosConStock(obj, fn, fnerror) {
        var url = ORIGEN + "/Almacen/AStock/GetProductosConStock";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    BuscarStock(idstock, fn) {
        var url = ORIGEN + "/Almacen/AStock/BuscarStock?idstock=" + idstock;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarStockXLaboratorio(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/BuscarStockXLaboratorio";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarStockPorProductoLista(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/BuscarStockPorProductoLista";
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            if (data.length == 0)
                mensaje('W', 'No se encuentra el producto para la bonificacion')
            else
                fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ActualizarStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/ActualizarStock";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                mensaje('S', 'Daos actualizados');
            else
                mensaje('W', data.mensaje);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //string sucursal,int top, string producto
    ReporteStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/ReporteStock";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //string sucursal,int top, string producto
    GenerarExcelStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/GenerarExcelStock";
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
    GetGenericosXProductosConStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/GetGenericosXProductosConStock";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    GetStockProducto(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/GetStockProducto";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn((data.objeto));
        }).fail(function (data) {

            mensajeError(data);
        });
    }

    GetStockEnSucursalxProducto(idproducto, fn) {
        var url = ORIGEN + "/Almacen/AStock/GetStockEnSucursalxProducto?idproducto=" + idproducto;
        $.post(url).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarProductosSinStock(obj, fn) {
        var url = ORIGEN + "/Almacen/AStock/RegistrarProductosSinStock";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}