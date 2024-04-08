var tbllotevencimiento;
var btnagregarlote = $('#btnagregarlote');
var txtindexlote = $('#txtindexlote');
var txtidedetallemodallotes = $('#txtidedetallemodallotes');
var txtcantidadtotalmodallote = $('#txtcantidadtotalmodallote');
var txtcantidadrestantelote = $('#txtcantidadrestantelote');
var btnguardarlotes = document.getElementById('btnguardarlotes');

var codigoProdAprobFactura;

var _PRIMERLOTEMODAL = [];
var _LOTESPORPRODUCTO = [];
$(document).ready(function () {
    tbllotevencimiento = $('#tbllotevencimiento').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }, {
                "targets": [1],
                "visible": false,
                "searchable": false
            }]
    });


});
$('#tbllotevencimiento tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllotevencimiento.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
btnagregarlote.click(function (e) {
    var count = tbllotevencimiento.rows().data().length;
    agregarNuevoLoteModal();
});

$('#btnagregaritemlote').click(function (e) {

    var txtcantidadrestantelotenuevo = $('#txtcantidadrestantelote').val();
    var aceptalote = '';
    var aceptafechavencimiento = '';
    var aceptaregsanitario = '';
    try {
        if (PRODUCTOLOTE.aceptalote)
            aceptalote = 'required';
        if (PRODUCTOLOTE.aceptafechavence)
            aceptafechavencimiento = 'required';
        if (PRODUCTOLOTE.aceptaregsanitario)
            aceptaregsanitario = 'required';
    } catch (e) {
        console.log('error en PRODUCTOLOTE');
    }
    // Additional validation for lote_cantidad
    var loteCantidadValid = true;

    $('.lote_cantidad').each(function () {
        if ($(this).val() == 0) {
            loteCantidadValid = false;
            return false; // exit the loop if any value is 0
        }
    });

    if (!loteCantidadValid) {
        alertaSwall('W', 'No se puede agregar porque hay una fila con el valor 0', '');
        return; // prevent further execution
    }

    if (txtcantidadrestantelotenuevo != 0 && loteCantidadValid == true) {


        try {
            auxtfila = tbllotevencimiento.row.add([
                '0',
                txtidedetallemodallotes.val(),
                '<label class="lote_producto">' + PRODUCTOLOTE.nombre + '</label>',
                '<input class="lote_cantidad inputdetalle " type="number" min="0" value="0" oninput="miFuncion(this.value)" required/>',
                '<input onblur="validarnuevodoc(this)" class="lote_lote inputdetalle " type="text"   ' + aceptalote + '/>',
                '<input min="' + (moment().format('YYYY-MM-DD')) + '" class="lote_fechavencimiento inputdetalle " type="date"  ' + aceptafechavencimiento + ' min="' + (moment().format('YYYY-MM-DD')) + '"/>',
                '<input type="text" class="lote_registrosanitario inputdetalle"  maxlength="18" ' + aceptaregsanitario + '/>',
                '<input type="text" class="lote_nprescripcion inputdetalle  maxlength="18" readonly/>',
                '<label class="lote_vigencia"></label>',
                '<textarea class="lote_observacion inputdetalle " rows=2 ></textarea>',

                '<div class="btn-group btn-group-sm text-center d-flex justify-content-center">' +
                '<input class="codigoproductonombre" type="text"  style="display: none;" value="' + PRODUCTOLOTE.codigoproducto + '"/>' +
                '<input class="btnsubirarchivo" type="file" style="display: none;"   onchange="manejarCargaArchivo(this.files)" accept=".pdf">' +
                '<button style="display: block;" class="btn btn-sm btn-outline-info" type="button" onclick="abrirInputArchivo(this)" data-toggle="tooltip"  data-placement="top" title="Subir archivo"><i class="fa fa-file"></i></button>' +
                '&nbsp;' +

                '<button class="btn btn-sm btn-outline-danger btnquitarlote" type="button" data-toggle="tooltip" data-placement="top" title="Borrar"><i class="fas fa-trash-alt"></i></button>' +
                '</div>'

            ]).draw(false).node();
            $(auxtfila).find('td').eq(0).attr({ 'style': 'width:20%' });
            $(auxtfila).find('td').eq(1).attr({ 'style': 'width:7%' });
            $(auxtfila).find('td').eq(2).attr({ 'style': 'width:8%' });
            $(auxtfila).find('td').eq(3).attr({ 'style': 'width:12%' });
            $(auxtfila).find('td').eq(4).attr({ 'style': 'width:8%' });
            $(auxtfila).find('td').eq(5).attr({ 'style': 'width:8%' });
            $(auxtfila).find('td').eq(6).attr({ 'style': 'width:10%' });

        } catch (e) {
            console.log(e);
        }
    } else {
        alertaSwall('W', 'No se puede agregar porque la cantidad restante es menor a 0', '');
    }
});



$(document).on('change', '.lote_fechavencimiento', function (e) {
    var fecha2 = $(this).parents("tr").find('.lote_fechavencimiento').val();
    fecha2 += '-01';
    if (fecha2.length != 10)
        return;
    fecha2 = moment(fecha2).format('MM/DD/YYYY');
    var fechaactual = moment().format('MM/DD/YYYY');
    var vigencia = restarfechas(fechaactual, fecha2);
    $(this).parents("tr").find('.lote_vigencia').text(vigencia);

});
$(document).on('keyup', '.lote_fechavencimiento', function (e) {
    var fecha2 = $(this).parents("tr").find('.lote_fechavencimiento').val();
    fecha2 += '-01';
    if (fecha2.length != 10)
        return;
    fecha2 = moment(fecha2).format('MM/DD/YYYY');
    var fechaactual = moment().format('MM/DD/YYYY');
    var vigencia = restarfechas(fechaactual, fecha2);
    $(this).parents("tr").find('.lote_vigencia').text(vigencia);
});
$(document).on('click', '.lote_fechavencimiento', function (e) {
    var fecha2 = $(this).parents("tr").find('.lote_fechavencimiento').val();
    fecha2 += '-01';
    if (fecha2.length != 10)
        return;
    fecha2 = moment(fecha2).format('MM/DD/YYYY');
    var fechaactual = moment().format('MM/DD/YYYY');
    var vigencia = restarfechas(fechaactual, fecha2);
    $(this).parents("tr").find('.lote_vigencia').text(vigencia);
});
$(document).on('click', '.btnquitarlote', function (e) {
    tbllotevencimiento.row('.selected').remove().draw(false);
});
//$('#modalfechaylote').on('hidden.bs.modal', function (e) {
//    btnguardarlotes.click();
//    $('#formlotes').submit();
//    fnActualizarArrayLotes();
//});
$('#formlotes').submit(function (e) {
    e.preventDefault();
    var txtcantidadrestantelotenuevo = $('#txtcantidadrestantelote').val();
    var loteCantidadValid = true;
    $('.lote_cantidad').each(function () {
        if ($(this).val() == 0) {
            loteCantidadValid = false;
            return false; // exit the loop if any value is 0
        }
    });

    if (txtcantidadrestantelotenuevo != 0) {
        alertaSwall('W', 'No se puede guardar porque hay cantidades restantes', '');
    } else {
        if (!loteCantidadValid) {
            alertaSwall('W', 'No se puede guardar porque hay una fila con el valor 0', '');
        } else {

            fnActualizarArrayLotes();
        }

    }

});
function agregarLoteModal(data, tipo) {
    tbllotevencimiento.clear().draw(false);
    if (tipo === 'primero') {
        agregarItemTablaLotes(data);
    }
    if (tipo === 'otros') {
        for (var i = 0; i < data.length; i++) {
            agregarItemTablaLotes(data[i]);
        }
    }
}
//function getLotesTabla() {
//    var filas = document.querySelectorAll("#tbllotevencimiento tbody tr");   
//    var c = 0;
//    var respuesta = new Object();
//    var array = [];
//    filas.forEach(function (e) {   
//        respuesta = new Object();
//        respuesta.idlote = getvalortablaLote(c, 0);
//        respuesta.iddetallepreingreso = getvalortablaLote(c, 1);
//        respuesta.producto = document.getElementsByClassName("producto")[c].innerHTML;
//        respuesta.cantidad = document.getElementsByClassName("cantidad")[c].value;
//        respuesta.lote = document.getElementsByClassName("lote")[c].value.trim();
//        //respuesta.mm = document.getElementsByClassName("cmbmeslote")[c].value;
//        //respuesta.yyyy = document.getElementsByClassName("anolote")[c].value;
//        respuesta.fechavencimiento = document.getElementsByClassName("fechavencimiento")[c].value+'-01';
//        respuesta.registrosanitario = document.getElementsByClassName("registrosanitario")[c].innerHTML;
//        respuesta.nprescripcion = document.getElementsByClassName("nprescripcion")[c].value;
//        respuesta.registrosanitario = document.getElementsByClassName("registrosanitario")[c].value;
//        respuesta.vigencia = document.getElementsByClassName("vigencia")[c].innerHTML;
//        respuesta.observacion = document.getElementsByClassName("observacion")[c].value;         
//        array[c] = respuesta;
//        c++;
//    }); 
//    return array;
//}
function calcularvigencia(fecha) {
    //console.log(moment(fecha).format('MM/DD/YYYY'));
    if (fecha === '')
        return '';
    var fecha2 = moment(fecha).format('MM/DD/YYYY');
    var fechaactual = moment().format('MM/DD/YYYY');
    return restarfechas(fechaactual, fecha2);
}
function agregarItemTablaLotes(data, producto) {
    var aceptalote = '';
    var aceptafechavencimiento = '';
    var aceptaregsanitario = '';
    codigoProdAprobFactura = producto.codigoproducto;
    console.log(_LOTESPORPRODUCTO);

    try {

        if (producto.aceptalote)
            aceptalote = 'required';
        if (producto.aceptafechavence)
            aceptafechavencimiento = 'required';
        if (producto.aceptaregsanitario)
            aceptaregsanitario = 'required';
    } catch (e) {
        console.log('error en PRODUCTOLOTE');
    }
    var auxtfila;
    tbllotevencimiento.clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        if (data[i].registrosanitario == '')
            data[i].registrosanitario = producto.regsanitario;
        if (data[i].fechavencimiento == '')
            data[i].fechavencimiento = producto.fechavencimiento;
        if (data[i].lote == '')
            data[i].lote = producto.lote;
        var cantidad = data[i].cantidad;
        if (i == 0 && data.length == 1)
            cantidad = txtcantidadtotalmodallote.val();

        var codigolote = data[i].lote;
        var iddetallepreingreso = data[i].iddetallepreingreso;
        var idproducto = producto.idproducto;
        auxtfila = tbllotevencimiento.row.add([
            data[i].idlote,
            data[i].iddetallepreingreso,
            '<label class="lote_producto">' + producto.nombre + '</label>',//EARTCOD1015
            '<input class="lote_cantidad inputdetalle " type="number" min="0" value="' + cantidad + '" oninput="miFuncion(this.value)" required/>',
            '<input onblur="validarExiteDocLote(\'' + codigolote + '\',' + iddetallepreingreso + ',' + idproducto + ')" class="lote_lote inputdetalle" type="text" value="' + (data[i].lote ?? '') + '" ' + aceptalote + '/>',
            '<input min="' + (moment().format('YYYY-MM-DD')) + '" class="lote_fechavencimiento inputdetalle " type="date"  value="' + (data[i].fechavencimiento === undefined ? '' : moment(data[i].fechavencimiento).format('YYYY-MM-DD')) + '" ' + aceptafechavencimiento + '/>',
            '<input type="text" class="lote_registrosanitario inputdetalle" value="' + ((data[i].registrosanitario === null) ? '' : data[i].registrosanitario) + '" maxlength="18" ' + aceptaregsanitario + '/>',
            '<input type="text" class="lote_nprescripcion inputdetalle" readonly value="' + (data[i].nprescripcion ?? '') + '" maxlength="18"/>',
            '<label class="lote_vigencia">' + (data[i].fechavencimiento === undefined ? '' : calcularvigencia(data[i].fechavencimiento)) + '</label>',
            '<textarea class="lote_observacion inputdetalle " rows=2 >' + (data[i].observacion ?? '') + '</textarea>',
            // ...

            '<div class="btn-group btn-group-sm text-center d-flex justify-content-center">' +
            '<input class="codigoproductonombre" type="text"  style="display: none;" value="' + producto.codigoproducto + '"/>' +
            '<input class="btnsubirarchivo" type="file" style="display: none;"   onchange="manejarCargaArchivo(this.files)" accept=".pdf">' +
            '<button style="display: block;"  class="btn btn-sm btn-outline-info" data-codigolote="' + codigolote + '" data-iddetallepreingreso="' + iddetallepreingreso + '"  data-idproducto="' + idproducto + '" type="button" onclick="abrirInputArchivo(this)" data-toggle="tooltip"  data-placement="top" title="Subir archivo"><i class="fa fa-file"></i></button>' +
            '&nbsp;' +

            '<button class="btn btn-sm btn-outline-danger btnquitarlote" type="button" data-toggle="tooltip" data-placement="top" title="Borrar"><i class="fas fa-trash-alt"></i></button>' +
            '</div>'


        ]).draw(false).node().classList.add('fila-nueva');
        $('#tbllotevencimiento th').eq(0).css('width', '20%');
        $('#tbllotevencimiento th').eq(1).css('width', '7%');
        $('#tbllotevencimiento th').eq(2).css('width', '12%');
        $('#tbllotevencimiento th').eq(3).css('width', '8%');
        $('#tbllotevencimiento th').eq(4).css('width', '8%');
        $('#tbllotevencimiento th').eq(5).css('width', '8%');
        $('#tbllotevencimiento th').eq(6).css('width', '10%');
        //$(auxtfila).find('td').eq(0).attr({ 'style': 'width:20%' });
        //$(auxtfila).find('td').eq(1).attr({ 'style': 'width:7%' });
        //$(auxtfila).find('td').eq(2).attr({ 'style': 'width:8%' });
        //$(auxtfila).find('td').eq(3).attr({ 'style': 'width:12%' });
        //$(auxtfila).find('td').eq(4).attr({ 'style': 'width:8%' });
        //$(auxtfila).find('td').eq(5).attr({ 'style': 'width:8%' });
        //$(auxtfila).find('td').eq(6).attr({ 'style': 'width:10%' });
        // Asigna un ID único a cada fila (puedes usar un número ficticio)
        // Marca la fila como seleccionada
        if (i === 0) {
            $(auxtfila).addClass('fila-seleccionada');
        }

        validardocumentorepetido(codigolote, iddetallepreingreso, idproducto);
    }
}



