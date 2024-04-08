
var btnbuscarrepmedico = document.getElementById('btnbuscarrepmedico');
var lblnombremedico = document.getElementById('lblnombremedico');
var txtidrepmedico = document.getElementById('txtidrepmedico');

var operacion = $('#TIPOOPERACION');

//variables de fullcalendar
var ultimaFecha;
var ultimaVista;
$(document).ready(function () {
    MMfnlistarRepresentanteMedico('REP.MEDICO');
});
btnbuscarrepmedico.addEventListener('click', function () {
    $('#modalempleadosxcargo').modal('show');
});
$(document).on('click', '.btnselectempleadoxcargo', function () {
    var fila = this.parentNode.parentNode;
    lblnombremedico.innerText = ' => ' + fila.getElementsByClassName('documento')[0].innerText + ' - ' + fila.getElementsByClassName('nombres')[0].innerText;
    txtidrepmedico.value = fila.getAttribute('id');
    $('#modalempleadosxcargo').modal('hide');
    fncargarActividades();

});


//HORARIOS DE VISITADORES
function fncargarActividades() {

    var actividad = [];
    var obj = {
        idrepresentante: txtidrepmedico.value.trim()
    };
    let controller = new VisitaMedicaController();
    BLOQUEARCONTENIDO('cardbody', 'Buscando..');
    controller.ListarVisitasMedicas(obj, (data) => {
        var cardcolor;
        datos = (data);      
        for (var i = 0; i < datos.length; i++) {


            if (datos[i]["VISITA"] == 'SI')
                cardcolor = 'green';
            if (datos[i]["VISITA"] == 'NO')
                cardcolor = '#F02424';
            if (datos[i]["VISITA"] == '') {
                if (datos[i]["TURNO"] == 'MAÑANA')
                    cardcolor = '#2E90C8';
                if (datos[i]["TURNO"] == 'TARDE')
                    cardcolor = '#0057ad';
            }
            if (datos[i]["ESTADOVISITA"] == "REPROGRAMADA")
                cardcolor = '#FFB233';
            //#FFB233 

            actividad.push({
                horarioCodigo: datos[i]["IDHORARIO"],
                title: datos[i]["TURNO"] + ' \n ' + 'Médico : ' + datos[i]["MEDICO"],
                description: "Trabajo",
                start: moment(datos[i]["HORAI"]),
                end: datos[i]["HORAF"] != null ? moment(datos[i]["HORAF"]) : null,
                color: cardcolor,
                allDay: false,
                codigoObjetivo: datos[i]["IDOBJETIVO"],
                descripcionObjetivo: datos[i]["OBJETIVO"],
                turnoCodigo: datos[i]["IDTURNO"],
                medicoCodigo: datos[i]["IDMEDICO"],
                codigoColegiatura: datos[i]["CMP"],
                nombreMedico: datos[i]["MEDICO"],
                codigoEmpleado: datos[i]["IDEMPLEADO"],
                nombreEmpleado: datos[i]["EMPLEADO"],
                iddiagnostico: datos[i]["IDDIAGNOSTICO"],
                diagnostico: datos[i]["DIAGNOSTICO"],
                detallevisita: datos[i]["DETALLEVISITA"],
                visita: datos[i]["VISITA"],
                detallenovisita: datos[i]["DETALLENOVISITA"] == "REPROGRAMADA" ? "REPROGRAMADA" : "NO REPROGRAMADA",
                estadovisita: datos[i]["ESTADOVISITA"],
                tipovisita: datos[i]["TIPOVISITA"],
                mediovisita: datos[i]["MEDIOVISITA"],
                observacion: datos[i]["OBSERVACION"],
                textColor: '#FFF'
            });
        }

        ultimaVista = $('#calender').fullCalendar('getView');
        if (ultimaVista.name == undefined) {
            ultimaVista.name = 'month';
        }

        fnGenerateCalendar(actividad);
        DESBLOQUEARCONTENIDO('cardbody');
    });


}
function fnGenerateCalendar(actividad) {
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
        //displayEventEnd: true,
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
            fnmostrardatafullcalendar(calEvent, jsEvent, view);
        },
        selectable: true,
        select: function (start, end) {
            selectedEvent = {
                horarioCodigo: 0,
                title: 'Registro de visita',
                start: start,
                end: end,
                color: 'green',
                allDay: false,
                codigoObjetivo: 0,
                descripcionObjetivo: '',
                turnoCodigo: 0,
                codigoMedico: '',
                codigoColegiatura: '',
                nombreMedico: '',
                codigoEmpleado: '',
                nombreEmpleado: '',
                iddiagnostico: '1',
                diagnostico: '',
                visita: '',
                detallenovisita: '',
                detallevisita: '',
                estadovisita: '',
                tipovisita: '',
                mediovisita: '',
                observacion: '',

            };
            operacion.val('NUEVO');
            fnEditarHorarioActividad();
            $('#calendar').fullCalendar('unselect');
        },
        editable: false

    });

}

$('#modalregistrovisita').on('show.bs.modal', function (e) {

    document.getElementById('btnGuardar').style.display = 'inline';
    document.getElementById('btnDelete').style.display = 'inline';
    document.getElementById("cboTurno").disabled = false;
    dtpInicio.prop("disabled", true);
    var fechaIni = moment(dtpInicio.val()).format("DD/MM/YYYY");
    verificarvisita();
    if (operacion.val() == "NUEVO") {

        cboObjetivo.prop("disabled", false);
        $('#div_reprogramar').addClass("ocultar");
        fnlistarobjetivos(fechaIni, fechaIni, operacion.val(), 0);
        dtpInicioh.prop("disabled", true);
        dtpFinh.prop("disabled", true);
        document.getElementById('btnDelete').style.display = 'none';
        des_habilitar(true);
        btn_bloqueo.removeClass("ocultar");
    }
    else if (operacion.val() == "EDITAR") {     
        btnBuscarMedico.prop("disabled", true);
        dtpInicioh.prop("disabled", true);
        dtpFinh.prop("disabled", true);
        document.getElementById("cboTurno").disabled = true;
        des_habilitar(false);
        btn_bloqueo.addClass("ocultar");
        $('#div_reprogramar').removeClass("ocultar");
    }

});