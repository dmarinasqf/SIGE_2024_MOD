var tbllista;
var arrayguias = [];
var dtpfecha = $('#dtpfecha');

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
        responsive: true,
        buttons: BOTONESDATATABLE('LISTA GUIAS ', 'H', false),
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [2],
                "visible": false,
                "searchable": false
            }]
    });
    $('#btnbusqueda').click();
    cargarcomboboxsucursales();
    listarTipoGuia();
});
function cargarcomboboxsucursales() {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbsucursaldestino', IDEMPRESA, IDSUCURSAL);

}
function listarTipoGuia() {
    let controller = new GuiaSalidaController();
    controller.ListarTipoGuia(function (dataJSON) {
        var data = JSON.parse(dataJSON);
        var combo = document.getElementById("cmbtipoguia");
        combo.innerHTML = '';
        var option = document.createElement('option');
        option.text = '[SELECCIONE]';
        option.value = 0;
        combo.appendChild(option);
        for (var i = 0; i < data.length; i++) {
            option = document.createElement('option');
            option.text = data[i].descripcion;
            option.value = data[i].idtipoguia;
            combo.appendChild(option);
        }
    });
}

function filtrarSucursal(idsucursalorigen, idsucursaldestino) {

}

$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    //let url = ORIGEN + "/Almacen/AGuiaSalida/ListarGuiasSalida";
    let obj = $('#form-busqueda').serializeArray();
    //let fecha;
    //if (dtpfecha.val() == "")
    //    fecha = moment().format('DD/MM/YYYY')
    //else
    //    fecha = moment(dtpfecha.val() + "-01").format('DD/MM/YYYY')
    //obj[obj.length] = { name: "fecha", value: fecha };
    obj[obj.length] = { name: "fechainicio", value: FECHAINICIO };
    obj[obj.length] = { name: "fechafin", value: FECHAFIN };
    obj[obj.length] = { name: "idsucursalorigen", value: IDSUCURSAL };
    //obj[obj.length] = { name: "idtipoguia", value: IDTIPOGUIA };
    let controller = new GuiaSalidaController();
    controller.ListarGuiaSalidas(obj, listarGuiaSalida);
});
//<a class="btn btn-dark btngenerarguiaelectronica" data-toggle="tooltip" data-placement="top" title="Generar Guia Electronica" onclick="fnenviarguiae(`+ datos[i]["ID"] +`)"><i class="far fa-file-alt"></i></a>
//agregar en botones para generar guia electronica 
function listarGuiaSalida(data) {
    arrayguias = [];
    tbllista.clear().draw(false);
    $('#cdbtn_generar').prop('disabled', true);
    try {
        if (data.mensaje === "ok") {
            let estadoguia = "";
            let datos = JSON.parse(data.objeto);
            arrayguias = datos;
            for (let i = 0; i < datos.length; i++) {
                let btnimpresion = "";
                if (datos[i]["ESTADO GUIA"] == "PENDIENTE" || datos[i]["ESTADO GUIA"] == "ATENDIDO" || datos[i]["ESTADO GUIA"] == "TRANSITO") {
                    btnimpresion = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-dark btnimprimir" data-toggle="tooltip" data-placement="top" title="Imprimir" onclick="fnimprimir(`+ datos[i]["ID"] + `,` + datos[i]["IDTIPOGUIA"] + `)"><i class="fas fa-print"></i></a>
                            <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="HACER PICKING" href="`+ ORIGEN + `/Almacen/AGuiaSalida/RegistrarEditar/?id=` + datos[i]["ID"] + `"><i class="fa fa-cart-arrow-down"></i></a>
                            <a class="btn btn-dark btngenerarguiaelectronica" data-toggle="tooltip" data-placement="top" title="Generar Guia Electronica" onclick="fnenviarguiae(`+ datos[i]["ID"] +`)"><i class="far fa-file-alt"></i></a>
                            </div>`;
                } else {
                    btnimpresion = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-sm btn-outline-primary waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="EDITAR GUÍA" href="`+ ORIGEN + `/Almacen/AGuiaSalida/RegistrarEditar/?id=` + datos[i]["ID"] + `"><i class="fa fa-eye"></i></a>
                            <a class="btn btn-dark btngenerarguiaelectronica" data-toggle="tooltip" data-placement="top" title="Generar Guia Electronica" onclick="fnenviarguiae(`+ datos[i]["ID"] +`)"><i class="far fa-file-alt"></i></a>
                            </div>`;
                }

                if (datos[i]["ESTADO GUIA"] == 'ANULADO')
                    estadoguia = '<span class="badge badge-danger mr-1">' + datos[i]["ESTADO GUIA"] + '</span>';
                if (datos[i]["ESTADO GUIA"] == 'PENDIENTE')
                    estadoguia = '<span class="badge badge-secondary mr-1">' + datos[i]["ESTADO GUIA"] + '</span>';
                if (datos[i]["ESTADO GUIA"] == 'ATENDIDO')
                    estadoguia = '<span class="badge bg-warning mr-1">' + datos[i]["ESTADO GUIA"] + '</span>';
                if (datos[i]["ESTADO GUIA"] == 'ENTREGADO')
                    estadoguia = '<span class="badge bg-success mr-1">' + datos[i]["ESTADO GUIA"] + '</span>';
                if (datos[i]["ESTADO GUIA"] == 'TRANSITO')
                    estadoguia = '<span class="badge bg-primary mr-1">' + datos[i]["ESTADO GUIA"] + '</span>';
                let fila = tbllista.row.add([
                    '',
                    //botones,
                    btnimpresion,
                    datos[i]["ID"],
                    datos[i]["NUM.DOC"],
                    datos[i]["SUCURSAL ORIGEN"],
                    datos[i]["DESTINO"],
                    moment(datos[i]["FECHA TRASLADO"]).format('DD/MM/YYYY'),
                    datos[i]["TIPOGUIA"],
                    estadoguia
                ]).draw(false).node();
                $(fila).find('td').eq(0).attr({ 'class': 'details-control' });
            }
        }
        else
            mensaje('W', data.mensaje);
    } catch (error) {
        $('#cdbtn_generar').prop('disabled', false);
    }
}

