var txtdocumento = $('#txtdocumento');
var txtidempleadoRM = $('#txtidempleado');
var txtrepresentante = $('#txtrepresentante');
var txtHorarioCodigo = $('#txthorCodigo');
var txtidmedico = $('#txtidmedico');
var txtCMP = $('#txtcmp');
var txtMedico = $('#txtMedico');
var cboTurno = $('#cboTurno');
var dtpInicio = $('#dtpInicio');
var dtpFinh = $('#dtpFinh');
var dtpInicioh = $('#dtpInicioh');
var dtpFin = $('#dtpFin');
var IDUSUARIO = $('#IDUSUARIO');
var operacion = $('#TIPOOPERACION');
var cboObjetivo = $('#cboObjetivo');
var txtiddiagnostico = $('#txtiddiagnostico');
var txtdiagnostico = $('#txtdiagnostico');
var cbovisita = $('#cbovisita');
var txtdetallevisita = $('#txtdetallevisita');
var txtdetallenovisita = $('#txtdetallenovisita');
var cboestadovisita = $('#cboestadovisita');
var cbotipovisita = $('#cbotipovisita');
var cbomediovisita = $('#cbomediovisita');
var txtobservacion = $('#txtobservacion');

var btnGuardar = $('#btnGuardar');
var btnBuscarMedico = $('#btnBuscarMedicoA');
var btn_bloqueo = $('#btn_bloqueo');
var txtcondicionriesgo = $('#txtcondicionriesgo');

$(document).ready(function () {
    fnmodalinit();
});
function fnmodalinit() {
    for (var i = 0; i < _TURNOS.length; i++) {
        $('#cboTurno').append('<option value="' + _TURNOS[i].tur_codigo + '">'+ _TURNOS[i].descripcion+'</option>');
    }
  
}

function fnmostrardatafullcalendar(calEvent, jsEvent, view) {
    fnlistarobjetivos(calEvent.start.format("DD-MM-YYYY"), calEvent.start.format("DD-MM-YYYY"), 'EDITAR', calEvent.codigoObjetivo);
    selectedEvent = calEvent;

    if (calEvent.turnoCodigo == 1) {
        $('#ModalDetalle #turno').text(calEvent.title.substring(0, 6));
    } else {
        $('#ModalDetalle #turno').text(calEvent.title.substring(0, 5));
    }

    console.log(calEvent);

    txtCMP.val(calEvent.codigoColegiatura);
    txtidmedico.val(calEvent.medicoCodigo);
    txtMedico.val(calEvent.nombreMedico);
    //dtpInicio.val(calEvent.start.format("DD-MMM-YYYY"));
    dtpInicio.val(calEvent.start.format("YYYY-MM-DD"));
    dtpInicioh.val(calEvent.start.format("HH:mm"));
    dtpFinh.val(calEvent.end.format("HH:mm"));
    cboTurno.val(calEvent.turnoCodigo);
    txtCMP.val(calEvent.codigoColegiatura);
    txtHorarioCodigo.val(calEvent.horarioCodigo);
    cbovisita.val(calEvent.visita);
    //calEvent.visita === true ? cbovisita.val("SI") : cbovisita.val("NO");

    txtdetallenovisita.val(calEvent.detallenovisita);
    txtiddiagnostico.val(calEvent.iddiagnostico);
    txtdiagnostico.val(calEvent.diagnostico);
    cboestadovisita.val(calEvent.estadovisita);
    cbotipovisita.val(calEvent.tipovisita);
    fncargarmediovisita(cbotipovisita.val(), calEvent.mediovisita);
    cbomediovisita.val(calEvent.mediovisita);

    if (calEvent.observacion != '') {
        $("#cbovisita").val("SI");
        document.getElementById('div_descripcionvisita').style.display = 'inline';
        document.getElementById('div_descripcion_novisita').style.display = 'none';
    }

    txtdetallevisita.val(calEvent.detallevisita);
    txtobservacion.val(calEvent.observacion);
    operacion.val('EDITAR');
    $('#modalregistrovisita').modal();
}
function fnlistarobjetivos(fechaInicial, fechaFinal, opc, codigoObjetivo) {
    let controller = new ObjetivoController();
    var obj = {
        fechaInicio: fechaInicial,
        fechaFin: fechaFinal
    };
    controller.ListarObjetivos(obj, function (data) {
        $('#cboObjetivo option').remove();
        $('#cboObjetivo').append('<option value="">- SELECCIONE -</option>');
        $(data).each(function (i, e) {
            codigo = [e.objrepm_codigo];
            descripcion = [e.descripcion];
            $('#cboObjetivo').append('<option value="' + codigo + '">' + descripcion + '</option>');
        });
        if (opc == 'EDITAR') {
            cboObjetivo.val(codigoObjetivo);
        }
    })
}

