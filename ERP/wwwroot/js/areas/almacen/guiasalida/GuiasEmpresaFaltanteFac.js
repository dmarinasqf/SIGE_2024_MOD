var tbllista;
var arrayguias = [];
var dtpfecha = $('#dtpfecha');
var arrayguiasdetalledes = [];
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
   /* cargarcomboboxsucursales();*/

});
function cargarcomboboxsucursales() {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbsucursaldestino', IDEMPRESA, IDSUCURSAL);

}



$('#form-busqueda').submit(function (e) {
    e.preventDefault();

    let selectedEstado = $('#cmbestado').val();

    let fechainicio = formatearFecha($('#txtfechainicio').val());
    let fechafin = formatearFecha($('#txtfechafin').val());

    let idsucursalorigen = IDSUCURSAL;
    let obj = [
        { name: "idempresa", value: selectedEstado },
        { name: "fechainicio", value: fechainicio },
        { name: "fechafin", value: fechafin },
    ];

    //obj[obj.length] = { name: "idtipoguia", value: IDTIPOGUIA };
    let controller = new GuiaSalidaController();
    controller.ListarGuiaSalidaxempresaSinfacturar(obj, listarGuiaSalida);
});

function formatearFecha(cadenaFecha) {
    if (!cadenaFecha || cadenaFecha.trim() === "") {
        return ""; // Devuelve cadena vacía si la fecha es nula o está vacía
    }

    // Suponiendo que cadenaFecha está en formato "YYYY-MM-DD"
    const [year, month, day] = cadenaFecha.split('-');
    return `${day}/${month}/${year}`;
}



function listarGuiaSalida(data) {
     arrayguias = [];

    tbllista.clear().draw(false);
    $('#cdbtn_generar').prop('disabled', true);
    try {
        if (data.mensaje === "ok") {
            let estadoguia = "";
            let datos = JSON.parse(data.objeto); // Ya es un array de objetos

                arrayguias = datos;
            for (let i = 0; i < datos.length; i++) {
                let btnimpresion = "";
            
                    btnimpresion = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="FACTURAR" href="`+ ORIGEN + `/Ventas/Venta/VentaDirecta?guiasalida=` + datos[i].ConcatenatedIds + `"><i class="fa fa-cart-arrow-down"></i></a>
                              </div>`;
              
                if (datos[i].estadoguia == 'ANULADO')
                    estadoguia = '<span class="badge badge-danger mr-1">' + datos[i].estadoguia + '</span>';
                if (datos[i].estadoguia == 'PENDIENTE')
                    estadoguia = '<span class="badge badge-secondary mr-1">' + datos[i].estadoguia + '</span>';
                if (datos[0].estadoguia== 'ATENDIDO')
                    estadoguia = '<span class="badge bg-warning mr-1">' + datos[i].estadoguia + '</span>';
                if (datos[i].estadoguia == 'ENTREGADO')
                    estadoguia = '<span class="badge bg-success mr-1">' + datos[i].estadoguia + '</span>';
                if (datos[i].estadoguia == 'TRANSITO')
                    estadoguia = '<span class="badge bg-primary mr-1">' + datos[i].estadoguia + '</span>';
                let fila = tbllista.row.add([
                    '',
                    btnimpresion,
                    datos[i].ConcatenatedIds,
                    datos[i].sucusalorigen,
                    datos[i].empresa,
                    datos[i].ENCARGADO,
                    datos[i].FECHA,
                    datos[i].tipoguia,
                    datos[i].CantidadIds,
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




function fnGetDetalleGuiaSalida(id) {
    arrayguiasdetalledes = [];
    let obj = {
        idguias: id
    };
    let controller = new GuiaSalidaController();

    // Devolver una promesa explícitamente
    return new Promise((resolve, reject) => {
        controller.ListarDetalleGuiaSalidaxempresaSinfacturar(obj, function (data) {
            if (data.mensaje !== "ok") {
                reject('No hay datos');
            } else {
                let detalle = JSON.parse(data.objeto);
                arrayguiasdetalledes = detalle;

                var tbody = '<tbody>';

                for (var i = 0; i < detalle.length; i++) {
                    let btnvedatos = "";

                    btnvedatos = `<div class="btn-group btn-group-sm" >
                            <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="VER DETALLE" href="`+ ORIGEN + `/Almacen/AGuiaSalida/RegistrarEditar/?id=` + detalle[i].idguiasalida + `"><i class="fa fa-list" style="color: #2678ae;"></i></a>
                              </div>`;
                    tbody += '<tr>';
                    tbody += '<td>' + btnvedatos + '</td>';
                    tbody += '<td>' + detalle[i].codigodocumento + '</td>';
                    //tbody += '<td>' + detalle[i].sucusaldestino + '</td>';
                    //tbody += '<td>' + detalle[i].empresa + '</td>';
                    tbody += '<td>' + detalle[i].codigoproducto + '</td>';
                    tbody += '<td>' + detalle[i].nombre + '</td>';
                    tbody += '<td>' + detalle[i].FECHA + '</td>';
                    tbody += '<td>' + detalle[i].cantidadgenerada + '</td>';
                    tbody += '<tr>';
                }

                const tableHtml = `<table class="table table-sm">
                    <thead class="thead-light">
                           <tr>
                                <th>boton</th>
                                <th>ID DOCUMENTO</th>                              
                                <th>CODIGO PRODUCTO</th>                                
                                <th>PRODUCTO</th>
                                <th>FECHA CREACION</th>                       
                               <th>CANT. (PRODUCTOS) </th>
                             
                            </tr>
                    </thead>` + tbody + `</table>`;

                resolve(tableHtml);
            }
        });
    });
}

$(document).ready(function () {
    $('#tbllista tbody').on('click', 'tr td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tbllista.row(tr);
        var columna = tbllista.row($(this).parents('tr')).data();
        if (row.child.isShown()) {
            tr.removeClass('details');
            row.child.hide();
        } else {
            var id = columna[2];
            tr.addClass('details');

            if (row.child) {
                fnGetDetalleGuiaSalida(id).then((html) => { // <-- Aquí se produce el error
                    row.child(html).show();
                });
            } else {
                console.error('row.child no está definido');
            }
        }
    });


    $('#tbllista tbody').on('click', 'button.toggle-btn', function () {
        var tr = $(this).closest('tr');
        tbllista.row(tr).child().toggle();
    });
});


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

function fnimprimir(id) {
    var href = ORIGEN + `/Almacen/AMantenimientoGuia/ImprimirPreGuia/?id=` + id;
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