class LaboratorioPedidoController {
    ListarPedidosLaboratorio(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/ListarPedidosLaboratorio';

        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    ListarDificultad(estado, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/ListarDificultad?estado=' + estado;

        $.post(url).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    TransferirPedido(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/TransferirPedido';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    CambiarDificultadItem(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/CambiarDificultadItem';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    IngresarOrdenProduccion(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/IngresarOrdenProduccion';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    IngresarNumDocumento(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/IngresarNumDocumento';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    TerminarPedido(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/TerminarPedido';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarPedidosDevueltos(idlaboratorio, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/BuscarPedidosDevueltos?idlaboratorio=' + idlaboratorio;
        $.post(url).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data.objeto);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    DescargarPedidoDevuelto(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/DescargarPedidoDevuelto';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data.objeto);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    CambiarFormuladorxItem(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/CambiarFormuladorxItem';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    CambiarLaboratorioAsignado(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/CambiarLaboratorioAsignado';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn();
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarDetallePorLaboratorioAsignado(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/ListarDetallePorLaboratorioAsignado';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ObtenerNumeroDetallePedidosAsignados(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/ObtenerNumeroDetallePedidosAsignados';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    CambiarEstadoProcesoDetalle(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/CambiarEstadoProcesoDetalle';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarDetallePorLaboratorioRecepcionado(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/ListarDetallePorLaboratorioRecepcionado';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ObtenerNumeroDetallePedidosRecepcionados(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/ObtenerNumeroDetallePedidosRecepcionados';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    AlertaDetalleSegunComplejidad(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/AlertaDetalleSegunComplejidad';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    CambiarEstadoDetalleTerminado(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/CambiarEstadoDetalleTerminado';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarDificultadDetallePedido(obj, fn, fnerror) {
        var url = ORIGEN + '/Pedidos/Laboratorio/ListarDificultadDetallePedido';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}