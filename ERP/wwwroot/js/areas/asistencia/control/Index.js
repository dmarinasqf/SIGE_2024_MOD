//MODULO DE CONTROL DE ASISTENCIAS
//btnGuardadRegistro
var tblReporteIngresoDia;
var tblReporteTemperatura;
//MODAL
var txtConceptoRegistro = $('#txtConceptoRegistro');
var txtIdRegistro = $('#txtIdRegistro');
var txtOperacion = $('#txtOperacion');

var txtClave = $('#txtClave');
var txtidEmpleado = $('#txtidEmpleado');
var cboPersonalA = $('#cboPersonalA');
var txtJustificacion = $('#txtJustificacion');

//MODAL TEMPERATURA
var txttemperatura = $('#txttemperatura');
var txtobservacion = $('#txtobservacion');

//VARIABLES DE INDEX
var txtfechaDia = document.getElementById('txtfechaDia');
var txtnombreEmpleado = document.getElementById('txtnombreEmpleado');
var txtsucursalusuario = document.getElementById('txtsucursalusuario');
//botones
//Ingresos
var btnIngreso = $('#btnIngreso');
var btnSalida = $('#btnSalida');
//almuerzo
var btnInicioAlmuerzo = $('#btnInicioAlmuerzo');
var btnFinAlmuerzo = $('#btnFinAlmuerzo');
//horas extras
var btnInicioHE = $('#btnInicioHE');
var btnFinHE = $('#btnFinHE');

//salida de emergencia
var btnSalidaEmergencia = $('#btnSalidaEmergencia');
//otros


$(document).ready(function () {
    tblReporteIngresoDia = $('#tblReporteIngresoDia').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "paging": false,
        "info": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No hay registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "No hay información",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "order": [[1, 'asc']]
        }

    });
    tblReporteTemperatura = $('#tblReporteTemperatura').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "paging": false,
        "info": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No hay registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "No hay información",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "order": [[1, 'asc']]
        }

    });

    txtClave.focus(function () {
        this.select();
    });
    txtfechaDia.innerText = moment().format('DD/MMM/YYYY');

    $('#modalRegistroClave').modal('show');

    btnIngreso.prop("disabled", false);
});

$('#form-registro-temp').submit(function (e) {
    e.preventDefault();
    if (txttemperatura.val() > 38 && txtobservacion.val().trim().length == 0) {
        mensaje("W", "Registre una observación");
        return;
    }
    registrarAsistencia();
}); function guardarRegistro() {
    if (txtConceptoRegistro.val() == 'EMERGENCIA')
        $('#modalRegistroTemperatura').modal();
    else
        registrarAsistencia();
}
//eventosClick
btnIngreso.click(function () {
    txtOperacion.val('NUEVO');
    txtConceptoRegistro.val('INGRESO');
    $('#modalRegistroTemperatura').modal();
    // registrarAsistencia();
});
btnSalida.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('SALIDA');
    //registrarAsistencia();
    $('#modalRegistroTemperatura').modal();
});
btnInicioHE.click(function () {
    //listarEmpleadosA();
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('INICIO HORA EXTRA');
    $('#modalPermisos').modal('show');
});
btnFinHE.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('FIN HORA EXTRA');
    registrarAsistencia();
});
btnInicioAlmuerzo.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('INICIO ALMUERZO');
    registrarAsistencia();
});
btnFinAlmuerzo.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('FIN ALMUERZO');
    registrarAsistencia();
});

btnSalidaEmergencia.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('EMERGENCIA');
    listarEmpleadosA();
    $('#modalPermisos').modal('show');

});
//cerrar modales
function cerrarModalRegistroIS() {
    $('#modalRegistroClave').modal('hide');
}
function cerrarModalPermisos() {
    $('#modalPermisos').modal('hide');
}

