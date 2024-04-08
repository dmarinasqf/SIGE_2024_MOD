
$('#form-registro').submit(function (e) {
    e.preventDefault();
    if (!fnvericarlotesproductoregistrar())
        return false;
    var count = tbllista.rows().data().length;
    if (count > 0) {  
        swal('¿DESEA GUARDAR DATOS DE PREINGRESO?', "l", {
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
        }).then((confirmar) => {
            if (confirmar) {
                var obj = $('#form-registro').serializeArray();
              
                var detalle = obtenerDetalle();
                obj[obj.length] = { value: JSON.stringify(detalle), name: 'jsondetalle' }
                btnguardarPreIngreso.prop('disabled', true);
                BLOQUEARCONTENIDO('form-registro', 'Guardando datos...');
                let controller = new PreingresoController();
                controller.Registrar(obj, function (dataOrden) {
                    if (dataOrden.mensaje == "ok") {
                        var arrItemsACrear = [];
                        for (var i = 0; i < detalle.length; i++) {
                            if (detalle[i].cantfactura.length > 0 || parseInt(detalle[i].cantfactura) != 0) {
                                if (parseInt(detalle[i].cantfactura) < parseInt(detalle[i].cantoc)) {
                                    var iddetalleorden = parseInt(detalle[i].iddetalle);
                                    var diferencia = parseInt(detalle[i].cantoc) - parseInt(detalle[i].cantfactura);
                                    arrItemsACrear.push([iddetalleorden, diferencia]);
                                }
                            }
                        }
                        if (arrItemsACrear.length > 0) {
                            var objDetalleOrden = {
                                jsondetalle: JSON.stringify(arrItemsACrear)
                            }
                            var url = "/Compras/COrdenCompra/RegistrarItemPorDiferenciaCantidad";
                            $.post(url, objDetalleOrden).done(function (data) {
                                if (data.mensaje = "ok") {
                                    fnAccionesGuardarEditar(dataOrden);
                                } else {
                                    mensaje("W", "Error al registrar item detalle con diferencia.");
                                }
                            });
                        } else {
                            fnAccionesGuardarEditar(dataOrden);
                        }
                  
                        var datosdelaorden = dataOrden.objeto;
                        var idpreingreso = datosdelaorden.idpreingreso;
                        envCorrEncarCreacionOC(idpreingreso);

                    } else if (dataOrden.mensaje == "No se puede guardar, porque la factura esta HABILITADO "){
                        mensaje("W", dataOrden.mensaje);
                        DESBLOQUEARCONTENIDO('form-registro');
                    } else {
                        mensaje("W", "Error al registrar el PreIngreso.");
                        DESBLOQUEARCONTENIDO('form-registro');
                    }
                });
            } else {
                swal.close();
                DESBLOQUEARCONTENIDO('form-registro');
            }
        });          
    } else
        mensaje('I', 'No existen registros en el detalle');
});

function fnAccionesGuardarEditar(data) {
 
    btnguardarPreIngreso.prop('disabled', false);
    if (data === null) { DESBLOQUEARCONTENIDO('form-registro'); return; }
    var obj = data.objeto;
    txtcodigopreingreso.val(obj.codigopreingreso);
    txtidpreingreso.val(obj.idpreingreso);
    //ActualizarOrdenCompra();//actualizar las ordenes de compras usadas a aplicada
    $("#btnimprimir").attr('href',ORIGEN+ '/PreIngreso/PIPreingreso/Imprimir/' + obj.idpreingreso); 
    alertaSwall('S', 'OPERACION COMPLETADA', 'DATOS GUARDADOS');
  
 
    fnBuscarPreingresoCompleto(data.objeto.idpreingreso);
}

function fnEditarDetalleTabla(detalle) {
    detalle = JSON.parse(detalle);
    console.log(detalle);
    for (var i = 0; i < detalle.length; i++) {
        var datos = '<label class="detalle_iddetalle">' + detalle[i].iddetalle+ '</label>' +
            '<label class="detalle_iddetallepreingreso">' + detalle[i].iddetallepreingreso + '</label>' +
            '<label class="detalle_idfactura">' + detalle[i].idfactura + '</label>' +
            '<label class="detalle_idproducto">' + detalle[i].idproducto + '</label>';
        tbllista.cell(i,0).data(datos).draw();
    }
   
}

// SE CREO UN FUNCION QUE SE ENCARGARA DE ENVIAR EL CORREO A LA PERSONAS QUE CREO LA ORDEN DE COMPRA CUANDO ESTA HAYA FINALIZADO
function envCorrEncarCreacionOC(idpreingreso) {
    console.log(idpreingreso);
    var urlsistema = ORIGEN;
    var obj = {
        idpreingreso: idpreingreso,
        urlsistema: urlsistema
    };
    let controller = new PreingresoController();
    controller.envCorrEncarCreacionOC(obj, function (data) {

        console.log(data);
        var mensajeres = data.mensaje;

        if (mensajeres == "ok") {
            mensaje('S', "Correo Enviado al creador de la orden");
        } else {
            mensaje('W', "Error al enviar el correo");
        }
    });

}