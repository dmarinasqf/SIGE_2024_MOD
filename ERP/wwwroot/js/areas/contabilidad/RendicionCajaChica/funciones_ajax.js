var cant_filas = 0;
var notificacion;//para generar la notificacion en el modal

function RendicionAgregarDetalleItem() {
    if (validacionForm()) {
        var numRuc = $('#numRuc').val();
        var numRucLabel = $("#numRucLabel");
        var maxLength;

        if (numRucLabel.text() === "NUM RUC") {
             maxLength = 11;
        }
        else {

            // Allow 12 or 8 digits for non-"NUM RUC" cases
            maxLength = (numRuc.length === 12 || numRuc.length === 8) ? numRuc.length : 12;
        }

    
        if (maxLength === 11) {
        if (numRuc.length !== maxLength) {
            var notificacion = `<div class="alert alert-warning" role="alert"> El ${numRucLabel.text()} debe tener ${maxLength} dígitos.</div>`;
            $("#notificacion").html(notificacion);
             return; // Stop execution if the length of the RUC is not valid

        }
        }

        else  {
            if (numRuc.length !== maxLength) {
                var notificacion = `<div class="alert alert-warning" role="alert"> El ${numRucLabel.text()} debe tener 8(DNI) o 12(C.EXTRANJERIA) dígitos.</div>`;
                $("#notificacion").html(notificacion);
                return; // Stop execution if the length of the RUC is not valid

            }

        }

        var formData = new FormData();
        var files = $('#imgFile')[0].files[0];
        formData.append('imgFile', files);

        formData.append('idCajaChica', $('#idCajaChica').val());
        //formData.append('numItem', cant_filas);
        formData.append('fecha', $('#fecha').val());
        formData.append('numRuc', $('#numRuc').val());
        formData.append('tipoDoc', $('#tipoDoc option:selected').text());
        formData.append('numSerie', $('#numSerie').val() != null ? $('#numSerie').val():"");
        formData.append('numDoc', $('#numDoc').val());
        formData.append('total', $('#total').val());
        //formData.append('saldo', calcularSaldo());
        formData.append('tipoGastos', $('#tipoGastos option:selected').val());
        formData.append('comentarios', $('#comentarios').val());
        formData.append('centro_costos_dos', $('#centro_costos_dos').val());
        formData.append('tp_igv', $('#tp_igv').val());

        $.ajax({
            type: "POST",
            url: "/Contabilidad/RendicionCajaChica/RendicionAgregarDetalleItem",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data == '"success"') {
                    notificacion = `<div class="alert alert-success" role="alert"> Su redición se agregó con éxito!</div>`;
                    consultarFichaRendicion($('#idSucursalResp').val())
                } else if (data == '"error_uc"'){
                    notificacion = `<div class="alert alert-danger" role="alert"> Error: El número y ruc del documento ya existen!</div>`;
                }

      


                else {
                    notificacion = `<div class="alert alert-danger" role="alert"> Ha ocurrido un error!</div>`;
                }
                $("#notificacion").html(notificacion);
                //console.log("success");
            },
            error: function () {
                //console.log("error");
                notificacion = `<div class="alert alert-danger" role="alert"> Ha ocurrido de comunicación!</div>`;
                $("#notificacion").html(notificacion);
            },
            complete: function () {
                //console.log("completado");
            }
        });
        limpiarForm();
        setTimeout(function () { $("#notificacion").html(""); }, 3000);
        //setTimeout(function () { $('#notificacion').fadeOut('slow'); }, 3000);
    } else {
        //console.log("FECHA: "+$("#fecha").val());
        notificacion = `<div class="alert alert-danger" role="alert"> Complete los campos vacios!</div>`;
        $("#notificacion").html(notificacion);
    }
}


function autocompletarConCeros(inputElement) {

    var valor = inputElement.value;

    if ($("#tipoDoc").val() == 5) {

    while (valor.length < 7) {
        valor = '0' + valor;
        }

    }
    else {
        while (valor.length < 8) {
            valor = '0' + valor;
        }
    }

    inputElement.value = valor;
}

function cajaRendicionListarUser() {
    var emp_codigo = $("#emp_codigo").val();
    var fechaInicial = $("#date_fechaInicial").val();
    var fechaFinal = $("#date_fechaFinal").val();
    var url = '/Contabilidad/RendicionCajaChica/cajaRendicionListarUser';// + ruta;
    var data = { emp_codigo: emp_codigo, fechaInicial: fechaInicial, fechaFinal: fechaFinal };
    $.post(url, data).done(function (data) {
        //console.log(data);
        var json = $.parseJSON(data);
        //SCRIPT PARA GENERAR LA PAGINACION PARA EL TABLA DETALLE
        $('#pagination-container').pagination({
            dataSource: json,
            pageSize: 8,
            callback: function (data, pagination) {
                var html = GenerarTablaCajaRendicionListarUser(data);
                $('#contenedor_detalle').html(html);
            }
        });
        
    }).fail(function (data) {
        console.log(data);
    });
}