//registrarAsistencia
function llamarModalClave() {
    $('#btnGuardadRegistro').prop('disabled', false);
    tblReporteIngresoDia.clear().draw();
    $('#modalRegistroClave').modal('show');
    txtClave.val('0');
}
function refrescar() {
    location.reload();
}
$('#modalPermisos').on('show.bs.modal', function (e) {
    //buscarUsuarioAutoriza(IDEMPLEADO);
});


function limpiarModalTemperatura() {
    txttemperatura.val(37);
    txtobservacion.val('');
}

function desactivarBotones() {
    btnIngreso.prop("disabled", true);
    btnSalida.prop("disabled", true);
    btnInicioAlmuerzo.prop("disabled", true);
    btnFinAlmuerzo.prop("disabled", true);
    btnInicioHE.prop("disabled", true);
    btnFinHE.prop("disabled", true);
    btnSalidaEmergencia.prop("disabled", true);
}
//buscar Empleado por codigo
function buscarEmpleadoxCodigo(id) {
    var url = '/Empleado/Buscar';
    var obj = { id: id };
    $.post(url, obj).done(function (data) {
        if (data != null) {
            //var empleado =data.nombres+' ' +data.apePaterno+' ' +data.apeMaterno;
            txtnombreEmpleado.innerText = data.nombres + ' ' + data.apePaterno + ' ' + data.apeMaterno;
        }
    }).fail(function (data) {
        mensaje("D", data);
    });
}
// ListarEmpleados que autorizan 
function listarEmpleadosA() {
    var controller = new AsistenciaController();
    controller.LlenarCmbEmpleadosA('cboPersonalA', function () { });
    //var url = "/Administrador/Empleado/ListarEmpleadosA";
    //$.post(url).done(function (data) {
    //    if (data != null) {
    //        $('#cboPersonalA option').remove();
    //        $('#cboPersonalA').append('<option value="0">- SELECCIONE -</option>');
    //        $(data).each(function (i, e) {
    //            descripcion = [e.nombres];
    //            codigo = [e.idEmpleadoA];
    //            $('#cboPersonalA').append('<option value="' + codigo + '">' + descripcion + '</option>');
    //        });
    //        //buscarUsuarioAutoriza(txtClave.val());
    //    }
    //}).fail(function (data) {
    //    mensaje("D", data);
    //});
}
function buscarUsuarioAutoriza(id) {
    var url = "/Asistencia_Control/buscarEmpleadoA";
    var obj = { documento: id };
    $.post(url, obj).done(function (data) {
        if (data != null) {
            cboPersonalA.val(data.idEmpleadoA);
            cboPersonalA.prop("disabled", true);
        } else {
            cboPersonalA.prop("disabled", false);
        }
    }).fail(function (data) {
        mensaje("D", data);
    });
}

function guardarRegistro() {
    if (txtConceptoRegistro.val() == 'EMERGENCIA')
        $('#modalRegistroTemperatura').modal();
    else
        registrarAsistencia();
}
//eventosClick
btnIngreso.click(function () {
    txtOperacion.val('NUEVO');
    txtConceptoRegistro.val('INGRESO');
    $('#modalRegistroTemperatura').modal('show');
    // registrarAsistencia();
});
btnSalida.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('SALIDA');
    //registrarAsistencia();
    $('#modalRegistroTemperatura').modal();
});
btnInicioHE.click(function () {
    //listarEmpleadosA();
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('INICIO HORA EXTRA');
    $('#modalPermisos').modal('show');
});
btnFinHE.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('FIN HORA EXTRA');
    //registrarAsistencia();
});
btnInicioAlmuerzo.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('INICIO ALMUERZO');
    //registrarAsistencia();
});
btnFinAlmuerzo.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('FIN ALMUERZO');
    //registrarAsistencia();
});

