
var tblreporte;
var cmbestado = $('#cmbestado');
var spiner = $('#spinners');
//Medico
var txtidMedico = $('#txtidMedico');
var txtnombremedico = $('#txtnombremedico');
//REP. MEDICO
var txtidEmpleadoRM = $('#txtidEmpleadoRM');
var txtrepresentante = $('#txtrepresentante');

var btnexportar = document.getElementById('btnExportar');
var btnconsultar = document.getElementById('btnConsultar');
var btnbuscarrepresentante = document.getElementById('btnbuscarrepresentante');
var btnbuscarmedico = document.getElementById('btnbuscarmedico');

$(document).ready(function () {
    MMfnlistarRepresentanteMedico('REP.MEDICO');
});

function iniciarTabla() {
    tblreporte = $('#tblreporte').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}
function fngetreporte() {

    var url = ORIGEN + '/VisitadorMedico/Reporte/GetReporteFormulasXMedico';
    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        idrepresentante: txtidEmpleadoRM.val(),
        top: 1000,
        medico: txtidMedico.val()
    };

    BLOQUEARCONTENIDO('contenedor', 'Buscando ...');
    $.post(url, data).done(function (data) {
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x"); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('contenedor');
        mensajeError("D", data);

    });
}



btnexportar.addEventListener('click', function () {

    var url = ORIGEN + '/VisitadorMedico/Reporte/GetReporteFormulasXMedico';
    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        idrepresentante: txtidEmpleadoRM.val(),
        top: 999999,
        medico: txtidMedico.val()
    };

    $.post(url, data).done(function (data) {
        if (data.mensaje === 'ok') {
            location.href = ORIGEN + data.objeto;
        }
        else
            mensaje('W', data.mensaje);
    }).fail(function (data) {
        mensajeError("D", data);
    });
});
btnconsultar.addEventListener('click', function () {
    fngetreporte();
});
$(document).on('click', '.btnselectempleadoxcargo', function () {
    var fila = this.parentNode.parentNode;
    txtrepresentante.val(fila.getElementsByClassName('documento')[0].innerText + ' - ' + fila.getElementsByClassName('nombres')[0].innerText);
    txtidEmpleadoRM.val(fila.getAttribute('id'));
    $('#modalempleadosxcargo').modal('hide');
    //fnbuscarmedicosderepresentante();

});
$(document).on('click', '.MMbtnpasarmedico', function () {
    var columna = this.parentNode.parentNode;
    txtidMedico.val(columna.getAttribute('idmedico'));
    txtnombremedico.val(columna.getElementsByTagName('td')[1].innerText);
    $('#modalmedicosrepmedico').modal('hide');

});
btnbuscarrepresentante.addEventListener('click', function () {
    $('#modalempleadosxcargo').modal('show');

});
btnbuscarmedico.addEventListener('click', function () {
    MMRtxtidrepmedico.value = txtidEmpleadoRM.val();
    MMRfnbuscarmedicos();
    $('#modalmedicosrepmedico').modal('show');
});
function limpiar() {

    txtnombremedico.val('');
    txtidMedico.val('');
    txtidEmpleadoRM.val('');
    txtrepresentante.val('');

}