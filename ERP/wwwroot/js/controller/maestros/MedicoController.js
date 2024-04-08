class MedicoController {
    //string colegiatura, int? idcolegio
    BuscarMedicoByNumColegio(params, fn)
    {
        var url = ORIGEN + '/Maestros/Medico/BuscarMedicoByNumColegio';
        $.post(url, params).done(function (data) {
            if (data.mensaje != 'ok')                         
                mensaje('W', data.mensaje);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }   
    BuscarMedicos(obj, fn) {
        var url = ORIGEN + '/Maestros/Medico/BuscarMedicos';       
        $.post(url, obj).done(function (data) {           
            fn( data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarMedicosByOReceta(obj, fn) {
        var url = ORIGEN + '/Maestros/Medico/ListarMedicosByOReceta';
        $.post(url,obj).done(function (data) {           
            fn( data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarMedicoPorId(obj, fn) {
        var url = ORIGEN + '/Maestros/Medico/getMedicoxId';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarMedicoSelect2(tipo) {
        return {
            url: ORIGEN + "/Maestros/Medico/BuscarMedicos",
            dataType: 'json',
            type:'POST',
            data: function (params) {
                var query = {
                    filtro: params.term,
                    top:15
                }
                return (query);
            },
            processResults: function (data) {
                if (tipo == 'documento')
                    return {
                        results: $.map(data.data, function (obj) {
                            return {
                                id: obj.colegiatura,
                                text: obj.colegiatura + ' - ' + obj.nombres + ' ' + obj.apepaterno + ' ' + obj.apematerno
                            };
                        })
                    };
                else
                    return {
                        results: $.map(data.data, function (obj) {
                            
                            return {
                                id: obj.idmedico,
                                text: obj.colegiatura + ' - ' + obj.nombres + ' ' + obj.apepaterno + ' ' + obj.apematerno
                            };
                        })
                    };
            }
        }
    }
    RegistrarEditar(obj, fn) {
        console.log(obj);
        var url = ORIGEN + '/Maestros/Medico/SetMedico';
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Datos guardados');
                fnguardarimagen(data.objeto[0].idmedico);
            } else {
                mensaje('W', data.mensaje);
            }
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GenerarExcelMedicos(obj, fn) {
        var url = ORIGEN + "/Maestros/Medico/GenerarExcelMedicos";
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