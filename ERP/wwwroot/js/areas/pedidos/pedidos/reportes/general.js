

var txtfechainicio = '';
var txtfechafin = '';
var txthorainicio = $('#txthorainicio');
var txthorafin = $('#txthorafin');
var cmbsucursalConsulta = $('#cmbSucursal');
var cmblaboratorioConsulta = $('#cmbLaboratorio');
var txtdocpacienteConsulta = $('#txtdocumentocliente');
var cmbtipopedido = $('#cmbTipoPedido');
var txtnombrepaciente = $('#txtnombrePaciente');
var txtnombremedico = $('#txtnombremedico');
var txtnombrevendedor = $('#txtnombresVendedor');
var txtdocpaciente = $('#txtdocpaciente');
var txtdocmedico = $('#txtcolegiaturamedico');
var txtdocvendedor = $('#txtdocempleado');
var txtnombreorigen = $('#txtnombreorigen');
var txtidorigen = $('#txtidorigenreceta');
var cmbEstado = $('#cmbEstado');
var cmbTipoEmpresa = $('#cmbTipoEmpresa');
var cmbtipoproducto = $('#cmbtipoproducto');
var cmbtipoformulacion = $('#cmbtipoformulacion');
var txtnombrecliente = $('#txtnombrecliente');
var txtdoccliente = $('#txtdoccliente');



$(document).ready(function () {

   
    tblReporte = $('#tblReportes').DataTable({
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    }); 
    getReporteGeneral();
    init();
});

function init() {
    if (document.getElementById('cmbSucursal').getAttribute('tipo') == 'select') {
        let controller = new SucursalController();
        controller.ListarSucursalxEmpresaEnCombo('cmbSucursal');
    } else
        txtsucursal.value = IDSUCURSAL;
}

$('#cmbTipoEmpresa').change(function () {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbSucursal', cmbTipoEmpresa.val());
});

$('#btnbuscarpaciente').click(function () {   
    $('#modalpaciente').modal('show');
});
$('#btnbuscarcliente').click(function () {   
    $('#modalcliente').modal('show');
});
$('#btnBuscarMedico').click(function () {
    $('#modalmedico').modal('show');
});
$('#btnBuscarRecetaorigen').click(function () {    
    $('#modalorigenreceta').modal('show');
});
$('#btnBuscarVendedor').click(function () {   
    $('#modalempleados').modal('show');
});
$(document).on('click', '.btnpasarempleado', function (e) {
    var columna =this.parentNode.parentNode;
    txtdocvendedor.val(columna.getElementsByTagName('td')[0].innerText);
    txtnombrevendedor.val(columna.getElementsByTagName('td')[1].innerText);
    $('#modalempleados').modal('hide');
});
$(document).on('click', '.MCPbtnseleccionarpaciente', function (e) {
    var columna = this.parentNode.parentNode;
    txtdocpaciente.val(columna.getElementsByTagName('td')[1].innerText);
    txtnombrepaciente.val(columna.getElementsByTagName('td')[2].innerText);
    $('#modalpaciente').modal('hide');
});
$(document).on('click', '.MCC_btnseleccionarcliente', function (e) { 
   
    var columna = this.parentNode.parentNode.parentNode;
    txtdoccliente.val(columna.getElementsByTagName('td')[2].innerText);
    txtnombrecliente.val(columna.getElementsByTagName('td')[3].innerText);
    $('#modalcliente').modal('hide');
});
$(document).on('click', '.MMbtnpasarmedico', function (e) {
    var columna = this.parentNode.parentNode;
    txtdocmedico.val(columna.getElementsByTagName('td')[2].innerText);
    txtnombremedico.val(columna.getElementsByTagName('td')[3].innerText);
    $('#modalmedico').modal('hide');
});
$(document).on('click', '.MORbtnseleccionaritem', function (e) {
    var columna = this.parentNode.parentNode;
    txtidorigen.val(columna.getAttribute('id'));
    txtnombreorigen.val(columna.getElementsByTagName('td')[0].innerText);
    $('#modalorigenreceta').modal('hide');
});


