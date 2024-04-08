var tbllista
var txtnumdocumento = document.getElementById('txtnumdocumento');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtsucursal = document.getElementById('txtsucursal');
var cmbbuscarcliente = document.getElementById('cmbbuscarcliente');
var btnbuscar = document.getElementById('btnbusqueda');
var btnexp = document.getElementById('btnexportar');

var btnbusqueda = document.getElementById('btnbusqueda');
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
    
    fnGetHistorial();
    if (txtsucursal.getAttribute('tipo') == 'select') {
        let controller = new SucursalController();
        controller.ListarSucursalxEmpresaEnCombo('txtsucursal');
    } else
        txtsucursal.value = IDSUCURSAL;
    let controller = new ClienteController();
    
    var fn = controller.BuscarClientesSelect2();
    $('#cmbbuscarcliente').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    })
    
});

function fnGetHistorial() {

    tbllista.clear().draw();
    // Limpiar el contador de registros
    $('#numRegistros').text('0');
    var cliente = $('#cmbbuscarcliente').text().split('-');
    var fechaActual = new Date().toISOString().split('T')[0];
    var obj = {
        numdocumento: txtnumdocumento.value.trim(),
        cliente: (cliente.length == 2) ? cliente[0].trim() : '',
        fechainicio: txtfechainicio.value ? txtfechainicio.value : fechaActual,
        fechafin: txtfechafin.value ? txtfechafin.value : fechaActual,
        sucursal: txtsucursal.value
    };

    var url = ORIGEN + "/Ventas/Venta/GetHistorialVentaslistarArray";

    BLOQUEARCONTENIDO('cardreport', 'Buscando ..');

    $.post(url, obj).done(function (data) { 
        if (data && data.rows && data.rows.length > 0) {
            agregarFila(data.rows);
            $('#numRegistros').text(data.rows.length);
        } else {
            mensaje('I', 'No hay datos en la consulta');
        }
        $("#btnbusqueda").prop("disabled", false);
        DESBLOQUEARCONTENIDO('cardreport');
    }).fail(function () {
        DESBLOQUEARCONTENIDO('cardreport');
        $("#btnbusqueda").prop("disabled", false);
    });
}





function agregarFila(data) {
    var rows = [];
    for (var i = 0; i < data.length; i++) {
        
        // Logic for btntxt
        var btntxt = '';
        if (isadmin) {
            btntxt = `<button class="btn btn-dark btntxt" idventa=${data[i][0]} data-toggle="tooltip" data-placement="right" title="Generar txt de facturación"><i class="far fa-file-alt"></i></button>`;
        }

        var btnguia = '';
        if (data[i][16] == true) {
            btnguia = `<button class="btn btn-dark btnguia" idventa=${data[i][0]} idsucursal="${data[i][2]}" data-toggle="tooltip" data-placement="right" title="Generar guia electrónica"><i class="fa fa-box"></i></button>`;
        }

        // Logic for btnimp
        var btnimp = '';
        if (data[i][2] === 'DROGUERIA' || data[i][2] === 'MATRIZ') { 
            btnimp = `<button class="btn btn-dark btnimprimir" href="${ORIGEN}/Ventas/Venta/ImprimirTicket_D/${data[i][0]}"><i class="fas fa-print"></i></button>`;
        } else {
            btnimp = `<button class="btn btn-dark btnimprimir" href="${ORIGEN}/Ventas/Venta/ImprimirTicket/${data[i][0]}"><i class="fas fa-print"></i></button>`;
        }

        // Create the row
        var fila = [
            `<div class="btn-group btn-group-sm">
                ${btntxt}${btnguia}${btnimp}
                <button class="btn btn-primary btnver" idventa="${data[i][0]}"><i class="fas fa-eye"></i></button>
            </div>`,
            data[i][1], // NUNDOCUMENTO
            data[i][3], //SUCURSAL
            data[i][4], // FECHA
            data[i][5], // DOC DOCUMENTO
            data[i][6], // CLIENTE 
            data[i][7], // COLEGIATURA
            data[i][8], // MEDICO
            data[i][9].toFixed(2), // IMPORTE
            data[i][10].toFixed(2), // EFECTIVO
            data[i][11].toFixed(2), // TARJETA
            data[i][12].toFixed(2), // EFECTIVO A D
            data[i][13].toFixed(2), // TARJETA DE
            data[i][14], // ESTADO
            data[i][15], // USUARIO
            `<button class="btn btn-secondary btn-sm btn-details" idventa="${data[i][0]}"><i class="fas fa-plus"></i></button>`,
        
        ];

        rows.push(fila);
  
    }
    tbllista.rows.add(rows).draw(false);
}








