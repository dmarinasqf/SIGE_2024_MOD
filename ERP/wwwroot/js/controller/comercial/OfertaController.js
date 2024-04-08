class OfertaController {
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + "/Comercial/Oferta/RegistrarEditar";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                alertaSwall('S', 'OFERTA GUARDADA !!!', '');
                fn(data);
            }
            else
                mensaje('W', data.mensaje, 'TC');


        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarObsequios(obj, fn) {
        var url = ORIGEN + "/Comercial/Oferta/BuscarObsequios";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarOfertaCompleta(id, fn) {
        var url = ORIGEN + "/Comercial/Oferta/BuscarOfertaCompleta?id=" + id;
        $.post(url).done(function (data) {   
            if (data == null)
                mensaje('W', 'No existe oferta');
            else
                fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarOfertaSucursal(id, fn) {
        var url = ORIGEN + "/Comercial/Oferta/ListarOfertaSucursal?idoferta=" + id;
        $.post(url).done(function (data) {   
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    AsignarOfertaSucursal(obj, fn) {
        var url = ORIGEN + "/Comercial/Oferta/AsignarOfertaSucursal";
        $.post(url,obj).done(function (data) {   
            if (data.mensaje == 'ok')
                mensaje('S', 'Registro guardado');
            else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    AsignarOfertaSucursalEnBloque(obj, fn) {
        var url = ORIGEN + "/Comercial/Oferta/AsignarOfertaSucursalEnBloque";
        $.post(url,obj).done(function (data) {   
            if (data.mensaje == 'ok')
                mensaje('S', 'Registros guardado');
            else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}