btnSalidaEmergencia.click(function () {
    txtOperacion.val('EDITAR');
    txtConceptoRegistro.val('EMERGENCIA');
    listarEmpleadosA();
    $('#modalPermisos').modal('show');

});
//cerrar modales
function cerrarModalRegistroIS() {
    $('#modalRegistroClave').modal('hide');
}
function cerrarModalPermisos() {
    $('#modalPermisos').modal('hide');
}

//registrarAsistencia
function llamarModalClave() {
    tblReporteIngresoDia.clear().draw();
    $('#modalRegistroClave').modal('show');
    txtClave.val('0');
}
function refrescar() {
    location.reload();
}
$('#modalPermisos').on('show.bs.modal', function (e) {
    //buscarUsuarioAutoriza(IDEMPLEADO);
});

//Regristros de procedimientos
function registrarAsistencia() {

    if (!(txtClave.val().length > 0)) {
        mensaje("W", "Ingrese su clave de seguridad");
        return;
    }
    if (txtConceptoRegistro.val() == 'INICIO HORA EXTRA') {
        if (cboPersonalA.val() == '0') {
            mensaje("W", "Seleccione a la persona que le autoriza realizar HORAS EXTRAS");
            return;
        }
        if (txtJustificacion.val().length == 0) {
            mensaje("W", "Justifique qué hará en sus horas extras");
            return;
        }

    }
    if (txtConceptoRegistro.val() == 'EMERGENCIA') {
        if (cboPersonalA.val() == '0') {
            mensaje("W", "Seleccione a la persona que le autoriza salir por EMERGENCIA");
            return;
        }
        if (txtJustificacion.val().length == 0) {
            mensaje("W", "Justifique el motivo");
            return;
        }

    }
    var url;
    var obj;
    if (txtOperacion.val() == "NUEVO") {
        $('#btnGuardadRegistro').prop('disabled', true);
        url = "/Asistencia/Control/RegistrarEditar";
        var data = {};
        data['idempleadoR'] = txtidEmpleado.val();
        data['documento'] = txtClave.val();
        data['temperatura'] = txttemperatura.val();
        data['observacion'] = txtobservacion.val();
        data['estado'] = 'HABILITADO';
        data['fecha'] = 'NUEVO';

        var obj = {
            obj: data
        }

        var controller = new AsistenciaController();
        controller.RegistrarEditar(obj, fn_registrar);
        
        delete controller;


       


    } else if (txtOperacion.val() == "EDITAR") {
        url = "/Asistencia/Control/RegistrarEditar";

        var data = {};
        data['documento'] = txtClave.val();
        data['idEmpleadoA_JE'] = cboPersonalA.val();
        data['idEmpleadoA_JEH'] = cboPersonalA.val();
        data['justificacionE'] = txtJustificacion.val();
        data['justificacionHE'] = txtJustificacion.val();
        data['idempleadoR'] = txtidEmpleado.val();
        data['fecha'] = txtConceptoRegistro.val();
        data['temperaturaf'] = txttemperatura.val();
        if (txtConceptoRegistro.val() == "EMERGENCIA" || txtConceptoRegistro.val() == "SALIDA") {
            data['observacionf'] = txtobservacion.val();
        } else {
            data['observacion'] = txtobservacion.val();
        }
        var obj = {
            obj: data
        }

        var controller = new AsistenciaController();
        controller.RegistrarEditar(obj, fn_editar);

    }

}
function fn_registrar(data) {
    var datos = data.objeto;
    var datos = data.objeto;
    if (data.mensaje == 'registrado') {
        $('#btnGuardadRegistro').prop('disabled', false);
        txtidEmpleado.val('');
        desactivarBotones();
        mensaje("S", "Su registro se realizó correctamente.");
        $('#modalRegistroTemperatura').modal();
        if (datos.temperatura > 38) {
            enviarEmail(txtnombreEmpleado.innerText, txtsucursalusuario.innerText,
                datos.temperatura, datos.observacion, datos.fechaIngreso)
        }
        llamarModalClave();
    }
    else {
        mensaje("W", data);
        txtidEmpleado.val('');
        desactivarBotones();
    }
    limpiarModalTemperatura();
    $('#modalRegistroTemperatura').modal('hide');
    $('#modalPermisos').modal('hide');
    txtJustificacion.val('');
}