function fnmostrardatosventa(idventa) {     
    let controller = new VentasController();
    controller.GetVentaCompleta(idventa, function (data) {
        var detalle =JSON.parse(  data[0].DETALLE);
        var pago = JSON.parse(data[0].PAGO);  
        var detallehtml = '<label>DETALLE</label><table border="1" >';
        detallehtml += '<thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>';
        for (var i = 0; i < detalle.length; i++) {
         
            var cantidad = detalle[i].cantidad;
            if (detalle[i].isfraccion)
                cantidad = 'F' + cantidad;
            else if (detalle[i].isblister)
                cantidad = 'B' + cantidad;
            detallehtml += '<tr>';
            detallehtml+= '<td><span>' + detalle[i].producto.replace(',', ', ') + '</span>';
            if (detalle[i].idtipoproducto == 'PT') {
                //detallehtml += '</br > <span>Lote: ' + detalle[i].lote + ', FV: ' + detalle[i].fechavencimiento + '</span>';
            }
            detallehtml += '</td >';
            detallehtml += '<td style="text-align:right">' + cantidad + '</td>';
            detallehtml += '<td style="text-align:right">' + detalle[i].precioigv.toFixed(2) + '</td>';
            detallehtml += '<td style="text-align:right">' + (detalle[i].cantidad * detalle[i].precioigv).toFixed(2) + '</td>';
            detallehtml += '</tr>';           
        }
        detallehtml += '</table>';

        var pagohtml = '<label>PAGOS DE VENTA</label><table border="1" ><thead><tr><th>Tipopago</th><th>Moneda</th><th>Monto</th></thead>';    
        var numtarjeta = '';
        for (var i = 0; i < pago.length; i++) {
            numtarjeta = '';
            if (pago[i].montopagado == null) pago[i].montopagado = 0;
            if (pago[i].numtarjeta != '') numtarjeta = '*****' + pago[i].numtarjeta;
            pagohtml += '<tr>';
            pagohtml += '<td >' + pago[i].tipopago + ' ' + numtarjeta + '</td>';
            pagohtml += '<td style="text-align:right">' + pago[i].simbolomoneda + '</td>';
            pagohtml += '<td style="text-align:right;" >' + pago[i].montopagado.toFixed(2) + '</td>';
            pagohtml += '</tr>';          
        }
        pagohtml += '</table>';
        var contenido = `<div class="row justify-content-center">
                        <div class="col-xl-4 col-sm-10">
                             `+ detallehtml + `
                     </div>
                     <div class="col-xl-4 col-sm-10">
                            ` + pagohtml + `
                     </div>
                    </div>`;
        document.getElementById('detalle' + idventa).innerHTML = contenido;
    });
    return ;
}

btnbusqueda.addEventListener('click', function () {
    btnbuscar.disabled = true;
    btnbuscar.style.background = "#465864";
    fnGetHistorial();

});



btnexportar.addEventListener('click', function () {
 
    descargarReporte();
    //btnexp.disabled = false;
    //btnexp.style.background = "#3f923f";
});
$(document).on('click', '.btnimprimir', function() {
    var href = this.getAttribute('href');
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR VENTA');
});
$(document).on('click', '.btnver', function() {
    var idventa = this.getAttribute('idventa');
    var a = document.createElement('a');
    a.href = ORIGEN + "/Ventas/Venta/VentaDirecta?idventa=" + idventa;
    a.target = "_blank";
    a.click();
});

