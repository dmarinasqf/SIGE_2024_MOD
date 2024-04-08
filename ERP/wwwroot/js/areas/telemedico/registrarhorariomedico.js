//Variables de registro
var txtidmedico = $('#txtidmedico');
var txtconsultaonline = $('#txtconsultaonline');
var txtconsultapresencial = $('#txtconsultapresencial');

var txtcolegiatura = $('#txtcolegiatura');
var txtnombresmedico = $('#txtnombresmedico');

var txtHorarioCodigo = $('#txtcodigo');

var cbotipohorario = $('#cbotipohorario');
var cbosucursal = $('#cbosucursal');
var cboconsultorio = $('#cboconsultorio');
var cboTurno = $('#cboTurno');
var dtpInicio = $('#dtpInicio');
var dtpFinh = $('#dtpFinh');
var dtpInicioh = $('#dtpInicioh');
var dtpFin = $('#dtpFin');
var IDUSUARIO = $('#IDUSUARIO');
var operacion = $('#TIPOOPERACION');
var cboObjetivo = $('#cboObjetivo');
var txtDescripcionVisita = $('#txtDescripcionVisita');

var PERFIL = $('#PERFIL').val();
//BOTONES
var btnbuscarmedico = $('#btnbuscarmedico');
var btnGuardar = $('#btnGuardar');

//variables de fullcalendar
var ultimaFecha;
var ultimaVista;
//botones de horas
var dtpInicioh_btn = $('#dtpInicioh_btn');
var dtpFinh_btn = $('#dtpFinh_btn');
//Boton de buscarMedicos

//VARIABLES PARA GUARDAR Y EDITAR HORARIOS
var fechaInicioS;
var fechaFinS;
var fechaInicioM;
var fechaFinM;
//fechas bloqueadas
var FechasIniciales = [];
var FechasFinales = [];
//cada vez que cargue la página