function fncargarmediovisita(tipo, medio) {
  
    if (tipo == "PRESENCIAL") {
        $('#cbomediovisita option').remove();
        $('#cbomediovisita').append('<option value="">[SELECCIONE]</option>');
        $('#cbomediovisita').append('<option value="INSTITUCIÓN">INSTITUCIÓN</option>');
        $('#cbomediovisita').append('<option value="CONSULTORIO">CONSULTORIO</option>');
        $('#cbomediovisita').append('<option value="CASA">CASA</option>');
        $('#cbomediovisita').append('<option value="FARMACIA">FARMACIA</option>');
    } else if (tipo == "ONLINE") {
        $('#cbomediovisita option').remove();
        $('#cbomediovisita').append('<option value="">[SELECCIONE]</option>');
        $('#cbomediovisita').append('<option value="REDES SOCIALES">REDES SOCIALES</option>');
        $('#cbomediovisita').append('<option value="ZOOM">ZOOM</option>');
        $('#cbomediovisita').append('<option value="LLAMADA">LLAMADA</option>');
    }
    else {
        $('#cbomediovisita option').remove();
        $('#cbomediovisita').append('<option value="">[SELECCIONE]</option>');
    }
    cbomediovisita.val(medio);
}
function fnEditarHorarioActividad() {
    limpiar();
    if (selectedEvent != null) {
        cboObjetivo.val(selectedEvent.codigoObjetivo);
        $('#modalregistrovisita #turno').text(selectedEvent.title);
        txtCMP.val(selectedEvent.codigoColegiatura);
        txtMedico.val(selectedEvent.nombreMedico);
        txtidmedico.val(selectedEvent.codigoMedico);
        //dtpInicio.val(selectedEvent.start.format("DD-MMM-YYYY"));       
        dtpInicio.val(selectedEvent.start.format("YYYY-MM-DD"));
        dtpInicioh.val(selectedEvent.start.format("HH:mm"));
        dtpFinh.val(selectedEvent.end.format("HH:mm"));
        cboTurno.val(selectedEvent.turnoCodigo);
        txtiddiagnostico.val(selectedEvent.iddiagnostico);
        txtdiagnostico.val(selectedEvent.diagnostico);
        cbovisita.val(selectedEvent.visita);
        txtdetallevisita.val(selectedEvent.detallevisita);
        txtdetallenovisita.val(selectedEvent.detallenovisita);
        cbotipovisita.val(selectedEvent.tipovisita);
        fncargarmediovisita(cbotipovisita.val(), selectedEvent.mediovisita)
        //cbomediovisita.val(selectedEvent.mediovisita);
        txtobservacion.val(selectedEvent.observacion);
    }
    $('#modalregistrovisita').modal('show');

}
$('#cbotipovisita').change(function () {
    fncargarmediovisita(cbotipovisita.val(), '');

});

dtpInicioh.on('change.datetimepicker', function (e) {
    limpiarMedico();
});
dtpFinh.on('change.datetimepicker', function (e) {
    limpiarMedico();
});

$('#cboTurno').change(function () {

    if (operacion.val() == "EDITAR") {
        cambiarFechasxTurno($("#cboTurno option:selected").text());
    }
    else if (operacion.val() == "NUEVO") {
        cambiarFechasxTurno($("#cboTurno option:selected").text());
        limpiarMedico();

    }
});
function limpiarMedico() {
    txtCMP.val('');
    txtidmedico.val('');
    txtMedico.val('');
}
//limpia los contenedores generales
function limpiar() {
    txtidmedico.val('');
    txtCMP.val('');
    txtMedico.val('');
    cboTurno.val('');
    dtpInicio.val('');
    dtpInicioh.val('');
    dtpFinh.val('');
    txtHorarioCodigo.val('');
    txtdetallevisita.val('');
}

cbovisita.change(function () {
    verificarvisita();
});
$('#btnBuscarMedicoA').click(function () {
    MMRtxtidrepmedico.value = txtidrepmedico.value;
    MMRfnbuscarmedicos();
    $('#modalmedicosrepmedico').modal('show');
});
function verificarvisita() {
    if (cbovisita.val() === "SI") {
        document.getElementById('div_descripcionvisita').style.display = 'inline';
        document.getElementById('div_descripcion_novisita').style.display = 'none';
    }
    else if (cbovisita.val() === "NO") {
        //cbovisita.val("NO");
        document.getElementById('div_descripcion_novisita').style.display = 'inline';
        document.getElementById('div_descripcionvisita').style.display = 'none';
    } else {
        document.getElementById('div_descripcion_novisita').style.display = 'none';
        document.getElementById('div_descripcionvisita').style.display = 'none';
    }

}
//diagnosticos
$('#btnBuscardiagnostico').click(function () {
    $('#modaldiagnosticos').modal('show');
});
$(document).on('click', '.MMbtnpasarmedico', function (e) {
    var columna = this.parentNode.parentNode;
    txtidmedico.val(columna.getAttribute('idmedico'));
    txtMedico.val(columna.getElementsByTagName('td')[1].innerText);
    txtCMP.val(columna.getElementsByTagName('td')[0].innerText);
    $('#modalmedicosrepmedico').modal('hide');
});
function cambiarcondicionregistro(btn) {

    if ($(btn).hasClass('btn-success')) {
        $(btn).removeClass('btn-success');
        $(btn).addClass('btn-danger');
        des_habilitar(true);
    } else {
        $(btn).removeClass('btn-danger');
        $(btn).addClass('btn-success');
        des_habilitar(false);
    }
}

