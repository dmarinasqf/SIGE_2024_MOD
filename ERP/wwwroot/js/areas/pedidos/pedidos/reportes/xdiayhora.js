

var tblReporte;
var txtfecha = $('#txtfecha');
var cmbintervalo = $('#cmbintervalo');
var lista;
var spiner = $('#spinners');
var cmbsucursalConsulta = $('#cmbSucursal');
var txthorainicio = $('#txthorainicio');
var txthorafin = $('#txthorafin');
//var cmbEstadoConsulta = $('#cmbEstado');

$(document).ready(function () {
    txtfecha.daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1920,
        format: 'DD/MM/YYYY'
        //maxYear: parseInt(moment().format('YYYY'), 10)
    });    
    listarSucursales();
    getReporteGeneral();
    convertirTiempoAEntero('10:30');
});
function listarSucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('cmbSucursal');
}
var horainicio;
var horafin;
function getReporteGeneral() {
    horainicio = convertirTiempoAEntero(txthorainicio.val());
    horafin = convertirTiempoAEntero(txthorafin.val());

    $('#btnConsultar').prop('disabled', true);
    spiner.removeClass('mostrar');
    // tblReporte.clear().draw();
    var url =ORIGEN+ '/Pedidos/Reporte/GetReporteXDiasYHora';
    var sucursal = '';
    if (cmbsucursalConsulta.val() == '0')
        sucursal = '';
    else
        sucursal = cmbsucursalConsulta.val();
    var obj = {
        fecha: moment(txtfecha.val()).format('DD/MM/YYYY'),
        horas: cmbintervalo.val(),
        sucursal: sucursal,
        horainicio: txthorainicio.val(),
        horafin: txthorafin.val()
    };
    $.post(url, obj).done(function (data) {
        var datos = data;
        console.log(datos);
        if (datos.length != 0) {
            $('#tblReportes thead tr').remove();
            $('#tblReportes tbody tr').remove();

            var cabeceras = GetHeaders(datos);
            var tabla = $("#tblReportes thead");
            var nuevaFila = "<tr>";
            for (var i = 0; i < cabeceras.length; i++) {
                //esta condicion verifica que los datos que se mostraran en la tabla estees entre el rango de horas q se pide
                if (i >= 5) {
                    var tiempo = cabeceras[i];
                    tiempo = tiempo.substr(0, 5);
                    var aux = 0;
                    aux = convertirTiempoAEntero(tiempo);
                    tiempo = cabeceras[i].substr(8, 12);
                    var aux2 = 0;
                    aux2 = convertirTiempoAEntero(tiempo);

                    if (aux >= horainicio && aux2 <= horafin)
                        nuevaFila += "<th>" + cabeceras[i] + "</th>";

                } else
                    nuevaFila += "<th>" + cabeceras[i] + "</th>";
            }
            nuevaFila += "</tr>";
            $("#tblReportes thead").append(nuevaFila);
            var nuevacolumna = "";
            var totalesU = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var TU = 0;
            var totalesC = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
            var TC = 0;
            for (var i = 0; i < datos.length; i++) {
                nuevacolumna += '<tr>';
                var valores = (GetValoresCustomDia(datos[i], cabeceras));
                TU = 0;
                TC = 0;
                for (var j = 0; j < valores.length; j++) {
                    try {
                        nuevacolumna += "<td>" + valores[j].toFixed(2) + "</td>";
                        if (valores[3].trim() == 'PEDIDO') {
                            totalesC[TC] = parseFloat(totalesC[TC]) + parseFloat(valores[j]);
                            TC = TC + 1;
                        }
                        else { totalesU[TU] += parseInt(valores[j]); TU = TU + 1; }
                    } catch (e) {
                        nuevacolumna += '<td>' + valores[j] + '</td>';
                    }
                }
                nuevacolumna += "</tr>";
                if (i == datos.length - 1) {
                    TC = 0;
                    TU = 0;
                    //TOTAL PEDIDOS
                    nuevacolumna += '<tr style="background:yellow">' +
                        '<td colspan="2" rowspan="2" class="text-center">TOTAL</td>';
                    for (var k = 2; k < valores.length; k++) {
                        if (k == 3)
                            nuevacolumna += "<td>PEDIDO</td>";
                        else if (k == 2)
                            nuevacolumna += "<td>" + valores[k] + "</td>";
                        else { nuevacolumna += "<td>" + totalesC[TC].toFixed(2) + "</td>"; TC = TC + 1; }
                    }
                    nuevacolumna += '</tr>';
                    //TOTAL CANTIDAD
                    nuevacolumna += '<tr style="background:yellow">';

                    for (var k = 2; k < valores.length; k++) {
                        if (k == 3)
                            nuevacolumna += "<td>NUM. FORMULAS</td>";
                        else if (k == 2)
                            nuevacolumna += "<td>" + valores[k] + "</td>";
                        else { nuevacolumna += "<td>" + totalesU[TU] + "</td>"; TU = TU + 1; }
                    }
                    nuevacolumna += '</tr>';
                }
            }
            $("#tblReportes tbody").append(nuevacolumna);
            $('#numRegistros').text(datos.length);
            //for (var i = 0; i < datos.length; i++) {
            //    nuevacolumna += '<tr>';
            //    var valores = (GetValores(datos[i]));
            //    TU = 0;
            //    TC = 0;
            //    for (var j = 0; j < valores.length; j++) {
            //        try {
            //            nuevacolumna += "<td>" + valores[j].toFixed(2) + "</td>";
            //            if (valores[3].trim() == 'PEDIDO') {
            //                totalesC[TC] = parseFloat(totalesC[TC]) + parseFloat(valores[j]);
            //                TC = TC + 1;
            //            }
            //            else { totalesU[TU] += parseInt(valores[j]); TU = TU + 1; }
            //        } catch (e) {
            //            nuevacolumna += '<td>' + valores[j] + '</td>';
            //        }
            //    }
            //    nuevacolumna += "</tr>";
            //    if (i == datos.length - 1) {
            //        TC = 0;
            //        TU = 0;
            //        //TOTAL PEDIDOS
            //        nuevacolumna += '<tr style="background:yellow">' +
            //            '<td colspan="2" rowspan="2" class="text-center">TOTAL</td>';
            //        for (var k = 2; k < valores.length; k++) {
            //            if (k == 3)
            //                nuevacolumna += "<td>PEDIDO</td>";
            //            else if (k == 2)
            //                nuevacolumna += "<td>" + valores[k] + "</td>";
            //            else { nuevacolumna += "<td>" + totalesC[TC].toFixed(2) + "</td>"; TC = TC + 1; }
            //        }
            //        nuevacolumna += '</tr>';
            //        //TOTAL CANTIDAD
            //        nuevacolumna += '<tr style="background:yellow">';

            //        for (var k = 2; k < valores.length; k++) {
            //            if (k == 3)
            //                nuevacolumna += "<td>NUM. FORMULAS</td>";
            //            else if (k == 2)
            //                nuevacolumna += "<td>" + valores[k] + "</td>";
            //            else { nuevacolumna += "<td>" + totalesU[TU] + "</td>"; TU = TU + 1; }
            //        }
            //        nuevacolumna += '</tr>';
            //    }
            //}
            //$("#tblReportes tbody").append(nuevacolumna);
            //$('#numRegistros').text(datos.length);
        }
        else { mensaje('I', 'No hay datos en la consulta'); $('#numRegistros').text("0"); }
        spiner.addClass('mostrar');
        $('#btnConsultar').prop('disabled', false);
    }).fail(function (data) {
        console.log(data);
        mensaje("W", "El numero de datos consultados ha execido la memoria, reduzca el rango de fecha.");
        $('#btnConsultar').prop('disabled', false);
        spiner.addClass('mostrar');
    });
}

