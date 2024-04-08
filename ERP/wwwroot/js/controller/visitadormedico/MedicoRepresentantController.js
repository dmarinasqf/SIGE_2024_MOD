class MedicoRepresentanteController {
    ListarMedicosRepMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/ListarMedicosRepMedico';
        $.post(url, obj).done(function (data) {
            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarClientesRepMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/ListarClientesRepMedico';
        $.post(url, obj).done(function (data) {
            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCanalVentaMedicoRepMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/ListarCanalVentaMedicoRepMedico';
        $.post(url, obj).done(function (data) {
            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCanalVentaClienteRepMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/ListarCanalVentaClienteRepMedico';
        $.post(url, obj).done(function (data) {
            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarRepresentatesDeUnMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/BuscarRepresentatesDeUnMedico';
        $.post(url, obj).done(function (data) {
            fn(data)
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    AgregarMedicoRepMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/AgregarMedicoRepMedico';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    DeshabilitarMedicoRepMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/DeshabilitarMedicoRepMedico';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    AgregarClienteRepMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/AgregarClienteRepMedico';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    DeshabilitarClienteRepMedico(obj, fn) {
        var url = ORIGEN + '/VisitadorMedico/MedicoRepresentante/DeshabilitarClienteRepMedico';
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}