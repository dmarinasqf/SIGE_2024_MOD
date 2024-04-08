var lblpedidoruta = $('#lblpedidoruta');
var lblpedidoentregado = $('#lblpedidoentregado');
var lblpedidototal = $('#lblpedidototal');


var pb_sucursal = $('#pb_sucursal');
var pb_cmbtipoentrega = $('#pb_cmbtipoentrega');
var pb_estadoentrega = $('#pb_estadoentrega');
var tblreporte;
var totalseleccionados = 0;
var listaselecciones = [];

$(document).ready(function () {
    listarreporte();
    fnlistarsucursales();

});
function fnlistarsucursales() {
    for (var i = 0; i < _SUCURSALES.length; i++) {
        pb_sucursal.append('<option value="' + _SUCURSALES[i].idsucursal + '">' + _SUCURSALES[i].descripcion + '</option>');
    }
}
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
function listarreporte() {

    $('#btnConsultar').prop('disabled', true);

    var url = ORIGEN + '/Pedidos/Delivery/GetReporteAsignacion';
    var obj = {
        sucursal: pb_sucursal.val(),
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        estado: pb_estadoentrega.val(),
        tipoentrega: pb_cmbtipoentrega.val(),
    };
    limpiarTablas();
    BLOQUEARCONTENIDO('cardacciones', 'Consultando reporte ...');
    $.post(url, obj).done(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');
        $('#btnConsultar').prop('disabled', false);
       
        if (data.length > 0) {
          
            crearCabeceras(data, '#tblReportes');
            //crearCuerpo(data, '#tblReportes');
            iniciarTabla();
            agregarFilas(data);
            tblReporte.columns.adjust().draw();
        }
      

    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');
        $('#btnConsultar').prop('disabled', false);

    });
}

$('#btnConsultar').click(function (e) {
    listarreporte();
});
function limpiarTablas() {
    $("#tabla").empty();
    var tabla = ' <table class="table table-sm table-bordered table-striped" id="tblReportes" width="100% ">' +
        '<thead class="thead-dark" style="font-size:10px">' +
        '</thead>' +
        ' <tbody style="font-size:10px"></tbody>' +
        '</table>';
    $("#tabla").append(tabla);
}

function agregarFilas(data) {
    var counterenruta = 0;
    var counterentregado = 0;
    var total = 0;  
    for (var i = 0; i < data.length; i++) {
        var bagdge = '';
        if (data[i]["ESTADO ENTREGA"] === "EN RUTA") {
            bagdge = 'badge badge-primary';
            counterenruta++;
        } else if (data[i]["ESTADO ENTREGA"] === "ENTREGADO") {
            bagdge = 'badge badge-success';
            counterentregado++;
        } else if (data[i]["ESTADO ENTREGA"] === "NO ENTREGADO") {
            bagdge = 'badge badge-danger';
        } else {
            bagdge = 'badge badge-dark';

        }

        tblReporte.row.add([
            data[i]["IDDELIVERY"],
            data[i]["IDPEDIDO"],
            data[i]["FECHA ENTREGA"],
            data[i]["MOTORIZADO"],
            data[i]["PACIENTE"],
            data[i]["CELULAR PACIENTE"],
            data[i]["CLIENTE"],
            data[i]["CELULAR CLIENTE"],
            data[i]["RECOGER EN"],
            data[i]["DIRECCIÓN ENTREGA"],
            data[i]["DISTRITO"],
            data[i]["REFERENCIA1"],
            data[i]["REFERENCIA2"],
            '<span class="' + bagdge + ' estado"  style="font-size:10px">' + data[i]["ESTADO ENTREGA"] + '</span>',
            data[i]["HORA ENTREGA"],
            data[i]["OBSERVACION"]
            //controles


        ]).draw(false)
        tblReporte.columns.adjust().draw();
    }
    lblpedidoentregado.text(counterentregado);
    lblpedidoruta.text(counterenruta);
    lblpedidototal.text(counterentregado + counterenruta);
}

$("#btnExportar").click(function () {
    descargarReporte();
});
function descargarReporte() {
    $("#btnExportar").prop('disabled', true);
    var a = document.createElement('a');
    var parametros = 'sucursal=' + pb_sucursal.val() + '&&fechainicio=' + FECHAINICIO.replaceAll('/', '-') +
        '&&fechafin=' + FECHAFIN.replaceAll('/', '-') + '&&estado=' + pb_estadoentrega.val();
    a.href = ORIGEN + '/Pedidos/Delivery/DescargarReporteAsignacion?' + parametros;
    a.download = true;
    a.click();
    setTimeout(() => { $("#btnExportar").prop('disabled', false); }, 5000);
}