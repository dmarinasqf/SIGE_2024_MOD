class ReporteFinanzasController {
    ExportarVentas(obj, fn,fnerror) {
        var url = ORIGEN + "/Finanzas/FReporte/ConsultarInterfazStartSoft";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                var a = document.createElement('a');
                a.href = ORIGEN + data.objeto;
                a.download = data.objeto.split('/')[data.objeto.split('/').length - 1];
                a.click();
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
    }
}