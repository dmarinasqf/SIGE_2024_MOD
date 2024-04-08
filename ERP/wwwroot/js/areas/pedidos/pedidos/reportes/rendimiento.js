var cmbsucursal = document.getElementById('cmbsucursal');

var txtfecharango = document.getElementById('txtfecharango');
var txtnombresmedico = document.getElementById('txtnombresmedico');
var txtnumdocumentomedico = document.getElementById('txtnumdocumentomedico');

var btnbuscarMedico = document.getElementById('btnbuscarMedico');

BuscarPedidoCompleto
var tblReporte;
var lista;
 
$(document).ready(function () {

    MMfnbuscarmedicos();
    getReporteGeneral();
    
    if (cmbsucursal.getAttribute('tipo') == 'select')
        fnListarSucursales();
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

function fnListarSucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('cmbsucursal', IDSUCURSAL, null, true);
}

function getReporteGeneral() {

    var url = ORIGEN + '/Pedidos/Reporte/GetReporteRendimiento';

    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        medico: $('#txtnumdocumentomedico').val(),
        sucursal: cmbsucursal.value,
        top: 1000
    };
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
function limpiarTablas() {
    $("#tabla").empty();
    var tabla = ' <table class="table table-sm" id="tblReportes" >' +
        '<thead class="thead-dark" style="font-size:10px">' +
        '</thead>' +
        ' <tbody style="font-size:10px"></tbody>' +
        '</table>';
    $("#tabla").append(tabla);
}

$("#btnExportar").click(function () {

    descargarReporte();

});
function descargarReporte() {


    var url = ORIGEN + '/Pedidos/Reporte/GetReporteRendimiento';

    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }

    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        medico: txtnumdocumentomedico.val(),
        sucursal: cmbsucursal.value,
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

//btnbuscarMedico.click(function (e) {
//    $('#modalmedico').modal('show');
//    txtnombresmedico.val('');
//});

btnbuscarMedico.addEventListener('click', function () {
    $('#modalmedico').modal('show');
});
function MMfnbuscarmedicos(numpagina, tamanopagina) {
    var obj = {
        pagine: {
            numpagina: numpagina ?? 1,
            tamanopagina: tamanopagina ?? 10,
        },
        filtro: MMtxtfiltro.value.trim(),
        top: 100,
        colegio: MMcmbtipodocmedico.value
    };
    let controller = new MedicoController();
    controller.BuscarMedicos(obj, function (response) {

        var fila = '';
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
            fila += '<tr id="' + data[i].idmedico + '">';
            fila += '<td>' + '<button class="btn-success MMbtnpasarmedico" id="' + data[i].idmedico + '"><i class="fas fa-check "></i></button>' + '</td>';
            fila += '<td class="colegio">' + (data[i].colegio ?? '') + '</td>';
            fila += '<td class="numCol">' + data[i].colegiatura + '</td>';
            fila += '<td class="nombre">' + data[i].nombres + ' ' + data[i].apepaterno + ' ' + data[i].apematerno + '</td>';
            fila += '<td>' + data[i].especialidad + '</td>';
            fila += '</tr>';
        }
        MMtbodymedicos.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'MMclinkpage', 'MMpaginacion');
    });

}


 $(document).on('click', '.MMbtnpasarmedico', function () {
     var fila = this.parentNode.parentNode;
     console.log(fila);
     txtidmedico.value = this.getAttribute('id');
     txtnumdocumentomedico.val(columna.getElementsByClassName('numCol')[0].innerText);
     txtnombresmedico.val(columna.getElementsByClassName('nombre')[0].innerText);

    $('#modalmedico').modal('hide');
});
