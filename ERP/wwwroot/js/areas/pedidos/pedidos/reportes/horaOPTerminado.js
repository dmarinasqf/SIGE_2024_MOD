

var tblReporte;
var lista;

var txtfechainicio = '';
var txtfechafin = '';
var cmbsucursalConsulta = $('#cmbSucursal');
var cmbestado = $('#cmbestado');
var spiner = $('#spinners');


$(document).ready(function () {

    
   
    listarSucursales();
    getReporteGeneral();
    //if (PERFIL == 'ADMINISTRADOR') {
    //    listarSucursales();
    //}
    //else if (PERFIL == 'SUPERVISOR') {
    //    listarSucursalesSupervisor();
    //}
    //else if (PERFIL == 'REP.MEDICO') {
    //    listarSucursalesRepMedico();
    //}
    //else if (PERFIL == 'LABORATORIO') { listarSucursalesxLaboratorio(); }

});


function listarSucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('cmbSucursal');
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
}

function agregarFila(data, tipo) {    
    if (tipo == 'reporte') {
        for (var i = 0; i < data.length; i++) {
            tblReporte.row.add([
                data[i].pedido_codigo,
                data[i].nroPedidoLocal,
                data[i].nombreSucursal,
                data[i].nombreEmpleado,
                data[i].nombreCliente,
                moment(data[i].fecha).format('DD/MM/YYYY, h:mm:ss a'),
                parseFloat(data[i].precio).toFixed(2),
                data[i].codigoformula,
                '<div style="word-wrap: break-word; word-break:break-all">' + data[i].formula + '</div>',
                data[i].cantidad,
                data[i].estadoPedido,
                data[i].numBoleta,
                data[i].ordenProduccion,
                data[i].nombreMedico,
                data[i].med_colegiatura,
                data[i].origenreceta,
                data[i].tipopedidodescripcion,
                data[i].tipoEmpresa

            ]).draw(false);
        }
    }
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
    //$('#btnConsultar').prop('disabled', true);
    spiner.removeClass('mostrar');

    //tblReporte.clear().draw();
    var url = '/Pedidos/Reporte/getHoraOpTerminado';
    var laboratorio = '';
    var sucursal = '';   
    if (cmbsucursalConsulta.val() == '0')
        sucursal = '';
    else
        sucursal = cmbsucursalConsulta.val();   
    if (txtfechainicio.length == 0) {
        txtfechainicio = moment().format('DD/MM/YYYY');
        txtfechafin = moment().format('DD/MM/YYYY');
    }
    var estado = '';
    if (cmbestado.val() == 0)
        estado = "";
    else
        estado = cmbestado.val();    
    var data = {
        fechainicio: txtfechainicio ,
        fechafin: txtfechafin,
        perfil: 'ADMINISTRADOR',
        sucursal: sucursal,
        consulta: 'CONSULTA',
        estado: estado
    };   
    try {
        tblReporte.clear().draw();

    } catch (e) {
        console.log("x.x");
    }
    
    limpiarTablas();
    $.post(url, data).done(function (data) {
        spiner.addClass('mostrar');       
        var datos = data;//$.parseJSON(data);      
        if (datos.length!=0) {
            console.log(datos);
            
            lista = datos;
            crearCabecerasHT(datos);
            crearCuerpoHT(datos);
            iniciarTabla();
            $('#numRegistros').text(datos.length);
        }
        else {
            //try {
            //    tblReporte.clear().draw();
            //} catch (e) {
            //}
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
    var tabla = ' <table class="table  table-sm table-striped " id="tblReportes">'+
        '<thead class="thead-dark" style="font-size:10px">'+
        '</thead>'+
       ' <tbody style="font-size:11px"></tbody>'+
    '</table>';
    $("#tabla").append(tabla);
}
function crearCabecerasHT(datos) {
    var cabeceras = GetHeaders(datos);
    var tabla = $("#tblReportes thead");
    var nuevaFila = "<tr>";
    for (var i = 0; i < cabeceras.length; i++) {
        nuevaFila += "<th>" + cabeceras[i] + "</th>";
    }
    nuevaFila += "</tr>";
    $("#tblReportes thead").append(nuevaFila);
}
function crearCuerpoHT(datos) {
    var fila = "";
    var cabeceras = GetHeaders(datos);
    for (var i = 0; i < datos.length; i++) {
        fila += '<tr>';
        var valores = GetValores(datos[i]);        
        for (var j = 0; j < valores.length; j++) {
            if (cabeceras[j] == "FORMULA MAGISTRAL") {
                fila += "<td>" + '<div style="word-wrap: break-word; word-break:break-all">' + valores[j] + '</div>', + "</td>";
            }else
            fila += "<td>" + valores[j] + "</td>";
        }
        fila += '</tr>';
    }
    $("#tblReportes tbody").append(fila);   
}

function GetHeaders(obj) {
    debugger;
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

function imprimir() {

    var tabla = '';

    var filas = '';
    var winprint = window.open('', 'Impresion');
    if (txtfechainicio.length == 0) {
        txtfechainicio = moment().format('DD-MM-YYYY');
        txtfechafin = moment().format('DD-MM-YYYY');
    }
    winprint.document.open();

    var saltoLinea = "<br/>";

    var estiloImprimir = "<style type='text/css'>";
    estiloImprimir += "@page { size: landscape;}";
    estiloImprimir += "table {margin-left:auto;margin-right:auto;} ";
    estiloImprimir += "thead,th {text-align:center;font-size:9pt;padding: 4px;border: 1px solid #ddd;}";
    estiloImprimir += "tr,td {font-size:8pt; padding: 3px;  border: 1px solid #ddd; vertical-align: top; border-top: 1px solid #ddd; }";
    estiloImprimir += ".noPrint {display:none}";
    estiloImprimir += "</style>";
    //var divToPrint = document.getElementById("tblReportes");
    var tablaimprimir = crearTablaImprimir();
    var cabeceraImprimir = "<strong><center><font size='5'>REPORTE HORA OP Y TERMINADO</font></center></strong>";
    cabeceraImprimir += saltoLinea;
    cabeceraImprimir += '<strong><center>Usuario: ' + NOMBREUSUARIO + '</center></strong>';
    cabeceraImprimir += "<center> Desde: " + txtfechainicio + "  -  " + " Hasta:" + txtfechafin + " </center>";
    cabeceraImprimir += '<strong><center>Laboratorio: ' + NOMBRESUCURSAL + '</center></strong>';
    cabeceraImprimir += saltoLinea;
    winprint.document.write('<html><head>');
    winprint.document.write(estiloImprimir);
    winprint.document.write(cabeceraImprimir);
    winprint.document.write('</head>');
    winprint.document.write('<body onload="window.print();">');
    winprint.document.write(tablaimprimir);
    winprint.document.close();
    winprint.focus();
    winprint.print();
    winprint.close();
}


function crearTablaImprimir() {
    excel = "<html><head><meta charset='UTF-8'></meta></head><body>";
    //var divToPrint = document.getElementById("tblReportes");
    //excel += divToPrint.outerHTML;
    //excel += "</body></html>";            
    excel += "<table border=\"1\"Ç><thead><tr>";
    var cabeceras = GetHeaders(lista);   
    var fila = "";
    for (var i = 0; i < cabeceras.length; i++) {
        fila += "<th style='background-color:blue;color:white'>"+cabeceras[i]+"</th>";
    }   
    excel += fila + "</tr></thead><tbody>";
    for (var i = 0; i < lista.length; i++) {
        excel += '<tr>';
        var valores = GetValores(lista[i]);
        for (var j = 0; j < valores.length; j++) {
            if (cabeceras[j] == "FORMULA MAGISTRAL") {
                excel += "<td>" + '<div style="word-wrap: break-word; word-break:break-all">' + valores[j] + '</div>', + "</td>";
            } else
                excel += "<td>" + valores[j] + "</td>";
        }
        excel += '</tr>';
    }  
    excel += "</tbody></table></body></html>";
    return excel;
}

$("#btnExportar").click(function () {

    descargarReporte();

});
function descargarReporte() {
    spiner.removeClass('mostrar');
    $('#btnExportar').prop('disabled', true);   
    var url = '/Reporte/excelHoraOpTerminado';
    var laboratorio = '';
    var sucursal = '';
    if (cmbsucursalConsulta.val() == '0')
        sucursal = '';
    else
        sucursal = cmbsucursalConsulta.val();
    if (txtfechainicio.length == 0) {
        txtfechainicio = moment().format('DD/MM/YYYY');
        txtfechafin = moment().format('DD/MM/YYYY');
    }
    var estado = '';
    if (cmbestado.val() == 0)
        estado = "";
    else
        estado = cmbestado.val();
    var data = {
        fechainicio: txtfechainicio,
        fechafin: txtfechafin,
        perfil: PERFIL,
        sucursal: sucursal,
        consulta: 'EXPORTACION',
        estado:estado
    };
    $.post(url, data).done(function (data) {
        spiner.addClass('mostrar');
        var url = location.origin.toString();
        location.href = URLREPORTE+"HoraOpTerminado/" + data;    
        $('#btnExportar').prop('disabled', false);
    }).fail(function (data) {
        console.log(data);
        mensaje("W", "El numero de datos consultados ha execido la memoria, reduzca el rango de fecha.");
        $('#btnExportar').prop('disabled', false);
        spiner.addClass('mostrar');
    });   
}