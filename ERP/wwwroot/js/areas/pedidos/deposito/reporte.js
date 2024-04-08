var txtfecharango = document.getElementById('txtfecharango');

var btnConsultar = document.getElementById('btnConsultar');
var btnExportar = document.getElementById('btnExportar');

var tblReporte;
var lista;

$(document).ready(function () {
    getReporteGeneral();
});

$("#btnExportar").click(function () {

    descargarReporte();

});

function iniciarTabla() {
    try {
         tblReporte.DataTable().clear().destroy(); 
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

    var url = ORIGEN + '/Pedidos/Reporte/GetReporteDeposito';

    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        tipo: 'CONSULTA',
        top: 1000
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
        DESBLOQUEARCONTENIDO('cardacciones');
        var datos = data;
        if (datos.length != 0) {
            crearCabeceras(datos, '#tblReportes');
            crearCuerpo(datos, '#tblReportes');
            //iniciarTabla();
            tblReporte=$('#tblReportes').DataTable({});

        }else {
            mensaje('I', 'No hay datos en la consulta');
        }

        $('#btnConsultar').prop('disabled', false);
    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');
        mensajeError(data);
    });
}

function descargarReporte() {

    var url = ORIGEN + '/Pedidos/Reporte/GetReporteDeposito';

    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }

    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        tipo: 'CONSULTA',
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