var txtSucursal = document.getElementById('txtSucursal');
//var txtidSucursal = document.getElementById('txtidSucursal');
var txtSerieSucursal = document.getElementById('txtSerieSucursal');

var cboConsultorio = document.getElementById("cboConsultorio");

//variables de fullcalendar
var ultimaFecha;
var ultimaVista;

// modal regstrartruno
var operacion = $('#TIPOOPERACION');
var txtCMP = $('#txtcmp');
var dtpInicio = $('dtpInicio');
var txtMedico = $('txtMedico');
var dtpInicioh = $('dtpInicioh');
var dtpFinh = $('dtpFinh');
var cboTurno = document.getElementById('cboTurno');
var txtConsultorio = $('#txtConsultorio');

var dtpFin = $('#dtpFin');
var txtidmedico = document.getElementById('txtidmedico');
var txtidSucursal = $('txtidSucursal');
var txtHorarioCodigo = $('txthorCodigo');
var txtnmrConsultas = document.getElementById('txtnmrConsultas');
//Boton de buscarMedicos
var btnBuscarMedico = $('#btnBuscarMedico');

//modal sucursal 
var tblSucursal = document.getElementById('tblSucursal');
//modal medicos
var tblMedicos = document.getElementById('tblMedicos');

//VARIABLES PARA GUARDAR Y EDITAR HORARIOS
var fechaInicioS;
var fechaFinS;
var fechaInicioM;
var fechaFinM;
//fechas bloqueadas
var FechasIniciales = [];
var FechasFinales = [];
$(document).ready(function () {
    cargarSucursalParaAdministrador();
    tblMedicos = $('#tblMedicos').DataTable({
        "searching": true,
        lengthChange: true,
        "ordering": false,
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "",
            "zeroRecords": "",
            "info": "",
            "infoEmpty": "No hay información",
            "infoFiltered": "",
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

    tblSucursal = $('#tblSucursal').DataTable({
        "searching": true,
        lengthChange: true,
        "ordering": false,
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "",
            "zeroRecords": "",
            "info": "",
            "infoEmpty": "No hay información",
            "infoFiltered": "",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "order": [[4, 'asc']],
        },
        "columnDefs": [
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            }
        ]
    });

    $('#dtpInicioh').datetimepicker({
        format: 'HH:mm'
    });

    $('#dtpFinh').datetimepicker({format: 'HH:mm'});

});

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

            txtCMP.val(calEvent.cmp);
            txtidmedico.value = (calEvent.medicoCodigo);


            txtMedico.val(calEvent.nombreMedico);
            dtpInicio.val(calEvent.start.format("DD-MMM-YYYY"));
            dtpInicioh.val(calEvent.start.format("HH:mm"));
            dtpFinh.val(calEvent.end.format("HH:mm"));

            //dtpFinh dtpInicio
            //dtpInicioh
            document.getElementById('txtcmp').value = null;
            //document.getElementById('txtidmedico').value = calEvent.medicoCodigo;
            document.getElementById('txtMedico').value = calEvent.nombreMedico;

            document.getElementById('dtpInicio').value = calEvent.start.format("DD-MMM-YYYY");
            document.getElementById('dtpInicioh').value = calEvent.start.format("HH:mm");
            document.getElementById('dtpFinh').value = calEvent.end.format("HH:mm");

            document.getElementById('txtcmp').value = calEvent.medicoCodigo;
            document.getElementById('txthorCodigo').value = calEvent.horarioCodigo;


            //dtpFin.val(calEvent.end.format("DD/MM/YYYY")); txthorCodigo

            txtMedico.val(calEvent.nombreMedico);
            if (calEvent.sucursalCodigo != 0) {
                txtidSucursal.val(calEvent.sucursalCodigo);
            }
            cboTurno.value = (calEvent.turnoCodigo);
            txtCMP.val(calEvent.codigoColegiatura);
            txtHorarioCodigo.val(calEvent.horarioCodigo);
            txtnmrConsultas.value = (calEvent.nmrConsultas);
            //Activar cboTurno 
            //SUPERVISAR POR TURNO


            operacion.val('EDITAR');
            $('#ModalDetalle').modal();
        },
        selectable: true,
        select: function (start, end) {
            selectedEvent = {
                horarioCodigo: 0,
                title: 'Registro de turno',
                start: start,
                end: end,
                color: 'green',
                allDay: false,
                sucursalCodigo: 0,
                turnoCodigo: 0,
                consultorio: '',
                nmrConsultas: 0
            };
            operacion.val('NUEVO');
            EditarHorarioActividad();
            $('#calendar').fullCalendar('unselect');
        },
        editable: false
    });

}