//AGREGAR DETALLE
$('#tbllista tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tbllista.row(tr);
    var columna = tbllista.row($(this).parents('tr')).data();
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        var id = columna[2];
        tr.addClass('details');
        row.child(fnGetDetalleGuiaSalida(id)).show();
    }
});

function fnGetDetalleGuiaSalida(id) {
    var index = fnencontrarIndex(arrayguias, id);
    console.log(fnencontrarIndex(arrayguias, id));
    var detalle = (JSON.parse(arrayguias[index]['DETALLE']));
    if (index === -1)
        return 'No hay datos';
    else {
        var tbody = '<tbody>';

        for (var i = 0; i < detalle.length; i++) {
            tbody += '<tr>';
            tbody += '<td>' + detalle[i]['IDDETALLE'] + '</td>';
            tbody += '<td>' + detalle[i]['CODIGO'] + '</td>';
            tbody += '<td>' + detalle[i]['PRODUCTO'] + '</td>';
            tbody += '<td>' + detalle[i]['CANTIDAD ENVIAR'] + '</td>';
            tbody += '<td>' + detalle[i]['CANTIDAD PICKING'] + '</td>';
            tbody += '<td>' + detalle[i]['LABORATORIO'] + '</td>';
            tbody += '<td>' + detalle[i]['LOTE'] + '</td>';
            tbody += '<td>' + detalle[i]['FECHA VECIMIENTO'] + '</td>';
            tbody += '<tr>';

        }
        return `<table class="table table-sm">
                    <thead class="thead-light">
                           <tr>
                                <th>ID</th>
                                <th>CODIGO</th>
                                <th>PRODUCTO</th>
                                <th>CANT. (GUÍAS) </th>                                
                                <th>CANT. PICKING (ENVIAR)</th>                                
                                <th>LABORATORIO</th>
                                <th>LOTE</th>
                                <th>F.VENCE</th>
                            </tr>
                    </thead>
                        `  + tbody + `
                </table>`;
    }
}

function fnencontrarIndex(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i]['ID'] == id) {
            return i;
            break;
        }
    }
    return -1;
}

function buscarGuiaSalida(id) {
    let obj = { id: id };
    let controller = new GuiaSalidaController();
    controller.GetGuiaSalidaCompleta(obj, cargardatosGuia);
}

function fnimprimir(id, idtipoguia) {
    var href = "";
    if (idtipoguia == 4) {
        href = ORIGEN + `/Almacen/AMantenimientoGuia/ImprimirGuiaCliente/?id=` + id;
    } else {
        href = ORIGEN + `/Almacen/AMantenimientoGuia/ImprimirPreGuia/?id=` + id;
    }
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR PREGUIA');
}

function fnenviarguiae(id) {
    let obj = {
        idguia: id,
        tipo: 'distribucion'
    };
    var controlleraux = new GuiaSalidaController();
    controlleraux.GenerarGuiaElectronica(obj, null);
}