var idfacturaanular = 0;
var idfacturavalidar = 0;
var idpreingreso = 0;

function fnListarFacturasPreingreso(id) {
    if (id === '')
        return;
    let controller = new PreingresoController();
    controller.BuscarFacturas(id, fnLlenarTablaFacturas);
}
//function fnListarFacturasPreingreso_paraAnular(id) {
//    if (id === '')
//        return;
//    let controller = new PreingresoController();
//    controller.BuscarFacturas(id, fnLlenarTablaFacturas_ParaAnular);
//}
function fnLlenarTablaFacturas(data, desdeBtn = "") {

    var tabla = $('#tblfacturapreingreso tbody');
    var fila = '';
    tabla.empty();
    for (var i = 0; i < data.length; i++) {
        var numdocCompleto = data[i].serie + data[i].numdoc;
        var stringAcciones;
            if (data[i].estado == 'ANULADO') {
            numdocCompleto += " <strong style='color: red;'>" + data[i].estado + "</strong>";
        }
        if (desdeBtn == "Anular") {
            stringAcciones = `<div class="btn-group btn-group-sm">
                            <button class="btn btn-sm btn-danger btnAnularDesdeModalFacturaPreIngreso"><i class="fas fa-trash"></i></button>
                    </div>`;
        } else{
            stringAcciones = `<div class="btn-group btn-group-sm">
                            <button class="btn btn-sm btn-dark btnimprimirfactura" href="`+ ORIGEN + `/PreIngreso/PIPreingreso/ImprimirPorFactura/` + data[i].idfactura + `"><i class="fas fa-print"></i></button>
                            <button class="btn btn-sm btn-success btnseleccionarfactura"><i class="fas fa-check"></i></button>
 <button class="btn btn-sm btn-info btnimprimiractarecepcion ml-1" data-toggle="tooltip"  title="Imprimir acta de recepción" href="`+ ORIGEN + `/PreIngreso/PIPreingreso/ImprimirActaRecepcion_V1/` + data[i].idfactura +`">
   <i class="fas fa-file mr-2"></i></button>
                    </div>`;
        }
        fila = `<tr>
                <td>`+ data[i].idfactura + `</td>
                <td>`+ numdocCompleto + `</td>
                <td>` + moment( data[i].fecha).format('YYYY-MM-DD') + `</td>
                <td>` + stringAcciones + `</td>
        </tr>`;
        tabla.append(fila);
    }   
}
//function fnLlenarTablaFacturas_ParaAnular(data) {

//    var tabla = $('#tblfacturapreingreso tbody');
//    var fila = '';
//    tabla.empty();
//    for (var i = 0; i < data.length; i++) {
//        var numdocCompleto = data[i].serie + data[i].numdoc;
//        if (data[i].estado == 'ANULADO') {
//            numdocCompleto += " <strong style='color: red;'>" + data[i].estado + "</strong>";
//        }
//        fila = `<tr>
//                <td>` + data[i].idfactura + `</td>
//                <td>` + numdocCompleto + `</td>
//                <td>` + moment(data[i].fecha).format('YYYY-MM-DD') + `</td>
//                <td>
//                    <div class="btn-group btn-group-sm">
//                            <button class="btn btn-sm btn-danger btnAnularDesdeModalFacturaPreIngreso"><i class="fas fa-trash"></i></button>
//                    </div>
//                </td>
//        </tr>`;
//        tabla.append(fila);
//    }
//}
function ValidarActaRepecionFactura(idfactura) {
    let controller = new AprobarFacturaController();
    var obj = {
        idfactura: idfactura
    }
    controller.ValidarActaRecepcionFactura(obj, function (data) {
        if (data.mensaje == "ok") {
            var controller = new _FacturasPreingreso();
            controller.fnListarFacturasPreingresoSinCheck(idpreingreso);
            alertaSwall('S', 'ACTA DE RECEPCIÓN VALIDADA', '');
            idfacturavalidar = 0;
        }
        else {
            alertaSwall('D', 'Error al validar el acta de recepción.', '');
        }
    });
}

