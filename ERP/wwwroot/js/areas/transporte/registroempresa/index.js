var MRE_txtcodigo = $('#MRE_txtcodigo');
var MRE_txtoperacion = $('#MRE_txtoperacion');
var MRE_txtruc = $('#MRE_txtruc');
var MRE_txtrazonsocial = $('#MRE_txtrazonsocial');
var MRE_txtdireccionfiscal = $('#MRE_txtdireccionfiscal');
var MRE_txttelefono = $('#MRE_txttelefono');
var MRE_txtemail = $('#MRE_txtemail');
var MRE_cmbestado = $('#MRE_cmbestado');
var MRE_btn_guardar = $('#MRE_btn_guardar');

var tbllista;
var MRE_btnguardar = $('#MRE_btnguardar');
$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        dom: 'Bfrtip',
        responsive: true,
        buttons: BOTONESDATATABLE('LISTA DE CLASES DE PRODUCTO ', 'V', false),
        "language": LENGUAJEDATATABLE()  
    });
});

function MRE_limpiar() {
    $('#MRE_form_empresa').trigger('reset');
    MRE_txtoperacion.val("nuevo");
    MRE_txtcodigo.val("");
}

$('#MRE_form_empresa').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Transporte/EmpresaTransporte/RegistrarEditar";
    var obj = $('#MRE_form_empresa').serializeArray();
    MRE_btn_guardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (MRE_txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');

            } else if (MRE_txtoperacion.val() === "editar") {
                mensaje('S', 'Registro actualizado');
                tbllista.row('.selected').remove().draw(false);
            }
            MRE_txtcodigo.val(data.objeto.idempresa);
            MRE_agregarFila(data.objeto);
            //MRE_limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            
            MRE_txtcodigo.val(data.objeto.idempresa);
            MRE_agregarFila(data.objeto);
           // MRE_limpiar();
        }else
            mensaje('W', data.mensaje);
        MRE_btn_guardar.prop('disabled', false);
    }).fail(function (data) {
        MRE_btn_guardar.prop('disabled', false);
        mensaje("D", "Error en el servidor");
    });
});

$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.btn-pasar', function (e) {
    MRE_limpiar();
    var columna = tbllista.row($(this).parents('tr')).data();
    CMV_tbllista.clear().draw(false);
    MRE_cargarvehiculos(columna[0])
    MRE_txtcodigo.val(columna[0]);
    MRE_txtruc.val(columna[1]);
    MRE_txtrazonsocial.val(columna[2]);
    MRE_txtdireccionfiscal.val(columna[3]);
    MRE_txttelefono.val(columna[4]);
    MRE_txtemail.val(columna[5]);
    MRE_cmbestado.val(columna[6]);
    MRE_txtoperacion.val("editar");
    $('#MRE_modalregistro').modal('show');
});
function MRE_agregarFila(data) {
    console.log(data);
    let estado = data.estado == 'HABILITADO' ? `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm bg-warning waves-effect btn-pasar"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm bg-danger waves-effect text-white" onclick="MRE_mensajedeshabilitar(`+ data.idempresa + `)"><i class="fas fa-lock"></i></button>                                                                 
        </div>`:
        `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm bg-success waves-effect" onclick="MRE_mensajehabilitar(`+ data.idempresa + `)"><i class="fas fa-unlock"></i></button>
        </div>`;
    tbllista.row.add([
        data.idempresa,
        data.ruc,        
        data.razonsocial,        
        data.direccionfiscal,        
        data.telefono,        
        data.email,        
        data.estado,      
        estado
    ]).draw(false);
}
function MRE_mensajedeshabilitar(data) {
    swal({
        title: '¿Desea deshabilitar registro?',
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            MRE_deshabilitar(data);
        }
        else
            swal.close();
    });
}
function MRE_mensajehabilitar(data) {
    swal({
        title: '¿Desea habilitar registro?',
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            MRE_habilitar(data);
        }
        else
            swal.close();
    });
}
function MRE_deshabilitar(id) {
    var url = ORIGEN + "/Transporte/EmpresaTransporte/Deshabilitar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                MRE_agregarFila(data.objeto);
                swal("Registro deshabilitado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}
function MRE_habilitar(id) {
    var url = ORIGEN + "/Transporte/EmpresaTransporte/Habilitar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                MRE_agregarFila(data.objeto);
                swal("Registro habilitado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}

function MRE_cargarvehiculos(idempresa) {
    let controller = new VehiculoController();
    let params = { idempresa: idempresa };
    controller.ListarVehiculosxEmpresa(params,MRE_fncargartalavehiculos);
}

function MRE_fncargartalavehiculos(data) {
    if (data.mensaje == "ok") {
        let datos = data.objeto;
        for (let i = 0; i < datos.length; i++) {
            MRV_agregarFila(datos[i]);
        }
    }
    else 
        mensajeError(data.mensaje);
}