function GenerarTablaCajaRendicionListarUser(data) {
    var tabla = `<table class="table mt-2 text-center" id="tabla_caja_chica">
        <thead class="table bg-danger text-light">
            <tr class="group-font-sm">
                <th>ID SUC RESP</th>
                <th>MONTO</th>
                <th>RESPONSABLE</th>
                <th>SUCURSAL</th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;
    $.each(data, function (index, item) {
        tabla += "<tr>"
            + "<td style='vertical-align: middle;'>" + item.idSucursalResp + "</td>"
            + "<td style='vertical-align: middle;'>" + item.montoCaja + "</td>"
            + "<td style='vertical-align: middle;'>" + item.responsableCaja + "</td>"
            + "<td style='vertical-align: middle;'>" + item.nombreSucursal + "</td>"
            + '<td><button class="btn btn-success" onclick="buscarFichaRendicion(\'' + item.idSucursalResp + '\')"><i class=\'bi bi-table h6 pr-1\'></i>RENDIR GASTOS</button></td>'
            + "</tr>";
    });
    tabla += "</tbody></table>";
    return tabla;
}

function consultarFichaRendicionLectura(id) {
    var parametros = { "id": id };
    $.ajax({
        data: parametros,
        url: '/Contabilidad/RendicionCajaChica/consultarFichaRendicion',
        type: 'GET',
        dataType: "json",
        success: function (response) {
            var json = JSON.parse(response)

            //---------------LLENADO DEL RESUMEN--------
            $('#montoCajaChica').val(json.montoCajaChica)
            $('#saldoUltimaRep').val(json.saldoUltimaRep)
            $('#montoUltimaRep').val(json.montoUltimaRep)
            $('#fechaUltimaRep').val(json.fechaUltimaRep)
            $('#montoDisponible').val(json.montoDisponible)
            $('#saldoCaja').val(json.saldoCaja)
            $('#montoReponer').val(json.montoReponer)
            $('#totalGastos').val(json.totalGastos)
            $('#responsable').val(json.responsable)
            //---------------------------------------------
            $('#pagination-container').pagination({
                dataSource: json.detalleCaja,
                pageSize: 5,
                callback: function (data, pagination) {
                    var html = generarTablaDetalleRendicionLectura(data);
                    $('#contenedor_detalle').html(html);
                }
            });
            $("#tablaDetalleRendicion tr:contains('REPOSICION')").attr("class", "table-success");
        }
    });
}

function consultarFichaRendicion(id) {
    var parametros = { "id": id };
    $.ajax({
        data: parametros,
        url: '/Contabilidad/RendicionCajaChica/consultarFichaRendicion',
        type: 'GET',
        dataType: "json",
        success: function (response) {
            var json = JSON.parse(response)
            //---------------LLENADO DEL RESUMEN--------
            $('#montoCajaChica').val(json.montoCajaChica)
            $('#saldoUltimaRep').val(json.saldoUltimaRep)
            $('#montoUltimaRep').val(json.montoUltimaRep)
            $('#fechaUltimaRep').val(json.fechaUltimaRep)
            $('#montoDisponible').val(json.montoDisponible)
            $('#saldoCaja').val(json.saldoCaja)
            $('#montoReponer').val(json.montoReponer)
            $('#totalGastos').val(json.totalGastos)
            $('#responsable').val(json.responsable)
            //---------------------------------------------
            //$("#contenedor_detalle").html(generarTablaDetalleRendicion(json.detalleCaja));
            //script para paginar el detalle de rendicion
            $('#pagination-container').pagination({
                dataSource: json.detalleCaja,
                pageSize: 5,
                callback: function (data, pagination) {
                    var html = generarTablaDetalleRendicion(data);
                    $('#contenedor_detalle').html(html);
                }
            })
            //SOMBREAMOS LA FILA QUE CONTENGA EL VALOR REPOSICION
            $("#tablaDetalleRendicion tr:contains('REPOSICION')").attr("class", "table-success");
        }
    });
}

function generarTablaDetalleRendicionLectura(data) {
    var tabla = `<table cellspacing="0" style="border-spacing: 0;" class="table mt-2 text-center" id="tablaDetalleRendicion">
        <thead class="table-dark text-light">
            <tr class="group-font-sm">
                <!--<th>V</th>-->
                <th>N°</th>
                <th>IMAGEN</th>
                <th>FECHA</th>
                <th>TIPO DOC</th>
                <th>N° RUC</th>
                <th>N° SERIE</th>
                <th>N° DOC.</th>
                <th>TIPO</th>
                <th>TOTAL</th>
                <th>SALDO</th>
                <th>COMENTARIOS</th>
            </tr>
            </thead>
        <tbody>`;

    $.each(data, function (index, item) {
                //console.log(index);
                var indice = index + 1;
                //console.log(item.recursoImgb64);
                var imagen;
                var stringb64 = item.recursoImgb64;

                if (item.recursoImgb64 != null) {
                    if (stringb64.substring(0, 5) == "JVBER") {
                        //console.log("este archivo es pdf, indice " + indice);
                        imagen = '<img class="card" width="50" height="50" src="' + icono_pdf_b64 + '" onclick="base64topdf(\'' + stringb64 + '\')" />';
                    } else {
                        //imagen = "<a download='captura.jpg' href='data: image; base64," + item.recursoImgb64 + "\'><img id='imgRecurso' class='card' width='60' height='50' src='data: image; base64," + item.recursoImgb64 + "' /></a>";
                        imagen = "<a href='#' id='pop'><img id='imgRecurso" + indice + "\' onclick='mostrarVistaPrevia(" + indice + ")' class='card' width='50' height='50' src='data: image; base64," + item.recursoImgb64 + "' /></a>";
                    }

                } else {
                    imagen = "<img class='card' width='50' height='50' style='background:#808080;' src='" + icono_no_image + "' />";
                }
                tabla += "<tr>"
                    //+ "<td style='vertical-align: middle;'><div class='form-check text-center'><input class='form-check-input' type='checkbox' id='rendicionCheck" + index + "\'></div></td>"
                    + "<td style='vertical-align: middle;'>" + item.numItem + "</td>"
                    + "<td style='vertical-align: middle;'>" + imagen + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.fecha + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.tipoDoc + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.numRuc + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.numSerie + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.numDoc + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.tipoGastos + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.total + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.saldo + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.comentarios + "</td>"
                    //+ '<td><button id="btnEliminar" class="btn btn-danger" onclick="RendicionEliminarDetalleItem(\'' + item.idCajaChicaDet + '\')"><i class=\'bi bi-trash-fill h6 \'></i></button></td>'
                    //+ '<td><button class="btn btn-success" onclick="RendicionCajaChicaBuscar(\'' + item.idCajaChica + '\')"><i class=\'bi bi-table h6 pr-1\'></i>RENDICION</button></td>'
                    + "</tr>";
            });

    tabla += "</tbody></table>";
    return tabla;
}

function generarTablaDetalleRendicion(data) {
    var tabla = `<table cellspacing="0" style="border-spacing: 0;" class="table mt-2 text-center" id="tablaDetalleRendicion">
        <thead class="table-dark text-light">
            <tr class="group-font-sm">
                <!--<th>V</th>-->
                <th>N°</th>
                <th>IMAGEN</th>
                <th>FECHA</th>
                <th>TIPO DOC</th>
                <th>N° RUC</th>
                <th>N° SERIE</th>
                <th>N° DOC.</th>
                <th>TIPO</th>
                <th>TOTAL</th>
                <th>SALDO</th>
                <th>COMENTARIOS</th>
                <th></th>
            </tr>
            </thead>
        <tbody>`;

    $.each(data, function (index, item) {
        //console.log(index);
        var indice = index + 1;
        //console.log(item.recursoImgb64);
        var imagen;
        var boton;
        var stringb64 = item.recursoImgb64;

        if (item.recursoImgb64 != null) {
            if (stringb64.substring(0, 5) == "JVBER") {
                //console.log("este archivo es pdf, indice " + indice);
                imagen = '<img class="card" width="50" height="50" src="' + icono_pdf_b64 + '" onclick="base64topdf(\'' + stringb64 + '\')" />';
            } else {
                //imagen = "<a download='captura.jpg' href='data: image; base64," + item.recursoImgb64 + "\'><img id='imgRecurso' class='card' width='60' height='50' src='data: image; base64," + item.recursoImgb64 + "' /></a>";
                imagen = "<a href='#' id='pop'><img id='imgRecurso" + indice + "\' onclick='mostrarVistaPrevia(" + indice + ")' class='card' width='50' height='50' src='data: image; base64," + item.recursoImgb64 + "' /></a>";
            }
        } else {
            imagen = "<img class='card' width='50' height='50' style='background:#808080;' src='" + icono_no_image + "' />";
        }
        //BLOQUEAMOS EL BOTON ELIMINAR EN CASO LA RENDICION 
        //SE ENCUENTRE YA VALIDADA
        if (item.estado_op == "VALIDADO") {
            boton = '<a id="btnEliminar' + indice + '\" class="btn btn-secondary" disabled><i class=\'bi bi-trash-fill h6 \'></i></a>';
        } else {
            boton = '<button id="btnEliminar' + indice + '\" class="btn btn-danger" onclick="RendicionEliminarDetalleItem(\'' + item.idCajaChicaDet + '\')"><i class=\'bi bi-trash-fill h6 \'></i></button>';
        }

        tabla += "<tr>"
            //+ "<td style='vertical-align: middle;'><div class='form-check text-center'><input class='form-check-input' type='checkbox' id='rendicionCheck" + index +"\'></div></td>"
            + "<td style='vertical-align: middle;'>" + item.numItem + "</td>"
            + "<td style='vertical-align: middle;'>" + imagen + "</td>"
            + "<td style='vertical-align: middle;'>" + item.fecha + "</td>"
            + "<td style='vertical-align: middle;'>" + item.tipoDoc + "</td>"
            + "<td style='vertical-align: middle;'>" + item.numRuc + "</td>"
            + "<td style='vertical-align: middle;'>" + item.numSerie + "</td>"
            + "<td style='vertical-align: middle;'>" + item.numDoc + "</td>"
            + "<td style='vertical-align: middle;'>" + item.tipoGastos + "</td>"
            + "<td style='vertical-align: middle;'>" + item.total + "</td>"
            + "<td style='vertical-align: middle;'>" + item.saldo + "</td>"
            + "<td style='vertical-align: middle;'>" + item.comentarios + "</td>"
            + "<td style='vertical-align: middle;'>" + boton + "</td>"
            //+ '<td><button class="btn btn-success" onclick="RendicionCajaChicaBuscar(\'' + item.idCajaChica + '\')"><i class=\'bi bi-table h6 pr-1\'></i>RENDICION</button></td>'
            + "</tr>";
    });

    tabla += "</tbody></table>";
    return tabla;
}

function RendicionEliminarDetalleItem(id) {
    bootbox.dialog({
        message: "Estas seguro que quieres borrar este item ?",
        title: "<i class='glyphicon glyphicon-trash'></i> Borrar !",
        buttons: {
            success: {
                label: "No",
                className: "btn-success",
                callback: function () {
                    $('.bootbox').modal('hide');
                }
            },
            danger: {
                label: "Borrar!",
                className: "btn-danger",
                callback: function () {
                    $.ajax({
                        type: 'POST',
                        url: '/Contabilidad/RendicionCajaChica/RendicionEliminarDetalleItem',
                        data: 'id=' + id
                    })
                        .done(function (response) {
                            if (response = '"success"') {
                                //parent.fadeOut('slow');
                                consultarFichaRendicion($('#idSucursalResp').val());
                                $('.bootbox').modal('hide');
                            }
                            //bootbox.alert(response);
                        })
                        .fail(function () {
                            bootbox.alert('Error....');
                        })
                }
            }
        }
    });
}

function validacionForm() {
    var regex_fecha = new RegExp('^(3[01]|[12][0-9]|0[1-9]|[1-9])/(1[0-2]|0[1-9]|[1-9])/[0-9]{4}$');

    if ($("#fecha").val() == "") {
        $("#fecha").focus();
        return false;
    }

    if (!regex_fecha.test($("#fecha").val())) {
        $("#fecha").focus();
        console.log(!regex_fecha.test($("#fecha").val()))
        return false;
    }

    if ($("#total").val() == "" || isNaN($("#total").val())) {
        $("#total").focus();
        return false;
    }

    if ($("#tipoDoc").val() == "") {
        $("#tipoDoc").focus();
        return false;
    }
    if ($("#numRuc").val() == "") {
        $("#numRuc").focus();
        return false;
    }
    if ($("#numSerie").val() == "" && $("#tipoDoc option:selected").text() !="PLANILLA DE MOVILIDAD") {
        $("#numSerie").focus();
        return false;
    }
    if ($("#numDoc").val() == "") {
        $("#numDoc").focus();
        return false;
    }
    if ($("#tipoGastos").val() == "") {
        $("#tipoGastos").focus();
        return false;
    }
    if ($("#comentarios").val() == "REPOSICION") {
        $("#comentarios").focus();
        return false;
    }
    return true;
}

function limpiarForm() {
    $("#imgPreview").attr("src", icono_upload_file);
    $("#imgFile").val(null);
    $("#numRuc").val("");
    $("#numSerie").val("");
    $("#numDoc").val("");
    $("#total").val("");
    $("#saldo").val("");
    $("#comentarios").val("");
    

    $("#tipoDoc").val("");
    $('#tipoDoc').change();
    $("#tipoGastos").val("");
    $('#tipoGastos').change();
}

function buscarFichaRendicion(id) {
    window.location.href = '/Contabilidad/RendicionCajaChica/RendirGastos/' + id;
}

function ExportarRendicionExcel(id) {
    window.location.href = '/Contabilidad/RendicionCajaChica/ExportarRendicionExcel/' + id;
}