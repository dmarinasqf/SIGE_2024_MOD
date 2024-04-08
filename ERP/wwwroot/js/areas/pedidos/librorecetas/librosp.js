
var tblReporte;
var cmbSucursal = $('#cmbSucursal');
var cmbLaboratorio = $('#cmbLaboratorio');
var cmbLibro = $('#cmbLibro');
var txtcodsucursalreceta = document.getElementById('txtcodsucursalreceta');
var txtcodlaboratorioreceta = document.getElementById('txtcodlaboratorioreceta');
var cmbtiporeporte = document.getElementById('cmbtiporeporte');
var sucursal = '';
var nombresucursal = '';
var tiposucursal = '';
var tipolibro = '';
$(document).ready(function () {   
    let controller = new SucursalController();
    controller.ListarTodasSucursales( 'cmbSucursal');
    controller.ListarSucursalesByTipoLocal('cmbLaboratorio','PRODUCCIÓN');
});

cmbSucursal.change(function () {
    txtcodsucursalreceta.value = 'LR' + cmbSucursal.val();
});
cmbLaboratorio.change(function () {
    txtcodlaboratorioreceta.value = 'LR' + cmbLaboratorio.val();
});

$("#btnExportar").click(function () {
    descargarReporte();
});
$("#btnConsultar").click(function () {
    getReporteGeneral();
});

function getReporteGeneral() {
    if (cmbLibro.val() == '') {
        mensaje('I', 'Seleccione tipo de libro');
        return;
    }
    $('#btnConsultar').prop('disabled', true);
   

    var url = ORIGEN + '/Pedidos/LibroRecetas/GetLibro';
    if (cmbLibro.val() == 'LOCAL') {
        sucursal = cmbSucursal.val();
        nombresucursal = $('select[id="cmbSucursal"] option:selected').text();
        tiposucursal = 'LOCAL';
       
    }

    if (cmbLibro.val() == 'LABORATORIO') {
        sucursal = cmbLaboratorio.val();
        nombresucursal = $('select[id="cmbLaboratorio"] option:selected').text();
        tiposucursal = 'LABORATORIO';
       
    }
    if (tiposucursal == 'LOCAL' && cmbSucursal.val() == "")
        nombresucursal = "TODOS";
    if (tiposucursal == 'LABORATORIO' && cmbLaboratorio.val() == "")
        nombresucursal = "TODOS";

    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }
  
    var obj = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        sucursal: sucursal,
        consulta: 'CONSULTA',
        tipolibro: cmbtiporeporte.value,
        tiposucursal: tiposucursal,
        nombresucursal: nombresucursal
    };
   
    try {
        tblReporte.clear().draw();

    } catch (e) {
        console.log("x.x");
    }

    limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
    console.log(obj);
    $.post(url, obj).done(function (data) {
       
        var datos = (data);
        if (datos.length != 0) {
            fncrearcabeceras(datos);
            fncrearcuerpo(datos);
            iniciarTabla();
            
        }
        else {
            mensaje('I', 'No hay datos en la consulta');
          
        }

        $('#btnConsultar').prop('disabled', false);
    }).fail(function (data) {
      
        mensajeError(data);
        $('#btnConsultar').prop('disabled', false);
     
    });
}

function descargarReporte() {
    if (cmbLibro.val() == '') {
        mensaje('I', 'Seleccione tipo de libro');
        return;
    }
    $('#btnExportar').prop('disabled', true);
    var url = ORIGEN + '/Pedidos/LibroRecetas/GetLibro';



    if (cmbLibro.val() == 'LOCAL') {
        sucursal = cmbSucursal.val();
        nombresucursal = $('select[id="cmbSucursal"] option:selected').text();
        tiposucursal = 'LOCAL';
       
    }
    if (cmbLibro.val() == 'LABORATORIO') {
        sucursal = cmbLaboratorio.val();
        nombresucursal = $('select[id="cmbLaboratorio"] option:selected').text();
        tiposucursal = 'LABORATORIO';
      
    }

    if (tiposucursal == 'LOCAL' && cmbSucursal.val() == "")
        nombresucursal = "TODOS";
    if (tiposucursal == 'LABORATORIO' && cmbLaboratorio.val() == "")
        nombresucursal = "TODOS";
    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }

    var obj = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        sucursal: sucursal,
        consulta: 'EXPORTACION',
        tipolibro: cmbtiporeporte.value,
        tiposucursal: tiposucursal,
        nombresucursal: nombresucursal
    };
    $.post(url, obj).done(function (data) {
        if (data.mensaje == 'ok')
            location.href = ORIGEN +  data.objeto;
        else
            mensaje('W', data.mensaje);
        $('#btnExportar').prop('disabled', false);
    }).fail(function (data) {
        mensajeError(data);
        $('#btnExportar').prop('disabled', false);

    });
}
function fncrearcabeceras(datos) {
    var cabeceras = GetHeaders(datos);  
    var nuevaFila = "<tr>";
    for (var i = 0; i < cabeceras.length - 1; i++) {
        nuevaFila += "<th>" + cabeceras[i] + "</th>";
    }
    nuevaFila += "<th></th></tr>";
    $("#tblreporte thead").append(nuevaFila);
}
function fncrearcuerpo(datos) {
    var fila = "";
    var cabeceras = GetHeaders(datos);
    for (var i = 0; i < datos.length; i++) {
        fila += '<tr>';
        var valores = GetValores(datos[i]);
        for (var j = 0; j < valores.length - 1; j++) {
            if (cabeceras[j] == "FORMULA") {
                fila += "<td>" + '<div style="word-wrap: break-word; word-break:break-all">' + valores[j] + '</div>', + "</td>";
            } else
                fila += "<td>" + valores[j] + "</td>";
        }
        if (datos[i]['IMAGENES'] > 0)
            fila += '<td><button class="btn btn-sm btn-info" onclick="fnmostrarpedido(' + datos[i]['ID'] + ')"><i class="fas fa-eye"></i></button></td>';
        else
            fila += '<td><button class="btn btn-sm btn-secondary" onclick="fnmostrarpedido(' + datos[i]['ID'] + ')"><i class="fas fa-eye"></i></button></td>';
        fila += '</tr>';
    }
    $("#tblreporte tbody").append(fila);
}




cmbLibro.change(function () {
    if (cmbLibro.val() == '') {
        cmbSucursal.prop('disabled', true);
        cmbLaboratorio.prop('disabled', true);
        txtcodsucursalreceta.value = '';
        txtcodlaboratorioreceta.value = '';
    }
    if (cmbLibro.val() == 'LOCAL') {
        cmbSucursal.prop('disabled', false);
        cmbLaboratorio.val("");
        cmbLaboratorio.prop('disabled', true);
        txtcodlaboratorioreceta.value = '';
    }
    if (cmbLibro.val() == 'LABORATORIO') {
        cmbSucursal.val("");
        cmbSucursal.prop('disabled', true);
        cmbLaboratorio.prop('disabled', false);
        txtcodsucursalreceta.value = '';
    }

});
function fnmostrarpedido(id) {
    console.log(id);
    MVPbuscarpedido(id);
}
function iniciarTabla() {
    tblreporte = $('#tblreporte').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}