function getReporteGeneral() {

    //$('#btnConsultar').prop('disabled', true);

    tblReporte.clear().draw();
    // Limpiar el contador de registros
    $('#numRegistros').text('0');
    var url = ORIGEN + "/Pedidos/Reporte/GetReporteGenerallistartabla";
    var laboratorio = '';
    var sucursal = cmbsucursalConsulta.val();
    var tipoEmpresa = cmbTipoEmpresa.val();
    var tipopedido = cmbtipopedido.val();

    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }
    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        horainicio: txthorainicio.val(),
        horafin: txthorafin.val(),
        sucursal: sucursal,
        laboratorio: laboratorio,
        tipopedido: tipopedido,
        vendedor: txtdocvendedor.val(),
        medico: txtdocmedico.val(),
        paciente: txtdocpaciente.val(),
        cliente: txtdoccliente.val(),
        origenreceta: txtidorigen.val(),
        estado: cmbEstado.val(),
        tipoempresa: tipoEmpresa,
        tipoproducto: cmbtipoproducto.val(),
        consulta: 'CONSULTA',
        tipoformulacion: cmbtipoformulacion.val()
    };
    console.log(data);
    BLOQUEARCONTENIDO('cardreport', 'Buscando ..');

    $.post(url, data).done(function (data) {
        if (data && data.length > 0) {  // Cambio de 'response' por 'data'
            agregarFila(data);  // Cambio de 'response' por 'data'
            lista = data;  // Cambio de 'response' por 'data'
            $('#numRegistros').text(data.length);  // Cambio de 'response' por 'data'
        } else {
            mensaje('I', 'No hay datos en la consulta');
        }
        $('#btnConsultar').prop('disabled', false);
        DESBLOQUEARCONTENIDO('cardreport');
    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardreport');
        $('#btnConsultar').prop('disabled', false);
    });

}



//prueba de yexson

//function getReporteGeneralprueba() {

//    //$('#btnConsultar').prop('disabled', true);

//    tblReporteprueba.clear().draw();
//    var url = ORIGEN + "/Pedidos/Reporte/GetReporteGeneralprueba";
//    var laboratorio = '';
//    var sucursal = cmbsucursalConsulta.val();
//    var tipoEmpresa = cmbTipoEmpresa.val();
//    var tipopedido = cmbtipopedido.val();

//    if (FECHAINICIO.length == 0) {
//        FECHAINICIO = moment().format('DD/MM/YYYY');
//        FECHAFIN = moment().format('DD/MM/YYYY');
//    }
//    var data = {
//        fechainicio: FECHAINICIO,
//        fechafin: FECHAFIN,
//        horainicio: txthorainicio.val(),
//        horafin: txthorafin.val(),
//        sucursal: sucursal,
//        laboratorio: laboratorio,
//        tipopedido: tipopedido,
//        vendedor: txtdocvendedor.val(),
//        medico: txtdocmedico.val(),
//        paciente: txtdocpaciente.val(),
//        cliente: txtdoccliente.val(),
//        origenreceta: txtidorigen.val(),
//        estado: cmbEstado.val(),
//        tipoempresa: tipoEmpresa,
//        tipoproducto: cmbtipoproducto.val(),
//        consulta: 'CONSULTA',
//        tipoformulacion: cmbtipoformulacion.val()
//    };
//    console.log(data);
//    BLOQUEARCONTENIDO('cardreport1', 'Buscando ..');
//    BLOQUEARCONTENIDO('cardreport1', 'Buscando ..');
//    $.post(url, data).done(function (data) {
//        if (data && data.length > 0) {  // Cambio de 'response' por 'data'
//            agregarFilaprueba(data);  // Cambio de 'response' por 'data'
//            lista = data;  // Cambio de 'response' por 'data'
//            $('#numRegistros').text(data.length);  // Cambio de 'response' por 'data'
//        } else {
//            mensaje('I', 'No hay datos en la consulta');
//        }
//        $('#btnConsultar').prop('disabled', false);
//        DESBLOQUEARCONTENIDO('cardreport1');
//    }).fail(function (data) {
//        DESBLOQUEARCONTENIDO('cardreport1');
//        $('#btnConsultar').prop('disabled', false);
//    });