function fn_editar(data) {
    if (data.mensaje == 'registrado') {
        $('#btnGuardadRegistro').prop('disabled', false);
        txtidEmpleado.val('');
        desactivarBotones();
        mensaje("S", "Su registro se realizó correctamente.");
        if (data.temperaturaf > 38) {
            console.log("pase");
            enviarEmail(txtnombreEmpleado.innerText, txtsucursalusuario.innerText,
                datos.temperatura, datos.observacion, datos.fechaIngreso)
        }
        llamarModalClave();
        if (txtConceptoRegistro.val() == "SALIDA" || txtConceptoRegistro.val() == "EMERGENCIA") {
            $('#modalRegistroTemperatura').modal();
        }
    }
    else {
        mensaje("W", data);
        txtidEmpleado.val('');
        desactivarBotones();
    }
    limpiarModalTemperatura();
    $('#modalRegistroTemperatura').modal('hide');
    $('#modalPermisos').modal('hide');
    txtJustificacion.val('');
}

function limpiarModalTemperatura() {
    txttemperatura.val(37);
    txtobservacion.val('');
}

function desactivarBotones() {
    btnIngreso.prop("disabled", true);
    btnSalida.prop("disabled", true);
    btnInicioAlmuerzo.prop("disabled", true);
    btnFinAlmuerzo.prop("disabled", true);
    btnInicioHE.prop("disabled", true);
    btnFinHE.prop("disabled", true);
    btnSalidaEmergencia.prop("disabled", true);
}

// ListarEmpleados que autorizan 
function buscarUsuarioAutoriza(id) {
    var url = "/Asistencia/Control/buscarEmpleadoA";
    var obj = { documento: id };
    $.post(url, obj).done(function (data) {
        if (data != null) {
            cboPersonalA.val(data.idEmpleadoA);
            cboPersonalA.prop("disabled", true);
        } else {
            cboPersonalA.prop("disabled", false);
        }
    }).fail(function (data) {
        mensaje("D", data);
    });
}


function acceder() {
    if (txtClave.val().length >= 4) {
        //buscarUsuarioxDocumento(txtClave.val());
        var url = "/Asistencia/Control/accederRegistro";
        var obj = { doc: txtClave.val() };
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'encontrado') {
                $('#modalRegistroClave').modal('hide');
                var datos = data.objeto;
                txtidEmpleado.val(data.objeto[0].emp_codigo);
                txtnombreEmpleado.innerText = datos[0].nombres + ' ' + datos[0].apePaterno + ' ' + datos[0].apeMaterno;
                txtsucursalusuario.innerText = datos[0].descripcionS
                cargarBotones_listaRegistros();
            } else {
                mensaje("W", "USUARIO NO REGISTRADO,COMUNIQUESE CON EL ADMINISTRADOR");
                txtClave.val('0');
            }
        }).fail(function (data) {
            mensaje("D", data);
        });
    } else {
        mensaje("W", "DNI NO VÁLIDO");
    }
}

function accederEnter(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (e.keyCode === 13) {
        if (txtClave.val().length > 4) {
            acceder();
        }
        else {
            mensaje("W", "DNI NO VÁLIDO");
        }
    }
}

//listar los botones registrados
//getUltimoRegistro y carga la lista

