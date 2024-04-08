var tbllista;
var dtpfecha = $('#dtpfecha');
var arrayguias = [];

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
    cargarcomboboxsucursales();
    listarTipoGuia();
    $('#btnbusqueda').click();

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

$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    let url = ORIGEN + "/Almacen/AGuiaSalida/ListarGuiasSalida";
    let obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: "idsucursalorigen", value: IDSUCURSAL };
    //let fecha;
    //if (dtpfecha.val()=="")
    //    fecha= moment().format('DD/MM/YYYY')
    //else 
    //    fecha=  moment(dtpfecha.val() + "-01").format('DD/MM/YYYY')
    obj[obj.length] = { name: "top", value: 200 };
    obj[obj.length] = { name: "fechainicio", value: FECHAINICIO };
    obj[obj.length] = { name: "fechafin", value: FECHAFIN };
    let controller = new GuiaSalidaController();
    controller.ListarGuiaSalidas(obj, listarGuiaSalida);
});


function listarGuiaSalida(data) {
    arrayguias = [];
    tbllista.clear().draw(false);
    $('#cdbtn_generar').prop('disabled', true);
    try {
        if (data.mensaje === "ok") {
            let datos = JSON.parse(data.objeto);
            arrayguias = datos;
            let estadoguia = "";
            let botones = "";
            for (let i = 0; i < datos.length; i++) {
                //console.log(datos[i]["ESTADO GUIA"]);
                if (datos[i]["ESTADO GUIA"] == "PENDIENTE" || datos[i]["ESTADO GUIA"] == "ATENDIDO" || datos[i]["ESTADO GUIA"] == "TRANSITO")
                    botones = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="EDITAR GUÍA" href="`+ ORIGEN + `/Almacen/AMantenimientoGuia/RegistrarEditar/?id=` + datos[i]["ID"] + `"><i class="fa fa-edit"></i></a>
                            <button class="btn btn-sm btn-outline-danger waves-effect  font-10" data-toggle="tooltip" data-placement="top" title="ANULAR GUÍA" onclick="mensajeanular(`+ datos[i]["ID"] + `)"><i class="fa fa-ban"></i></button>                                                                   
                        </div>`;
                else
                    botones = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-sm btn-outline-primary waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="EDITAR GUÍA" href="`+ ORIGEN + `/Almacen/AMantenimientoGuia/RegistrarEditar/?id=` + datos[i]["ID"] + `"><i class="fa fa-eye"></i></a>
                         </div>`;
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
              let fila=  tbllista.row.add([
                    '',
                    botones,
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

function mensajeanular(data) {
    const btn = document.querySelector(`[onclick="mensajeanular(${data})"]`);
    btn.disabled = true; // Deshabilitamos el botón inmediatamente
    BLOQUEARCONTENIDO('cardreportport', 'Anulando...');
    $.confirm({
        title: 'Confirmación',
        content: '¿Desea ANULAR esta guía?',
        type: 'red',
        icon: 'fa fa-question',
        buttons: {
            cancelar: {
                text: 'Cancelar',
                btnClass: 'btn-red',
                action: function () {
                    DESBLOQUEARCONTENIDO('cardreportport');
                    btn.disabled = false; // Reactivamos el botón si el usuario cancela
                }
            },
            confirmar: {
                text: 'ACEPTAR',
                btnClass: 'btn-blue',
                action: function () {
                    
                    anularGuia(data);
                    DESBLOQUEARCONTENIDO('cardreportport');
                }
            }
        }
    });
}



function anularGuia(id) {
    let controller = new MantenimientoGuiaController();
    let obj = { id: id };
    controller.Anular(obj, respuestAnulacion);
    
}
function respuestAnulacion(data) {    
    if (data.mensaje === "ok") {
        mensaje("S", "Registro Anulado", "BR");
        $('#btnbusqueda').click();
    }
    else
        mensaje('W', data.mensaje, 'BR');
     
}
//detalle
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
        let spanestado = '';
        for (var i = 0; i < detalle.length; i++) {
            spanestado = detalle[i]['ESTADO'] === 'ELIMINADO' ? '<span class="badge bg-red">' + detalle[i]['ESTADO'] + '</span>' : '<span class="badge bg-cyan">' + detalle[i]['ESTADO'] + '</span>';
            tbody += '<tr>';
            tbody += '<td>' + detalle[i]['IDDETALLE'] + '</td>';
            tbody += '<td>' + detalle[i]['CODIGO'] + '</td>';
            tbody += '<td>' + detalle[i]['PRODUCTO'] + '</td>';
            tbody += '<td>' + detalle[i]['CANTIDAD ENVIAR'] + '</td>';
            tbody += '<td>' + detalle[i]['CANTIDAD PICKING'] + '</td>';
            tbody += '<td>' + detalle[i]['LABORATORIO'] + '</td>';
            tbody += '<td>' + detalle[i]['LOTE'] + '</td>';
            tbody += '<td>' + detalle[i]['FECHA VECIMIENTO'] + '</td>';
            tbody += '<td>' + spanestado + '</td>';
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
                                <th>ESTADO</th>
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