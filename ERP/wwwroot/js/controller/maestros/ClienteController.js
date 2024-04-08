class ClienteController {
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + '/Maestros/Cliente/RegistrarEditar';
        $.post(url,obj).done(function (data) {
            if (data.mensaje === 'ok')
            {
                mensaje('S', 'Datos guardados de cliente');

                fn(data.objeto);
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditarCliente2(obj, fn) {
        var url = ORIGEN + '/Maestros/Cliente/RegistrarEditarCliente';
        $.post(url,obj).done(function (data) {
            if (data.mensaje === 'ok')
            {
                mensaje('S', 'Datos guardados de cliente');

                fn(data.objeto);
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditarClienteAsociado(obj, fn) {
        var url = ORIGEN + '/Maestros/Cliente/RegistrarEditarClienteAsociado';
        $.post(url,obj).done(function (data) {
            if (data.mensaje === 'ok')
            {
                mensaje('S', 'Datos guardados de cliente');

                fn(data.objeto);
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarClientes(obj, fn) {
        var url = ORIGEN + '/Maestros/Cliente/BuscarClientes';

        $.get(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarClientesPaginacion(obj, fn) {
        var url = ORIGEN + '/Maestros/Cliente/BuscarClientesPaginacion';
        
        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarCliente(numdocumento, fn) {
        var url = ORIGEN + '/Maestros/Cliente/BuscarCliente?numdocumento=' + numdocumento;

        $.get(url).done(function (data) {
            if (data === null)
                mensaje('W', 'No existe cliente');
            else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarClientebyId(idcliente, fn) {
        var url = ORIGEN + '/Maestros/Cliente/BuscarClientebyId?idcliente=' + idcliente;

        $.get(url).done(function (data) {
            if (data.mensaje === 'ok')
                fn(data.objeto);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarClienteCompleto(idcliente, fn) {
        var url = ORIGEN + '/Maestros/Cliente/BuscarClienteCompleto?idcliente=' + idcliente;

        $.get(url).done(function (data) {
            if (data.mensaje === 'ok')
                fn(data.objeto);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarClientesSelect2(tipo) {
        return {
            url: ORIGEN + "/Maestros/Cliente/BuscarClientesEF",
            dataType: 'json',
            data: function (params) {
                var query = {
                    filtro: params.term,
                }
                return (query);
            },
            processResults: function (data) {
                if (tipo == 'documento')
                    return {
                        results: $.map(data, function (obj) {
                            return {
                                id: obj.numdocumento,
                                text: obj.numdocumento + ' - ' + obj.nombres
                            };
                        })
                    };
                else
                    return {
                        results: $.map(data, function (obj) {
                            return {
                                id: obj.idcliente,
                                text: obj.numdocumento + ' - ' + obj.nombres
                            };
                        })
                    };
            }
        }
    }
    GuardarImagen(obj,fn) {
        var url = ORIGEN + '/Maestros/Cliente/RegistrarImagen';

        $.ajax({
            url: url,
            type: "data",
            data: obj,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                if (data.mensaje === 'ok') {
                    fn(data);
                } else
                    mensaje('W', data.mensaje);
            }, error: function (data) {
                console.log(data);
            }

        });
    }
    GenerarExcelClientes(obj, fn) {
        var url = ORIGEN + "/Maestros/Cliente/GenerarExcelClientes";
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