// SCRIPT SUBIR
// Variable global para almacenar la información de todas las filas
var informacionPorFilas = [];

function abrirInputArchivo(input) {
    var fila = $(input).closest('tr');
    fila.addClass('fila-seleccionada');
    var codigolote = fila.find('.lote_lote.inputdetalle').val();
    if (codigolote != "" || codigolote != 0) {


        // Desactiva la clase 'fila-seleccionada' de otras filas
        $('.fila-seleccionada').not(fila).removeClass('fila-seleccionada');

        // Activar el evento de clic en el input de archivo oculto
        fila.find('.btnsubirarchivo').trigger('click');
    } else {
        mensaje('W', "Complete el lote");
    }

}

var numeroIds = 0;
function manejarCargaArchivo(files) {
    var archivoCargado = files[0];
    var inputArchivo = $(this);
    var fila = $('.fila-seleccionada');
    if (!fila.attr('data-numero-id')) {
        numeroIds += 1;
        fila.attr('data-numero-id', numeroIds);
    }
    var numeroId = fila.attr('data-numero-id');
    var nombreproducto = fila.find('.lote_producto').text();
    var codigolote = fila.find('.lote_lote.inputdetalle').val();
    var codigoProducto = fila.find('.codigoproductonombre').val();

    fila.attr('data-nombre-archivo', archivoCargado.name);
    fila.data('archivo-completo', archivoCargado);

    // Verifica si ya existe información para esta fila
    var indiceExistente = informacionPorFilas.findIndex(function (element) {
        return element.numeroId == numeroId;
    });
    var formData = new FormData();
    formData.append('file', archivoCargado);
    formData.append('nombreArchivo', archivoCargado.name);
    formData.append('codigocarperta', numeroId);
    formData.append('codigolote', codigolote);
    formData.append('codigoProducto', codigoProducto);
    var url = ORIGEN + "/PreIngreso/PIPreingreso/guardarpdfpreingreso";
    $.ajax({
        url: url,  // Ajusta la ruta según tu configuración
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            var informacionFila = {
                numeroId: numeroId,
                nomcodcarpeta: data.fileName,
                nomcoddocumento: data.nombreArchivo
            };
            if (indiceExistente !== -1) {
                informacionPorFilas[indiceExistente] = informacionFila;
            } else {
                informacionPorFilas.push(informacionFila);
            }
            console.log("Información por filas:", informacionPorFilas);
        },
        error: function (data) {
            mensajeError(data);
        }
    });






}


