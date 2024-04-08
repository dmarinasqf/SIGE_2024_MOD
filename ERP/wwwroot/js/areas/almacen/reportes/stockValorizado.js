
var tblreporte;
var tbllista;
var txtsucursal = document.getElementById('txtsucursal');
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
$(document).ready(function () {

    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": true,
        info: false,
        paging: true,
        //pageLength: [15]
    });

    let controller = new LaboratorioController();
    var fn = controller.BuscarLaboratoriosSelect2();
    $('#cmblaboratorio').select2({
        allowClear: true,
        dropdownParent: $('#select2-parent'),
        ajax: fn
    })
    fnGetHistorial();
    //fngetreporte();
    if (txtsucursal.getAttribute('tipo') == 'select') {
        let controller = new SucursalController();
        controller.ListarSucursalxEmpresaEnCombo('txtsucursal',null,null,null,true);
    }
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
function fngetreporte(top) {
  
    var obj = {
    
        sucursal: txtsucursal.value
    };
    BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
    let controller = new StockController();
    controller.ReporteStock(obj, function (data) {
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x"); }        
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false,12);       
        crearCuerpo(data, '#tblreporte',12);
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    });
}


function fnGetHistorial() {

    tbllista.clear().draw();
    // Limpiar el contador de registros
    $('#numRegistros').text('0');
    var obj = {
        //producto: txtproducto.value,
        //top: top,
        sucursal: txtsucursal.value
        /*   laboratorio: $('#cmblaboratorio').val().join('|')*/
    };

    var url = ORIGEN + "/Almacen/AReporte/stockvalorizadoListar";

    BLOQUEARCONTENIDO('cardreport', 'Buscando ..');

    $.post(url, obj).done(function (data) {
        if (data && data.rows && data.rows.length > 0) {
            agregarFila(data.rows);
            $('#numRegistros').text(data.rows.length);
        } else {
            mensaje('I', 'No hay datos en la consulta');
        }

        DESBLOQUEARCONTENIDO('cardreport');
    }).fail(function () {
        DESBLOQUEARCONTENIDO('cardreport');

    });
}





function agregarFila(data) {
    var rows = [];
    for (var i = 0; i < data.length; i++) {
        // Create the row
        var fila = [
            data[i][0],
            data[i][1], // NUNDOCUMENTO
            data[i][2], // SUCURSAL
            data[i][3], // FECHA
            data[i][4], // DOC DOCUMENTO
            data[i][5], // CLIENTE 
            data[i][6], // COLEGIATURA
            data[i][7], // MEDICO
            data[i][8], // IMPORTE
            data[i][9],// EFECTIVO


        ];

        rows.push(fila);

    }
    tbllista.rows.add(rows).draw(false);
}



btnexportar.addEventListener('click', function () {
    descargarReporte();
});
btnconsultar.addEventListener('click', function () {
    fnGetHistorial();
});

function descargarReporte() {
    var obj = {
        //producto: txtproducto.value,
        //top: top,
        sucursal: txtsucursal.value
        /*   laboratorio: $('#cmblaboratorio').val().join('|')*/
    };


    var url = ORIGEN + "/Almacen/AReporte/GetEpllusexportarExcel";

    BLOQUEARCONTENIDO('cardreport', 'Descargando ..');


    $.ajax({
        url: url,
        type: 'POST',
        data: obj,
        dataType: 'binary',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data, status, xhr) {
            var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            //link.download = "ReporteBasico.xlsx";
            var now = new Date();
            var formattedDate = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2) + ('0' + now.getHours()).slice(-2) + ('0' + now.getMinutes()).slice(-2);
            link.download = "ReporteStockValorizado" + formattedDate + ".xlsx";

            // Simular el clic en el enlace para descargar el archivo
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            DESBLOQUEARCONTENIDO('cardreport');
            $('#btnexportar').prop('disabled', false);
            mensaje('S', 'Excel Descargado');
        },
        error: function (error) {
            DESBLOQUEARCONTENIDO('cardreport');
            $('#btnexportar').prop('disabled', false);
        }
    });
}
