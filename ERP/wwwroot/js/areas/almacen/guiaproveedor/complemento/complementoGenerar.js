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
    });

});

function CG_fnCargarGuias() {
    CV_tbldistribucion.clear().draw(false);
    for (let i = 0; i < CD_arrayguias.length; i++) {
        let nitems = CG_getNItemsGuia(i);
        let badgednitems = nitems > 0
            ? ` <span id="span_suc` + CD_arrayguias[i].idproveedor + `"  class="badge ml-auto bgc-green-d2 text-white radius-round text-90 px-25">` + nitems + `</span>`
            : ` <span id="span_suc` + CD_arrayguias[i].idproveedor + `" class="badge ml-auto bgc-red-d2 text-white radius-round text-90 px-25">` + 0 + `</span>`;
        let fila = CV_tbldistribucion.row.add([
            '',
            CD_arrayguias[i].idproveedor,
            CD_arrayguias[i].proveedor,
            CD_arrayguias[i].encargado,
            CD_arrayguias[i].fechatraslado,
            badgednitems,
            '<button class="btn btn-xs btn-danger" onclick="CG_fnEliminarGuiaProveedor(' + i + ',' + CD_arrayguias[i].idproveedor + ')"><i class="fas fa-trash-alt fa-1x"></i></button>'
        ]).draw(false).nodes();
        $(fila).find('td').eq(0).attr({ 'class': 'details-control' });
        $(fila).find('td').eq(0).attr({ 'id': 'SUC' + CD_arrayguias[i].idproveedor });
    }
}
function CG_getNItemsGuia(pos) {
    let detalle = [];
    let stringdetalle = CD_arrayguias[pos].jsondetalle;
    if (stringdetalle.length > 0) {
        detalle = JSON.parse(stringdetalle);
        return detalle.length;
    }
    else
        return 0;
}

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
    var index = CG_fnencontrarIndex(CD_arrayguias, id);
    let stringdetalle = CD_arrayguias[index].jsondetalle;
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
            tbody += '<td>' + detalle[i].idstock + '</td>';
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

function CG_fnencontrarIndex(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].idproveedor == id) {
            return i;
            break;
        }
    }
    return -1;
}

function CG_fnEliminarGuiaProveedor(pos, idproveedor) {
    CD_arrayguias[pos].jsondetalle = '';
    let detalle = [];
    CG_ModificarSpan(idproveedor, detalle)
    //RECARGAR LA VISTA
    $('#SUC' + idproveedor).click();
    $('#SUC' + idproveedor).click();
}
function CG_fnEliminarDetalleGuiaDistribucion(idproveedor, posdetalleguia) {
    let posguia = CD_fnBuscarGuiaDistribucion(idproveedor)
    if (posguia == -1)
        alert("NO SE ENCONTRÓ EL ITEM");
    else {
        let detalle = [];
        let stringdetalle = CD_arrayguias[posguia].jsondetalle;
        if (stringdetalle.length > 0) {
            detalle = JSON.parse(stringdetalle);
            //elimina de la lista
            detalle.splice(posdetalleguia, 1);
            //agrega a la lista
            CD_arrayguias[posguia].jsondetalle = JSON.stringify(detalle);
            //RECARGAR LA VISTA
            $('#SUC' + idproveedor).click();
            $('#SUC' + idproveedor).click();
            CG_ModificarSpan(idproveedor, detalle);
        }
    }
}
function CG_ModificarSpan(idproveedor, detalle) {
    let badget = $('#span_suc' + idproveedor);
    badget.text(detalle.length);
    badget.removeClass('bgc-green-d2');
    badget.removeClass('bgc-red-d2');
    if (detalle.length > 0)
        badget.addClass('bgc-green-d2');
    else
        badget.addClass('bgc-red-d2');
}

btngoback.click(function () {
    btnpreviewdistribucion.click();
});

