var txtproveedor = $('#txtproveedor');
var txtidproveedor = $('#txtidproveedor');
var txtidproductoproveedor = $('#txtidproductoproveedor');
var txtcodproductoproveedor = $('#txtcodproductoproveedor');
var txtdescripcion = $('#txtdescripcion');
var cmbidunidadmedida = $('#cmbidunidadmedida');
var txtidproducto = $('#txtidproducto');
var txtcodproducto = $('#txtcodproducto');

var txtdescripconqf = $('#txtdescripconqf');
var txtabreviaturaqf = $('#txtabreviaturaqf');
var lblproveedor = $('#lblproveedor');


var txtoperacion = $('#txtoperacion');
var tbllista;
var btnguardar = $('#btnguardar');

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = false;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
   
    fnListarProductosProveedor();
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    txtidproveedor.val(txtproveedor.val());
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Compras/CProductoProveedor/RegistrarEditar";
    var obj = $('#form-registro').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');

            } else if (txtoperacion.val() === "editar") {
                mensaje('S', 'Registro actualizado');
                tbllista.row('.selected').remove().draw(false);
            }
            if(cmbidunidadmedida.val()!=="")
                data.objeto.unidadmedida = $('#cmbidunidadmedida option:selected').text();
            agregarFila(data.objeto);
            limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            agregarFila(data.objeto);
            limpiar();
        } else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
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

function agregarFila(data) {
    console.log(data);
    tbllista.row.add([    
        '<span>' + data.producto.codigoproducto + '</span></br><span>' + data.codproductoproveedor  + '</span>',
        '<span>' + data.producto.nombre + '</span></br><span>' + data.descripcion + '</span>',                
    
        ` <div class="btn-group btn-group-sm">
             <button class="btn btn-sm btn-outline-warning waves-effect font-10"  onclick="buscar( `+ data.idproductoproveedor +  `)"><i class="fas fa-edit"></i></button>
             <button class="btn btn-sm btn-outline-danger waves-effect font-10"  onclick="mensajeeliminar(`+ data.idproductoproveedor + `)"><i class="fas fa-trash-alt"></i></button>             
        </div>`
    ]).draw(false);
}

function mensajeeliminar(data) {
    swal({
        title: '¿Desea eliminar?',
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
            eliminar(data);
        }
        else
            swal.close();
    });
}
function eliminar(id) {
    var url = ORIGEN + "/Compras/CProductoProveedor/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                swal("Registro eliminado!", {
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
function buscar(id) {
    txtoperacion.val("editar");
    var url = ORIGEN + "/Compras/CProductoProveedor/Buscar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                
                txtidproveedor.val(data.objeto.idproveedor);
                txtidproductoproveedor.val(data.objeto.idproductoproveedor);
                txtcodproductoproveedor.val(data.objeto.codproductoproveedor);
                txtdescripcion.val(data.objeto.descripcion);
                cmbidunidadmedida.val(data.objeto.idunidadmedida);
                txtidproducto.val(data.objeto.idproducto);
                txtcodproducto.val(data.objeto.producto.codigoproducto);
                txtdescripconqf.val(data.objeto.producto.nombre);
                txtabreviaturaqf.val(data.objeto.producto.nombreabreviado);               
                txtoperacion.val('editar');
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
txtcodproducto.click(function () {
    $('#modalproductos').modal('show');
});

$(document).on('click', '.btnpasarproducto', function (e) {
    var columna = tbl_CBPtabla.row($(this).parents('tr')).data();
    txtidproducto.val(columna[0]);
    txtcodproducto.val(columna[1]);
    txtdescripconqf.val(FN_GETDATOHTML(columna[2],'nombreproducto'));
    txtabreviaturaqf.val(FN_GETDATOHTML(columna[2], 'abreviaturaproducto'));
    $('#modalproductos').modal('hide');
});

function fnListarProductosProveedor() {
    var obj = {
        idproveedor: txtidproveedor.val(),
        tipo: '',
        top:1000
    };
    let controller = new ProductoProveedorController();
    controller.BuscarProductos(obj, function (data) {
        tbllista.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            tbllista.row.add([
                '<span>' + data[i]['CODPROQF'] + '</span></br><span>' + data[i]['CODPROPROV'] + '</span>',
                '<span>' + data[i]['NOMBRE_PROD_QF'] + '</span></br><span>' + data[i]['NOMBRE_PROD_PROV'] + '</span>',                
               ` <div class="btn-group btn-group-sm">                                                        
                   <button class="btn btn-sm btn-outline-warning waves-effect font-10"  onclick="buscar(`+ data[i]['IDPROPROV']+`)"><i class="fas fa-edit"></i></button>
                   <button class="btn btn-sm btn-outline-danger waves-effect font-10"  onclick="mensajeeliminar(`+ data[i]['IDPROPROV'] +`)"><i class="fas fa-trash-alt"></i></button>
               </div>  `

            ]).draw(false);
        }
    });
}