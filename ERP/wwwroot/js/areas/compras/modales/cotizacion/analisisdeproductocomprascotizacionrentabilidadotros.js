

var tbl10ultimascompras;
var tbl10ultimasingresoscompras;
var lblproductocompra = $('#lblproductocompra');
var tbltbodyventasvscompras = document.getElementById('tbltbodyventasvscompras');
var tbodyventas6meses = document.getElementById('tbodyventas6meses');
var theadventas6meses = document.getElementById('theadventas6meses');



var txtcodarticuloanalisis = document.getElementById('txtcodarticuloanalisis');
var txtarticulodescripcionanalisis = document.getElementById('txtarticulodescripcionanalisis');
var tblventas6meses = document.getElementById('tblventas6meses');

var txtlaboratorionombreanalisis = document.getElementById('txtlaboratorionombreanalisis');


function getultimascompras(idproducto, idproveedor) {

    var url = ORIGEN + "/Compras/COrdenCompra/ConsultaProductoAnalisis";
    var obj = {
        proveedor: idproveedor,
        producto: idproducto
    };

    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.length != 0) {
            //10 ULTIMAS ORDENES DE COMPRAS
            lista1 = $.parseJSON(data[0]);
            var fila = '';
            document.getElementById('tbltbody10ultimascompras').innerHTML = '';
            document.getElementById('tbltbody10ultimasingresoscompras').innerHTML = '';
            for (var i = 0; i < lista1.length; i++) {
                fila += '<tr>';
                fila += '<td>' + lista1[i].proveedor + '</td>';
                fila += '<td>' + lista1[i].orden + '</td>';
                fila += '<td>' + lista1[i].fecha + '</td>';
                fila += '<td>' + lista1[i].fechaaprobacion + '</td>';
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
                    fila += '<td>' + lista1[i].fechadocumento + '</td>';
                    fila += '<td>' + lista1[i].fechapreingreso + '</td>';
                    fila += '<td>' + lista1[i].fechaorden + '</td>';
                    fila += '<td>' + lista1[i].cantidad + '</td>';
                    fila += '<td>' + lista1[i].costo + '</td>';
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
        var ventasvscompras = JSON.parse(data[0]);
        var ventasmensuales = JSON.parse(data[1]);
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
        fnMAPagregarventas6meses(ventasmensuales);

    });
}
function fnMAPagregarventas6meses(data) {
    tbodyventas6meses.innerHTML = '';
    theadventas6meses.innerHTML = '';
    var arraynuevo = [];
    for (var i = 0; i < data.length; i++) {
        var mes = data[i].mes + '(' + data[i].ano + ')';       
        arraynuevo.push([data[i].sucursal, mes, data[i].cantidad, data[i].stock]);
        data[i].mes = mes;
    } 
    var fila = fnarrayultimas6mesesventas(getpivottablaventas(arraynuevo, 0, 1, 2, data));
   
    tblventas6meses.innerHTML = fila;
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
function getpivottablaventas(dataArray, rowIndex, colIndex, dataIndex,datareal) {
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
function fnarrayultimas6mesesventas(myArray) {
    //var table = "<table border='1' cellpadding='7' cellspacing='0'>";
    var thead = '<thead class="thead-dark">';
    var tbody = '<tbody>';
    for (var i = 0; i < myArray.length; i++) {
       
        if (i == 0) {
            for (var j = 0; j < myArray[i].length; j++)
                thead += '<th class="header-sticky" style="width:10%">' + myArray[i][j] + "</th>";
            thead += '<th></th>';
        }
           
        else {
            tbody += "<tr>";
            for (var j = 0; j < myArray[i].length; j++) {
                var classs='';
                if (j == 1)
                    classs = 'font-weight-bold font-14 table-warning';
                tbody += '<td class="'+classs+'">' + myArray[i][j] + "</td>";
            }
            tbody += "</tr>";
        }           
    }
    tbody += "</tbody>";
    thead += "</thead>";

    return  thead + tbody;
}  