function miFuncion(nuevoValor) {
    // Obtener el valor inicial del campo de entrada
    // Obtener el elemento que activó el evento
    var inputElement = $('.lote_cantidad:focus')[0]; // Obtener el campo de entrada enfocado

    var txtcantidadtotalmodallotevalue = $('#txtcantidadtotalmodallote').val();
    var txtcantidadrestantelotenuevo = $('#txtcantidadrestantelote').val();
    // Sumar todos los valores de las filas
    var todasLasFilas = document.getElementsByClassName('lote_cantidad');
    var sumaTotal = 0;

    for (var i = 0; i < todasLasFilas.length; i++) {
        var valorFila = parseFloat(todasLasFilas[i].value) || 0; // Convertir a número y manejar NaN
        sumaTotal += valorFila;
    }
    var sumavalores = txtcantidadtotalmodallotevalue - sumaTotal;
    if (txtcantidadtotalmodallotevalue >= sumaTotal) {

        txtcantidadrestantelote.val(sumavalores);
    } else {
        var sumafila = parseFloat(nuevoValor) + sumavalores;
        alertaSwall('W', 'La cantidad no puede sobrepasar la cantidad total', '');
        // Asignar el valor calculado solo al campo de entrada enfocado
        inputElement.value = sumafila;
        txtcantidadrestantelote.val(0);
    }

}
function getvalortablaLote(fila, columna) {
    var rows = tbllotevencimiento.rows().data();
    return (rows[fila][columna]);
}
function cantidadtotallotes() {
    var filas = document.querySelectorAll("#tbllotevencimiento tbody tr");
    var c = 0;
    var cantidad = 0;
    filas.forEach(function (e) {
        var num = parseFloat(document.getElementsByClassName("cantidad")[c].value);
        if (isNaN(num))
            num = 0;
        cantidad += num;
        c++;
    });
    return cantidad;
}
function verificardatoslotesseancorrectos() {
    var filas = document.querySelectorAll("#tbllotevencimiento tbody tr");
    var c = 0;
    var respuesta = "ok";
    filas.forEach(function (e) {
        var num = parseFloat(document.getElementsByClassName("cantidad")[c].value);
        if (num === 0 || isNaN(num))
            respuesta = 'x';
        c++;
    });
    return respuesta;
}
function fnActualizarArrayLotes() {
    var filas = document.querySelectorAll("#tbllotevencimiento tbody tr");
    var datatable = tbllotevencimiento.rows().data();
    var i = 0;
    var array = [];
    var cantidad = 0;
    var nombreProducto = '';
    var maximoingreso = parseFloat(txtcantidadtotalmodallote.val());
    if (isNaN(maximoingreso))
        maximoingreso = 0;
    filas.forEach(function (e) {
        if (datatable.length > 0) {
            var obj = new PILote();
            obj.estado = 'HABILITADO';
            // Use e to refer to the current row
            var numeroid = e.getAttribute('data-numero-id');
            var nomcodcarpeta = "";
            var nomcoddocumento = "";
            for (var j = 0; j < informacionPorFilas.length; j++) {
                if (informacionPorFilas[j].numeroId === numeroid) {
                    // Update the properties of the found object
                    nomcodcarpeta = informacionPorFilas[j].nomcodcarpeta;
                    nomcoddocumento = informacionPorFilas[j].nomcoddocumento;  // Replace with the actual File object
                    break;  // Exit the loop once the object is updated
                }
            }
            obj.fechavencimiento = document.getElementsByClassName('lote_fechavencimiento')[i].value.toUpperCase();
            obj.cantidad = document.getElementsByClassName('lote_cantidad')[i].value;
            obj.lote = document.getElementsByClassName('lote_lote')[i].value.toUpperCase();
            obj.registrosanitario = document.getElementsByClassName('lote_registrosanitario')[i].value.toUpperCase();
            obj.nprescripcion = document.getElementsByClassName('lote_nprescripcion')[i].value;
            obj.observacion = document.getElementsByClassName('lote_observacion')[i].value;
            obj.idlote = datatable[i][0] === '' ? 0 : datatable[i][0];
            obj.iddetallepreingreso = datatable[i][1] === '' ? txtidedetallemodallotes.val() : datatable[i][1];
            obj.producto = FN_GETDATOHTML(datatable[i][2], 'lote_producto');
            obj.nomcodcarpeta = nomcodcarpeta;
            obj.nomcoddocumento = nomcoddocumento;
            nombreProducto = obj.producto;
            if (obj.cantidad === '')
                obj.cantidad = 0;
            cantidad += parseFloat(obj.cantidad);
            if (obj.cantidad != '')// && parseFloat(obj.cantidad) > 0
                array.push(obj);
            i++;
        }

    });
    if (cantidad <= maximoingreso) {
        var index = parseInt(txtindexlote.val());
        _LOTESPORPRODUCTO[index - 1] = array;

        //AGREGAR CODIGO PARA DEFINIR EL ORDEN DE ITEMS.
        ORDENITEMSAPROBARFACTURA += 1;
        ArrayORDENITEMSAPROBARFACTURA.set(nombreProducto, ORDENITEMSAPROBARFACTURA);

        $('#modalfechaylote').modal('hide');
    } else
        mensaje('W', 'La cantidad de los lotes sobrepasa la cantidad ingresada en la factura');
    fnverificarcantidadesdetalle();
}
function fnSumarCantidadLotesIngresadosxProducto(index) {
    var array = _LOTESPORPRODUCTO[index];
    var cantidad = 0;
    for (var i = 0; i < array.length; i++) {
        cantidad += parseFloat(array[i].cantidad);
    }
    return cantidad;
}