$(document).on('click', '.btntxt', function () {
    var controlleraux = new VentasController();
    controlleraux.GenerarTxtVenta(this.getAttribute('idventa'), null);
});
var idventaGuia = 0;
$(document).on('click', '.btnguia', function () {
    idventaGuia = this.getAttribute('idventa');
    var idsucursal = this.getAttribute('idsucursal');
    MSS_buscarSeriesXSucursal(idsucursal);
});
$(document).on('click', '.MSS_btnseleccionarserie', function () {
    if (MSSPG_txtfechatraslado.value != "" && MSSPG_txtpeso.value != "" && MSSPG_txtbulto.value != "") {
        var idcorrelativo = this.getAttribute('idcorrelativo');
        var obj = new Object();
        obj.idventa = idventaGuia;
        obj.fechatraslado = MSSPG_txtfechatraslado.value;
        obj.peso = MSSPG_txtpeso.value;
        obj.bulto = MSSPG_txtbulto.value;
        obj.idsucursal = "";
        obj.idempleado = "";
        obj.idempresa = "";
        obj.jsondetalle = "";
        obj.idcorrelativo = idcorrelativo;
        var urlGuiaDesdeVenta = ORIGEN + "/Almacen/AGuiaSalida/RegistrarGuiaSalidaDesdeVentas";
        $.post(urlGuiaDesdeVenta, obj).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Guia generada', '');
                $('#modalserie').modal('hide');
            }
            else
                mensaje('W', data.mensaje, '');

            if (data.objeto != null || data.objeto != "") {
                var lGuias = JSON.parse(data.objeto);
                for (var i = 0; i < lGuias.length; i++) {
                    fnenviarguiae(lGuias[i][1]);
                }
            }
            MSSPG_txtfechatraslado.value = "";
            MSSPG_txtpeso.value = "";
            MSSPG_txtbulto.value = "";

        }).fail(function (data) {
            mensajeError(data);
            fnerror();
        });
    } else {
        mensaje("W", "Llene todos los campos.");
    }
    
});
function fnenviarguiae(id) {
    let obj = {
        idguia: id,
        tipo: 'distribucion'
    };
    var controlleraux = new GuiaSalidaController();
    controlleraux.GenerarGuiaElectronica(obj, null);
}
//txtfechainicio.addEventListener('change', function () {
//    fnGetHistorial();
//});
$('#cmbbuscarcliente').on('select2:select', function (e) {
    fnGetHistorial();
    $('#cmbbuscarcliente').text('');

});
$('#tbllista tbody').on('click', 'tr td.details-control, .btn-details', function () {
    var id = this.parentNode.getAttribute('idventa') || this.getAttribute('idventa');
    var tr = $(this).closest('tr');

    var row = tbllista.row(tr);
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        tr.addClass('details');
        row.child('<div id="detalle' + id + '">...</div>').show();
        fnmostrardatosventa(id);
    }
});




function descargarReporte()
{

    tbllista.clear().draw();
    // Limpiar el contador de registros
    $('#numRegistros').text('0');
    var cliente = $('#cmbbuscarcliente').text().split('-');
    // Si 'fechainicio' está vacío, asigna la fecha de hoy.
    var fechaActual = new Date().toISOString().split('T')[0];
    var obj = {
        numdocumento: txtnumdocumento.value.trim(),
        cliente: (cliente.length == 2) ? cliente[0].trim() : '',
        fechainicio: txtfechainicio.value ? txtfechainicio.value : fechaActual,
        fechafin: txtfechafin.value ? txtfechafin.value : fechaActual,
        sucursal: txtsucursal.value
    };

    var url = ORIGEN + "/Ventas/Venta/GetEpllusexportarExcel";

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
            link.download = "ReporteVentas" + formattedDate + ".xlsx";

            // Simular el clic en el enlace para descargar el archivo
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            DESBLOQUEARCONTENIDO('cardreport');
            $('#btnExportar').prop('disabled', false);
            mensaje('S', 'Excel Descargado');
        },
        error: function (error) {
            DESBLOQUEARCONTENIDO('cardreport');
            $('#btnExportar').prop('disabled', false);
        }
    });
}




