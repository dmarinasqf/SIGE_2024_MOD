
var MDP_tblpreingreso;
var MDP_txtfactura = $('#MDP_txtfactura');
var MDP_timerbusqueda = null;
//var txtbuscarordencompra = document.getElementById('txtbuscarordencompra');
$(document).ready(function () {
    MDP_tblpreingreso = $('#MDP_tblpreingreso').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: true,
        info:false,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            }]
    });
    MDP_fnCargarPreingreso();
});

$('#MDP_tblpreingreso tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        MDP_tblpreingreso.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

MDP_txtfactura.on('keyup', function (e) {
    clearTimeout(MDP_timerbusqueda);
    var $this = this;
    MDP_timerbusqueda = setTimeout(function () {
        if (e.key != 'Enter') {
            MDP_fnCargarPreingreso();
        }

    }, 1100);
});
function MDP_fnCargarPreingreso() {
    let controller = new PreingresoController();
    var obj = {
        estado: 'TERMINADO',
        id: '',
        factura: MDP_txtfactura.val()
    };
   
    controller.ListarPreingresosParaAnalisis(obj, function (data) {
        MDP_tblpreingreso.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            var fila = MDP_tblpreingreso.row.add([
                data[i]['ID'],
                data[i]['IDFACTURA'],
                data[i]['FACTURAS'],
                data[i]['CODIGO'],               
                data[i]['RUC'],
                data[i]['RAZONSOCIAL'],
                moment(data[i]['FECHA']).format('DD/MM/YYYY hh:mm:ss'),
                data[i]['SUCURSAL'],
                data[i]['ESTADO'],
                data[i]['ESTADOFACTURA'],
                data[i]['USERNAME'],
                '<button class="btn-pasar-preingreso btn btn-sm btn-success" id=' + data[i]['IDFACTURA'] + '><i class="fas fa-check "></i></button>'
            ]).draw(false).node();
            if (data[i]['SUCURSALDESTINO'] == NOMBRESUCURSAL)
                fila.classList.add('table-success');
            MDP_tblpreingreso.columns.adjust().draw(false);
        }
    });
}



//var tbltipoanalisis;
//var nombretabla ='tblpreingreso';
//$(document).ready(function () {
//    //iniciarTablaVista();
//    listarPreingresos();
//});

//function iniciarTablaVista() {
//    tblpreingreso = $('#' + nombretabla).DataTable({
//        "searching": true,
//        lengthChange: false, 
//        "ordering": false,
//        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
//        //dom: 'Bfrtip',
//        responsive: true,
//        "language": LENGUAJEDATATABLE(),
//        "columnDefs": [
//            {
//                "targets": [0],
//                "visible": false,
//                "searchable": false
//            }, {
//                "targets": [1],
//                "visible": false,
//                "searchable": false
//            }, {
//                "targets": [6],
//                "visible": false,
//                "searchable": false
//            }, {
//                "targets": [7],
//                "visible": false,
//                "searchable": false
//            }
//        ]
//    });
   
//}

//function listarPreingresos() {
//    limpiarTablasGeneradas('#paneltabla', nombretabla, false);
//    let controller = new PreingresoController();
//    var obj = {
//        estado: 'TERMINADO',
//        id: ''
//    };
//    controller.ListarPreingresosParaAnalisis(obj, function (data) {
//        var datos = data; //$.parseJSON(data);
//        if (datos.length !== 0) {
//            lista = datos;
//            crearCabecerasVista(datos, "#" + nombretabla, false);
//            crearCuerpoVista(datos, '#' + nombretabla);
//            iniciarTablaVista();
//        }
//        else {
//            mensaje('I', 'No hay datos en la consulta');
//        }
//    });   
//}

//function crearCuerpoVista(datos, tablename, controles) {
//    var fila = "";
//    for (var i = 0; i < datos.length; i++) {
//        fila += '<tr>';
//        var valores = GetValores(datos[i]);
//        var cabeceras = GetHeaders(datos);
//        for (var j = 0; j < valores.length; j++) {
//            //if (cabeceras[j] === 'ORDENES')
//            //    fila += '<td style="font-size:10px">' + valores[j]  + "</td>";
//            //else
//            fila += "<td>" + valores[j] + "</td>";
//            if (j + 1 === valores.length)
//                fila += '<td class="center">' +
//                    '<button class=" btn btn-sm btn-success btn-pasar-preingreso"><i class="fas fa-check"></i></button>'   
//                    '</td>';
//        }

//        fila += '</tr>';
//    }
//    $(tablename + " tbody").append(fila);
//}
//function crearCabecerasVista(datos, tablename, sticky) {
//    var stick = '';
//    if (sticky)
//        stick = 'class="header-sticky"';
//    var cabeceras = GetHeaders(datos);
//    var tabla = $(tablename + ' thead');
//    var nuevaFila = "<tr>";
//    for (var i = 0; i < cabeceras.length; i++) {

//        nuevaFila += "<th " + stick + ">" + cabeceras[i] + "</th>";
//    }
//    nuevaFila += "<th ></th>";
//    nuevaFila += "</tr>";
//    $(tablename + ' thead').append(nuevaFila);
//}


// function limpiarTabla(contenedortable,tablename,sticky) {
//    $(contenedortable).empty();
//    var tablasticky = '';
//    if (sticky)
//        tablasticky = 'tabla-sticky';
//     var tabla = `<table font-12 table-hover table-bordered ` + tablasticky +` " id="` + tablename +`" style="width:100%">
//        <thead class="" >
//        </thead >
//        <tbody class="">
//        </tbody>`;
//    $(contenedortable).append(tabla);
//}

//$('#tblpreingreso tbody').on('click', 'tr', function () {
//    if ($(this).hasClass('selected')) {
//        console.log();
//    }
//    else {
//        tblpreingreso.$('tr.selected').removeClass('selected');
//        $(this).addClass('selected');
//    }
//});