var tbllista;
var arrayguias = [];
//var dtpfecha = $('#dtpfecha');

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
            }  ] 
    });
    $('#btnbusqueda').click();
    //cargarcomboboxsucursales();
    
});


$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    let obj = $('#form-busqueda').serializeArray();    
    obj[obj.length] = { name: "top", value: 200 };
    obj[obj.length] = { name: "fechainicio", value: FECHAINICIO };
    obj[obj.length] = { name: "fechafin", value: FECHAFIN };
    obj[obj.length] = { name: "idsucursalorigen", value: IDSUCURSAL };
    let controller = new ASalidaTransferenciaController();
    controller.GetHistorial(obj, listarhojas);
});

function listarhojas(data) {
    
    arrayguias = [];
    tbllista.clear().draw(false);
    $('#cdbtn_generar').prop('disabled', true);
    try {
        if (data.mensaje === "ok") {
            let estadoguia = "";
            let datos = JSON.parse(data.objeto);
            arrayguias = datos;
            for (let i = 0; i < datos.length; i++) {
                let botones = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-sm btn-outline-primary waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="HACER PICKING" href="`+ ORIGEN + `/Almacen/ASalidaTransferencia/RegistrarEditar/?id=` + datos[i]["ID"] + `"><i class="fa fa-eye"></i></a>
                        </div>`;
                if (datos[i]["ESTADO GUIA"] == 'ANULADO')
                    estadoguia = '<span class="badge badge-danger mr-1">'+datos[i]["ESTADO GUIA"]+'</span>';
                if (datos[i]["ESTADO GUIA"] == 'ENTREGADO')
                    estadoguia = '<span class="badge badge-success mr-1">' +datos[i]["ESTADO GUIA"]+'</span>';
                if (datos[i]["ESTADO GUIA"] == 'TRANSITO')
                    estadoguia = '<span class="badge badge-primary mr-1">'+datos[i]["ESTADO GUIA"]+'</span>';
               let fila = tbllista.row.add([
                    '',
                    botones,
                    datos[i]["ID"],
                    datos[i]["NUM.DOC"],
                    datos[i]["SUCURSAL ORIGEN"],
                    datos[i]["SUCURSAL DESTINO"],
                    moment(datos[i]["FECHA TRASLADO"]).format('DD/MM/YYYY'),
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
                                <th>CANTIDAD ENVIAR</th>                                
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