function GetHeaders(obj) {
    var cols = new Array();
    var p = obj[0];
    for (var key in p) {
        cols.push(key);
    }
    return cols;
}
function GetValoresCustomDia(obj, cabeceras) {
    var cols = new Array();
    var i = 0;
    for (var key in obj) {
        if (i >= 5) {
            var tiempo = cabeceras[i];
            tiempo = tiempo.substr(0, 5);
            var aux = 0;
            aux = convertirTiempoAEntero(tiempo);
            tiempo = cabeceras[i].substr(8, 12);
            var aux2 = 0;
            aux2 = convertirTiempoAEntero(tiempo);
            if (aux >= horainicio && aux2 <= horafin) {
                cols.push(obj[key]);
            }

        } else {
            if (obj[key] == null || obj[key] == "null") 
                cols.push("");
            else
                cols.push(obj[key]);
            
            
        }
            
        i = i + 1;
    }
    return cols;
    //for (var key in obj) {        
    //    cols.push(obj[key]);
    //}
    //return cols;
}

function convertirTiempoAEntero(tiempo) {

    var min = parseInt(tiempo.substr(3, 5));
    var hor = parseInt(tiempo.substr(0, 2));
    var tiemp = 0;
    tiemp = hor * 3600 + min * 60;
    return tiemp;

}
function imprimir() {
    var winprint = window.open('', 'Impresion');
    winprint.document.open();

    var saltoLinea = "<br/>";

    var estiloImprimir = "<style type='text/css'>";
    estiloImprimir += "@page { size: landscape;}";
    estiloImprimir += "table {margin-left:auto;margin-right:auto;} ";
    estiloImprimir += "thead,th {text-align:center;font-size:9pt;padding: 4px;border: 1px solid #ddd;}"
    estiloImprimir += "tr,td {font-size:8pt; padding: 3px;  border: 1px solid #ddd; vertical-align: top; border-top: 1px solid #ddd; }";
    estiloImprimir += ".noPrint {display:none}";
    estiloImprimir += "</style>";
    var divToPrint = document.getElementById("tblReportes");
    var cabeceraImprimir = "<strong><center><font size='5'>PEDIDOS Y NRO DE FORMULAS GENERADOS X DIA X HORA</font></center></strong>";
    cabeceraImprimir += saltoLinea;
    cabeceraImprimir += '<strong><center>Usuario: ' + NOMBREUSUARIO + '</center></strong>';
    cabeceraImprimir += "<center> Desde: " + moment(txtfecha.val()).format('DD/MM/YYYY') + "  -  " + " Hasta:" + moment(txtfecha.val()).format('DD/MM/YYYY') + " </center>";
    cabeceraImprimir += saltoLinea;
    winprint.document.write('<html><head>');
    winprint.document.write(estiloImprimir);
    winprint.document.write(cabeceraImprimir);
    winprint.document.write('</head>');
    winprint.document.write('<body onload="window.print();">');
    winprint.document.write(divToPrint.outerHTML);
    winprint.document.close();
    winprint.focus();
    winprint.print();
    winprint.close();
}



