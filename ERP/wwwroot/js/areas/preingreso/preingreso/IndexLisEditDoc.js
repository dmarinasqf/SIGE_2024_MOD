var tbllista;


var btnbusqueda = $('#btnbusqueda');
var txtfechaconsulta = $('#txtfechaconsulta');

var txtcodpreingreso = document.getElementById('txtcodpreingreso');
var txtcodigororden = document.getElementById('txtcodigororden');
var txtidlote = document.getElementById('txtidlote');
var txtestadolote = document.getElementById('txtestadolote');
$(document).ready(function () {
    iniciarTablaVista();
});
function iniciarTablaVista() {
   
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = false;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable);
    fnBuscarPreingresos();
}

$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

// Verifica si los elementos no son null antes de agregar los eventos
if (txtcodpreingreso && txtcodigororden && txtidlote && txtestadolote) {
    // Agrega eventos 'change' a cada elemento
    txtcodpreingreso.addEventListener('change', function () {
        fnBuscarPreingresos();
    });

    txtcodigororden.addEventListener('change', function () {
        fnBuscarPreingresos();
    });

    txtidlote.addEventListener('change', function () {
        fnBuscarPreingresos();
    });

    txtestadolote.addEventListener('change', function () {
        fnBuscarPreingresos();
    });
} else {
    console.error("Elemento no encontrado");
}
$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    fnBuscarPreingresos();
  
});

function fnBuscarPreingresos() {
    var txtcodpreingresoval = $('#txtcodpreingreso').val();
    var txtcodigorordenval = $('#txtcodigororden').val();
    var txtidloteval = $('#txtidlote').val();
    var txtestadoloteval = $('#txtestadolote').val();

    var obj = {
        txtcodpreingreso: txtcodpreingresoval,
        txtcodigororden:txtcodigorordenval,
        txtidlote:txtidloteval,
        txtestadolote:txtestadoloteval
    };
    //btnbusqueda.prop('disabled', true);
    var controller = new PreingresoController();
    controller.ListarDocumentospreingreso(obj, fnAgregarFilasTabla);
}

function fnAgregarFilasTabla(data) {
    console.log(data);
    tbllista.clear().draw();
    for (var i = 0; i < data.length; i++) {
        tbllista.row.add([
            '<div class="btn-group btn-group-sm">' +
            '<a class="btn btn-sm btn-outline-warning font-10" data-toggle="tooltip" data-placement="top" title="Editar DocLote" onclick="editardoclote(' + data[i]['IDLOTETABLA'] + ')"><i class="fas fa-edit"></i></a>'+
            '<button class="btn btn-sm btn-outline-info btnverdocumento font-10" data-toggle="tooltip" data-placement="top" title="Ver Documento"><a target="_blank" href="' + data[i]['previzualizacionarchivo'] + '"><i class="fas fa-eye"></i></a></button>' +
            '</div>',
            data[i]['codigopreingreso'],
            data[i]['CODIGOORDEN'],
           /* moment(data[i]['FECHApri']).format('DD/MM/YYYY hh:mm A'),*/
            data[i]['ESTADOPRin'],
            data[i]['codigoproducto'],
            data[i]['NOMBREPRODUCTO'],
            //data[i]['TIPOPRODUCTO'],
            //data[i]['LABORATORIO'],
            data[i]['CANTIDADOC'],
           /* data[i]['TIPO INGRESO'],*/
            data[i]['UBICACIONARCHIVO'],
            data[i]['nombrecarpeta'],
            data[i]['nombrearchivo']
          
        ]).draw(false);
    }
    tbllista.columns.adjust().order([4, 'desc']).draw(false);
}
function verfacturas(id) {
    var obj = new _FacturasPreingreso();
    obj.fnListarFacturasPreingresoSinCheck(id);
    
}


function editardoclote(idloteeditar) {
    console.log(idloteeditar);
    limpiarModalEditardoDocumento();
    var obj = {
        idloteeditar: idloteeditar
    };
    var controller = new PreingresoController();
    controller.listaDatoDocumentosLote(obj, fnagregardatosmodal);
    $('#modaleditardocumento').modal('show');
}
function limpiarModalEditardoDocumento() {
    $('#txtcodigocarpeta').val('');
    $('#txtcodigodocumento').val('');
    $('#txtiddocumentoDrive').val('');

    $('#codigoLoteLabel').text('');
    $('#urlidlabel').attr('href', '#').hide();
    $('#nombreArchivoLabel').text('');
    $('#archivoPDF').val('');
}
function fnagregardatosmodal(data) {
    console.log(data);
    if (data && data.length > 0) {
        var objetoData = data[0];
        $('#codigoLoteLabel').text(objetoData.idlote);
        $('#urlidlabel').attr('href', objetoData.previzualizacionarchivo);
        $('#nombreArchivoLabel').text(objetoData.nombrearchivo);
        $('#txtcodigocarpeta').val(objetoData.codigocarpeta);
        $('#txtcodigodocumento').val(objetoData.codigoarchivo);
        $('#txtiddocumentoDrive').val(objetoData.iddocumentoDrive);
        $('#modaleditardocumento').modal('show');
    }
 

}


function editararchivolote() {

    var inputFile = $("#archivoPDF")[0].files[0];
    var inputFileval = $("#archivoPDF")[0];
    var valorCodigocarpeta = $("#txtcodigocarpeta").val();
    var valorCodigodocumento = $("#txtcodigodocumento").val();
    var valorIddocumentoDrive= $("#txtiddocumentoDrive").val();

    if (inputFileval.files.length === 0) {
        mensaje('W', "Agregue un nuevo archivo");
        return; // La función se termina aquí si no hay un archivo seleccionado
    }
    var formData = new FormData();
    var drdecredentials = "D:\TXT\credentials.json";
    formData.append('file', inputFile);
    formData.append('nombreArchivo', inputFile.name);
    formData.append('valorCodigocarpeta', valorCodigocarpeta);
    formData.append('valorCodigodocumento', valorCodigodocumento);
    formData.append('txtiddocumentoDrive', valorIddocumentoDrive);
    formData.append('drdecredentials', drdecredentials);
    BLOQUEARCONTENIDO('idcodigomodaleditardoc', 'Editando documento ..');
    var url = ORIGEN + "/PreIngreso/PIPreingreso/editarpdfpreingreso";
    $.ajax({
        url: url,  // Ajusta la ruta según tu configuración
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            var mensajeedit = "";
            if (data != "Error al guardar el archivo: Lanzar al catch") {
                var obj = JSON.parse(data);
                 mensajeedit = obj[0].MENSAJE;
            } else {
                mensajeedit = "Error al guardar el archivo: Lanzar al catch";
            }

           
            if (mensajeedit == "ACTUALIZADO") {
                $('#modaleditardocumento').modal('hide');
                alertaSwall('S', 'Documento actualizado', '');           
                fnBuscarPreingresos();
            } else {
                mensaje('W', mensajeedit);
            }
            DESBLOQUEARCONTENIDO('idcodigomodaleditardoc');
        },
        error: function (data) {
            mensajeError(data);
            DESBLOQUEARCONTENIDO('idcodigomodaleditardoc');
        }
    });
}
//$(document).on('click', '.btnimprimir', function () {
//    var href = $(this).attr('href'); console.log(href);
//    if (href != '')
//        ABRIR_MODALIMPRECION(href, 'IMPRIMIR PREINGRESO COMPLETO');
//});
