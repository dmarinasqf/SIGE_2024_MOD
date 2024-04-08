class PagoController {

    ListarDepositos(obj, fn, fnerror) {
        var url = ORIGEN + "/Finanzas/FPagos/ListarDepositosAprobar";
        $.post(url, obj).done(function (data) {
            console.log('Listar Depositos Aprobar', data);

            if (data.mensaje === 'ok') {
                fn(data.objeto);
            }
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    };

    ActualizarPago(obj, fn, fnerror) {
        var url = ORIGEN + "/Finanzas/FPagos/ActualizarPago";
        $.post(url, obj).done(function (data) {
            console.log('Actualizar Pago', data);
            if (data.mensaje === 'ok') {
                fn();
            }
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    };

    AprobarPago(obj, fn, fnerror) {
        var url = ORIGEN + "/Finanzas/FPagos/AprobarPago";
        $.post(url, obj).done(function (data) {
            console.log('Aprobar Pago', data);
            if (data.mensaje === 'ok') {
                fn();
            }
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    };

    ReporteDeposito(obj, fn, fnerror) {
        var url = ORIGEN + "/Finanzas/FPagos/ReportePagos";
        $.post(url, obj).done(function (data) {
            console.log('Reporte Depositos', data);

            if (data.mensaje === 'ok') {
                fn(data.objeto);
            }
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    };
}