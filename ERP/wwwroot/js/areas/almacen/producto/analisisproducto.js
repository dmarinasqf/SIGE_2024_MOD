

var tbl10ultimascompras;

var tbl10ultimasingresoscompras;
var lblproductocompra = $('#lblproductocompra');
var tbltbodyventasvscompras = document.getElementById('tbltbodyventasvscompras');
var tbodyventas6meses = document.getElementById('tbodyventas6meses');
var theadventas6meses = document.getElementById('theadventas6meses');
var tblventas6meses = document.getElementById('tblventas6meses');

var txtprecioproducto = document.getElementById('txtprecioproducto');
var txtporcentajeganancia = document.getElementById('txtporcentajeganancia');
var txtcodarticuloanalisis = document.getElementById('txtcodarticuloanalisis');
var txtarticulodescripcionanalisis = document.getElementById('txtarticulodescripcionanalisis');
var tfootventas6meses = document.getElementById('tfootventas6meses');
var labelDinamico = document.getElementById('labelDinamico');

var txtlaboratorionombreanalisis = document.getElementById('txtlaboratorionombreanalisis');

$(document).ready(function () {
    fnbuscaranalisis();
});
$(window).on('load', function () {

    if (window.opener) {
        _fnocultarbarra();

    } else {

    }

});

function getultimascompras(idproducto, idproveedor) {

    var url = ORIGEN + "/Compras/COrdenCompra/ConsultaProductoAnalisis";
    var obj = {
        proveedor: idproveedor,
        producto: idproducto
    };

    $.post(url, obj).done(function (data) {
        
        if (data.length != 0) {
            //10 ULTIMAS ORDENES DE COMPRAS
            lista1 = $.parseJSON(data[0]);
            var fila = '';
            document.getElementById('tbltbody10ultimascompras').innerHTML = '';
            document.getElementById('tbltbody10ultimasingresoscompras').innerHTML = '';
            for (var i = 0; i < lista1.length; i++) {
                fila += '<tr>';
                fila += '<td>' + lista1[i].proveedor + '</td>';
                fila += '<td>' + lista1[i].Orden + '</td>';
                fila += '<td>' + lista1[i].fechaOC + '</td>';
                fila += '<td>' + lista1[i].costofacturar + '</td>';
                fila += '<td>' + lista1[i].cantidad + '</td>';
                fila += '<td>' + lista1[i].vvf + '</td>';
                fila += '<td>' + lista1[i].pvf + '</td>';
                fila += '<td>' + lista1[i].des1 + '</td>';
                fila += '<td>' + lista1[i].des2 + '</td>';
                fila += '<td>' + lista1[i].des3 + '</td>';
                fila += '<td>' + lista1[i].total + '</td>';
                fila += '</tr>';
            }
            document.getElementById('tbltbody10ultimascompras').innerHTML = fila;
            if (data.length > 1) {//10 ULTIMOS PREINGRESOS
                lista1 = $.parseJSON(data[1]);
                fila = '';
                document.getElementById('tbltbody10ultimasingresoscompras').innerHTML = '';
                for (var i = 0; i < lista1.length; i++) {
                    fila += '<tr>';
                    fila += '<td>' + lista1[i].proveedor + '</td>';
                    fila += '<td>' + lista1[i].tipodocumento + '</td>';
                    fila += '<td>' + lista1[i].numdocumento + '</td>';
                    fila += '<td>' + lista1[i].fechaorden + '</td>';
                    fila += '<td>' + lista1[i].fechapreingreso + '</td>';
                    fila += '<td>' + lista1[i].fechaaprobacion + '</td>';
                    fila += '<td>' + lista1[i].cantidad + '</td>';
                    fila += '<td>' + lista1[i].costofacturar + '</td>';
                    fila += '<td>' + lista1[i].des1 + '</td>';
                    fila += '<td>' + lista1[i].des2 + '</td>';
                    fila += '<td>' + lista1[i].des3 + '</td>';
                    fila += '<td>' + lista1[i].total + '</td>';
                    fila += '</tr>';
                }
                document.getElementById('tbltbody10ultimasingresoscompras').innerHTML = fila;
            }
        }
        else {
            mensaje('I', 'No hay datos en la consulta');
        }
        $('#modalultimascompras').modal('show');
    }).fail(function (data) {
        console.log(data);
        mensaje('D', 'Error en el servidor');
    });
}
function fnMAPleerdatos(idproducto, fechainicio) {
    let controller = new ReporteController();
    var obj = {
        producto: idproducto,
        fechainicio: fechainicio
    };
    controller.ReporteAnalisisProducto(obj, function (data) {
        DESBLOQUEARCONTENIDO('cardmain');
        var ventasvscompras = JSON.parse(data[0]);
        var ventasmensuales = JSON.parse(data[1]);
        //CAMBIOS SEMANA3
        var ventasmensualestotal = JSON.parse(data[2]);
        var consumoEconomato = JSON.parse(data[3]);

        tbltbodyventasvscompras.innerHTML = '';
        var fila = '';
        for (var i = 0; i < ventasvscompras.length; i++) {
            fila += '<tr>';
            fila += '<td>' + ventasvscompras[i].año + '</td>';
            fila += '<td>' + ventasvscompras[i].mes + '</td>';
            fila += '<td>' + ventasvscompras[i].ventas + '</td>';
            fila += '<td>' + ventasvscompras[i].compras + '</td>';
            fila += '</tr>';
        }
        tbltbodyventasvscompras.innerHTML = fila;
        //CAMBIOS SEMANA3
        fnMAPagregarventas6meses(ventasmensuales, ventasmensualestotal)
        //fnMAPagregarventas6meses(ventasmensuales);

        //PARA LA SUMA TOTAL DE ECONOMATO, POR SI ACASO.
        //var fila = '<tr>';
        //fila += '<td>' + datat[0]['SUCURSAL'] + '</td>';
        //fila += '<td>' + datat[0]['STOCK'] + '</td>';
        //fila += '<td>' + datat[0]['STOCK_TR'] + '</td>';
        //fila += '<td>' + datat[0]['MES_0'] + '</td>';
        //fila += '<td>' + datat[0]['MES_1'] + '</td>';
        //fila += '<td>' + datat[0]['MES_2'] + '</td>';
        //fila += '<td>' + datat[0]['MES_3'] + '</td>';
        //fila += '<td>' + datat[0]['MES_4'] + '</td>';
        //fila += '<td>' + datat[0]['MES_5'] + '</td>';
        //fila += '</tr>';

        //document.getElementById('tfootventas6meses').innerHTML = fila;

    });
}
//CAMBIOS SEMANA3
//function fnMAPagregarventas6meses(data) {
function fnMAPagregarventas6meses(data,datat) {
    tbodyventas6meses.innerHTML = '';
    theadventas6meses.innerHTML = '';
    //var fila = fnarrayultimas6mesesventas(getpivottablaventas(arraynuevo, 0, 1, 2, data));
    //CAMBIOS SEMANA3
    fnarrayultimas6mesesventas(data, datat);
    //fnarrayultimas6mesesventas(data);
    //tblventas6meses.innerHTML = fila;
}
$('#tbl10ultimascompras tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbl10ultimascompras.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
function getpivottablaventas(dataArray, rowIndex, colIndex, dataIndex, datareal) {
    var result = {}, ret = [];
    var newCols = [];
    for (var i = 0; i < dataArray.length; i++) {

        if (!result[dataArray[i][rowIndex]]) {
            result[dataArray[i][rowIndex]] = {};
        }
        result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];

        //To get column names
        if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
            newCols.push(dataArray[i][colIndex]);
        }
    }

    //newCols.sort(); 
    var item = [];

    //Add Header Row
    item.push('Sucursal');
    item.push('Stock');
    item.push.apply(item, newCols);
    ret.push(item);


    for (var key in result) {
        item = [];
        item.push(key);
        var datastock = datareal.find(x => x.sucursal == key);
        if (datastock == null)
            item.push(0);
        else
            item.push(datastock.stock);

        for (var i = 0; i < newCols.length; i++) {
            item.push(result[key][newCols[i]] || "-");
        }
        ret.push(item);
    }
    return ret;
}

