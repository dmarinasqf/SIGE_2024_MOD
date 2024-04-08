var cmbtiporeporte = document.getElementById('cmbtiporeporte');
var cmblaboratorio = document.getElementById('cmblaboratorio');
var cmbcomplejidad = document.getElementById('cmbcomplejidad');
//var cmbtiporeporte = document.getElementById('cmbtiporeporte');

var txtnumdocumentoempleado = document.getElementById('txtnumdocumentoempleado');
var txtidempleado = document.getElementById('txtidempleado');
var txtnombresempleado = document.getElementById('txtnombresempleado');

var btnbuscarempleado = $('#btnbuscarempleado');

var tblReporte;
var lista;

$(document).ready(function () {
    fnllenarCmbDificultad();
    if (cmblaboratorio.getAttribute('tipo') == 'select')
        fnListarSucursales();
    getReporteGeneral();
});

function fnListarSucursales() {
    let controller = new SucursalController();
    controller.ListarSucursalesByTipoLocal('cmblaboratorio', 'PRODUCCIÓN', true);
    //controller.ListarTodasSucursales('cmblaboratorio', IDSUCURSAL, null, true);
}

function fnllenarCmbDificultad(){
    controller = new DificultadFormulaController();
    controller.LlenarCmbDificultarFormula('cmbcomplejidad', 'HABILITADO');
}

btnbuscarempleado.click(function (e) {
    $('#modalempleados').modal('show');
    txtnombresempleado.value='';
});

$(document).on('click', '.btnpasarempleado', function (e) {
    var fila = this.parentNode.parentNode;
    //console.log(fila);
    //txtidempleado.value = fila.getAttribute('id');
    txtnumdocumentoempleado.value=(fila.getElementsByClassName('numdoc')[0].innerText);
    txtnombresempleado.value=(fila.getElementsByClassName('nombres')[0].innerText);
    $('#modalempleados').modal('hide');
});

function iniciarTabla() {
    try {
        // tblReporte.DataTable().clear().destroy(); 
        //tblReporte = null;
    } catch (e) {
        console.log('x.x');
    }

    tblReporte = $('#tblReportes').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "ordering": false,
        "info": false,
        "scrollX": true,
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
}


function getReporteGeneral() {

    var url = ORIGEN + '/Pedidos/Reporte/GetReportefmComlejidadFormulacion';

    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        formulador: txtnumdocumentoempleado.value,
        laboratorio: String(cmblaboratorio.value),
        complejidad: cmbcomplejidad.value,
        tipoReporte: cmbtiporeporte.value,
        consulta: 'CONSULTA'
    };
    //console.log(data);
    try {
        tblReporte.clear().draw();
    } catch (e) {
        console.log("x.x");
    } 


    limpiarTablas();
    BLOQUEARCONTENIDO('cardacciones', 'Consultando reporte ...');
    $.post(url, data).done(function (data) {
        console.log(data);
        DESBLOQUEARCONTENIDO('cardacciones');
        var datos = data;
        if (datos.length != 0) {
            crearCabeceras(datos, '#tblReportes');
            crearCuerpo(datos, '#tblReportes');
            iniciarTabla();

        }
        else {
            mensaje('I', 'No hay datos en la consulta');
        }

        $('#btnConsultar').prop('disabled', false);
    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');
        mensajeError(data);
    });

}

$("#btnExportar").click(function () {

    descargarReporte();

});
function descargarReporte() {


    var url = ORIGEN + '/Pedidos/Reporte/GetReportefmComlejidadFormulacion';

    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }

    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        formulador: txtnumdocumentoempleado.value,
        sucursal: cmblaboratorio.value,
        complejidad: cmbcomplejidad.value,
        tipo: cmbtiporeporte.value,
        consulta: 'CONSULTA',
        top: 1000000
    };

    BLOQUEARCONTENIDO('cardacciones', 'Descargando reporte ...');
    $.post(url, data).done(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');
        var url = location.origin.toString();
        if (data.mensaje == 'ok')
            location.href = ORIGEN + "/" + data.objeto;
        else
            mensaje('W', data.mensaje);
    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');

        mensajeError(data);
    });
}

function limpiarTablas() {
    $("#tabla").empty();
    var tabla = ' <table class="table table-sm" id="tblReportes" >' +
        '<thead class="thead-dark" style="font-size:10px">' +
        '</thead>' +
        ' <tbody style="font-size:10px"></tbody>' +
        '</table>';
    $("#tabla").append(tabla);
}