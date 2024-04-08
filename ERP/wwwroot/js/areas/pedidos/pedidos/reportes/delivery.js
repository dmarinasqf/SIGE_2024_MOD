

var tblReporte;
var lista;
var txtfechainicio = '';
var txtfechafin = '';
var spiner = $('#spinners');
var checkencomienda = $('#checkencomienda');


$(document).ready(function () {
    getReporteGeneral();
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


$('input[id="txtfecharango"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    txtfechainicio = picker.startDate.format('DD/MM/YYYY');
    txtfechafin = picker.endDate.format('DD/MM/YYYY');
});
$('input[id="txtfecharango"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
    txtfechainicio = "";
    txtfechafin = "";
});


function getReporteGeneral() {
    $('#btnConsultar').prop('disabled', true);
    spiner.removeClass('mostrar');
    var url = '/Pedidos/Reporte/GetReporteDelivery';
    if (txtfechainicio.length == 0) {
        txtfechainicio = moment().format('DD/MM/YYYY');
        txtfechafin = moment().format('DD/MM/YYYY');
    }
    var data = {
        fechainicio: txtfechainicio,
        fechafin: txtfechafin,
        encomienda: checkencomienda.prop('checked')
    };
    try {
        tblReporte.clear().draw();

    } catch (e) {
        console.log("x.x");
    }

    limpiarTablas();
    $.post(url, data).done(function (data) {
        spiner.addClass('mostrar');
        var datos = data;
        if (datos.length != 0) {
            console.log(datos);
            lista = datos;
            crearCabecerasDelivery(datos);
            crearCuerpoDelivery(datos);
            iniciarTabla();
            $('#numRegistros').text(datos.length);
        }
        else {
            mensaje('I', 'No hay datos en la consulta');
            $('#numRegistros').text("0");
        }

        $('#btnConsultar').prop('disabled', false);
    }).fail(function (data) {
        console.log(data);
        mensaje("W", "El numero de datos consultados ha execido la memoria, reduzca el rango de fecha.");
        $('#btnConsultar').prop('disabled', false);
        spiner.addClass('mostrar');
    });
}
function limpiarTablas() {
    $("#tabla").empty();
    var tabla = ' <table class="table table-sm" id="tblReportes" width="100%">' +
        '<thead class="thead-dark" style="font-size:10px">' +
        '</thead>' +
        ' <tbody style="font-size:10px"></tbody>' +
        '</table>';
    $("#tabla").append(tabla);
}
function crearCabecerasDelivery(datos) {
    var cabeceras = GetHeaders(datos);
    var tabla = $("#tblReportes thead");
    var nuevaFila = "<tr>";
    for (var i = 0; i < cabeceras.length; i++) {
        nuevaFila += "<th>" + cabeceras[i] + "</th>";
    }
    nuevaFila += "</tr>";
    $("#tblReportes thead").append(nuevaFila);
}
function crearCuerpoDelivery(datos) {
    var fila = "";
    var cabeceras = GetHeaders(datos);
    for (var i = 0; i < datos.length; i++) {
        fila += '<tr>';
        var valores = GetValores(datos[i]);
        for (var j = 0; j < valores.length; j++) {
            if (cabeceras[j] == "PRODUCTO" || cabeceras[j] == "DETALLE PEDIDO") {
                fila += "<td>" + '<div style="width:200px;word-wrap: break-word; word-break:break-all">' + valores[j] + '</div>', + "</td>";
            } else
                fila += "<td>" + valores[j] + "</td>";
        }
        fila += '</tr>';
    }
    $("#tblReportes tbody").append(fila);
}

function GetHeaders(obj) {
    var cols = new Array();
    var p = obj[0];
    for (var key in p) {
        cols.push(key);
    }
    return cols;
}
function GetValores(obj) {
    var cols = new Array();
    for (var key in obj) {
        cols.push(obj[key]);
    }
    return cols;
}


$("#btnExportar").click(function () {

    descargarReporte();

});
function descargarReporte() {
    spiner.removeClass('mostrar');
    $('#btnExportar').prop('disabled', true);
    var url = '/Pedidos/Reporte/GetReporteDelivery';

    if (txtfechainicio.length == 0) {
        txtfechainicio = moment().format('DD/MM/YYYY');
        txtfechafin = moment().format('DD/MM/YYYY');
    }

    var data = {
        fechainicio: txtfechainicio,
        fechafin: txtfechafin,
        encomienda: checkencomienda.prop('checked'),
        tipo: 'EXPORTACION'
    };
    $.post(url, data).done(function (data) {
        spiner.addClass('mostrar');
        var url = location.origin.toString();
        location.href = ORIGEN + data.objeto;
        $('#btnExportar').prop('disabled', false);
    }).fail(function (data) {
        console.log(data);
        mensaje("W", "El numero de datos consultados ha execido la memoria, reduzca el rango de fecha.");
        $('#btnExportar').prop('disabled', false);
        spiner.addClass('mostrar');
    });
}