//CAMBIOS SEMANA3
//function fnarrayultimas6mesesventas(data) {
function fnarrayultimas6mesesventas(data,datat) {
    try { tblventas6meses.clear().draw(); } catch (e) { console.log("x.x " + e); }
    limpiarTablasGeneradas('#contenedor', 'tblventas6meses', false);
    var arrayKeys = [];
    for (var key in data[0]) {
        arrayKeys.push(key);
    }
    var arrayFinal = [];
    for (let i = 0; i < data.length; i++) {
        var VerificacionInicial = arrayFinal.filter(x => x.SUCURSAL == data[i].SUCURSAL);
        if (VerificacionInicial.length == 0) {
            var arrayVerificacion = data.filter(x => x.SUCURSAL == data[i].SUCURSAL);
            if (arrayVerificacion.length > 1) {
                arrayFinal.push(arrayVerificacion[1]);
                //var arrayAInsertar = arrayVerificacion.filter(x => x[arrayKeys[1]] + x[arrayKeys[2]] + x[arrayKeys[3]] + x[arrayKeys[4]] + x[arrayKeys[5]]
                //    + x[arrayKeys[6]] + x[arrayKeys[7]] + x[arrayKeys[8]] != "00000000");
                //if (arrayAInsertar.length == 1)
                //    arrayFinal.push(arrayAInsertar[0]);
            }
            else {
                arrayFinal.push(data[i]);
            }
        }

    }
    datat[0]['STOCK'] = 0;
    for (var i = 0; i < arrayFinal.length; i++) {
        datat[0]['STOCK'] += parseFloat(arrayFinal[i].STOCK);
    }

    crearCabeceras(arrayFinal, '#tblventas6meses', false);
    crearCuerpo(arrayFinal, '#tblventas6meses');
    //CAMBIOS SEMANA3
    var fila = '<tr>';
    fila += '<td>' + datat[0]['SUCURSAL'] + '</td>';
    fila += '<td>' + datat[0]['STOCK'] + '</td>';
    if (!(txtcodarticuloanalisis.value.includes("EC"))) {
        fila += '<td>' + datat[0]['STOCK_TR'] + '</td>';
    }
    fila += '<td>' + datat[0]['MES_0'] + '</td>';
    fila += '<td>' + datat[0]['MES_1'] + '</td>';
    fila += '<td>' + datat[0]['MES_2'] + '</td>';
    fila += '<td>' + datat[0]['MES_3'] + '</td>';
    fila += '<td>' + datat[0]['MES_4'] + '</td>';
    fila += '<td>' + datat[0]['MES_5'] + '</td>';
    fila += '</tr>';
      
    document.getElementById('tfootventas6meses').innerHTML = fila;
    /*iniciarTabla();*/
    //var head = element.querySelectorAll('.tblventas6meses');

    //var table = "<table border='1' cellpadding='7' cellspacing='0'>";
    //var thead = '<thead class="thead-dark">';
    //var tbody = '<tbody>';
    //for (var i = 0; i < data.length; i++) {

    //    if (i == 0) {
    //        for (var j = 0; j < data[i].length; j++)
    //            if (j == 0)
    //                thead += '<th class="header-sticky" style="width:15%">' + data[i][j] + "</th>";
    //            else
    //                thead += '<th class="header-sticky" style="width:8%">' + data[i][j] + "</th>";

    //        thead += '<th></th>';
    //    }

    //    else {
    //        tbody += "<tr>";
    //        for (var j = 0; j < data[i].length; j++) {
    //            var classs = '';
    //            if (j == 1)
    //                classs = 'font-weight-bold font-14 table-warning';
    //            tbody += '<td class="' + classs + '">' + data[i][j] + "</td>";
    //        }
    //        tbody += "</tr>";
    //    }
    //}
    //tbody += "</tbody>";
    //thead += "</thead>";

    //return thead + tbody;
}