$(document).on('click', '.btnimprimirfactura', function () {
    $('#modalfacturapreingreso').modal('hide');
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR FACTURA DE PREINGRESO');
});
$(document).on('click', '.btnimprimirfacturamontos', function () {
    $('#modalfacturapreingreso').modal('hide');
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR FACTURA DE PREINGRESO');
});
$(document).on('click', '.btnimprimiractarecepcion', function () {
    $('#modalfacturapreingreso').modal('hide');
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR ACTA DE RECEPCIÓN');
});
$(document).on('click', '.btnanularfactura', function () {
    $('#modalfacturapreingreso').modal('hide');
});
function fModalValidarUsuario(idfactura) {
    idfacturavalidar = idfactura;
    $('#modalvalidarusuario').modal('show');
}
$('#form-validarusuario').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Compras/CAprobarFactura/VerificarCredenciales_AprobarFactura";
    var obj = $('#form-validarusuario').serializeArray();
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.mensaje === "ok") {
            ValidarActaRepecionFactura(idfacturavalidar);
            $('#modalvalidarusuario').modal('hide');
        }
        else if (data.mensaje === "Credenciales incorrectas") {
            mensaje("I", "Usuario o contraseña son incorrectas");
        } else
            mensaje('I', data.mensaje);
    }).fail(function (data) {
        mensaje("D", "Error en el servidor");
    });
    $('#form-validarusuario').trigger('reset');
});

class _FacturasPreingreso {
    fnListarFacturasPreingresoSinCheck(id) {
        if (id === '')
            return;
        let controller = new PreingresoController();
        idpreingreso = id;
        controller.BuscarFacturas(id, this.fnLlenarTablaFacturasSinCheck);
    }
    fnLlenarTablaFacturasSinCheck(data) {
        $('#modalfacturapreingreso').modal('show');
        var tabla = $('#tblfacturapreingreso tbody');
        var fila = '';
        tabla.empty();
        for (var i = 0; i < data.length; i++) {
            var sBotonValidarAR = ``;
            //if (data[i].usuariovalida == null) {
            //    sBotonValidarAR = `<button class="btn btn-sm btn-warning ml-1" onClick="fModalValidarUsuario(` + data[i].idfactura +`)" data-toggle="tooltip"  title="Validar acta de recepción">Validar A.R.
            //        <i class="fas fa-check"></i></button >`;
            //}
            fila = `<tr>
                <td>`+ data[i].idfactura + `</td>
                <td>`+ data[i].serie + data[i].numdoc + `</td>                
                <td>`+ moment(data[i].fecha).format('YYYY-MM-DD') + `</td>
                <td>
                    <div class="btn-group btn-group-sm">
                           <button class="btn btn-sm btn-dark btnimprimirfactura ml-1" data-toggle="tooltip"  title="Imprimir cantidades ingresadas de la factura" href="`+ ORIGEN + `/PreIngreso/PIPreingreso/ImprimirPorFactura/` + data[i].idfactura +`">
                            <i class="fas fa-print mr-2"></i>Un</button>                        
                           <button class="btn btn-sm btn-dark btnimprimirfacturamontos ml-1" data-toggle="tooltip"  title="Imprimir costo de factura" href="`+ ORIGEN + `/Compras/CAprobarFactura/Imprimir?id=` + data[i].idfactura +`">
                            <i class="fas fa-print mr-2"></i>S/.</button>
                            <button class="btn btn-sm btn-info btnimprimiractarecepcion ml-1" data-toggle="tooltip"  title="Imprimir acta de recepción" href="`+ ORIGEN + `/PreIngreso/PIPreingreso/ImprimirActaRecepcion_V1/` + data[i].idfactura +`">
                            <i class="fas fa-file"></i></button>
                            `+ sBotonValidarAR +`
                    </div>
                </td>
        </tr>`;
            tabla.append(fila);
        }
    }
}


