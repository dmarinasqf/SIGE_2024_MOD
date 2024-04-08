class AprobarFacturaController {
    ListarFacturas(obj, fn) {
        var url = ORIGEN + "/Compras/CAprobarFactura/ListarFacturas";
        $.post(url, obj).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarFactura(idfactura, fn) {
        var url = ORIGEN + "/Compras/CAprobarFactura/BuscarFactura?idfactura=" + idfactura;
        $.post(url).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarDetallePorFacturaParaNotaCredito(idfactura, fn) {
        var url = ORIGEN + "/Compras/CAprobarFactura/BuscarDetallePorFacturaParaNotaCredito?idfactura=" + idfactura;
        $.post(url).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarFacturasParaNotaCredito(obj, fn) {
        var url = ORIGEN + "/Compras/CAprobarFactura/ListarFacturasParaNotaCredito";
        $.post(url, obj).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    AprobarFactura(obj, fn) {       
        var url = ORIGEN + "/Compras/CAprobarFactura/AprobarFactura";
        console.log(obj);
        $.post(url,obj).done(function (data) {
            if (data.mensaje === 'ok') {
                fn(data);
            } else {
                alertaSwall('W', data.mensaje, '');
                fn(data);
            }
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    AnularFactura(obj, fn) {
        var url = ORIGEN + "/Compras/CAprobarFactura/AnularFactura";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                fn(data);
            } else {
                alertaSwall('W', data.mensaje, '');
                fn(data);
            }
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ValidarAnalisisOrganoleptico(obj, fn) {
        var url = ORIGEN + "/Compras/CAprobarFactura/ValidarAnalisisOrganoleptico";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                fn(data);
            } else {
                alertaSwall('W', data.mensaje, '');
                fn(data);
            }
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ValidarNotaDeCredito(obj, fn) {
        var url = ORIGEN + "/Compras/CAprobarFactura/ValidarNotaDeCredito";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                fn(data);
            } else {
                alertaSwall('W', data.mensaje, '');
                fn(data);
            }
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}