$("#btnExportar").click(function () {
    var divToPrint = document.getElementById("tblReportes");
    var excel = divToPrint.outerHTML;
    var nombre = "rep_xdiayhora" + (new Date()).getTime() + ".xls";
    var blob = new Blob([excel], { type: 'application/vdn.ms-excel' });
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
        window.navigator.msSaveBlob(blob, nombre);
    } else {
        this.download = nombre;
        this.href = window.URL.createObjectURL(blob);
    }

});
$("#txthorainicio").change(function () {
    if (txthorainicio.val().length == 0)
        txthorainicio.val('00:00');
    var hora = txthorainicio.val();
    var aux1 = txthorainicio.val().substr(0, 2);
    var aux2 = txthorainicio.val().substr(3, 5);
    if (parseInt(aux2) != 0)
        txthorainicio.val(aux1 + ':00');
    if (cmbintervalo.val() == 2) {
        if (aux1 != '23') {
            if (parseInt(aux1) % 2 != 0) {
                var newhora = ((parseInt(aux1) + 1) + ':00');
                if (newhora.trim().length != 5)
                    newhora = '0' + newhora;
                txthorainicio.val(newhora);
            }
        } else
            txthorainicio.val('00:00');
    }
    console.log(aux2);
});
$("#txthorafin").change(function () {
    if (txthorafin.val().length == 0)
        txthorafin.val('00:00');
    var hora = txthorafin.val();
    var aux1 = txthorafin.val().substr(0, 2);
    var aux2 = txthorafin.val().substr(3, 5);
    if (parseInt(aux2) != 0)
        txthorafin.val(aux1 + ':00');
    if (cmbintervalo.val() == 2) {
        if (aux1 != '23') {
            if (parseInt(aux1) % 2 != 0) {
                var newhora = ((parseInt(aux1) + 1) + ':00');
                if (newhora.trim().length != 5)
                    newhora = '0' + newhora;
                txthorafin.val(newhora);
            }
        } else
            txthorafin.val('23:00');
    }
    console.log(aux2);
});
