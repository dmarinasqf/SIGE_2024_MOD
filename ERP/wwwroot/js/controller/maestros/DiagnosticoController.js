class DiagnosticoController {
    BuscarDignostico(filtro, fn) {
        var url = ORIGEN + '/Maestros/Diagnostico/Buscardiagnosticos?filtro=' + filtro;

        $.get(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarDignosticoSelect2() {
        return {
            url: ORIGEN + '/Maestros/Diagnostico/Buscardiagnosticos',
            dataType: 'json',
            data: function (params) {
                var query = {
                    filtro: params.term,
                }
                return (query);
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (obj) {
                        return {
                            id: obj.iddiagnostico,                        
                            text: obj.descripcion
                        };
                    })
                };
            }
        }
    }
}