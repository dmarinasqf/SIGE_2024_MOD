class CotizacionController {
    //string estado, string fecha,string id
    ListarCotizaciones(params,fn) {
        var url = ORIGEN + "/Compras/CCotizacion/BuscarCotizacion";
        $.post(url, params).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarEditar(obj, fn) {
       
        var mens1='¿DESEA EDITAR PROFORMA?', mens2='PROFORMA EDITADA';
        if (obj.idcotizacion === '' || obj.idcotizacion.toString() === "0") {
            mens1 = '¿DESEA GUARDAR PROFORMA?';
            mens2 = "PROFORMA GENERADA";
        }
        swal({
            title: mens1,
            text: "",
            type: 'warning',
            class: 'text-center',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'Cancelar',
                    className: 'btn btn-danger'
                },
                confirm: {
                    text: 'Aceptar',
                    className: 'btn btn-success'
                }
            }
        }).then((willDelete) => {
            if (willDelete) {
                var url = ORIGEN + "/Compras/CCotizacion/RegistrarEditar";
                $.post(url, obj).done(function (data) {                  
                    if (data.mensaje === "ok") {
                        fn(data,mens2);
                    }
                    else {
                        mensaje('W', data.mensaje);
                        fn(null,'');
                    }
                }).fail(function (data) {
                    fn(null);
                    mensajeError(data);
                });   
            }
            else
                swal.close();
        });
     
    }   
    Anular(id, fn) {
        swal({
            title: '¿Desea anular proforma?',
            text: "",
            type: 'warning',
            class: 'text-center',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'Cancelar',
                    className: 'btn btn-danger'
                },
                confirm: {
                    text: 'Aceptar',
                    className: 'btn btn-success'
                }
            }
        }).then((willDelete) => {
            if (willDelete) {
                var url = ORIGEN + "/Compras/CCotizacion/AnularCotizacion";
                var obj = { id: id };
                $.post(url, obj).done(function (data) {
                    if (data.mensaje === "ok") {
                        alertaSwall('S', 'PROFORMA ANULADA','');
                        $('#txtestado').val('ANULADO'); 
                        setTimeout(function () { location.reload();},1000);
                    }
                    else {
                        mensaje('W', data.mensaje);
                    }
                }).fail(function (data) {
                    console.log(data);
                    mensaje("D", "Error en el servidor");
                });
            }
            else
                swal.close();
        });

    }
    Habilitar(id, fn) {
        swal({
            title: '¿Desea anular proforma?',
            text: "",
            type: 'warning',
            class: 'text-center',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'Cancelar',
                    className: 'btn btn-danger'
                },
                confirm: {
                    text: 'Aceptar',
                    className: 'btn btn-success'
                }
            }
        }).then((willDelete) => {
            if (willDelete) {
                var url = ORIGEN + "/Compras/CCotizacion/habilitarCotizacion";
                var obj = { id: id };
                $.post(url, obj).done(function (data) {
                    if (data.mensaje === "ok") {
                        alertaSwall('S','PROFORMA HABILITADA');
                        $('#txtestado').val('PENDIENTE');
                        location.reload();
                    }
                    else {
                        mensaje('W', data.mensaje);
                    }
                }).fail(function (data) {
                    console.log(data);
                    mensaje("D", "Error en el servidor");
                });
            }
            else
                swal.close();
        });

    }
    Buscar(id, fn) {
        var url = ORIGEN + "/Compras/CCotizacion/BuscarProformaCompleta?id="+id;
        $.post(url).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarUltimaCompraxProducto(idproducto, fn) {
        var obj = {
            idproducto: idproducto
        }
        var url = ORIGEN + "/Compras/CCotizacion/BuscarUltimaCompraxProducto" ;
        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    GetBonificacionDetalleCotizacion(iddetallecotizacion, fn) {
        var url = ORIGEN + "/Compras/CCotizacion/getBonificacion?id=" + iddetallecotizacion;
        $.post(url).done(function (data) {
         
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    EnviarEmail(obj) {
        var url = ORIGEN + "/Compras/CCotizacion/EnviarEmail";

        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') { mensaje('S', 'Email enviado'); $('#modalcorreos').modal('hide'); }
            else
                mensaje('W', data.mensaje);

            DESBLOQUEARCONTENIDO('modalcorreos');
        }).fail(function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
            DESBLOQUEARCONTENIDO('modalcorreos');


        });
    }
    GetEmailEnvio(id, fn) {
        var url = ORIGEN + "/Compras/CCotizacion/GetEmailEnvio?id=" + id;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
            $('#modalprogress').modal('hide');
        });
    }
    async GetProformas(obj, fn) {
        var url = ORIGEN + "/Compras/CCotizacion/GetProformas";
        $.post(url, obj).done(async function (data) {
            fn(data);
        }).fail(async function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
        });
    }

    CargarUnidadMedida(fn) {
        var url = ORIGEN + "/Compras/CCotizacion/GetUnidadMedida";

        $.post(url).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            console.log(data);
            mensaje(data);
        });
    }
}