var tbllista;
var arrayguias = [];
var dtpfecha = $('#dtpfecha');

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[100, 200, 500, -1], [100, 200, 500, "All"]],
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

});
function cargarcomboboxsucursales() {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbsucursalorigen', IDEMPRESA, IDSUCURSAL);
}

$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    let obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: "top", value: 200 };
    obj[obj.length] = { name: "fechainicio", value: FECHAINICIO };
    obj[obj.length] = { name: "fechafin", value: FECHAFIN };
    obj[obj.length] = { name: "idsucursalrecepciona", value: IDSUCURSAL };
    obj[obj.length] = { name: "estado", value: 'HABILITADO' };
    console.log(obj);
    let controller = new IngresoTransferenciaController();
    controller.ListarIngresoTransferencia(obj, listarGuiaEntrada);
});

function listarGuiaEntrada(data) {

    arrayguias = [];
    tbllista.clear().draw(false);    
    try {
        if (data.mensaje === "ok") {
            let datos = JSON.parse(data.objeto);
            arrayguias = datos;
            for (let i = 0; i < datos.length; i++) {
                let botones = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-sm btn-outline-primary waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="HACER PICKING" href="`+ ORIGEN + `/Almacen/AIngresoTransferencia/Registrar/?id=` + datos[i]["ID"] + `"><i class="fa fa-eye"></i></a>
                        </div>`;
              let fila=  tbllista.row.add([
                    '',
                    botones,
                    datos[i]["ID"],
                    //datos[i]["CODIGOSUCURSALRECEPCIONA"],
                    datos[i]["NUMDOC"],
                    datos[i]["SUCURSALRECEPCIONA"],
                    datos[i]["SUCURSALENVIA"],
                    moment(datos[i]["FECHA"]).format('DD/MM/YYYY'),
                    datos[i]["ESTADO"]
              ]).draw(false).node();
                $(fila).find('td').eq(0).attr({ 'class': 'details-control' });
            }
        }
        else
            mensaje('W', data.mensaje);
    } catch (error) {
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
            tbody += '<td>' + detalle[i]['CANTIDAD'] + '</td>';
            tbody += '<td>' + detalle[i]['LABORATORIO'] + '</td>';
            tbody += '<td>' + detalle[i]['LOTE'] + '</td>';
            tbody += '<td>' + moment(detalle[i]['FECHA VECIMIENTO']).format("DD/MM/YYYY") + '</td>';
            tbody += '<tr>';

        }
        return `<table class="table table-sm">
                    <thead class="thead-light">
                           <tr>
                                <th>ID</th>
                                <th>CODIGO</th>
                                <th>PRODUCTO</th>
                                <th>CANTIDAD</th>                                  
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