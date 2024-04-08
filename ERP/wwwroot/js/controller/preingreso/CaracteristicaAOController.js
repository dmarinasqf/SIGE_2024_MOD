class CaracteristicaAOController {
    // requiere int id,string descripcion,string estado
    registrar(params, fn) {
        var url = ORIGEN + "/Preingreso/PICaracteristicaAO/RegistrarEditar";
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensaje("D", "Error en el servidor");
        });
    }
    //requiere: int id
    deshabilitar(id, fn) {
        var url = ORIGEN + "/Preingreso/PICaracteristicaAO/Deshabilitar/" + id;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    habilitar(id, fn) {
        var url = ORIGEN + "/Preingreso/PICaracteristicaAO/Habilitar/" + id;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    //recibe string estado,string categoria
    ListarCaracteristicaxCategoria(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PICaracteristicaAO/Listar";
        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarHabilitados(fn) {
        var url = ORIGEN + "/PreIngreso/PICaracteristicaAO/ListarHabilitados";
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}