function validardocumentorepetido(codigolote, iddetallepreingreso, idproducto) {
    var obj = {
        codigolote: codigolote,
        iddetallepreingreso: iddetallepreingreso,
        idproducto: idproducto,
    };
    let controller = new PreingresoController();
    controller.validardocuemntoloteexistente(obj, function (data) {
        console.log(data);
        if (data && data.length > 0) {
            // Desactiva el botón de subir archivo solo en la fila actual
            $('[data-codigolote="' + codigolote + '"][data-iddetallepreingreso="' + iddetallepreingreso + '"][data-idproducto="' + idproducto + '"]').prop('disabled', true);
        } else {
            // Habilita el botón de subir archivo solo en la fila actual
            $('[data-codigolote="' + codigolote + '"][data-iddetallepreingreso="' + iddetallepreingreso + '"][data-idproducto="' + idproducto + '"]').prop('disabled', false);
        }
    });
}

function validarExiteDocLote(codigolote, iddetallepreingreso, idproducto) {
    validardocumentorepetido(codigolote, iddetallepreingreso, idproducto);
}

function validarnuevodoc(input) {
    var fila = $(input).closest('tr');
    fila.addClass('fila-seleccionada');
    var loteInput = $(input);
    var subirArchivoBtn = loteInput.closest('tr').find('.btn-outline-info');

    var codigolote = fila.find('.lote_lote.inputdetalle').val();

    $('#tbllotevencimiento tbody tr').each(function () {
        var loteInput = $(this).find('.lote_lote');
        var archivoInput = $(this).find('.btnsubirarchivo');

        // Verificar si el valor del campo coincide con idLote
        if (loteInput.val() == codigolote) {
            // Verificar si se ha cargado un archivo
            if (archivoInput.val() != '') {
                subirArchivoBtn.prop('disabled', true);
            }
        } else {
            subirArchivoBtn.prop('disabled', false);
        }
    });

}

