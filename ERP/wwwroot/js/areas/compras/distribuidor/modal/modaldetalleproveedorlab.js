var DPL_txtidproveedor = $('#DPL_txtidproveedor');
var DPL_laboratorio = $('#DPL_laboratorio');

var tbllaboratorio;
$(document).ready(function () {
    tbllaboratorio = $('#tbllaboratorio').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        //dom: 'Bfrtip',
        responsive: true,
        //buttons: BOTONESDATATABLE('LISTA DE PROVEEDORES', 'H', false),
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [2],
                "visible": false,
                "searchable": false
            }
        ]
        

    });
});

$("#modaldetalleproveedorlab").draggable({
    handle: ".modal-header"
});

$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function () {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});

//EVENTOS
function DPL_abrirmodal(id) {
    DPL_txtidproveedor.val(id);
    $('#modaldetalleproveedorlab').modal('show');
    DPL_listarLaboratorio(id,'');
}
DPL_laboratorio.keyup(function () {
    DPL_listarLaboratorio(DPL_txtidproveedor.val(), DPL_laboratorio.val());
});


$('#formregistrocontacto').submit(function (e) {
    e.preventDefault();
    if (RP_txtidproveedor.val() === '') {
        mensaje('I','Primero registre un proveedor.');
        return;
    }
    var url = ORIGEN + "/Compras/ContactoProveedor/RegistrarEditar";
    var obj = $('#formregistrocontacto').serializeArray();
    obj[obj.length] = { name: 'idproveedor', value: RP_txtidproveedor.val() };
    btnguardarcontacto.prop('disabled', true);
    var operacion = RC_txtidcontacto.val();
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (operacion === "") {
                mensaje('S','Registro guardado');

            } else {
                mensaje('S','Registro actualizado');
                tblcontactos.row('.selected').remove().draw(false);
            }
            DPL_agregarFila(data.objeto);
            RC_limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S','Existia un registro con la misma descripcion se ha habilitado');
            tblcontactos.row('.selected').remove().draw(false);
            DPL_agregarFila(data.objeto);
            RC_limpiar();
        } else
            mensaje('W',data.mensaje);
        btnguardarcontacto.prop('disabled', false);
    }).fail(function (e) {
        btnguardarcontacto.prop('disabled', false);
        mensajeError(e);

    });
});

function DPL_listarLaboratorio(idproveedor, laboratorio) {
    var url = ORIGEN + "/Compras/CProveedorLaboratorio/ListarLaboratorioxProveedor/";
    var obj = {
        idproveedor: idproveedor,
        laboratorio: laboratorio
    }
    $.get(url, obj).done(function (data) {
        if (data.mensaje === 'ok') {
            var laboratorio = JSON.parse(data.tabla);
            tbllaboratorio.clear().draw(false);
            for (var i = 0; i < laboratorio.length; i++) {
                DPL_agregarFila(laboratorio[i]);
            }
            //estilos a los switch buttons
            $('.js-switch').each(function () {
                new Switchery($(this)[0], $(this).data());
            });
        }
        else
            mensaje('W','No Info ó ' + data.mensaje);
    }).fail(function (data) {
        mensajeError(data);
    });
}

function DPL_agregarFila(data) {
    //var control = data["ESTADO"] === 0 ? `<div>                                    
    //                                <input type="checkbox" data-color="#02ba5a" data-size="small" onchange="agregarLaboratorio(this,event)"/>                                   
    //                                </div>` :
    //                                `<div>                                    
    //                                    <input type="checkbox" data-color="#02ba5a" data-size="small" onchange="quitarLaboratorio(this,event)" checked/>                                   
    //                                </div>`;
    var control = data["ESTADO"] === 0 ? `<div>                                    
                                        <input type="checkbox" id="md_checkbox_26" class="filled-in chk-col-blue" onchange="agregar_quitarLaboratorio(this,event)"/></div>` :
                                    `<div>                                    
                                        <input type="checkbox" id="md_checkbox_26" class="filled-in chk-col-blue" onchange="agregar_quitarLaboratorio(this,event)" checked />                                  
                                    </div>`;
    var fila = tbllaboratorio.row.add([
        data["ID"],
        data["DESCRIPCION"],
        data["ESTADO"],
        control
    ]).draw(false).node();

}

function agregar_quitarLaboratorio(tabla, evento) {
    var columna = tbllaboratorio.row($(tabla).parents('tr')).data();
    //if (evento.target.checked) {
        var url = ORIGEN + "/Compras/CProveedorLaboratorio/RegistrarEliminar";
        var data = {
            idproveedor: DPL_txtidproveedor.val(),
            idlaboratorio: columna[0],
            estado: 'HABILITADO',
            id: columna[2]
        };
        $.post(url, data).done(function (data) {
            if (data.mensaje === "ok-registrado") {
                //DPL_listarLaboratorio(DPL_txtidproveedor.val(), DPL_laboratorio.val());
                mensaje('S','Laboratorio asignado');
            }
            else if (data.mensaje == "ok-eliminado")            
                mensaje('S','Laboratorio quitado');            
            else 
                mensaje('W', data.mensaje);
            
        }).fail(function (data) {
            mensaje("D", "Error en el servidor");
        });
    //}
}

function quitarLaboratorio(tabla, evento) {
    var columna = tbllaboratorio.row($(tabla).parents('tr')).data();
    if (!evento.target.checked) {
        var url = ORIGEN + "/Compras/CProveedorLaboratorio/Eliminar?id=" + columna[2];
        $.post(url).done(function (data) {
            if (data.mensaje === "ok") {
                DPL_listarLaboratorio(DPL_txtidproveedor.val(), DPL_laboratorio.val());
                mensaje('S','Laboratorio removido');
            }
            else {
                mensaje('W',data.mensaje);
            }
        }).fail(function (data) {
            mensaje("D", "Error en el servidor");
        });
    }
}

$('#DPL_btncerrarrepresentante').click(function () {
    $('#modaldetalleproveedorlab').modal('hide');
});