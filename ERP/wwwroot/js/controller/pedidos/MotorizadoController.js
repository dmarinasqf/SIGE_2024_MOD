class MotorizadoController {
    ListarPedidoPorUsuario(estado, fn) {
        var url = ORIGEN + '/Pedidos/Motorizado/ListarPedidosPorUsuario';
        var obj = { estado: estado };
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    CambiarEstadoEntregaDelivery(estado, id, fn) {
        var url = ORIGEN + '/Pedidos/Motorizado/CambiarEstadoEntregaDelivery';
        var obj = { estado: estado, id: id };
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok")
                fn(data);
            else
                fn(data.mensaje);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    ReporteGeneral(obj, fn) {
        var url = ORIGEN + '/Pedidos/Motorizado/ReporteGeneral';
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    GenerarExcelReporteGeneral(obj, fn) {
        var url = ORIGEN + "/Pedidos/Motorizado/GenerarExcelReporteGeneral";
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