
var btnbusqueda = document.getElementById("btnbusqueda");
var txtidsucursal = document.getElementById("txtidsucursal");
var txtfechainicio = document.getElementById("txtfechainicio");
var txtfechafin = document.getElementById("txtfechafin");
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
var tbllista;

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: true,
        info: false,
        "language": LENGUAJEDATATABLE(),
        "scrollX": true,
        /*dom: 'Bfrtip',*/
        //buttons: [
        //    'excel'
        //]
    });
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('txtidsucursal', 'LOCAL', null, null, true);

    fnGetHistorial();
});




//btnbusqueda.addEventListener('click', function () {
//    var obj = {
//        idsucursal: txtidsucursal.value,
//        fechainicio: txtfechainicio.value,
//        fechafin: txtfechafin.value
//    }
//    BLOQUEARCONTENIDO('tbllista', 'Cargando...');
//    let controller = new CajaVentasController();
//    controller.ListarCuadreCajeLocales(obj, function (data) {
//        tbllista.clear().draw(false);
//        var data = JSON.parse(data);
//        for (var i = 0; i < data.length; i++) {
//            var totalDeposito = parseFloat(data[i]["DEPOSITO AL BANCO"] + data[i]["TRANSFERENCIA DEPOSITO"] + data[i]["TRANSFERENCIA YAPE"] + data[i]["TRANSFERENCIA PLIN"] + data[i]["PAGO QR"] + data[i]["PAGO POR LINK"]).toFixed(2);
//            var diferenciaDeposito = parseFloat(totalDeposito - (-data[i]["MONTO"])).toFixed(2);
//            var fechadeposito = "";
//            if (data[i]["FECHA DEPOSITO"] != "1900-01-01T00:00:00")
//                fechadeposito = moment(data[i]["FECHA DEPOSITO"]).format('DD-MM-YYYY');

//            var depositoalbanco = "";
//            if (data[i]["DEPOSITO AL BANCO"] != 0)
//                depositoalbanco = data[i]["DEPOSITO AL BANCO"];
//            tbllista.row.add([
//                data[i]["SUCURSAL"],
//                moment(data[i]["FECHA VENTA"]).format('DD-MM-YYYY'),
//                data[i]["TOTAL VENTAS"],
//                data[i]["VENTA AL CREDITO"],
//                data[i]["VENTA CON TARJETA"],
//                data[i]["VISA"],
//                data[i]["MASTERDCARD"],
//                data[i]["DINNERS CLUB"],
//                data[i]["AMERICAN EXPRESS"],
//                data[i]["VENTA EN EFECTIVO"],

//                data[i]["TOTAL DEPOSITOS"],
//                data[i]["VENTA EN EFECTIVO"],
//                //fechadeposito,
//                //depositoalbanco,
//                data[i]["TRANSFERENCIA DEPOSITO"],
//                data[i]["TRANSFERENCIA YAPE"],
//                data[i]["TRANSFERENCIA PLIN"],
//                data[i]["PAGO QR"],
//                data[i]["PAGO POR LINK"],
//                /*    totalDeposito,*/
//                data[i]["VENTA EN EFECTIVO"],
//                '<div class="text-wrap" style="width: 110px; height: 70px;overflow-y: scroll;">' + data[i]["COMPROBANTES"] + '</div>',
//                data[i]["MONTO"],
//                /*diferenciaDeposito,*/
//                data[i]["VENTA EN EFECTIVO"],
//                data[i]["CAJERO"],
//                data[i]["ENCARGADO"],
//                data[i]["OBSERVACION"],
//            ]).draw(false).node();
//        }
//        DESBLOQUEARCONTENIDO('tbllista');
//    });
//});


function fnGetHistorial() {

    var fechaActual = new Date().toISOString().split('T')[0];
       var obj = {
           idsucursal: txtidsucursal.value,
           fechainicio: txtfechainicio.value ? txtfechainicio.value : fechaActual,
           fechafin: txtfechafin.value ? txtfechafin.value : fechaActual
    }

    var url = ORIGEN + "/Ventas/Caja/GetHistorialVentaslistarArray";

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
          /*  data[i][1], // NUNDOCUMENTO*/
            data[i][2], // SUCURSAL
            data[i][3], // FECHA
            data[i][4], // DOC DOCUMENTO
            //data[i][5], // CLIENTE 
            //data[i][6], // COLEGIATURA
            //data[i][7], // MEDICO
            //data[i][8], // IMPORTE
            //data[i][9],// EFECTIVO


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
    var fechaActual = new Date().toISOString().split('T')[0];
    var obj = {
        idsucursal: txtidsucursal.value,
        fechainicio: txtfechainicio.value ? txtfechainicio.value : fechaActual,
        fechafin: txtfechafin.value ? txtfechafin.value : fechaActual
    }

    var url = ORIGEN + "/Ventas/Caja/GetEpllusexportarExcel";

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


            if (data.type === "application/json") {
                var reader = new FileReader();
                reader.onload = function (event) {
                    var jsonResponse = JSON.parse(event.target.result);
                    if (!jsonResponse.success) {
                        // Mostrar mensaje de error del servidor
                        mensaje('I', 'No se encontraron datos, el excel no puede estar vacio');
                        DESBLOQUEARCONTENIDO('cardreport');
                        $('#btnexportar').prop('disabled', false);
                      
                    }
                };
                reader.readAsText(data);
            } else {

                var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                //link.download = "ReporteBasico.xlsx";
                var selectedValue = txtidsucursal.value;
                var selectedText = document.querySelector("#txtidsucursal option[value='" + selectedValue + "']").textContent;

                var now = new Date();
                var formattedDate =
                    ('0' + now.getDate()).slice(-2) + '-' +
                    ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
                    now.getFullYear() + ' ' +
                    ('0' + now.getHours()).slice(-2) + ';' +
                    ('0' + now.getMinutes()).slice(-2);

                link.download = "Registro de cierre de caja " + selectedText + " " + formattedDate + ".xlsx";


                // Simular el clic en el enlace para descargar el archivo
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                DESBLOQUEARCONTENIDO('cardreport');
                $('#btnexportar').prop('disabled', false);
                mensaje('S', 'Excel Descargado');
            }
        },
        error: function (error) {
            DESBLOQUEARCONTENIDO('cardreport');
            $('#btnexportar').prop('disabled', false);

        }
    });
}