$('#btnBuscarSucursal').click(function () {
    $('#modalsucursal').modal('show');
});

function ListarConsultorioPorSucursal(dato) {
    //txtidSucursal
    var url = "/Administrador/Consultorio/listarConsultorioPorSucursal?id=" + dato;
    var obj = { id: dato };

    $.post(url, dato).done(function (data) {
        $('#cboConsultorio option').remove();
        $('#cboConsultorio').append('<option value="0">- SELECCIONE -</option>');
        $(data).each(function (i, e) {
            descripcion = [e.descripcion];
            codigo = [e.consultorio_codigo];
            $('#cboConsultorio').append('<option value="' + codigo + '">' + descripcion + '</option>');
        });

    }).fail(function (data) {

        mensaje("D", 'Error en el servidor.');
    });
}

$('#cboConsultorio').change(function () {
    cargarActividades('', txtidSucursal.value, cboConsultorio.value);
});

function cargarActividades(dato, suc, nmrConsultorio) {

    var actividad = [];
    var url = '/VisitadorMedico/Horarios/GetHorariosxMedicosxSucursal';
    var obj = {
        codigoMedico: dato,
        sucursalCodigo: suc,
        consultorioCodigo: nmrConsultorio
    };

    $.post(url, obj).done(function (data) {

        $.each(data, function (i, v) {
            actividad.push({
                horarioCodigo: v.horario_codigo,
                title: v.turno + '<br />' + 'Médico : ' + v.medico,
                description: "Trabajo",
                start: moment(v.fechaInicio),
                end: v.fechaFin != null ? moment(v.fechaFin) : null,
                color: v.tur_codigo == 1 ? 'green' : '#0057ad',
                allDay: false,
                sucursalCodigo: v.suc_codigo,
                turnoCodigo: v.tur_codigo,
                medicoCodigo: v.med_codigo,
                codigoColegiatura: v.cmp,
                nombreMedico: v.medico,
                consultorio: v.consultorio,
                // textColor: '#black',
                textColor: '#FFF',
                nmrConsultas: v.NROCONSULTAS,
                cmp: v.cmp
            });
        });
        ultimaVista = $('#calender').fullCalendar('getView');
        if (ultimaVista == undefined) {
            ultimaVista = 'month';
        }

        //alert(ultimaVista.name);
        GenerateCalendar(actividad);
    }).fail(function (data) {
        mensaje("D", data);
    });
}
function EditarHorarioActividad() {


    if (selectedEvent != null) {

        $('#ModalDetalle #turno').text(selectedEvent.title);
        txtCMP.val("");
        txtMedico.val('');
        $('#dtpInicio').val(selectedEvent.start.format("DD-MMM-YYYY"));
        //dtpInicioh.newDate();
        $('#dtpInicioh').val(selectedEvent.start.format("HH:mm"));

        //dtpFin.val(selectedEvent.end.format("DD-MM-YYYY"));

        $('#dtpFinh').val(selectedEvent.end.format("HH:mm"));


        if (selectedEvent.sucursalCodigo != "0") {
            document.getElementById('txtidSucursal').value = (selectedEvent.sucursalCodigo);
        }
        //document.getElementById('txtidSucursal').value = (selectedEvent.sucursalCodigo);
        document.getElementById("cboTurno").selectedIndex = selectedEvent.turnoCodigo;
        //cboTurno.value(selectedEvent.turnoCodigo);
        txtConsultorio.val(selectedEvent.consultorio);
        txtnmrConsultas.value = (selectedEvent.nmrConsultas);
    }
    $('#ModalDetalle').modal('show');

}

