
var tblReporte;
var lista;
var FECHAINICIO = '';
var FECHAFIN = '';
var txthorainicio = $('#txthorainicio');
var txthorafin = $('#txthorafin');
var cmbsucursalConsulta = $('#cmbSucursal');
var PERFIL = "ADMINISTRADOR";
$(document).ready(function () {
    
    tblReporte = $('#tblReportes').DataTable({
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
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
        }
    });
    getReporteGeneral();
    if (PERFIL == 'ADMINISTRADOR') { //listarLaboratorios();
        listarSucursales();
    }
    else if (PERFIL == 'LABORATORIO') { listarSucursalesxLaboratorio(); }
    else if (PERFIL == 'REP.MEDICO') { listarSucursalesRepMedico(); }
    else if (PERFIL == 'SUPERVISOR') { listarSucursalesSupervisor(); }
    exportarDatos();
});

function listarSucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('cmbSucursal');
}
function listarSucursalesxLaboratorio() {
    let controller = new SucursalController();
    controller.ListarLaboratorioSucursal(IDSUCURSAL, 'cmbSucursal');
}
function agregarFila(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        tblReporte.row.add([
            data[i].pedido_codigo,
            data[i].nroPedidoLocal,
            data[i].SUCURSAL,
            data[i].DOCUMENTO,
            data[i].PACIENTE,
            moment(data[i].FECHAPEDIDO).format('DD/MM/YYYY, h:mm:ss a'),
            data[i].NUMFORMULAS,
            parseFloat(data[i].TOTAL).toFixed(2),
            parseFloat(data[i].ADELANTO).toFixed(2),
            parseFloat(data[i].SALDO).toFixed(2),
            data[i].USUARIO,
            data[i].ESTADOPEDIDO
        ]).draw(false);
    }
}

function getReporteGeneral() {
    tblReporte.clear().draw();
    var url = ORIGEN+'/Pedidos/Reporte/GetReportePedidosConAdelanto';
    var laboratorio = IDSUCURSAL;
    var sucursal = '';
    if (cmbsucursalConsulta.val() == '0')
        sucursal = '';
    else
        sucursal = cmbsucursalConsulta.val();
    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }
    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        sucursal: sucursal,
        laboratorio: laboratorio,
        perfil: PERFIL,
        supervisor: IDEMPLEADO
    };
    $.post(url, data).done(function (data) {

        console.log(data);
        if (data.length > 0) { agregarFila(data); lista = data; }
        else
            mensaje('I', 'No hay datos en la consulta');
        $('#numRegistros').text(data.length);
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor.');
    });
}

function exportarDatos() {
    document.getElementById("btnExportar").onclick = function () {
        var excel = crearExcelExportar();
        var nombre = "rep_pedidosconadelanto" + (new Date()).getTime() + ".xls";
        var blob = new Blob([excel], { type: 'application/vdn.ms-excel' });
        if (navigator.appVersion.toString().indexOf('.NET') > 0) {
            window.navigator.msSaveBlob(blob, nombre);
        } else {
            this.download = nombre;
            this.href = window.URL.createObjectURL(blob);
        }
    }
}
function crearExcelExportar() {
    excel = "<html><head><meta charset='UTF-8'></meta></head><body>";
    //var divToPrint = document.getElementById("tblReportes");
    //excel += divToPrint.outerHTML;
    //excel += "</body></html>";            
    excel += "<table border=\"1\"><thead><tr>";
    excel += "<th style='background-color:blue;color:white'>ID</th>";
    excel += "<th style='background-color:blue;color:white'>N° PEDIDO</th>";
    excel += "    <th style='background-color:blue;color:white'>SUCURSAL</th>";
    excel += "<th style='background-color:blue;color:white'>DOCUMENTO</th>";
    excel += "<th style='background-color:blue;color:white'>PACIENTE</th>";
    excel += "<th style='background-color:blue;color:white'>FECHA</th>";
    excel += "<th style='background-color:blue;color:white'>#F.M</th>";
    excel += "<th style='background-color:blue;color:white'>TOTAL</th>";
    excel += "<th style='background-color:blue;color:white'>ADELANTO</th>";
    excel += "<th style='background-color:blue;color:white'>SALDO</th>";
    excel += "<th style='background-color:blue;color:white'>USUARIO</th>";
    excel += "<th style='background-color:blue;color:white'>ESTADO</th>";
    excel += "</tr></thead><tbody>";
    for (var i = 0; i < lista.length; i++) {
        excel += "<tr>";
        excel += "<td>" + lista[i].pedido_codigo + "</td>";
        excel += "<td>" + lista[i].nroPedidoLocal + "</td>";
        excel += "<td>" + lista[i].SUCURSAL + "</td>";
        excel += "<td>" + lista[i].DOCUMENTO + "</td>";
        excel += "<td>" + lista[i].PACIENTE + "</td>";
        excel += "<td>" + moment(lista[i].FECHAPEDIDO).format('DD/MM/YYYY, h:mm:ss a') + "</td>";
        excel += "<td>" + lista[i].NUMFORMULAS + "</td>";
        excel += "<td>" + parseFloat(lista[i].TOTAL).toFixed(2) + "</td>";
        excel += "<td>" + parseFloat(lista[i].ADELANTO).toFixed(2) + "</td>";
        excel += "<td>" + parseFloat(lista[i].SALDO).toFixed(2) + "</td>";
        excel += "<td>" + lista[i].USUARIO + "</td>";
        excel += "<td>" + lista[i].ESTADOPEDIDO + "</td>";
        excel += "</tr>";
    }
    excel += "</tbody></table></body></html>";
    return excel;
}
