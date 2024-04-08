class InventarioController {
    RegistrarInicioInventario(obj, fn) {
        var url = ORIGEN + "/Almacen/AInventario/RegistrarInicioInventario";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarDetalleInventario(obj, fn) {
        var url = ORIGEN + "/Almacen/AInventario/RegistrarDetalleInventario";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarFinalizacionInventario(obj, fn) {
        var url = ORIGEN + "/Almacen/AInventario/RegistrarFinalizacionInventario";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarLotePorLaboratorioSucursal(obj, fn) {
        var url = ORIGEN + "/Almacen/AInventario/BuscarLotePorLaboratorioSucursal";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ValidarExistenciaInventario(obj, fn) {
        var url = ORIGEN + "/Almacen/AInventario/ValidarExistenciaInventario";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarLote(obj, fn) {
        var url = ORIGEN + "/Almacen/AInventario/RegistrarLote";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}