//}


















function limpiar() {
    txtnombrepaciente.val('');
    txtnombremedico.val('');
    txtnombrevendedor.val('');
    txtdocpaciente.val('');
    txtdocmedico.val('');
    txtdocvendedor.val('');
    txtnombreorigen.val('');
    txtidorigen.val('');
    txtdoccliente.val('');
    txtnombrecliente.val('');
}
$("#btnExportar").click(function () {
    descargarReporte();
});












function descargarReporte() {

    BLOQUEARCONTENIDO('cardreport', 'Descargando ..');
    $('#btnExportar').prop('disabled', true);
    var url = ORIGEN + "/Pedidos/Reporte/GetEpllusexportarExcel";
    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }
    var datos = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        horainicio: txthorainicio.val(),
        horafin: txthorafin.val(),
        sucursal: cmbsucursalConsulta.val(),
        laboratorio: '',
        tipopedido: cmbtipopedido.val(),
        vendedor: txtdocvendedor.val(),
        medico: txtdocmedico.val(),
        paciente: txtdocpaciente.val(),
        cliente: txtdoccliente.val(),
        origenreceta: txtidorigen.val(),
        estado: cmbEstado.val(),
        empconsulta: '',
        tipoempresa: '',
        consulta: 'EXPORTACION',
        fechafacturacion: false,
        tipoproducto: cmbtipoproducto.val(),
        tipoformulacion: cmbtipoformulacion.val()
    };

    $.ajax({
        url: url,
        type: 'POST',
        data: datos,
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
            link.download = "ReporteGeneral" + formattedDate + ".xlsx";

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





//function agregarFilaprueba(data) {
//    var rows = [];
//    for (var i = 0; i < data.length; i++) {
//        rows.push([



//            data[i][0], // ID
//            data[i][1], // N_PEDIDO
//            data[i][2], // SUCURSAL
//            data[i][3] ? moment(data[i][7]).format('DD/MM/YYYY, h:mm:ss a') : '', // FECHA// LABORATORIO
//            data[i][4] ? moment(data[i][8]).format('DD/MM/YYYY, h:mm:ss a') : '', // FECHA_FACTURACION 
//            data[i][5], // TIPOFORMULACION
//            data[i][6], // TIPO_DE_ENTREGA
//            data[i][7],
//            parseFloat(data[i][8]).toFixed(2),
//            data[i][9], // VENDEDOR
//            '<div style="word-wrap: break-word; word-break:break-all">' + data[i][10] + '</div>',          
//            data[i][11], // DOC_CLIENTE
//            data[i][12], // CLIENTE
//            data[i][13], // CELULAR_PACIENTE
//            data[i][14], // DNI_PACIENTE
//            data[i][15], // PACIENTE
//            data[i][16], // TIPO_PRODUCTO
//            data[i][17], // NOMLABO
//            data[i][18], // CODIGO
//            data[i][19], // FORMULA_MAGISTRAL

           

//        ]);
//    }
//    tblReporte.rows.add(rows).draw(false);
//}



function agregarFila(data) {
    var rows = [];
    for (var i = 0; i < data.length; i++) {
        rows.push([
            data[i][0], // ID
            data[i][1], // N_PEDIDO
            data[i][2], // SUCURSAL
            data[i][3] , // FECHA// LABORATORIO
            data[i][4] , // FECHA_FACTURACION 
            data[i][5], // TIPOFORMULACION
            data[i][6], // TIPO_DE_ENTREGA
            data[i][7],
            parseFloat(data[i][8]).toFixed(2),
            data[i][9], // VENDEDOR
            data[i][10],
            data[i][11], // DOC_CLIENTE
            data[i][12], // CLIENTE
            data[i][13], // CELULAR_PACIENTE
            data[i][14] ? data[i][14] : '',
            data[i][15], // PACIENTE
            data[i][16] ? data[i][16] : '', // TIPO_PRODUCTO
            data[i][17], // NOMLABO
            data[i][18], // CODIGO
            data[i][19], // FORMULA_MAGISTRAL
        ]);
    }
    tblReporte.rows.add(rows).draw(false);
}


