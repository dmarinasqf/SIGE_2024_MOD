var txtHorarioCodigo = $('#txthorCodigo');
var txtidmedico = $('#txtidmedicof');
var txtCMP = $('#txtcmpf');
var txtMedico = $('#txtMedicof');
var txtidmedico_detalle = $('#txtidmedico');
var txtCMP_detalle = $('#txtcmp');
var txtMedico_detalle = $('#txtMedico');
var cboTurno = $('#cboTurno');
var txtidSucursal = $('#txtidSucursal');
var txtSerieSucursal = $('#txtSerie');
var txtSucursal = $('#txtSucursal');
var omitirTurno = $('#omititTurno');
var dtpInicio = $('#dtpInicio');

var dtpInicioh = $('#dtpInicioh');
var dtpFinh = $('#dtpFinh');
var IDUSUARIO = $('#IDUSUARIO');
var operacion = $('#TIPOOPERACION');
var cboConsultorio = $('#cboConsultorio');
var txtConsultorioR = $('#txtConsultorioR');
var txtnmrConsultas = $('#txtnmrConsultas');
//variables fullcalendar
var ultimaFechac;
var ultimaVistac;
//VARIABLES PARA GUARDAR Y EDITAR HORARIOS
var fechaInicioS;
var fechaFinS;
//tipos de contenido según mes
var mensajeCorto;
var mensajeLargo;

$(document).ready(function () {
    document.getElementById('btnDelete').style.display = "none";
    //document.getElementById('btnVerDetalle').style.display = "none";
    //document.getElementById('btnBuscarMedico').style.display = "none";
    cargarSucursal();
    document.getElementById("btnBuscarSucursal").disabled = false;
    document.getElementById("cboTurno").disabled = true;
    //ListarConsultorioPorSucursal(txtidSucursal.val());
    //if (PERFIL == 'VENTAS' || PERFIL == 'VENTASSM') {
    //    txtidSucursal.val(IDSUCURSAL);
    //    mostrarSucursal(txtidSucursal.val());
    //    document.getElementById("btnBuscarSucursal").disabled = true;
    //    ListarConsultorioPorSucursal(txtidSucursal.val());
    //    document.getElementById('btn_limpiar').style.display = 'none';
    //    document.getElementById('div_medicoBuscar1').style.display = 'none';
    //    document.getElementById('div_medicoBuscar2').style.display = 'none';
    //} else if (PERFIL == 'ADMINISTRADOR' || PERFIL == 'SUPERVISOR') {
    //    document.getElementById('div_medicoBuscar1').style.display = 'inline';
    //    document.getElementById('div_medicoBuscar2').style.display = 'inline';
    //    document.getElementById('btn_limpiar').style.display = 'inline';
    //}
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
    
});

function cargarActividades(dato, suc, nmrConsultorio) {

    ultimaVistac = $('#calender').fullCalendar('getView');
    if (ultimaVistac.name == undefined) {
        ultimaVistac.name = 'month';
    }

    var actividad = [];
    var url = '/VisitadorMedico/Horarios/GetHorariosxMedicosxSucursal';
    var obj = {
        codigoMed: dato,
        sucursalCodigo: suc,
        consultorioCodigo: nmrConsultorio
    };

    $.post(url, obj).done(function (data) {
        //console.log(data);       
        $.each(data, function (i, v) {
            mensajeCorto = v.turno + '<br />' + 'MEDICO: ' + v.medico;
            mensajeLargo = v.turno + '<br />' + 'MEDICO: ' + v.medico + '<br />' + 'SUCURSAL: ' + v.sucursal + '<br />' + 'CONSULTORIO: ' + v.consultorio;
            actividad.push({
                horarioCodigo: v.horario_codigo,
                title: ultimaVistac.name == 'month' ? mensajeCorto : mensajeLargo,
                description: "Trabajo",
                start: moment(v.fechaInicio),
                end: v.fechaFin != null ? moment(v.fechaFin) : null,
                color: v.tur_codigo == 1 ? 'green' : '#0057ad',
                allDay: false,
                sucursalCodigo: v.suc_codigo,
                turnoCodigo: v.tur_codigo,
                medicoCodigo: v.med_codigo,
                codigoColegiatura: v.numeroColegiatura,
                nombreMedico: v.medico,
                consultorio: v.consultorio,
                codigoConsultorio: v.consultorio_codigo,
                textColor: '#FFF',
                nmrConsultas: v.NROCONSULTAS,
                cmp: v.cmp

            });
        });

        GenerateCalendar(actividad);
    }).fail(function (data) {
        //console.log(data);
        mensaje("D", data);
    });
}
function GenerateCalendar(actividad) {
    $('#calender').fullCalendar('destroy');
    $('#calender').fullCalendar({
        defaultDate: ultimaFechac,
        defaultView: ultimaVistac.name,
        contentHeight: 625,
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
        allDaySlot: false,
        minTime: '07:00:00',
        maxTime: '22:00:00',
        timeFormat: 'h(:mm)a',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agenda',

        },
        displayEventTime: true,
        eventLimit: true,
        events: actividad,
        eventClick: function (calEvent, jsEvent, view) {
            selectedEvent = calEvent;
            if (calEvent.turnoCodigo == 1) {
                $('#ModalDetalle #turno').text(calEvent.title.substring(0, 6));
            } else {
                $('#ModalDetalle #turno').text(calEvent.title.substring(0, 5));
            }

            txtConsultorioR.val(calEvent.codigoConsultorio);

            txtCMP_detalle.val(calEvent.cmp);
            txtidmedico_detalle.val(calEvent.medicoCodigo);

            txtMedico_detalle.val(calEvent.nombreMedico);
            dtpInicio.val(calEvent.start.format("DD-MMM-YYYY"));
            dtpInicioh.val(calEvent.start.format("HH:mm"));
            dtpFinh.val(calEvent.end.format("HH:mm"));
            if (calEvent.sucursalCodigo != 0) {
                txtidSucursal.val(calEvent.sucursalCodigo);
            }
            cboTurno.val(calEvent.turnoCodigo);
            txtCMP.val(calEvent.codigoColegiatura);
            txtHorarioCodigo.val(calEvent.horarioCodigo);
            txtnmrConsultas.val(calEvent.nmrConsultas);

            operacion.val('EDITAR');
            $('#ModalDetalle').modal();
        },
        selectable: true,
        editable: false
    });

}

