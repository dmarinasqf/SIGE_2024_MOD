class PreingresoController {
    //string preingreso, string estado, int? sucursal, string orden, string factura, int top
    ListarPreingresos(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/BuscarPreingresos";
        console.log(obj);
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarPreingresosAprobarFactura(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/BuscarPreingresosAprobarFactura";
        console.log(obj);
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //string preingreso, string estado, int? sucursal, string orden, string factura, int top
    ListarPreingresosParaAnalisis(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/BuscarPreingresosParaAnalisisOrganoleptico";
      
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarFacturas(id, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/ListarFacturas?id=" + id;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    Registrar(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/RegistrarEditar";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
            fn(null);
        });
    }
    VerificarSiOrdenTienePreingreso(idorden, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/VerificarSiOrdenTienePreingreso?idorden=" + idorden;
        $.post(url).done(function (data) {

            fn(data);
        }).fail(function (data) {
            mensajeError(data);

        });
    }
    VerificarAlmacenesParaPreingreso(idorden, sucursal, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/VerificarIngresoOrdenAlmacenes";
        var obj = { orden: idorden, sucursal: sucursal };
        $.post(url, obj).done(function (data) {

            if (data.mensaje === "ok") {
                fn(idorden);

            }
            else {
                alertaSwall('W', 'NO PODRÁ GUARDAR LA OPERACIÓN', data.mensaje);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    BuscarPreingresoCompleto(idpreingreso, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/BuscarPreingresoCompleto?id=" + idpreingreso;
        $.post(url).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    //recibe un idfactura int
    //EARTCOD1016
    BuscarPreingresoCompleto_StockxFactura(idfactura, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/BuscarPreingresoCompleto_StockxFactura?id=" + idfactura;
        $.post(url).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    AnularPreingreso(id, idfactura, fn) {
        swal('¿DESEA ANULAR LA FACTURA?', "LAS ORDENES DE COMPRA VOLVERAN A SU ESTADO ANTERIOR", {
            icon: 'warning',
            buttons: {
                confirm: {
                    text: 'ACEPTAR',
                    className: 'btn btn-success'
                },
                cancel: {
                    visible: true,
                    text: 'CANCELAR',
                    className: 'btn btn-danger'
                }
            }
        }).then((Delete) => {
            if (Delete) {
                var url = ORIGEN + "/PreIngreso/PIPreingreso/AnularPreingreso";
                var obj = { id: id, idfactura: idfactura };
                $.post(url, obj).done(function (data) {
                    if (data.mensaje === "ok") {
                        alertaSwall('S', 'FACTURA ANULADA', '');
                        fn(id, idfactura);
                    }
                    else
                        mensaje('W', data.mensaje);
                }).fail(function (data) {
                    mensajeError(data);
                });

            } else {
                swal.close();
            }
        });

    }
    //se usa para agregar bonificaciones fuera de documento
    GetBonificacionxFactura(idfactura, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/GetBonificacionxFactura?idfactura=" + idfactura;
        $.post(url).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    RegistrarEditarBonificacionFueraDoc(obj,fn,fnerror) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/RegistrarEditarBonificacionFueraDoc";
        $.post(url, obj).done(function (data) {

            if (data.mensaje === "ok") {
                fn(data);
            }
            else {
                mensaje('W', data.mensaje);
                fnerror();
            }           
        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });
    }
    ListarItemsCondicionEmbalaje(fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/ListarItemsCondicionEmbalaje";
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    guardarpdfpreingreso(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/guardarpdfpreingreso";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    //CODIGO PARA EL LISTADO Y EDICION DEL DRIVE YEX

    ListarDocumentospreingreso(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/BuscarDocuLote";
        console.log(obj);
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    listaDatoDocumentosLote(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/listaDatoDocumentosLote";
        console.log(obj);
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    validardocuemntoloteexistente(obj, fn) {
        var url = ORIGEN + "/PreIngreso/PIPreingreso/validardocuemntoloteexistente";
        console.log(obj);
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    envCorrEncarCreacionOC(obj, fn) {
        var url = ORIGEN + "/Compras/COrdenCompra/EnviarEmailPreingresoTerm";
        console.log(obj);
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    
}