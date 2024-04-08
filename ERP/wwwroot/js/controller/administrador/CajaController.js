class CajaController {
    ListarCajas(fn) {
        var url = ORIGEN + "/Administrador/Caja/ListarCajas";
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCajaSucursal(fn, idsucursal) {
        var url = ORIGEN + "/Administrador/Caja/ListarCajasSucursal?idsucursal=" + idsucursal;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarCajaSucursal(idcajasucursal, fn) {
        var url = ORIGEN + "/Administrador/Caja/BuscarCajaSucursal?idcajasucursal=" + idcajasucursal;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCorrelativosPorCaja(idcajasucursal, fn) {
        var url = ORIGEN + "/Administrador/Caja/ListarCorrelativosPorCaja?idcajasucursal=" + idcajasucursal;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCorrelativosPorCajaPorDocumento(cmb, params, fn, idcorrelativo) {
        var url = ORIGEN + "/Administrador/Caja/ListarSerieCajasxsucursalxdocumento";
        $.post(url, params).done(function (data) {
         
            if (cmb == null || cmb == '') {
                if (fn != null)
                    fn(data, idcorrelativo);
            }
            else {
                if (data.mensaje == "ok") {
                    let datos = JSON.parse(data.objeto);
                    for (var j = 0; j < datos.length; j++) {
                        if (datos[j]["IDCORRELATIVO"] == idcorrelativo)
                            $("#" + cmb).append(`<option value="` + datos[j]["SERIE"] + `" idcaja="` + datos[j]["IDCAJA"] + `" idcorrelativo="` + datos[j]["IDCORRELATIVO"] + `" selected>` + datos[j]["SERIE"] + " - " + datos[j]["CAJA"] + `</option>`);
                        else
                            $("#" + cmb).append(`<option value="` + datos[j]["SERIE"] + `" idcaja="` + datos[j]["IDCAJA"] + `" idcorrelativo="` + datos[j]["IDCORRELATIVO"] + `">` + datos[j]["SERIE"] + " - " + datos[j]["CAJA"] + `</option>`);

                    }
                } else
                    mensaje("W", data.mensaje, "BR");
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }

    RegistrarEditarCorrelativosPorCaja(obj, fn) {
        var url = ORIGEN + "/Administrador/Caja/RegistrarEditarCorrelativosPorCaja";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados.');
                console.log(data);
                fn(data.objeto);
            } else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ActualizarDatosCaja(obj, fn) {
        var url = ORIGEN + "/Administrador/Caja/ActualizarDatosCaja";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados.');
                fn(data);
            } else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

}