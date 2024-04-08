var AI_txtcodigo = $('#AI_txtcodigo');
var AI_txtproducto = $('#AI_txtproducto');
var AI_txtlaboratorio = $('#AI_txtlaboratorio');
var AI_txtid = $('#AI_txtid');
var AI_txttipo = $('#AI_txttipo');
var AI_txtuma = $('#AI_txtuma');
var AI_lbltipodeitem = $('#AI_lbltipodeitem');
var AI_txtcantidad = $('#AI_txtcantidad');
var AI_txttipobonificacion = $('#AI_txttipobonificacion');

function vermodaladditem() {
    $('#modalagregaritem').modal('show');
}
function ocultarmodaladditem() {
    $('#modalagregaritem').modal('hide');
}

AI_txtcodigo.click(function (e) {   
    $('#modalproductos').modal('show');
});

$(document).on('click', '.btnpasarproducto', function (e) {
 
    var columna = tbl_CBPtabla.row($(this).parents('tr')).data();    
  
    AI_txtid.val(columna[0]);
    AI_txtcodigo.val(columna[1]);
    AI_txtproducto.val(FN_GETDATOHTML(columna[2],'nombreproducto'));
    AI_txttipo.val($(this).parents("tr").find('.tipo').text());
    AI_txtuma.val($(this).parents("tr").find('.um').text());
    AI_txtlaboratorio.val($(this).parents("tr").find('.laboratorio').text());
    $('#modalproductos').modal('hide');
});



function limpiarmodaladditem() {
    $('#formadditem').trigger('reset');
    AI_lbltipodeitem.text('');
}
