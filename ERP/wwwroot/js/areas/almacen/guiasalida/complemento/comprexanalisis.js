var btngoback = $('#btngoback');
var CV_tbldistribucion;

$(document).ready(function () {
    CV_tbldistribucion = $('#CV_tbldistribucion').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        //"columnDefs": [
        //    {
        //        "targets": [0],
        //        "visible": false,
        //        "searchable": false
        //    }
        //]
    });

});

btngoback.click(function () {
    btnpreviewdistribucion.click();
});

function CG_fnCargarGuias() {
    CV_tbldistribucion.clear().draw(false);
    for (let i = 0; i < acab.length; i++) {
        let nitems = CG_getNItemsGuia(i);
        console.log(nitems);
        let badgednitems = nitems > 0
            ? ` <span id="span_suc` + acab[i].idsucursaldestino + `"  class="badge ml-auto bgc-green-d2 text-white radius-round text-90 px-25">` + nitems + `</span>`
            : ` <span id="span_suc` + acab[i].idsucursaldestino + `" class="badge ml-auto bgc-red-d2 text-white radius-round text-90 px-25">` + 0 + `</span>`;
        let fila = CV_tbldistribucion.row.add([
            //acab[i].idsucursal,
            '',
            acab[i].idsucursaldestino,
            acab[i].sucursaldestino,
            acab[i].encargado,
            acab[i].fechatraslado,
            badgednitems,
            '<button class="btn btn-xs btn-danger" onclick="CG_fnEliminarGuiaSucursal(' + i + ',' + acab[i].idsucursaldestino + ')"><i class="fas fa-trash-alt fa-1x"></i></button>'
        ]).draw(false).nodes();
        $(fila).find('td').eq(0).attr({ 'class': 'details-control' });
        $(fila).find('td').eq(0).attr({ 'id': 'SUC' + acab[i].idsucursaldestino });
        // $(fila).find('td').eq(5).attr({ 'class': 'center' });
    }
}

//AGREGAR DETALLE
$('#CV_tbldistribucion tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = CV_tbldistribucion.row(tr);
    var columna = CV_tbldistribucion.row($(this).parents('tr')).data();
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        var id = columna[1];
        tr.addClass('details');
        row.child(fnGetDetalleGuiaSalida(id)).show();
    }
});
function fnGetDetalleGuiaSalida(id) {
    console.log(id);

    var index = CG_fnencontrarIndex(acab, id);
    console.log(CG_fnencontrarIndex(acab, id));
    let stringdetalle = acab[index].jsondetalle;
    if (stringdetalle.length > 0)
        var detalle = JSON.parse(stringdetalle);
    else
        detalle = [];
    if (index === -1)
        return 'No hay datos';
    else {
        var tbody = '<tbody>';

        for (let i = 0; i < detalle.length; i++) {
            tbody += '<tr>';
            tbody += '<td>' + parseInt(i + 1) + '</td>';
            tbody += '<td>' + detalle[i].idproducto + '</td>';
            tbody += '<td>' + detalle[i].producto + '</td>';
            tbody += '<td>' + detalle[i].cantidadgenerada + '</td>';
            tbody += '<td>' + detalle[i].laboratorio + '</td>';
            tbody += '<td>' + '<button class="btn btn-xs btn-danger" onclick="CG_fnEliminarDetalleGuiaDistribucion(' + id + ',' + i + ')"><i class="fas fa-times fa-1x"></i></button>' + '</td>';
            tbody += '<tr>';

        }
        return `<table class="table table-sm">
                    <thead class="thead-light">
                           <tr>
                                <th>Nº</th>                                
                                <th>IDPRODUCTO</th>                                
                                <th>PRODUCTO</th>
                                <th>CANTIDAD ENVIAR</th>  
                                <th>LABORATORIO</th>
                                <th></th>
                            </tr>
                    </thead>
                        `  + tbody + `
                </table>`;
    }
}

function CG_getNItemsGuia(pos) {
    let detalle = [];
    console.log(acab)
    let stringdetalle = acab[pos].jsondetalle;
    if (stringdetalle.length > 0) {
        detalle = JSON.parse(stringdetalle);
        return detalle.length;
    }
    else
        return 0;
}


function CG_fnencontrarIndex(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].idsucursaldestino == id) {
            return i;
            break;
        }
    }
    return -1;
}

//FUNCIONES DE ELIMINADO EN ARRAYS
function CG_fnEliminarGuiaSucursal(pos, idsucursaldestino) {
    acab[pos].jsondetalle = '';
    let detalle = [];
    CG_ModificarSpan(idsucursaldestino, detalle)
    //RECARGAR LA VISTA
    $('#SUC' + idsucursaldestino).click();
    $('#SUC' + idsucursaldestino).click();
}

function CG_fnEliminarDetalleGuiaDistribucion(idsucursaldestino, posdetalleguia) {
    let posguia = CD_fnBuscarGuiaDistribucion(idsucursaldestino)
    if (posguia == -1)
        alert("NO SE ENCONTRÓ EL ITEM");
    else {
        let detalle = [];
        let stringdetalle = acab[posguia].jsondetalle;
        if (stringdetalle.length > 0) {
            detalle = JSON.parse(stringdetalle);
            //elimina de la lista
            detalle.splice(posdetalleguia, 1);
            //agrega a la lista
            acab[posguia].jsondetalle = JSON.stringify(detalle);
            //RECARGAR LA VISTA
            $('#SUC' + idsucursaldestino).click();
            $('#SUC' + idsucursaldestino).click();
            CG_ModificarSpan(idsucursaldestino, detalle);

        }
    }

}

function CG_ModificarSpan(idsucursaldestino, detalle) {
    //let badget = document.getElementById('span_suc' + idsucursaldestino);
    let badget = $('#span_suc' + idsucursaldestino);
    badget.text(detalle.length);
    badget.removeClass('bgc-green-d2');
    badget.removeClass('bgc-red-d2');
    if (detalle.length > 0)
        badget.addClass('bgc-green-d2');
    else
        badget.addClass('bgc-red-d2');
}

$('#cvbtn_generarguia').click(function () {
    let totaldetalle = CG_getTotalDetalles(acab)
    if (totaldetalle > 0) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/GenerarGuiasLista";
        let obj = {
            listaguiajson: JSON.stringify(acab)
        };
        $('#cvbtn_generarguia').prop('disabled', true);
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                btnpreviewdistribucion.click();
                btnpreview.click();
                $('#btnnuevoregistro').click();
                mensaje('S', "LAS GUIAS DE SALIDA SE GENERARON CORRECTAMENTE.");
                limpiar();
            }
            else
                mensaje('W', data.mensaje);
            $('#cvbtn_generarguia').prop('disabled', false);
        }).fail(function (data) {
            $('#cvbtn_generarguia').prop('disabled', false);
            mensajeError(data);
        });
    } else
        alertaSwall("W", "NO SE HA AGREGADO NINGÚN ITEM PARA DISTRIBUIR.", "")
});


function CG_getTotalDetalles(array) {
    let suma = 0;
    for (let i = 0; i < array.length; i++) {
        let detalle = [];
        let stringdetalle = array[i].jsondetalle;
        if (stringdetalle.length > 0)
            detalle = JSON.parse(stringdetalle);
        else detalle = [];
        suma += detalle.length;
    }
    return suma;
}