//--------------------FIN DE CALENDARIO----------------------
function registrarActividad() {

    if (txtidSucursal.val() == "0") {
        mensaje("W", "Seleccione una sucursal");
        return;
    }
    if (txtidmedico_detalle.val() == "") {
        mensaje("W", "Seleccione un médico asociado");
        return;
    }
    if (cboTurno.val() == "0") {
        mensaje("W", "Seleccione un turno válido");
        return;
    }
    if (cboConsultorio.val() == "0") {
        mensaje("W", "Seleccione un turno válido");
        return;
    }


    var url = '/VisitadorMedico/Horarios/setHorario';
    if (operacion.val() == "NUEVO") {
        fechaInicioS = dtpInicio.val().toString() + ' ' + dtpInicioh.val().toString();
        fechaFinS = dtpInicio.val().toString() + ' ' + dtpFinh.val().toString();
        
        //var horario = {
        //    med_codigo: txtidmedico_detalle.val(),
        //    suc_codigo: txtidSucursal.val(),
        //    fechaInicio: dtpInicioS,
        //    fechaFin: dtpFinS,
        //    emp_codigo: '',
        //    estado: 'HABILITADO',
        //    tur_codigo: cboTurno.val(),
        //    consultorio_codigo: cboConsultorio.val(),
        //    nmrConsultas: txtnmrConsultas.val()
        //};
        var horario = {};
        horario['horario_codigo'] = 0;
        horario['med_codigo'] = txtidmedico.value;
        horario['suc_codigo'] = document.getElementById('txtidSucursal').value;
        horario['fechaInicio'] = fechaInicioS;
        horario['fechaFin'] = fechaFinS;
        horario['estado'] = 'HABILITADO';
        horario['tur_codigo'] = cboTurno.value;
        horario['consultorio_codigo'] = cboConsultorio.value;
        horario['nmrConsultas'] = txtnmrConsultas.val();

        var dataobj = {
            obj: horario
        }
        $.post(url, horario).done(function (data) {
            //console.log(data);
            if (data.mesnaje == "ok") {
                mensaje("S", "Datos guardados correctamente.");
                $("#btnGuardar").prop("disabled", false);
                $('#ModalDetalle').modal('hide');
                consultar();
                limpiar();
            }
            else {
                mensaje('W', data);

            }
        }).fail(function (data) {
            btnGuardar.prop("disabled", false);
            //console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    } else if (operacion.val() == "EDITAR") {

        fechaInicioS = dtpInicio.val().toString() + ' ' + dtpInicioh.val().toString();
        fechaFinS = dtpInicio.val().toString() + ' ' + dtpFinh.val().toString();
        if (cboConsultorio.val() == "0") {
            //horario2 = {
            //    horario_codigo: txtHorarioCodigo.val(),
            //    med_codigo: txtidmedico_detalle.val(),
            //    suc_codigo: txtidSucursal.val(),
            //    fechaInicio: fechaInicioS,
            //    fechaFin: fechaFinS,
            //    emp_codigo: '',
            //    estado: 'HABILITADO',
            //    tur_codigo: cboTurno.val(),
            //    consultorio_codigo: cboConsultorio.val(),
            //    nmrConsultas: txtnmrConsultas.val()
            //};
            var horario = {};
            horario['horario_codigo'] = $('#txthorCodigo').val();
            horario['med_codigo'] = txtidmedico.value;
            horario['suc_codigo'] = document.getElementById('txtidSucursal').value;
            horario['fechaInicio'] = fechaInicioS;
            horario['fechaFin'] = fechaFinS;
            horario['estado'] = 'HABILITADO';
            horario['tur_codigo'] = cboTurno.value;
            horario['consultorio_codigo'] = cboConsultorio.value;
            horario['nmrConsultas'] = txtnmrConsultas.val();

            
        } else {
            if (txtConsultorioR.val() != '') {
                //horario2 = {
                //    horario_codigo: txtHorarioCodigo.val(),
                //    med_codigo: txtidmedico_detalle.val(),
                //    suc_codigo: txtidSucursal.val(),
                //    fechaInicio: fechaInicioS,
                //    fechaFin: fechaFinS,
                //    emp_codigo: '',
                //    estado: 'HABILITADO',
                //    tur_codigo: cboTurno.val(),
                //    consultorio_codigo: txtConsultorioR.val(),
                //    nmrConsultas: txtnmrConsultas.val()
                //};
                var horario = {};
                horario['horario_codigo'] = $('#txthorCodigo').val();
                horario['med_codigo'] = txtidmedico.value;
                horario['suc_codigo'] = document.getElementById('txtidSucursal').value;
                horario['fechaInicio'] = fechaInicioS;
                horario['fechaFin'] = fechaFinS;
                horario['estado'] = 'HABILITADO';
                horario['tur_codigo'] = cboTurno.value;
                horario['consultorio_codigo'] = cboConsultorio.value;
                horario['nmrConsultas'] = txtnmrConsultas.val();

                
            }
            else {
                mensaje("W", "No se puede guardar");
                return;
            }
        }
        // console.log(horario2);
        var dataobj = {
            obj: horario
        }

        ultimaFechac = dtpInicio.val();
        $.post(url, dataobj).done(function (data) {
            if (data.mensaje == "ok") {
                mensaje("S", "Datos actualizados correctamente.");
                $('#ModalDetalle').modal('hide');
                $('#btn_consultar').click();
                //cargarActividades('', txtidSucursal.val(), cboConsultorio.val());
                limpiar();
            }
            else
                mensaje('W', data);
            //btnGuardar.prop("disabled", false);

        }).fail(function (data) {
            //console.log(data);
            mensaje("D", 'Error en el servidor');
            //btnGuardar.prop("disabled", false);
        });
    }
    
}

function limitarPorFecha(fechaFin) {
    document.getElementById('div_nmrConsultas').style.display = 'none';
    var hoy = moment(Date.now()).format("DD-MM-YYYY HH:mm");

    if (hoy >= fechaFin) {
        document.getElementById('div_nmrConsultas').style.display = 'inline';
        if (PERFIL == 'VENTAS' || PERFIL == 'VENTASSM') {
            if (moment(hoy).format("DD-MM-YYYY") == moment(fechaFin).format("DD-MM-YYYY")) {

                document.getElementById("txtnmrConsultas").disabled = false;
            } else {

                document.getElementById("txtnmrConsultas").disabled = true;
            }
        } else {
            document.getElementById("txtnmrConsultas").disabled = false;
        }
    }
}

function mostrarSucursal(data) {

    var url = '/Sucursal/Buscar';
    var obj = { id: data };
    $.post(url, obj).done(function (data) {
        //console.log(data);
        txtSucursal.val(data.descripcion);
        txtSerieSucursal.val(data.serie);
    }).fail(function (data) {
        mensaje("E", data);
    });
}

function cargarMedicosAsociados() {
    var url = '/Maestros/Medico/getListarMedicosAsociados';
    $.post(url).done(function (data) {
        agregarFilaModal(data, 'medico');
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

            tblMedicos.row.add([
                data[i].med_codigo,
                data[i].nroColegiatura,
                data[i].medico,
                data[i].especialidad,
                'ASOCIADO QF',
                '<button class="btn  btn-success btn-xs btn-pasarMedico"><i class="fas fa-check fa-1x"></i></button>'
            ]).draw(false);
        }
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
 
$(document).on('click', '.btn-pasarMedico', function (e) {
    var columna = tblMedicos.row($(this).parents('tr')).data();

    txtidmedico.val(columna[0]);
    txtCMP.val(columna[1]);
    txtMedico.val(columna[2]);
    $('#modalmedico').modal('hide');

});
function consultar() {

    if (txtidmedico.val() > 0 && txtidSucursal.val() > 0) {
        if (cboConsultorio.val() == '0') {
            mensaje('W', 'Seleccione un consultorio');
            return;
        }
        cargarActividades(txtidmedico.val(), txtidSucursal.val(), cboConsultorio.val());
        return;
    }
    if (txtidmedico.val() > 0) {
        cargarActividades(txtidmedico.val(), '', '');
        return;
    }
    if (txtidSucursal.val() > 0) {
        if (cboConsultorio.val() == '0') {
            mensaje('W', 'Seleccione un consultorio');
            return;
        }
        cargarActividades('', txtidSucursal.val(), cboConsultorio.val());
        return;
    }
}

//EVENTOS CLICK
$('#btn_limpiar').on('click', function () {
    txtidSucursal.val('0');
    txtSerieSucursal.val('');
    txtSucursal.val('');
    cboConsultorio.val('0');
    txtidmedico.val('');
    //txtMedico.val('');
    txtCMP.val('');
    txtConsultorioR.val('');
    $('#cboConsultorio option').remove();
    $('#calender').fullCalendar('destroy');
});
$('#btn_consultar').on('click', function () {
    consultar();
});
$('#btnBuscarMedico').click(function () {
    cargarMedicosAsociados();
    $('#modalmedico').modal('show');
});
$('#btnBuscarSucursal').click(function () {
    $('#modalsucursal').modal('show');
});
$('#cerrarModalDetalle').click(function () {
    $('#ModalDetalle').modal('hide');
});
$('#cerrarModalMedicos').click(function () {
    $('#modalmedico').modal('hide');
});
$('#cerrarModalSucursal').click(function () {
    $('#modalsucursal').modal('hide');
});

//---------------------------------------------------------------------------------------


function cargarSucursal() {
    var url = ORIGEN + '/Administrador/Sucursal/ListarSucursales2';
    $.post(url).done(function (data) {
        //console.log(data);
        agregarFilaModal(data, 'sucursal');
    }).fail(function (data) {
        //console.log(data);
        mensaje("D", data);
    });
}

$(document).on('click', '.btn-pasarSucursal', function (e) {
    var columna = tblSucursal.row($(this).parents('tr')).data();
    txtidSucursal.val(columna[0]);
    txtSerieSucursal.val(columna[1]);
    txtSucursal.val(columna[3]);
    console.log(txtidSucursal.val());
    ListarConsultorioPorSucursal(txtidSucursal.val());
    $('#modalsucursal').modal('hide');
});
$(document).on('click', '.btn-mensajeMO', function (e) {
    mensaje("W", "Médico está ocupado para ese turno.");
});


//-----------------------CONSULTORIO-------------------------

function ListarConsultorioPorSucursal(dato) {
    var url = "/Administrador/Consultorio/ListarConsultorioPorSucursal";
    var obj = { id: dato };
    $.post(url, obj).done(function (data) {
        $('#cboConsultorio option').remove();
        $('#cboConsultorio').append('<option value="0">- SELECCIONE -</option>');
        $(data).each(function (i, e) {
            descripcion = [e.descripcion];
            codigo = [e.consultorio_codigo];
            $('#cboConsultorio').append('<option value="' + codigo + '">' + descripcion + '</option>');
        });

    }).fail(function (data) {
        //console.log(data);
        mensaje("D", 'Error en el servidor.');
    });
}


//function justNumbers(e) {
//    var keynum = window.event ? window.event.keyCode : e.which;
//    if ((keynum == 8) || (keynum == 46))
//        return true;

//    return /\d/.test(String.fromCharCode(keynum));
//}
function limpiar() {
    txtnmrConsultas.val('0');
}


$('#btnVerDetalle').click(function () {


    if (txtidmedico.val() == "") {
        mensaje("W", "Seleccione un médico asociado");
        return;
    }
    else {
        $('#modalHorariosDetalle').modal('show');
        //document.querySelector('#lblNombreMedico').innerText = 'Tu Valor';
        //document.getElementById('lblNombreMedico').value = 'Hello World!';
        // $('#lblNombreMedico').val(txtMedico.val());
        //alert(moment(dtpInicio.val()).format('DD/MM/YYYY'));

        cargarActividadesMedicoxDia(txtidmedico.val(), dtpInicio.val());
    }

});