function buscarMedicoTelemedico(id) {
    var url = "/Medico/Buscar";
    var obj = { id: id };
    $.post(url, obj).done(function (data) {
        if (data != null) {
            txtidmedico.val(data.med_codigo);
            cargarActividades(data.med_codigo);
            txtnombresmedico.val(data.nombres + ' ' + data.apePaterno + ' ' + data.apeMaterno);
            txtcolegiatura.val(data.nroColegiatura);
            txtconsultaonline.val(data.consultapresencial);
            txtconsultapresencial.val(data.teleconsulta);

        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor.');
    });
}

$(document).ready(function () {
    //cargar las librerias principales para las horas
    $('#dtpInicioh').datetimepicker({
        format: 'HH:mm'
    });
    $('#dtpFinh').datetimepicker({
        format: 'HH:mm'
    });
    if (PERFIL == "ADMINISTRADOR" && PERFIL === "SUPERVISOR" && PERFIL == "VENTAS_DELIVERY") {
        btnbuscarmedico.prop("disabled", false);
    }
    if (PERFIL == "MEDICO" && TIPOUSUARIO == "MEDICO") {
        buscarMedicoTelemedico(IDUSUARIO.val());
        btnbuscarmedico.prop("disabled", true);
    }
    cargarsucursales();
});

function cargarsucursales() {
    let controller = new SucursalController();
    controller.ListarSucursales('', 'cbosucursal');
}
//LLAMADO Y CERRADO DE MODALS

$('#btnbuscarmedico').click(function () {
    $('#modalmedicos').modal('show');
});
//EVENTOS
//CARGAR CONSULTORIOS X SUCURSAL
$('#cbotipohorario').change(function () {
    if (cbotipohorario.val() == 'ONLINE') {
        cboTurno.prop("disabled", false);
    }
    else {
        cboTurno.prop("disabled", true);
    }
});
$('#cbosucursal').change(function () {
    cargarconsultorios(cbosucursal.val(), 0);
});
$('#cboconsultorio').change(function () {
    if (cboconsultorio.val() != '') {
        cboTurno.prop("disabled", false);
    }
});
$('#cbotipohorario').change(function () {
    verificartipohorario();
});
$('#cboTurno').change(function () {
    if (operacion.val() == "NUEVO")
        cambiarFechasxTurno($("#cboTurno option:selected").text(), cbotipohorario.val(), cbosucursal.val(), cboconsultorio.val());

});
function cargarconsultorios(idsucursal, idconsultorio) {

    let controller = new ConsultorioController();
    if (idsucursal != '') {
        let obj = { sucursalCodigo: idsucursal };
        controller.ListarConsultorioxsucursalCombo(obj, 'cboconsultorio', idconsultorio);
    }
}
function verificartipohorario() {
    let valorestado = cbotipohorario.val() == 'PRESENCIAL' ? true : false;
    cbosucursal.val('');
    cboconsultorio.val('');
    cbosucursal.prop("disabled", !valorestado);
    cboconsultorio.prop("disabled", !valorestado);
}

//cerrar modales
function cerrarModalMedicos() {
    $('#modalmedicos').modal('hide');
}

//EVENTO PARA SELECCIONAR EL MEDICO
$(document).on('click', '.btn-pasarMedico', function (e) {
    var columna = tblMedicos.row($(this).parents('tr')).data();

    cargarActividades(columna[0]);
    txtidmedico.val(columna[0]);
    txtcolegiatura.val(columna[1]);
    txtnombresmedico.val(columna[2]);
    txtconsultaonline.val(columna[4]);
    txtconsultapresencial.val(columna[5]);

    $('#modalmedicos').modal('hide');
});

//HORARIOS DE VISITADORES
function cargarActividades(codigoMedico) {

    var actividad = [];
    var url = ORIGEN + '/Telemedico/HorarioMedico/ListarHorarioMedico';
    var obj = {
        idmedico: codigoMedico
    };

    $.post(url, obj).done(function (data) {
        if (data.mensaje == "ok") {
            let datos = JSON.parse(data.objeto);
            for (let i = 0; i < datos.length; i++) {
                let colores = 'green';/*
                if (datos[i]["TIPOHORARIO"] == '')
                    colores = datos[i]["TURNO"] == 'MAÑANA' ? 'green' : '#0057ad'
                else if (datos[i]["TIPOHORARIO"] == 'ONLINE')
                    colores = datos[i]["TURNO"] == 'MAÑANA' ? 'green' : '#0057ad'
                else if (datos[i]["TIPOHORARIO"] == 'PRESENCIAL')
                    colores = datos[i]["TURNO"] == 'MAÑANA' ? '#06623b' : '#543864'
                */
                if (datos[i]["TIPOHORARIO"] == '')
                    colores = datos[i]["TURNO"] == 'MAÑANA' ? '#ffbd69' : '#ff6363'
                else if (datos[i]["TIPOHORARIO"] == 'ONLINE')
                    colores = datos[i]["TURNO"] == 'MAÑANA' ? '#ffbd69' : '#ff6363'
                else if (datos[i]["TIPOHORARIO"] == 'PRESENCIAL')
                    colores = datos[i]["TURNO"] == 'MAÑANA' ? '#543864' : '#202040'
                //colores = datos[i]["TURNO"] == 'MAÑANA' ? '#006a71' : '#0f4c75'


                actividad.push({
                    horarioCodigo: datos[i]["IDHORARIO"],
                    title: datos[i]["TURNO"] + '<br />',
                    description: "TRABAJO",
                    start: moment(datos[i]["FECHAINICIO"]),
                    end: datos[i]["FECHAFIN"] != null ? moment(datos[i]["FECHAFIN"]) : null,
                    color: colores,
                    allDay: false,
                    turnoCodigo: datos[i]["IDTURNO"],
                    idsucursal: datos[i]["IDSUCURSAL"],
                    idconsultorio: datos[i]["IDCONSULTORIO"],
                    tipohorario: datos[i]["TIPOHORARIO"],
                    textColor: '#FFF'
                });
            }
        } else {
            mensaje("W", data.mensaje);
        }
        ultimaVista = $('#calender').fullCalendar('getView');
        if (ultimaVista.name == undefined) {
            ultimaVista.name = 'month';
        }
        GenerateCalendar(actividad);
    }).fail(function (data) {
        console.log(data);
        mensaje("D", data);
    });
}
function GenerateCalendar(actividad) {
    $('#calender').fullCalendar('destroy');
    $('#calender').fullCalendar({
        defaultDate: ultimaFecha,
        defaultView: ultimaVista.name,
        contentHeight: 650,
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Día'
        },
        weekend: true,
        displayEventTime: true,
        allDaySlot: false,
        minTime: '07:00:00',
        maxTime: '22:00:00',
        timeFormat: 'h(:mm)a',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agenda'
        },
        eventLimit: true,
        events: actividad,
        eventClick: function (calEvent, jsEvent, view) {
            selectedEvent = calEvent;
            if (calEvent.turnoCodigo == 1) {
                $('#ModalDetalle #turno').text(calEvent.title.substring(0, 6));
            } else {
                $('#ModalDetalle #turno').text(calEvent.title.substring(0, 5));
            }
            dtpInicio.val(calEvent.start.format("DD-MMM-YYYY"));
            dtpInicioh.val(calEvent.start.format("HH:mm"));
            dtpFinh.val(calEvent.end.format("HH:mm"));
            cboTurno.val(calEvent.turnoCodigo);
            txtHorarioCodigo.val(calEvent.horarioCodigo);
            operacion.val('EDITAR');
            cbosucursal.val(selectedEvent.idsucursal);
            cbotipohorario.val(selectedEvent.tipohorario);
            cargarconsultorios(selectedEvent.idsucursal, selectedEvent.idconsultorio)
            $('#ModalDetalle').modal();
        },
        selectable: true,
        select: function (start, end) {
            selectedEvent = {
                horarioCodigo: 0,
                title: 'Registro de Horario',
                start: start,
                end: end,
                color: 'green',
                allDay: false,
                turnoCodigo: '',
                idconsultorio: '',
                idsucursal: '',
                tipohorario: ''
            };
            cargarconsultorios(1, 1);
            operacion.val('NUEVO');
            EditarHorarioActividad();
            $('#calendar').fullCalendar('unselect');
        },
        editable: false

    });

}
//mostrar y limpiar modal
function EditarHorarioActividad() {

    if (selectedEvent != null) {
        $('#ModalDetalle #turno').text(selectedEvent.title);
        txtHorarioCodigo.val(selectedEvent.horarioCodigo);
        dtpInicio.val(selectedEvent.start.format("DD-MMM-YYYY"));
        dtpInicioh.val(selectedEvent.start.format("HH:mm"));
        dtpFinh.val(selectedEvent.end.format("HH:mm"));
        cboTurno.val(selectedEvent.turnoCodigo);
        cbosucursal.val(selectedEvent.idsucursal);
        cbotipohorario.val(selectedEvent.tipohorario);

    }
    $('#ModalDetalle').modal('show');
}
function eliminarActividad() {
    swal({
        title: '¿Desea eliminar esta registro?',
        text: "No se podra revertir",
        type: 'warning',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Eliminar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            swal("Registro eliminado!", {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                }
            });
            eliminar(txtHorarioCodigo.val());
        } else {
            swal.close();
        }
    });
}
function eliminar(data) {
    var url = ORIGEN + '/Telemedico/HorarioMedico/EliminarRegistro';
    var obj = { id: data };
    $.post(url, obj).done(function (data) {
        $('#ModalDetalle').modal('hide');
        cargarActividades(txtidmedico.val(), '');
        ultimaFecha = moment(dtpInicio.val()).format('DD-MMM-YYYY');
        mensaje("S", "Registro eliminado correctamente.");
    }).fail(function (data) {
        mensaje("D", data);
    });
}
//realiza los cambios( si es editar muestra los botones adecuado a la operación)
$('#ModalDetalle').on('show.bs.modal', function (e) {
    document.getElementById('btnGuardar').style.display = 'inline';
    document.getElementById('btnDelete').style.display = 'inline';
    document.getElementById("cboTurno").disabled = true;
    document.getElementById("cbosucursal").disabled = true;
    document.getElementById("cboconsultorio").disabled = true;

    if (txtconsultaonline.val() == "false" || txtconsultaonline.val() == null || txtconsultaonline.val() == "")
        $("#cbotipohorario option[value='ONLINE'").prop("disabled", true);
    else
        $("#cbotipohorario option[value='ONLINE'").prop("disabled", false);
    if (txtconsultapresencial.val() == "false" || txtconsultapresencial.val() == null || txtconsultapresencial.val() == "")
        $("#cbotipohorario option[value='PRESENCIAL'").prop("disabled", true);
    else
        $("#cbotipohorario option[value='PRESENCIAL'").prop("disabled", false);
    if (operacion.val() == "NUEVO") {
        document.getElementById('btnGuardar').disabled = false;
        dtpInicioh.prop("disabled", true);
        dtpFinh.prop("disabled", true);
        document.getElementById('btnDelete').style.display = 'none';
    }
    else if (operacion.val() == "EDITAR") {
        dtpInicioh.prop("disabled", true);
        dtpFinh.prop("disabled", true);
        document.getElementById("cboTurno").disabled = true;
        document.getElementById('btnGuardar').style.display = 'none';
    }
});

