var MGS_tblguiasalida;
var MGS_arrayguias = [];
var MGS_btnbusqueda = $('#MGS_btnbusqueda');
$(document).ready(function () {
    MGS_tblguiasalida = $('#MGS_tblguiasalida').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        responsive: true,
        "language": LENGUAJEDATATABLE()
        
    });
    MGS_fnlistarsucursales();
});

$('#modallistarguiasalida').on('shown.bs.modal', function () {
    MGS_btnbusqueda.click();
})

function MGS_fnlistarsucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('MGS_cmbsucursaldestino', '', null);
}

$('#MGS_form-busqueda').submit(function (e) {
    e.preventDefault();
    let controller = new ASalidaTransferenciaController();
    obj = $('#MGS_form-busqueda').serializeArray();
    obj[obj.length] = { name: 'estadoguia', value: 'TRANSITO' };    
    obj[obj.length] = { name: 'idsucursaldestino', value: IDSUCURSAL };
 
    controller.GetSalidasTransferenciaxCargar(obj, MGS_fncargarDatosGuiaSalida);
});

function MGS_fncargarDatosGuiaSalida(data) {
    //console.log(data);
    MGS_arrayguias = [];
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        MGS_fnagregarfila(datos);
        MGS_arrayguias=datos;

    } else 
        mensaje("W", data.mensaje, "BR");
}
function MGS_fnagregarfila(data) {
    MGS_tblguiasalida.clear().draw(false);
    for (let i = 0;i< data.length; i++) {
        var MGS_fila = MGS_tblguiasalida.row.add([           
            '<div class="btn-group btn-group-sm "><button class="btn btn-sm btn-success btn-pasarguisalida"><i class="fas fa-check"></i></button></div>',
            '',   
            data[i]["ID"],
            data[i]["CODIGO"],
           data[i]["SERIE"] + '-' + data[i]["NUMERODOC"],
            moment(data[i]["FECHA TRASLADO"]).format("DD/MM/YYYY"),
            data[i]["SUCURSAL ORIGEN"],
            data[i]["SUCURSAL DESTINO"],
           data[i]["ESTADO"],
           
        ]).draw(false).node();
        $(MGS_fila).find('td').eq(1).attr({ 'class': 'details-control' });
    }
}

//TABLA CON DETALLE
$('#MGS_tblguiasalida tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = MGS_tblguiasalida.row(tr);
    var columna = MGS_tblguiasalida.row($(this).parents('tr')).data();
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        var id = columna[2];
        tr.addClass('details');
        row.child(MGS_fnGetDetalleGuiaSalida(id)).show();
    }
});
function MGS_fnGetDetalleGuiaSalida(id) {
    var index = MGS_encontrarIndex(MGS_arrayguias, id);
  
    var detalle = (JSON.parse(MGS_arrayguias[index]['DETALLE']));    
    if (index === -1)
        return 'No hay datos';
    else {
        var tbody = '<tbody>';

        for (var i = 0; i < detalle.length; i++) {

            var checked = '';
            if (detalle[i]["ISFRACCION"] == 'true' || detalle[i]["ISFRACCION"] == true)
                checked = 'checked';
            else
                checked = ''

            var checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" disabled deshabilitado ' + checked + ' "/>';

            tbody += '<tr>';
            tbody += '<td>' + detalle[i]['IDDETALLE'] + '</td>';
            tbody += '<td>' + detalle[i]['CODIGO'] + '</td>';                
            tbody += '<td>' + detalle[i]['PRODUCTO'] + '</td>';
            tbody += '<td>' + detalle[i]['CANTIDAD'] + '</td>';
            tbody += '<td>' + checkfracion + '</td>';
            tbody += '<td>' + detalle[i]['LABORATORIO'] + '</td>';
            tbody += '<td>' + detalle[i]['LOTE'] + '</td>';
            tbody += '<td>' + moment(detalle[i]['FVENCE']).format("DD/MM/YYYY") + '</td>';
            tbody += '<tr>';
            
        }
        return `<table class="table table-sm">
                    <thead class="thead-light">
                           <tr>
                                <th>ID</th>
                                <th>CODIGO</th>
                                <th>PRODUCTO</th>
                                <th>CANTIDAD</th>   
                                <th>F</th>   
                                <th>LABORATORIO</th>
                                <th>LOTE</th>
                                <th>F.VENCE</th>
                            </tr>
                    </thead>
                        `  + tbody + `
                </table>`;
    }
}

function MGS_encontrarIndex(array, id) {   
    for (var i = 0; i < array.length; i++) {
        if (array[i]['ID'] == id) {
            return i;
            break;
        }
    }
    return -1;
}