$('#ModalDetalle').on('show.bs.modal', function (e) {
    document.getElementById("cboTurno").disabled = false;

    var fechaHorario = moment(dtpFin.val()).format("DD-MM-YYYY HH:mm");

    document.getElementById('btnGuardar').style.display = 'inline';
    document.getElementById('btnEditar').style.display = 'inline';
    document.getElementById('btnDelete').style.display = 'inline';

    //alert(dtpInicio.val());


    document.getElementById('div_nmrConsultas').style.display = 'none';
    //listarTurnos();
    if (operacion.val() == "NUEVO") {
        limpiarMedico();
        //dtpInicioh.prop("disabled", false);
        //dtpFinh.prop("disabled", false);
        //document.getElementById('dtpInicioh').disabled = false;
        //document.getElementById('dtpFinh').disabled = false;
        //document.getElementById('btnBuscarMedico').disabled = false;
        document.getElementById("cboTurno").selectedIndex = "2"
        document.getElementById('btnDelete').style.display = 'none';
        document.getElementById('btnEditar').style.display = 'none';

        //document.getElementById('div_nmrConsultas').style.display = 'none';


    }
    else if (operacion.val() == "EDITAR") {
        //btnBuscarMedico.prop("disabled", true);
        //dtpInicioh.prop("disabled", true);
        //dtpFinh.prop("disabled", true);

        document.getElementById('btnBuscarMedico').disabled = true;
        document.getElementById('dtpInicioh').disabled = true;
        document.getElementById('dtpFinh').disabled = true;

        document.getElementById('div_nmrConsultas').style.display = 'inline';
        document.getElementById("cboTurno").disabled = true;
        document.getElementById('btnGuardar').style.display = 'none';

        //limitarPorFecha(fechaHorario);
    }
    //cambiarFechasxTurno(cboTurno.val());
    //omitirTurno.val(0);
});


$('#cboTurno').change(function () {

    if (operacion.val() == "EDITAR") {
        //cambiarFechasxTurno($("#cboTurno option:selected").text());        
    }
    else if (operacion.val() == "NUEVO") {
        cambiarFechasxTurno(cboTurno.selectedOptions[0].innerHTML);
        limpiarMedico();

    }
});

//dtpInicioh.on('change.datetimepicker', function (e) {
//    limpiarMedico();
//});
//dtpFinh.on('change.datetimepicker', function (e) {
//    limpiarMedico();
//});