function des_habilitar(data) {
    txtdetallenovisita.prop("disabled", data);
    txtdetallevisita.prop("disabled", data);
    cbovisita.prop("disabled", data);
    cboestadovisita.prop("disabled", data);
    txtobservacion.prop("disabled", data);
}

cboestadovisita.change(function () {
    if (cboestadovisita.val() == "REPROGRAMADA")
        des_habilitarFechas(false);
    else {
        des_habilitarFechas(true);
    }

});
function des_habilitarFechas(data) {
    cboTurno.prop("disabled", data);
    dtpInicioh.prop("disabled", data);
    dtpFinh.prop("disabled", data);
    dtpInicio.prop("disabled", data);
}
function CambiarFechaEdicion() {
    setHoras(true);
    cboTurno.prop("disabled", false);
}
function cambiarFechasxTurno(turno) {
    ListarRegistrosRMxDia(txtidrepmedico.value, moment(dtpInicio.val()).format('DD/MM/YYYY'), turno);
}
function ListarRegistrosRMxDia(codigoRepMed, fecha, turno) {

    var fechaI;
    var fechaF;
    //var horasDiferencia = fecha2.getHours() - fecha1.getHours();
    var obj = {
        idrepresentante: codigoRepMed,
        fecha: fecha
    };
    let controller = new VisitaMedicaController();
    controller.ListarRegistrosConsultorioxDia(obj, (data)=> {
        FechasIniciales = [];
        FechasFinales = [];
        //Asigno las horas a los vectores según la logica de negocio
        if (turno == 'MAÑANA') {
            FechasIniciales.push(0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23);
            FechasFinales.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23);
        }
        else if (turno == 'TARDE') {
            FechasIniciales.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23);
            FechasFinales.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 22, 23);
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
        if (turno == "MAÑANA" || turno == "TARDE") {
            if (FechasIniciales.length == 24) {
                setHoras(true);
            }
            else {
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
                setHoras(false)
            }
        } else
            setHoras(true)
    });
    
   
}
function setHoras(data) {
    //Activar horas y el botón de búsqueda
    dtpInicioh.val('0:00');
    dtpFinh.val('0:00');
    dtpInicioh.prop("disabled", data);
    dtpFinh.prop("disabled", data);
    btnBuscarMedico.prop("disabled", data);
}
function registrarActividad() {
    if (cboObjetivo.val() == "") {
        mensaje("W", "Seleccione un OBJETIVO");
        return;
    }
    if (cbotipovisita.val() == "") {
        mensaje("W", "Seleccione un tipo de visita");
        return;
    }
    if (cbomediovisita.val() == "") {
        mensaje("W", "Seleccione un medio de visita");
        return;
    }
    if (cboTurno.val() == "0") {
        mensaje("W", "Seleccione un turno válido");
        return;
    }

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

        mensaje("W", "La hora inicial debe ser menor a la hora final y además diferentes");
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
    if (operacion.val() == "EDITAR" && txtdetallevisita.val().length == 0 && cbovisita.val() === "SI") {
        mensaje("W", "Describa lo que desarrollo en la visita médica");
        return;
    }
    if (operacion.val() == "EDITAR" && txtdetallenovisita.val().length == 0 && cbovisita.val() === "NO") {
        mensaje("W", "Describa el motivo, por el que no se realizó la visita");
        return;
    }

    fechaInicioS = dtpInicio.val().toString() + ' ' + dtpInicioh.val().toString();
    fechaFinS = dtpInicio.val().toString() + ' ' + dtpFinh.val().toString();
    var horario = {
        hvm_codigo: txtHorarioCodigo.val(),
        horaInicio: fechaInicioS,
        horaFin: fechaFinS,
        descripcion: txtdetallevisita.val(),
        med_codigo: txtidmedico.val(),
        emp_codigo: txtidrepmedico.value,
        estado: 'HABILITADO',
        tur_codigo: cboTurno.val(),
        objrepm_codigo: cboObjetivo.val(),
        visita: cbovisita.val() === "SI" ? true : false,
        detallenovisita: txtdetallenovisita.val(),
        iddiagnostico: txtiddiagnostico.val() == '0' ? 1 : txtiddiagnostico.val(),
        estadovisita: cboestadovisita.val(),
        tipovisita: cbotipovisita.val(),
        mediovisita: cbomediovisita.val(),
        observacion: txtobservacion.val()
    };
    ultimaFecha = moment(dtpInicio.val()).format('DD-MMM-YYYY');
    var obj = { horario: horario };
    let controller = new VisitaMedicaController();
    controller.RegistrarEditarVisita(obj, () => {
        $("#btnGuardar").prop("disabled", false);
        $('#ModalDetalle').modal('hide');
        fncargarActividades(txtidrepmedico.value, '');
        limpiar();
    }, () => { $("#btnGuardar").prop("disabled", false); })     ;
  
}