txtcodarticuloanalisis.addEventListener('click', function () {
    $('#modalproductos').modal('show');
});

$(document).on('click', '.btnpasarproducto', function () {
    var fila = this.parentNode.parentNode;
    var idproducto = this.getAttribute('idproducto');
    _idproductoanalisis = idproducto;
    _idproveedoranalisis = '';
    txtcodarticuloanalisis.value = fila.getElementsByTagName('td')[0].innerText;
    txtarticulodescripcionanalisis.value = fila.getElementsByClassName('nombreproducto')[0].innerText;
    txtlaboratorionombreanalisis.value = fila.getElementsByClassName('laboratorio')[0].innerText;
    var tipoProducto = fila.getElementsByClassName('tipo')[0].innerText;
    //fnBuscarUltimos10ConsumoEconomato(idproducto);
    if (txtcodarticuloanalisis.value.includes("EC")) {
        labelDinamico.innerText = "CONSUMO ECONOMATO";
    } else {
        labelDinamico.innerText = "VENTAS DEL AÑO";
    }

    fnBuscarPrecioProducto(idproducto);
    fnBuscarProducto(idproducto);
    fnbuscaranalisis();
    $('#modalproductos').modal('hide');
});
function fnbuscaranalisis() {
    if (_idproductoanalisis != 0) {
        BLOQUEARCONTENIDO('cardmain', 'Buscando datos');
        getultimascompras(_idproductoanalisis, _idproveedoranalisis);
        fnMAPleerdatos(_idproductoanalisis, '');
    }
}
function fnBuscarPrecioProducto(idproducto) {
    var url = ORIGEN + "/Comercial/ListaPrecios/ListarPreciosxListasyProducto";
    var obj = {
        listas: "1001",
        idproducto: idproducto
    };

    $.post(url, obj).done(function (data) {
        if (data.length != 0) {
            txtprecioproducto.value = data[0].precio;
        } else {
            txtprecioproducto.value = 0;
        }
    });
}
function fnBuscarProducto(idproducto) {
    var controller = new ProductoController();
    controller.BuscarProducto(idproducto, function (data) {
        if (data != null) {
            if (data.porcentajeganancia != null || data.porcentajeganancia != undefined) {
                txtporcentajeganancia.value = data.porcentajeganancia;
            } else {
                txtporcentajeganancia.value = "";
            }
        }
    });
}