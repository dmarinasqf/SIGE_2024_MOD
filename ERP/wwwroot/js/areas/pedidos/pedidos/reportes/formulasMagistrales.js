var tblReporte;
var lista;
var txthorainicio = $('#txthorainicio');
var txthorafin = $('#txthorafin');
var cmbsucursalConsulta = $('#cmbSucursal');
var cmbTipoEmpresa = $('#cmbTipoEmpresa');
var cmbtipoproducto = $('#cmbtipoproducto');
var spiner = $('#spinners');

$(document).ready(() => {
    tblReporte = $('#tblReportes').DataTable({
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[30, 35, 50, -1], [30, 35, 50, "All"]],
        "ordering": false,
        "info": false,
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
        },
    });
    getReporteGeneral();

    if (document.getElementById('cmbSucursal').getAttribute('tipo') == 'select') {
        let controller = new SucursalController();
        controller.ListarSucursalxEmpresaEnCombo('cmbSucursal');
    } else
        txtsucursal.value = IDSUCURSAL;
});

// Agregar Fila
function agregarFila(data) {
    for (var i = 0; i < data.length; i++) {
        tblReporte.row.add([
            data[i]['SUCURSAL'],
            data[i]['TIPO PRODUCTO'],
            data[i]['CODIGO PRECIO'],
            data[i]['FORMULA'],
            data[i]['ESTADO'],
            data[i]['CANTIDAD']
        ]).draw(false);
    }
}
// Reporte General
function getReporteGeneral() {
    tblReporte.clear().draw();
    spiner.removeClass('mostrar');
    var laboratorio = '';
    var url = ORIGEN+'/Pedidos/Reporte/GetReporteFormulasMagistral';
    laboratorio = '';

    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }
    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        sucursal: cmbsucursalConsulta.val(),
        laboratorio: laboratorio,
        horainicio: txthorainicio.val(),
        horafin: txthorafin.val(),
        tipoproducto: cmbtipoproducto.val(),
        tipoempresa: cmbTipoEmpresa.val()
    };
    console.log(data);    
    $.post(url, data).done(function (data) {
        //var datos = JSON.parse(data);
        console.log(data);
        if (data.length > 0) { agregarFila(data); }
        else
            mensaje('I', 'No hay datos en la consulta');
        $('#numRegistros').text(data.length);
        spiner.addClass('mostrar');
    }).fail(function (data) {
        console.log(data);
        spiner.addClass('mostrar');
        mensaje("D", 'Error en el servidor.');
    });
}
// EXportar
$("#btnExportar").click(function () {
    descargarReporte();
});
// Descarga del Reporte
function descargarReporte() {
    $('#btnExportar').prop('disabled', true);
    spiner.removeClass('mostrar');
    var url = ORIGEN+'/Pedidos/Reporte/GetReporteFormulasMagistral';
    laboratorio = '';

    var sucursal = cmbsucursalConsulta.val();;
    var tipoEmpresa = cmbTipoEmpresa.val();
    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }
    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        sucursal: sucursal,
        laboratorio: laboratorio,
        horainicio: txthorainicio.val(),
        horafin: txthorafin.val(),
        tipoproducto: cmbtipoproducto.val(),
        tipo: 'EXPORTACION',
        tipoempresa: tipoEmpresa
    };
    $.post(url, data).done(function (data) {
        $('#btnExportar').prop('disabled', false);

        location.href = ORIGEN + data.objeto;
        spiner.addClass('mostrar');
    }).fail(function (data) {
        console.log(data);
        $('#btnExportar').prop('disabled', false);
        mensaje("D", 'Error en el servidor.');
        spiner.addClass('mostrar');
    });
}