//Guardar Actividad
//function registrarActividad() {
$('#form-registro-horario').submit(function (e) {
    e.preventDefault();
    if (dtpInicioh.val() == "") {
        mensaje("W", "Seleccione una fecha ");
        return;
    }
    if (dtpFinh.val() == "") {
        mensaje("W", "Seleccione una hora válida");
        return;
    }
    var fecha1 = new Date(dtpInicio.val().toString() + ' ' + dtpInicioh.val().toString());
    var fecha2 = new Date(dtpInicio.val().toString() + ' ' + dtpFinh.val().toString());
    var horasDiferencia = fecha2.getHours() - fecha1.getHours();
    if (fecha1.getTime() >= fecha2.getTime()) {
        mensaje("W", "La hora inicial debe ser menor a la hora de fin y además diferentes");
        return;
    }
    if (horasDiferencia < 1) {
        mensaje("W", "Debe haber una diferencia de 1 hora como mínimo");
        return;
    }

    if (txtidmedico.val() == "") {
        mensaje("W", "Seleccione un MÉDICO");
        return;
    }

    var url;
    if (operacion.val() == "NUEVO") {
        fechaInicioS = dtpInicio.val().toString() + ' ' + dtpInicioh.val().toString();
        fechaFinS = dtpInicio.val().toString() + ' ' + dtpFinh.val().toString();

        url = ORIGEN + '/Telemedico/HorarioMedico/CrearRegistro';
        var obj = $('#form-registro-horario').serializeArray();
        obj[obj.length] = { name: 'med_codigo', value: txtidmedico.val() };
        obj[obj.length] = { name: 'fechainicio', value: fechaInicioS };
        obj[obj.length] = { name: 'fechafin', value: fechaFinS };
        obj[obj.length] = { name: 'estado', value: 'HABILITADO' };

        $("#btnGuardar").prop("disabled", true);
        ultimaFecha = moment(dtpInicio.val()).format('DD-MMM-YYYY');
        $.post(url, obj).done(function (data) {
            if (data == "ok") {
                mensaje("S", "Datos guardados correctamente.");
                $("#btnGuardar").prop("disabled", false);
                $('#ModalDetalle').modal('hide');
                cargarActividades(txtidmedico.val());
                limpiar();
            }
            else {
                $("#btnGuardar").prop("disabled", false);
                mensaje('W', data);

            }
        }).fail(function (data) {
            btnGuardar.prop("disabled", false);
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
});
//}


function cambiarFechasxTurno(turno, tipo, idsucursal, idconsultorio) {
    listarHorasLibres(txtidmedico.val(), moment(dtpInicio.val()).format('DD/MM/YYYY'), turno, tipo, idsucursal, idconsultorio);
}

//listar los registros de los médicos
function listarHorasLibres(idmedico, fecha, turno, tipo, idsucursal, idconsultorio) {

    var fechaI;
    var fechaF;
    var url = ORIGEN + '/Telemedico/HorarioMedico/getMedicoHorasOcupadasxDiaxtipoxconsultorio';
    var obj = {
        idmedico: idmedico,
        fecha: fecha,
        tipo: tipo,
        idsucursal: idsucursal,
        idconsultorio: idconsultorio
    };
    $.post(url, obj).done(function (data) {
        console.log(data);
        //limpiamos los vectores
        FechasIniciales = [];
        FechasFinales = [];
        //Asigno las horas a los vectores según la logica de negocio
        if (turno == 'MAÑANA') {
            FechasIniciales.push(0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24);
            FechasFinales.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24);
        }
        else if (turno == 'TARDE') {
            FechasIniciales.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24);
            FechasFinales.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 22, 23, 24);
        }
        $.each(data, function (i, v) {
            fechaI = new Date(moment(v.fechaInicial).format('DD/MMM/YYYY HH:mm'));
            fechaF = new Date(moment(v.fechaFinal).format('DD/MMM/YYYY HH:mm'));
            if (turno == 'MAÑANA') {
                if (fechaF.getHours() <= 13) {
                    for (var j = fechaI.getHours(); j < fechaF.getHours(); j++) {
                        FechasIniciales.push(j);
                        FechasFinales.push(j + 1);

                    }
                }
            }
            else if (turno == 'TARDE') {
                if (fechaI.getHours() >= 14) {
                    for (var j = fechaI.getHours(); j < fechaF.getHours(); j++) {
                        FechasIniciales.push(j);
                        FechasFinales.push(j + 1);
                    }
                }
            }
        });
        if (turno == "MAÑANA") {
            $('#dtpInicioh').datetimepicker('destroy');
            $('#dtpInicioh').datetimepicker({
                format: 'HH:mm',
                disabledHours: FechasIniciales
            });


            $('#dtpFinh').datetimepicker('destroy');
            $('#dtpFinh').datetimepicker({
                format: 'HH:mm',
                disabledHours: FechasFinales
            });

            dtpInicioh.val('00:00');
            dtpFinh.val('00:00');
            dtpInicioh.prop("disabled", false);
            dtpFinh.prop("disabled", false);

        } else if (turno == "TARDE") {
            $('#dtpInicioh').datetimepicker('destroy');
            $('#dtpInicioh').datetimepicker({
                format: 'HH:mm',
                disabledHours: FechasIniciales
            });

            $('#dtpFinh').datetimepicker('destroy');
            $('#dtpFinh').datetimepicker({
                format: 'HH:mm',
                disabledHours: FechasFinales
            });
            dtpInicioh.val('00:00');
            dtpFinh.val('00:00');
            //Activar horas y el botón de búsqueda
            dtpInicioh.prop("disabled", false);
            dtpFinh.prop("disabled", false);

        } else {
            //Desactivar horas y el botón de búsqueda
            dtpInicioh.val('0:00');
            dtpFinh.val('0:00');
            dtpInicioh.prop("disabled", true);
            dtpFinh.prop("disabled", true);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor.');
    });
}

//eventos click
$('#cerrarModalDetalle').click(function () {
    $('#ModalDetalle').modal('hide');
});

//limpia los contenedores generales
function limpiar() {
    //cboTurno.val('');
    //dtpInicio.val('');
    //dtpInicioh.val('');
    //dtpFinh.val('');
    //txtHorarioCodigo.val('');
    $('#form-registro-horario').trigger('reset');

}