$('#cvbtn_generarguia').click(function () {
    let totaldetalle = CG_getTotalDetalles(CD_arrayguias);
    if (totaldetalle > 0) {
        CD_arrayguias = verificarGuiasSalidas(CD_arrayguias);
        var url = ORIGEN + "/Almacen/AGuiaSalida/GenerarGuiasLista";
        let obj = {
            listaguiajson: JSON.stringify(CD_arrayguias)
        };
        $('#cvbtn_generarguia').prop('disabled', true);
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                btnpreviewdistribucion.click();
                $('#btnnuevoregistro').click();
                mensaje('S', "LAS GUIAS DE SALIDA SE GENERARON CORRECTAMENTE.");
                if (CC_cmbproveedorcliente.value == "CLIENTE") {
                    swal({
                        title: '¿Desea Generar Venta?',
                        text: '',
                        icon: 'info',
                        class: 'text-center',
                        buttons: {
                            cancel: {
                                visible: true,
                                text: 'Cancelar',
                                className: 'btn btn-danger'
                            },
                            confirm: {
                                text: 'Aceptar',
                                className: 'btn btn-success'
                            }
                        }
                    }).then((AceptaCancela) => {
                        if (AceptaCancela) {
                            location.href = ORIGEN + "/Ventas/Venta/VentaDirecta?guiasalida=" + data.objeto;
                        } else
                            swal.close();
                    });
                }
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
function verificarGuiasSalidas(CD_arrayguias) {
    let arrGuiasFinal = [];
    for (let i = 0; i < CD_arrayguias.length; i++) {
        let arrIdAlmacenSucursalOrigen = [];
        if (CD_arrayguias[i].jsondetalle.length > 0) {
            let detalle = JSON.parse(CD_arrayguias[i].jsondetalle);
            for (let j = 0; j < detalle.length; j++) {
                let verificarSiHayId = arrIdAlmacenSucursalOrigen.find(x => x == detalle[j].idalmacensucursalorigen);
                if (verificarSiHayId == undefined) {
                    arrIdAlmacenSucursalOrigen.push(detalle[j].idalmacensucursalorigen);
                }
            }

            if (arrIdAlmacenSucursalOrigen.length > 0) {
                for (let k = 0; k < arrIdAlmacenSucursalOrigen.length; k++) {
                    let arrDetallePorAlmacenSucursal = [];
                    for (let m = 0; m < detalle.length; m++) {
                        if (arrIdAlmacenSucursalOrigen[k] == detalle[m].idalmacensucursalorigen) {
                            arrDetallePorAlmacenSucursal.push(detalle[m]);
                        }
                    }
                    let guiaSalida = new AGuiaSalida();
                    guiaSalida.idempresa = CD_arrayguias[i].idempresa;
                    guiaSalida.idsucursal = CD_arrayguias[i].idsucursal;
                    if (CC_cmbproveedorcliente.value == "PROVEEDOR") {
                        guiaSalida.idtipoguia = 3;//GUIA PROVEEDOR
                        guiaSalida.idproveedor = CD_arrayguias[i].idproveedor;
                    } else {
                        guiaSalida.idtipoguia = 4;//GUIA CLIENTE
                        guiaSalida.idcliente = CD_arrayguias[i].idproveedor;
                    }
                    guiaSalida.idsucursaldestino = CD_arrayguias[i].idsucursaldestino;
                    guiaSalida.sucursaldestino = CD_arrayguias[i].sucursaldestino;
                    guiaSalida.idcorrelativo = CD_arrayguias[i].idcorrelativo;
                    guiaSalida.idcaja = CD_arrayguias[i].idcaja;
                    guiaSalida.encargado = CD_arrayguias[i].encargado;
                    guiaSalida.idalmacensucursalorigen = arrIdAlmacenSucursalOrigen[k];
                    guiaSalida.seriedoc = CD_arrayguias[i].seriedoc;
                    guiaSalida.fechatraslado = CD_arrayguias[i].fechatraslado;
                    guiaSalida.jsondetalle = JSON.stringify(arrDetallePorAlmacenSucursal);
                    arrGuiasFinal.push(guiaSalida);
                }
            }
        }
    }
    return arrGuiasFinal;
}