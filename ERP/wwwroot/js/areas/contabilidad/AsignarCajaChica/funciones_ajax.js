var notificacion;//para generar la notificacion en el modal
//FUNCION PARA ASIGNAR UNA NUEVA CAJA CHICA
function CajaAsignacionAgregar() {
    if (validacionForm()) {
        var datos = $("#form_asignar_caja").serialize();
        //console.log(datos);
        $.ajax({
            type: "POST",
            url: "/Contabilidad/AsignarCajaChica/CajaAsignacionAgregar",
            data: datos,
            success: function (data) {
                //console.log(data);
                if (data == '"success"') {
                    notificacion = `<div class="alert alert-success" role="alert"> Se asignó exitosamente una nueva caja!</div>`;
                    CajaAsignacionListar();
                } else {
                    notificacion = `<div class="alert alert-danger" role="alert"> Ha ocurrido un error!</div>`;
                }
                $("#notificacion").html(notificacion);
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
        setTimeout(function () { $("#notificacion").html(""); }, 3000);
        limpiarForm();
    } else {
        notificacion = `<div class="alert alert-danger" role="alert"> Complete o seleccione los campos!</div>`;
        $("#notificacion").html(notificacion);
    }
}
//FUNCION PARA REPONER CAJA CHICA
function CajaAsignacionReponer() {
    

    var idSucursalResp = $("#idSucursalResp").val();
    var montoReponer = $("#montoReponer").val();//CAMPO OCULTO MONTO A REPONER
    var montoCaja = $(".montoCaja").val();//VALOR INGRESADO

    if (montoReponer <= 0) {
        notificacion = `<div class="alert alert-danger" role="alert"> Error: Actualmente no hay montos a reponer!</div>`;
        $(".modal-notificacion").html(notificacion);
    } else {
        if (montoCaja > 0 && montoCaja <= montoReponer) {

            var formData = new FormData();
            var files = $('#imgFile')[0].files[0];
            formData.append('imgFile', files);
            console.log("HOLA1");
            formData.append('idSucursalResp', idSucursalResp);
            formData.append('usuario', $("#usuario").val());
            formData.append('usuario_op', $("#usuario_op").val());
            formData.append('numeroCuenta', $("#numeroCuenta").val());
            formData.append('entidadBancaria', $("#entidadBancaria").val());
            formData.append('montoCaja', montoCaja);
            console.log("HOLA2");


            //var datos = $("#form_reponer_caja").serialize();
            //console.log(datos);
            $.ajax({
                type: "POST",
                url: "/Contabilidad/AsignarCajaChica/CajaAsignacionReponer",
                data: formData,// datos,
                contentType: false,
                processData: false,
                success: function (data) {
                    //console.log(data);
                    if (data == '"success"') {
                        notificacion = `<div class="alert alert-success" role="alert"> Reposición del saldo exitosa!, para cosultar las reposiciones haga clic en el boton ver historial</div>`;
                        CajaAsignacionBuscar(idSucursalResp);
                        CajaAsignacionListar();
                    } else {
                        notificacion = `<div class="alert alert-danger" role="alert"> Ha ocurrido un error!</div>`;
                    }
                    $(".modal-notificacion").html(notificacion);
                    //console.log("success");                   
                },
                error: function () {
                    notificacion = `<div class="alert alert-danger" role="alert"> Ha ocurrido de comunicación!</div>`;
                    $(".modal-notificacion").html(notificacion);
                    //console.log("error");
                }
            });
        } else if (montoCaja > montoReponer) {
            notificacion = `<div class="alert alert-danger" role="alert"> Error: El monto a ingresado supera el máximo al reponer!</div>`;
            $(".modal-notificacion").html(notificacion);
        } else if (montoCaja <= 0) {
            notificacion = `<div class="alert alert-danger" role="alert"> Error: La cantidad ingresada no esta permitida!</div>`;
            $(".modal-notificacion").html(notificacion);
        }
    }
    setTimeout(function () { $(".modal-notificacion").html(""); }, 4000);
}
//FUNCION PARA MOSTRAR EL LISTADO DE CAJA CHICAS ASIGNADAS
function CajaAsignacionListar() {
    var fechaInicial = $("#date_fechaInicial").val();
    var fechaFinal = $("#date_fechaFinal").val();
    var url = '/Contabilidad/AsignarCajaChica/CajaAsignacionListar';// + ruta;
    var data = { fechaInicial: fechaInicial, fechaFinal: fechaFinal };
    $.post(url, data).done(function (data) {
        //console.log(data);
        var json = $.parseJSON(data);
        //SCRIPT PARA GENERAR LA PAGINACION PARA EL TABLA DETALLE
        $('#pagination-container').pagination({
            dataSource: json,
            pageSize: 5,
            callback: function (data, pagination) {
                var html = GenerarTablaCajaAsignacionListar(data);
                $('#contenedor_detalle').html(html);
            }
        });
        //

    }).fail(function (data) {
        console.log(data);
    });
}
//FUNCION PARA GENERAR TABLA DE LISTADO DE CAJAS CHICAS
function GenerarTablaCajaAsignacionListar(data) {
    var tabla = `<table class="table mt-2 text-center" id="tabla_caja_chica">
        <thead class="table-dark text-light">
            <tr class="group-font-sm">
                <th>ID SUC RESP</th>
                <th>AREA</th>
                <th>MONTO</th>
                <th>SALDO</th>
                <th>MONTO REP.</th>
                <th>RESPONSABLE</th>
                <th>SUCURSAL</th>
                <th>CAMBIO RECIENTE</th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;

    $.each(data, function (index, item) {
        tabla += "<tr>"
            + "<td style='vertical-align: middle;'>" + item.idSucursalResp + "</td>"
            + "<td style='vertical-align: middle;'>" + item.areaTrabajo + "</td>"
            + "<td style='vertical-align: middle;'>" + item.montoCaja + "</td>"
            + "<td style='vertical-align: middle;'>" + item.saldoCaja + "</td>"
            + "<td style='vertical-align: middle;'>" + item.montoReponer + "</td>"
            + "<td style='vertical-align: middle;'>" + item.responsableCaja + "</td>"
            + "<td style='vertical-align: middle;'>" + item.nombreSucursal + "</td>"
            + "<td style='vertical-align: middle;'>" + item.fecha_modificacion + "</td>"
            + '<td><button id="btnReponer" class="btn btn-primary" onclick="CajaAsignacionBuscarResp(\'' + item.idSucursalResp + '\')"><i class=\'bi bi-person-square h6 pr-2\'></i>REASIGNAR</button></td>'
            + '<td><button id="btnReponer" class="btn btn-warning" onclick="CajaAsignacionBuscar(\'' + item.idSucursalResp + '\')"><i class=\'bi bi-pencil-square h6 pr-2\'></i>REPONER</button></td>'
            + '<td><button class="btn btn-success" onclick="RendicionCajaChicaBuscar(\'' + item.idSucursalResp + '\')"><i class=\'bi bi-table h6 pr-1\'></i>RENDICION</button></td>'
            + "</tr>";
    });

    tabla += "</tbody></table>";
    return tabla;
}
//FUNCION PARA MOSTRAR EL HISTORIAL DE CAMBIOS EN CAJA CHICA
function AsignacionCajaHistoricoListar() {
    var id = $("#idSucursalResp").val();
    var tabla = `<table  cellspacing="0" style="border-spacing: 0;" class="table table-sm mt-2 text-center" id="tablaHistorico">
            <thead class="table text-light bg-primary">
            <tr class="group-font-sm">
                <th>MONTO</th>
                <th>TIPO</th>
                <th>USUARIO</th>
                <th>FECHA DE CREACIÓN</th>
            </tr>
            </thead>
        <tbody>`;
    var parametros = { "id": id };
    $.ajax({
        data: parametros,
        url: '/Contabilidad/AsignarCajaChica/AsignacionCajaHistoricoListar',
        type: 'GET',
        dataType: "json",
        success: function (response) {
            //console.log(response);
            var json = $.parseJSON(response);
            //console.log(json);
            $.each(json, function (index, item) {
                tabla += "<tr>"
                    + "<td style='vertical-align: middle;'>" + item.monto + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.montoCajaTipo + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.usuario_op + "</td>"
                    + "<td style='vertical-align: middle;'>" + item.fecha_modificacion + "</td>"
                    + "</tr>";
            });
            tabla += "</tbody></table>";
            $("#contenedor_historico").html(tabla);
        }
    });
}
//FUNCION PARA ABRIR EL MODAL DE REPONER
function CajaAsignacionBuscar(id) {
    $("#contenedor_historico").html("");

    //console.log("CODIGO:" + id);
    var parametros = { "id": id};
    $.ajax({
        data: parametros,
        url: '/Contabilidad/AsignarCajaChica/CajaAsignacionBuscar',
        type: 'GET',
        dataType: "json",
        success: function (response) {
            //console.log("HOLA1:" + response);
            var data = JSON.parse(response)

            console.log(" sucursal" + data.idSucursalResp + "monto: " + data.montoReponer);
            $("#idSucursalResp").val(data.idSucursalResp);
            $('#montoReponer').val(data.montoReponer);
            $('#usuario').val(data.usuario);
            $('#numeroCuenta').val(data.numeroCuenta);
            $('#entidadBancaria').val(data.entidadBancaria);

            //$(".periodo").val(data.periodo);
            //$('.periodo').change();
            //$(".idSucursal").val(data.idSucursal);
            //$('.idSucursal').change();

            //$('#montoCaja').val(data.montoCaja);
            $('#txtresponsableCaja').val(data.responsableCaja);
            //$('#txtnumeroCuenta').val(data.numeroCuenta);
            //$('#txtentidadBancaria').val(data.entidadBancaria);

            //$('.idEmpresa').val(data.idEmpresa);
            //$('.emp_descripcion').val(data.emp_descripcion);
            //$('#txtareaTrabajo').val(data.areaTrabajo);
            $('.montoCaja').val(data.montoReponer);//
            $('#modalReponer').modal('show');
            $("#imgPreview").attr("src", icono_upload_file);
            $("#imgFile").val(null);
        }
    });
}
//FUNCION PARA ABRIR EL MODAL DE REASIGNACION DE RESP
function CajaAsignacionBuscarResp(id) {
    //$("#contenedor_historico").html("");

    //console.log("CODIGO:" + id);
    var parametros = { "id": id };
    $.ajax({
        data: parametros,
        url: '/Contabilidad/AsignarCajaChica/CajaAsignacionBuscar',
        type: 'GET',
        dataType: "json",
        success: function (response) {
            //console.log("HOLA1:" + response);
            var data = JSON.parse(response)

            //console.log(" sucursal" + data.idSucursalResp + "monto: " + data.montoReponer);
            $(".idSucursalResp").val(data.idSucursalResp);
            //$('#montoReponer').val(data.montoReponer);
            $('.usuario').val(data.usuario);
            //$('#usuario_op').val(data.usuario_op);
            $('.responsableCaja').val(data.responsableCaja);
            $('.numeroCuenta').val(data.numeroCuenta);
            $('.entidadBancaria').val(data.entidadBancaria);
            //console.log("HOLA" + data.entidadBancaria + " " + data.numeroCuenta);
            //$(".periodo").val(data.periodo);
            //$('.periodo').change();
            //$(".idSucursal").val(data.idSucursal);
            //$('.idSucursal').change();

            //$('#montoCaja').val(data.montoCaja);
            //$('#txtresponsableCaja').val(data.responsableCaja);
            //$('#txtnumeroCuenta').val(data.numeroCuenta);
            //$('#txtentidadBancaria').val(data.entidadBancaria);

            //$('.idEmpresa').val(data.idEmpresa);
            //$('.emp_descripcion').val(data.emp_descripcion);
            //$('#txtareaTrabajo').val(data.areaTrabajo);
            //$('.montoCaja').val(data.montoReponer);//
            $('#modalReasignar').modal('show');
            //$("#imgPreview").attr("src", icono_upload_file);
            //$("#imgFile").val(null);
        }
    });
}
//FUNCION PARA ASIGNAR NUEVO RESPONSABLE
function CajaAsignacionReasignarResp() {  
    if (validacionFormReasignarResp()) {
        var datos = $("#form_reasignar_resp_caja").serialize();
        var idSucursalResp = $(".idSucursalResp").val();
        $.ajax({
            type: "POST",
            url: "/Contabilidad/AsignarCajaChica/CajaAsignacionReasignarResp",
            data: datos,
            success: function (data) {
                if (data == '"success"') {
                    notificacion = `<div class="alert alert-success" role="alert">El responsable ha sido modificado correctamente</div>`;
                    CajaAsignacionBuscarResp(idSucursalResp)
                    CajaAsignacionListar();
                } else {
                    notificacion = `<div class="alert alert-danger" role="alert"> Ha ocurrido un error!</div>`;
                }
                $(".modal-notificacion").html(notificacion);                 
            },
            error: function () {
                notificacion = `<div class="alert alert-danger" role="alert"> Ha ocurrido de comunicación!</div>`;
                $(".modal-notificacion").html(notificacion);
            }
        });
    } else {
        notificacion = `<div class="alert alert-danger" role="alert"> Complete, seleccione o cambie los campos solicitados!</div>`;
        $(".modal-notificacion").html(notificacion);
    }
    setTimeout(function () { $(".modal-notificacion").html(""); }, 3000);
}
//FUNCION PARA MOSTRAR EL DETALLE DE LA RENDICION HECHA
function RendicionCajaChicaBuscar(id) {
    //var id = btoa(id);
    window.location.href = '/Contabilidad/RendicionCajaChica/ConsultarFicha/' + id;
}
//FUNCION PARA VALIDAR EL FORMULARIO MODAL ASIGNAR
function validacionForm() {
    if ($("#responsableCaja").val() == "") {
        $("#responsableCaja").focus();
        return false;
    }

    if ($("#suc_descripcion").val() == ""){
        $("#suc_descripcion").focus();
        return false;
    }

    if ($("#emp_descripcion").val() == ""){
        $("#emp_descripcion").focus();
        return false;
    }

    if ($("#periodo").val() == "") {
        $("#periodo").focus();
        return false;
    }

    if ($("#areaTrabajo").val() == "") {
        $("#areaTrabajo").focus();
        return false;
    }

    if ($("#montoCaja").val() == "" || isNaN($("#montoCaja").val())){
        $("#montoCaja").focus();
        return false;
    }
    
    if ($("#numeroCuenta").val() == "") {
        $("#numeroCuenta").focus();
        return false;
    }
    if ($("#entidadBancaria").val() == "") {
        $("#entidadBancaria").focus();
        return false;
    }

    return true;
}
//FUNCION PARA VALIDAR EL FORMULARIO MODAL REASIGNAR RESP
function validacionFormReasignarResp() {
    if ($("#responsable_nombre").val() == "") {
        $(".responsableCaja").focus();
        return false;
    }
    if ($("#responsable_nombre").val() == $(".responsableCaja").val()) {
        $(".responsableCaja").focus();
        return false;
    }
    if ($(".responsableCaja").val() == "") {
        $(".responsableCaja").focus();
        return false;
    }
    if ($(".numeroCuenta").val() == "") {
        $(".numeroCuenta").focus();
        return false;
    }
    if ($(".entidadBancaria").val() == "") {
        $(".entidadBancaria").focus();
        return false;
    }
    return true;
}

//FUNCION PARA LIMPIAR EL FORM MODAL
function limpiarForm() {
    $("#imgPreview").attr("src", icono_upload_file);
    $("#imgFile").val(null);

    $("#montoCaja").val("");
    $("#responsableCaja").val("");
    $("#numeroCuenta").val("");
    $("#entidadBancaria").val("");
    $("#areaTrabajo").val("");
    $("#emp_codigo").val("");
    $("#idEmpresa").val("");
    $("#emp_descripcion").val("");

    $("#idSucursal").val("");
    $("#suc_descripcion").val("");
    $("#periodo").val("");
    $('#periodo').change();
}
//FUNCION PARA BUSCAR REPONSABLE MODAL ASIGNAR
$(function () {
    $("#responsableCaja").autocomplete({
        appendTo: "#modalAsignar",
        source: function (request, response) {
            $.ajax({
                url: '/Contabilidad/AsignarCajaChica/AsignacionEmpleadoListar',
                data: { "nombres": request.term },
                dataType: "json",
                type: "POST",
                success: function (data) {
                    //console.log(data);
                    var json = $.parseJSON(data);
                    response($.map(json, function (item) {
                        return item;
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });
        },
        select: function (e, i) {
            //console.log(i.item);
            $("#emp_codigo").val(i.item.emp_codigo);
            $("#idSucursal").val(i.item.suc_codigo);
            $("#suc_descripcion").val(i.item.suc_descripcion);
            $("#idEmpresa").val(i.item.idempresa);
            $("#emp_descripcion").val(i.item.emp_descripcion);
        },
        minLength: 1
    });
});
//FUNCION PARA BUSCAR REPONSABLE MODAL REASIGNAR RESP
$(function () {
    $("#responsableCaja_reasignar").autocomplete({
        appendTo: "#modalReasignar",
        source: function (request, response) {
            $.ajax({
                url: '/Contabilidad/AsignarCajaChica/AsignacionEmpleadoListar',
                data: { "nombres": request.term },
                dataType: "json",
                type: "POST",
                success: function (data) {
                    var json = $.parseJSON(data);
                    response($.map(json, function (item) {
                        return item;
                    }))                 
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });
        },
        select: function (e, i) {
            //console.log(i.item);
            $(".usuario").val(i.item.emp_codigo);
            $("#responsable_nombre").val(i.item.label);
            //$(".responsableCaja").val(i.item.label);
            //console.log($(".usuario").val());
            //$("#idSucursal").val(i.item.suc_codigo);
            //$("#suc_descripcion").val(i.item.suc_descripcion);
            //$("#idEmpresa").val(i.item.idempresa);
            //$("#emp_descripcion").val(i.item.emp_descripcion);
        },
        minLength: 1
    });
});