//txtidEmpleado.val
function cargarBotones_listaRegistros() {

    var url = "/Asistencia/Control/getUltimoRegistro";
    var obj = { documento: txtClave.val() };
    $.post(url, obj).done(function (data) {
        if (data.mensaje == 'encontrado') {
            agregarFila(data.objeto);

            if (data.objeto.fechaIngreso == null) {
                btnSalidaEmergencia.prop("disabled", false);
            }
            if (data.objeto.fechaIngreso != null && data.objeto.fechaIAlmuerzo == null) {
                btnIngreso.prop("disabled", true);
                btnInicioAlmuerzo.prop("disabled", false);
                btnSalidaEmergencia.prop("disabled", false);
            }
            if (data.objeto.fechaIAlmuerzo != null && data.objeto.fechaFAlmuerzo == null) {
                btnIngreso.prop("disabled", true);
                btnFinAlmuerzo.prop("disabled", false);
                btnSalidaEmergencia.prop("disabled", false);
            }
            if (data.objeto.fechaFAlmuerzo != null && data.objeto.fechaSalida == null) {
                btnIngreso.prop("disabled", true);
                btnSalida.prop("disabled", false);
                btnSalidaEmergencia.prop("disabled", false);
            }
            if (data.objeto.fechaSalida != null && data.objeto.fechaIHoraExtra == null) {
                btnIngreso.prop("disabled", true);
                btnInicioHE.prop("disabled", false);
            }
            if (data.objeto.fechaIHoraExtra != null && data.objeto.fechaFHoraExtra == null) {
                btnIngreso.prop("disabled", true);
                btnFinHE.prop("disabled", false);
            }
            if (data.objeto.fechaIngreso != null
                && data.objeto.fechaSalida != null
                && data.objeto.fechaIAlmuerzo != null
                && data.objeto.fechaFAlmuerzo != null
                && data.objeto.fechaIHoraExtra != null
                && data.objeto.fechaFHoraExtra != null) {
                btnIngreso.prop("disabled", true);
                btnFinHE.prop("disabled", true);
            }
            if (data.objeto.fechaSalidaEmergencia != null) {
                btnIngreso.prop("disabled", true);
                btnSalidaEmergencia.prop("disabled", true);
                btnInicioHE.prop("disabled", true);
                btnFinHE.prop("disabled", true);
            }


        } else if (data.mensaje == 'no encontrado') {
            btnIngreso.prop("disabled", false);
        }
    }).fail(function (data) {
        mensaje("D", data);
    });

}

//AGREGA LAS FILAS EN EL DATATABLE
function agregarFila(data) {
    tblReporteIngresoDia.clear().draw();
    tblReporteTemperatura.clear().draw();
    tblReporteTemperatura.row.add([
        'Temperatura Ingreso: ' + data.temperatura + ' ºC',
        data.observacion
    ]).draw(false);
    if (data.temperaturaf !== null) {
        tblReporteTemperatura.row.add([
            'Temperatura Salida: ' + data.temperaturaf + ' ºC',
            data.observacionf
        ]).draw(false);
    }
    if (data.fechaIngreso != null) {
        tblReporteIngresoDia.row.add([
            'INGRESO',
            moment(data.fechaIngreso).format('HH:mm A')
        ]).draw(false);
    }
    if (data.fechaIAlmuerzo != null) {
        tblReporteIngresoDia.row.add([
            'IR ALMORZAR',
            moment(data.fechaIAlmuerzo).format('HH:mm A')
        ]).draw(false);
    }
    if (data.fechaFAlmuerzo != null) {
        tblReporteIngresoDia.row.add([
            'REGRESO DE ALMUERZO',
            moment(data.fechaFAlmuerzo).format('HH:mm A')
        ]).draw(false);
    }
    if (data.fechaSalidaEmergencia != null) {
        tblReporteIngresoDia.row.add([
            'SALIDA DE EMERGENCIA',
            moment(data.fechaSalidaEmergencia).format('HH:mm A')
        ]).draw(false);
    }
    if (data.fechaSalida != null) {
        tblReporteIngresoDia.row.add([
            'SALIDA',
            moment(data.fechaSalida).format('HH:mm A')
        ]).draw(false);
    }
    if (data.fechaIHoraExtra != null) {
        tblReporteIngresoDia.row.add([
            'INICIO DE HORA EXTRA',
            moment(data.fechaIHoraExtra).format('HH:mm A')
        ]).draw(false);
    }
    if (data.fechaFHoraExtra != null) {
        tblReporteIngresoDia.row.add([
            'HORA EXTRA TERMINADA',
            moment(data.fechaFHoraExtra).format('HH:mm A')
        ]).draw(false);
    }
}