function cambiarFechasxTurno(turno) {
    ListarRegistrosConsultorioxDia(cboConsultorio.value, moment(dtpInicio.val()).format('DD/MM/YYYY'), turno);
}
function ListarRegistrosConsultorioxDia(codigoConsultorio, fecha, turno) {

    var fechaI;
    var fechaF;
    //var horasDiferencia = fecha2.getHours() - fecha1.getHours();

    var url = "/VisitadorMedico/Horarios/GeListarHorarioConsultorioxDia";
    var obj = {
        codigoConsultorio: codigoConsultorio,
        fecha: fecha
    };
    $.post(url, obj).done(function (data) {
        //vaciamos los vectores para luego llenarlos
        FechasIniciales = [];
        FechasFinales = [];
        //Asigno las horas a los vectores según la logica de negocio
        if (turno == 'MAÑANA') {
            FechasIniciales.push(0, 1, 2, 3, 4, 5, 6, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24);
            FechasFinales.push(0, 1, 2, 3, 4, 5, 6, 7, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24);
        }
        else if (turno == 'TARDE') {
            FechasIniciales.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24);
            FechasFinales.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 22, 23, 24);
        }
        $.each(data, function (i, v) {
            fechaI = new Date(moment(v.fechaInicial).format('DD/MM/YYYY HH:mm'));
            fechaF = new Date(moment(v.fechaFinal).format('DD/MM/YYYY HH:mm'));

            if (turno == 'MAÑANA') {
                if (fechaF.getHours() <= 13) {
                    for (var j = fechaI.getHours(); j < fechaF.getHours(); j++) {

                        console.log(j);
                        FechasIniciales.push(j);
                        FechasFinales.push(j + 1);

                    }
                }
            }
            else if (turno == 'TARDE') {
                if (fechaI.getHours() >= 14) {
                    console.log(j);
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
            
            //dtpInicioh.val('8:00');

            $('#dtpFinh').datetimepicker('destroy');
            $('#dtpFinh').datetimepicker({
                format: 'HH:mm',
                disabledHours: FechasFinales
            });
            //Activar horas y el botón de búsqueda
            //var nmI = 8;
            //var nmF = 9;
            //for (var h = nmI; h <= FechasIniciales.length; h++) {
            //    console.log(FechasIniciales.indexOf(h));
            //    if (FechasIniciales.indexOf(h) == null || FechasIniciales.indexOf(h) == undefined); {
            //        nmI = h;
            //        h = FechasIniciales.length + 1;
            //        return;
            //    }
            //}
            dtpInicioh.val('00:00');
            dtpFinh.val('00:00');
            document.getElementById('btnBuscarMedico').disabled = false;
            document.getElementById('dtpInicioh').disabled = false;
            document.getElementById('dtpFinh').disabled = false;

            //dtpInicioh.prop("disabled", false);
            //dtpFinh.prop("disabled", false);
            //btnBuscarMedico.prop("disabled", false);

        } else if (turno == "TARDE") {
            $('#dtpInicioh').datetimepicker('destroy');
            $('#dtpInicioh').datetimepicker({
                format: 'HH:mm',
                disabledHours: FechasIniciales
            });
            dtpInicioh.val('8:00');

            $('#dtpFinh').datetimepicker('destroy');
            $('#dtpFinh').datetimepicker({
                format: 'HH:mm',
                disabledHours: FechasFinales
            });
            dtpInicioh.val('00:00');
            dtpFinh.val('00:00');
            //Activar horas y el botón de búsqueda
            document.getElementById('btnBuscarMedico').disabled = false;
            document.getElementById('dtpInicioh').disabled = false;
            document.getElementById('dtpFinh').disabled = false;
            //dtpInicioh.prop("disabled", false);
            //dtpFinh.prop("disabled", false);
            //btnBuscarMedico.prop("disabled", false);
        } else {
            //Desactivar horas y el botón de búsqueda
            dtpInicioh.val('0:00');
            dtpFinh.val('0:00');
            document.getElementById('btnBuscarMedico').disabled = true;
            document.getElementById('dtpInicioh').disabled = true;
            document.getElementById('dtpFinh').disabled = true;
            //dtpInicioh.prop("disabled", true);
            //dtpFinh.prop("disabled", true);
            //btnBuscarMedico.prop("disabled", true);
        }



    }).fail(function (data) {
        mensaje("D", 'Error en el servidor.');
    });
}




function limpiarMedico() {
    txtCMP.val('');
    txtidmedico.value = ('');
    txtMedico.val('');

    document.getElementById('txtcmp').value = "";
    //document.getElementById('txtidmedico').value = "";
    document.getElementById('txtMedico').value = "";
}
function limpiar() {
    //txtidmedico.val('');
    txtidmedico.value = ('');
    txtCMP.val('');
    txtMedico.val('');
    cboTurno.value = '';
    dtpInicio.val('');
    dtpFin.val('');
    txtHorarioCodigo.val('');
    txtnmrConsultas.value = ('0');
}
$('#btnBuscarMedico').click(function () {
    //asignar las fecha y horas de disponbilidad
    fechaInicioS = $('#dtpInicio').val() + ' ' + $('#dtpInicioh').val();
    fechaFinS = $('#dtpInicio').val() + ' ' + $('#dtpFinh').val();
    cargarMedicosxDisponibilidad(fechaInicioS, fechaFinS);

});

function cargarMedicosxDisponibilidad(fechaInicio, fechaFin) {

    var url = '/Maestros/Medico/getListarMedicosxDisponibilidadH';
    var obj = {
        finicio: fechaInicio,
        ffin: fechaFin
    };
    console.log(obj);
    $.post(url, obj).done(function (data) {
        tblMedicos.clear().draw();
        agregarFilaModal(data, 'medico');
    }).fail(function (data) {
        console.log(data);
        mensaje("D", data);
    });
}
//****************************** cargar Modales ****************************************
function cargarSucursalParaAdministrador() {
    var url = ORIGEN + '/Administrador/Sucursal/ListarSucursales2';
    $.post(url).done(function (data) {
        agregarFilaModal(data, 'sucursal');
    }).fail(function (data) {
        console.log(data);
        mensaje("D", data);
    });
}

function agregarFilaModal(data, tipo) {
    if (tipo == 'medico') {
        tblMedicos.clear()
            .draw();
        for (var i = 0; i < data.length; i++) {
            if (data[i].disponibilidad == 0) {
                tblMedicos.row.add([
                    data[i].med_codigo,
                    data[i].nroColegiatura,
                    data[i].medico,
                    data[i].especialidad,
                    'LIBRE',
                    '<button class="btn  btn-success btn-xs btn-pasarMedico"><i class="fas fa-check fa-1x"></i></button>'
                ]).draw(false);
            } else if (data[i].disponibilidad >= 1) {
                tblMedicos.row.add([
                    data[i].med_codigo,
                    data[i].nroColegiatura,
                    data[i].medico,
                    data[i].especialidad,
                    'OCUPADO',
                    '<button class="btn  btn-danger btn-xs btn-mensajeMO"><i class="fas fa-times-circle fa-1x"></i></button>'
                ]).draw(false);
            }
        }
        limpiarMedico();
        $('#modalmedico').modal('show');
    }
    if (tipo == 'sucursal') {
        for (var i = 0; i < data.length; i++) {
            tblSucursal.row.add([
                data[i].suc_codigo,
                data[i].serie,
                data[i].tipoSucursal,
                data[i].descripcion,
                data[i].direccion,
                data[i].nConsultorios,
                '<button class="btn  btn-success btn-xs btn-pasarSucursal"><i class="fas fa-check fa-1x"></i></button>'
            ]).draw(false);
        }
    }
}

$(document).on('click', '.btn-pasarSucursal', function (e) {

    var columna = tblSucursal.row($(this).parents('tr')).data();
    document.getElementById('txtidSucursal').value = columna[0];
    txtidSucursal.value = (columna[0]);

    txtSerieSucursal.value = (columna[1]);
    cmbsucursal.value = (columna[3]);
    ListarConsultorioPorSucursal(columna[0]);

    $('#modalsucursal').modal('hide');
});

$(document).on('click', '.btn-pasarMedico', function (e) {
    var columna = tblMedicos.row($(this).parents('tr')).data();

    txtidmedico.value = (columna[0]);
    txtMedico.val(columna[2]);
    $('#txtMedico').val(columna[2]);

    txtCMP.val(columna[1]);
    $('#modalmedico').modal('hide');
});
//************************************************

function registrarActividad() {

    if (dtpInicioh.val() == "") {
        mensaje("W", "Seleccione una hora válida");
        return;
    }
    if (dtpFinh.val() == "") {
        mensaje("W", "Seleccione una hora válida");
        return;
    }
    var fecha1 = new Date(document.getElementById('dtpInicio').value + ' ' + document.getElementById('dtpInicioh').value);
    var fecha2 = new Date(document.getElementById('dtpInicio').value + ' ' + document.getElementById('dtpFinh').value);
    var horasDiferencia = fecha2.getHours() - fecha1.getHours();

    if (fecha1.getTime() >= fecha2.getTime()) {

        mensaje("W", "La hora inicial debe ser menor a la hora de fin y además diferentes");
        return;
    }

    if (horasDiferencia < 1) {
        mensaje("W", "Debe haber una diferencia de 1 hora como mínimo");
        return;
    }
    if (txtidSucursal.val() == "0") {
        mensaje("W", "Seleccione una sucursal");
        return;
    }
    if (txtidmedico.value == "") {
        mensaje("W", "Seleccione un médico asociado");
        return;
    }
    if (cboTurno.value == "0") {
        mensaje("W", "Seleccione un turno válido");
        return;
    }

    var url = '/VisitadorMedico/Horarios/setHorario';
    if (operacion.val() == "NUEVO") {
        fechaInicioS = document.getElementById('dtpInicio').value + ' ' + document.getElementById('dtpInicioh').value;
        fechaFinS = document.getElementById('dtpInicio').value + ' ' + document.getElementById('dtpFinh').value;

        var horario = {};
        horario['horario_codigo'] = $('#txthorCodigo').val();
        horario['med_codigo'] = txtidmedico.value;
        horario['suc_codigo'] = document.getElementById('txtidSucursal').value;
        horario['fechaInicio'] = fechaInicioS;
        horario['fechaFin'] = fechaFinS;
        horario['estado'] = 'HABILITADO';
        horario['tur_codigo'] = cboTurno.value;
        horario['consultorio_codigo'] = cboConsultorio.value;
        horario['nmrConsultas'] = txtnmrConsultas.value;

        var dataobj = {
            obj: horario
        }
        //console.log(horario);
        ultimaFecha = moment(dtpInicio.val()).format('DD-MMM-YYYY');
        $.post(url, dataobj).done(function (data) {
            //console.log(data);

            if (data.mensaje == "ok") {
                mensaje("S", "Datos guardados correctamente.");
                $("#btnGuardar").prop("disabled", false);
                $('#ModalDetalle').modal('hide');

                cargarActividades('', txtidSucursal.val(), cboConsultorio.value);
                limpiar();
            }
            else {
                mensaje('W', data);

            }
        }).fail(function (data) {
            //btnGuardar.prop("disabled", false);
            document.getElementById('btnGuardar').disabled = true;
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    } else if (operacion.val() == "EDITAR") {
        fechaInicioS = dtpInicio.val() + ' ' + dtpInicioh.val();
        fechaFinS = dtpInicio.val() + ' ' + dtpFinh.val();
        var horario = {};
        horario['horario_codigo'] = $('#txthorCodigo').val();
        horario['med_codigo'] = txtidmedico.value;
        horario['suc_codigo'] = document.getElementById('txtidSucursal').value;
        horario['fechaInicio'] = fechaInicioS;
        horario['fechaFin'] = fechaFinS;
        horario['estado'] = 'HABILITADO';
        horario['tur_codigo'] = cboTurno.value;
        horario['consultorio_codigo'] = cboConsultorio.value;
        horario['nmrConsultas'] = txtnmrConsultas.value;

        var dataobj = {
            obj: horario
        }
        ultimaFecha = moment(dtpInicio.val()).format('DD-MMM-YYYY');
        $.post(url, dataobj).done(function (data) {
            if (data.mensaje == "ok") {
                mensaje("S", "Datos actualizados correctamente.");
                $('#ModalDetalle').modal('hide');
                cargarActividades('', txtidSucursal.val(), cboConsultorio.value);
                limpiar();
            }
            else
                mensaje('W', data);
            //btnGuardar.prop("disabled", false);

        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
            //btnGuardar.prop("disabled", false);
        });
    }
}

function eliminarActividad() {
    swal({
        title: '¿Desea eliminar esta actividad?',
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
            swal("Actividad eliminada!", {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                }
            });
            
            eliminar($('#txthorCodigo').val());
        } else {
            swal.close();
        }
    });
}

function eliminar(data) {
    var url = '/VisitadorMedico/Horarios/DeleteHorario';
    var obj = { cod: data };
    
    $.post(url, obj).done(function (data) {
        $('#ModalDetalle').modal('hide');
        cargarActividades('', txtidSucursal.val(), cboConsultorio.value);
        ultimaFecha = moment(dtpInicio.val()).format('DD-MMM-YYYY');
        mensaje("S", "Actividad eliminada correctamente.");
    }).fail(function (data) {
        mensaje("D", data);
    });
}
$('#btnVerDetalle').click(function () {
    if (txtidmedico.value == "") {
        mensaje("W", "Seleccione un médico asociado");
        return;
    } else {

        cargarActividadesMedicoxDia(txtidmedico.value, dtpInicio.val());
    }

});

function cargarActividadesMedicoxDia(codigoMedico, fecha) {
    var fechas = new Date(fecha);
    var registro = [];
    var url = '/VisitadorMedico/Horarios/getRegistrosMedicoxDia';
    var obj = {
        codigoMed: codigoMedico,
        fecha: moment(fechas).format('DD/MM/YYYY')
    };

    $.post(url, obj).done(function (data) {
        //console.log(data);
        if (data.length > 0) {
            $.each(data, function (i, v) {
                registro.push({
                    horarioCodigo: v.horario_codigo,
                    title: v.turno + '<br />' + v.medico + '<br />' + 'Sucursal: ' + v.sucursal + '<br />' + 'Consultorio: ' + v.consultorio,
                    description: "Trabajo",
                    start: moment(v.fechaInicio),
                    end: v.fechaFin != null ? moment(v.fechaFin) : null,
                    color: v.tur_codigo == 1 ? 'green' : '#0057ad',
                    allDay: false,
                    sucursalCodigo: v.suc_codigo,
                    turnoCodigo: v.tur_codigo,
                    medicoCodigo: v.med_codigo,
                    codigoColegiatura: v.cmp,
                    nombreMedico: v.medico,
                    consultorio: v.consultorio,
                    textColor: '#FFF',
                    nmrConsultas: v.NROCONSULTAS
                });
            });
            //ultimaVista = $('#calender').fullCalendar('getView');
            //if (ultimaVista == undefined) {
            //    ultimaVista = 'month';
            //}
            GenerateCalendarDiaDetalle(registro, fecha);
            $('#modalHorariosDetalle').modal('show');
        } else {
            mensaje("W", 'No existen datos');
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", data);
    });
}