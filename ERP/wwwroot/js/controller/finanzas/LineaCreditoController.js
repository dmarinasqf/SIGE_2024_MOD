class LineaCreditoController {
    BuscarLineaCredito(idcliente, fn) {
        var url = ORIGEN + '/Finanzas/FLineaCredito/BuscarLineaCliente?idcliente=' + idcliente;
        $.get(url).done(function (data) {
            if (data.mensaje === 'ok')
                fn(data.objeto);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditarCredito(obj, fn) {
        var url = ORIGEN + '/Finanzas/FLineaCredito/RegistrarEditarCredito' ;
        $.get(url,obj).done(function (data) {
            if (data.mensaje === 'ok')
                fn(data);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    HistorialCreditoCliente(idcliente, fn) {
        var url = ORIGEN + '/Finanzas/FLineaCredito/HistorialCreditoCliente?idcliente=' + idcliente ;
        $.get(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarDocumentosPorCobrar(obj, fn) {
        var url = ORIGEN + '/Finanzas/FLineaCredito/ListarDocumentosPorCobrar' ;
        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GenerarExcelDocCobrar(obj, fn) {
        var url = ORIGEN + '/Finanzas/FLineaCredito/ExcelPagosDocumentos' ;
        $.post(url,obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarPagosDocumentos(obj, fn) {
        var url = ORIGEN + '/Finanzas/FLineaCredito/RegistrarPagosDocumentos' ;
        $.post(url,obj).done(function (data) {
            if (data.mensaje === 'ok')
                fn(data);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}