function buscarUsuarioxDocumento(documento) {
    var url = "/Asistencia/Control/accederRegistro";
    var obj = { doc: documento };
    $.post(url, obj).done(function (data) {
        if (data.mensaje == 'encontrado') {
            txtidEmpleado.val(data.objeto.emp_codigo);
        } else if (data.mensaje == 'no encontrado') {
            mensaje("W", "NO SE PUDO IDENTIFICAR A ESTE USUARIO CON SU DNI");
        }
    }).fail(function (data) {
        mensaje("D", data);
    });
}

function enviarEmail(empleado, sucursal, temperatura, sintomas, fecha) {
    var fechad = moment(fecha).format("DD/MM/YYYY");
    var hora = moment(fecha).format("LT");
    var msj = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <title>Mensaje</title>
</head>
<body>
    <div style="background: #ededed;display: flex;">
        <div style="background: #ffffff;width:600px;margin-right:auto;margin-left:auto">
            <img style="padding:0px;display:block;" src="cid:img_header" width="600px" />
            <div style="padding:50px 0px 50px 0px">
                <label style="padding:440px 60px 0px 60px;font-size: 16px;color:#FE0000 ;font-family: 'Open Sans',sans-serif;
                font-weight: 700;font-style: normal">!ALERTA COVID-19!,</label>
                <br />            
                <p style="padding:4px 60px 0px 60px;font-size: 15px;font-family: 'Open Sans',sans-serif;
                    font-style: normal;text-align: justify">
                   El <b>Sr.(a) `+ empleado + `</b>, de la sucursal, <b>` + sucursal + `</b> el día: <b>` + fechad + `</b> a las <b>` + hora + `</b> ha presentado <b>` + temperatura + ` ºC</b> de temperatura
                </p>
                <p style="padding:4px 60px 0px 60px;font-size: 15px;font-family: 'Open Sans',sans-serif;
            font-style: normal;text-align: justify">
                    <b>Con los siguientes síntomas:</b><br />
                    `+ sintomas + `.
                </p>
                <p style="padding:4px 60px 0px 60px;font-size: 15px;font-family: 'Open Sans',sans-serif;font-style: normal;
            text-align: justify">
                    Comuniquese lo antes posible con nuestro colaborador.
                </p>
                <p style="padding: 4px 60px 0px 60px; font-size: 15px; font-family: 'Open Sans',sans-serif; font-style: normal; text-align: justify">!Esperamos su pronta comunicación y gracias de antemano!</p>
               
            </div>
             <table style="background: rgba(40,57,101,.5); padding: 12px 12px 12px 12px">
                <tbody>
                    <tr>
                        <td style="color:white;text-align:left" width="200px"></td>
                        <td style="color:white;text-align:center;font-size:16px;" width="200px"></td>
                        <td style="color:white;text-align:center;font-size:16px;" width="200px"></td>
                    </tr>
                    <tr>
                        <td style="color:white;text-align:left" width="300px">
                            <img src="../../imagenes/logo.png" width="300px" />
                        </td>                      
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
`;
    var url = '/Asistencia/Control/EnviarEmail1';
    var obj = {
        email: 'dario2798@gmail.com',
        htmlbody: msj
    }
    $.post(url, obj).done(function (data) {
        if (data.mensaje == "ok") {
            console.log(data.mensaje);
            mensaje("s","Email enviado" );
        }
        else {
            mensaje("D", data.mensaje);
        }

    }).fail(function (data) {
        mensaje("D", data);
    });
}