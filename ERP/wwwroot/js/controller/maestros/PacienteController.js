class PacienteController {
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + '/Maestros/Paciente/RegistrarEditar';
        $.get(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados de paciente');
                fn(data.objeto);
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarxDocumento(numdocumento, fn) {
        var url = ORIGEN + '/Maestros/Paciente/BuscarxDocumento?numdocumento=' + numdocumento;
        $.get(url).done(function (data) {
            /*if (data.mensaje != 'ok')
                mensaje('W', data.mensaje);
            else
                fn(data.objeto);*/
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarPacientes(obj, fn) {
        var url = ORIGEN + '/Maestros/Paciente/BuscarPacientes';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarPacientById(id, fn) {
        var url = ORIGEN + '/Maestros/Paciente/BuscarPacienteById?id=' + id;

        $.get(url).done(function (data) {
            if (data.mensaje === 'ok')
                fn(data.objeto);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarPacientesSelect2(tipo) {
        return {
            url: ORIGEN + "/Maestros/Paciente/BuscarPacientesByNumDocumento",
            dataType: 'json',
            data: function (params) {
                var query = {
                    numdocumento: params.term,
                }
                return (query);
            },
            processResults: function (data) {
                if (tipo == 'documento')
                    return {

                        results: $.map(data, function (obj) {
                            return {
                                id: obj.numdocumento,                               
                                text: obj.numdocumento + ' - ' + obj.nombres + ' ' + obj.apepaterno + ' ' + obj.apematerno
                            };
                        })
                    };
                else
                    return {

                        results: $.map(data, function (obj) {
                            return {
                                id: obj.idpaciente,                                
                                text: obj.numdocumento + ' - ' + obj.nombres + ' ' + obj.apepaterno + ' ' + obj.apematerno
                            };
                        })
                    };
            }
        }
    }
}