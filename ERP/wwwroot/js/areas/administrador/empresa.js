var txtcodigo = $('#txtcodigo');
var txtdescripcion = $('#txtdescripcion');
var txtruc = $('#txtruc');
var txttelefono = $('#txttelefono');
var txtcelular = $('#txtcelular');
var txtemail = $('#txtemail');
var txtdireccion = $('#txtdireccion');
var txtcorrelativo = $('#txtcorrelativo');
var txtnombrecomercial = $('#txtnombrecomercial');
var txtimagen = $('#txtimagen');
var txtfile = $('#txtfile');
var txtcodsunat = $('#txtcodsunat');
var cmbalmacen = $('#cmbalmacen');
var cmbestado = $('#cmbestado');
var txtoperacion = $('#txtoperacion');
var tbllista;
var btnguardar = $('#btn-guardar');
var txtcodigoubigeo = document.getElementById('txtcodigoubigeo');
var cmbdepartamento = document.getElementById('cmbdepartamento');
var cmbprovincia = document.getElementById('cmbprovincia');
var cmbdistrito = document.getElementById('cmbdistrito');
var txtpaginaweb = document.getElementById('txtpaginaweb');
var txtlogofacturacion = document.getElementById('txtlogofacturacion');
var logofacturacion = document.getElementById('imglogofacturacion');
$(document).ready(function () {
  
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
    $('#btndatatablenuevo').click(function () {
        $('#modalregistro').modal('show');
    });
    fnListarDepartamentos();
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    txtcodigo.val("");
    txtimagen.replaceWith(txtimagen.prop('src', ''));
    txtfile.replaceWith(txtfile.val('').clone(true));
    txtlogofacturacion.value = '';
    logofacturacion.src = '';
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    // alert(txtoperacion.val());
    var url = ORIGEN + "/Administrador/Empresa/RegistrarEditar";
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
            guardarImagen(data.objeto.idempresa);         
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

function guardarImagen(id) {   
    var dataString = new FormData();
    var url = ORIGEN + "/Administrador/Empresa/guardarImagen";
    var selectFile = ($('#txtfile'))[0].files[0];
  
    dataString.append("id", id);
    dataString.append('tipo', "logo");   
    dataString.append('file', selectFile);   
    var logofacturacion = ($('#txtlogofacturacion'))[0].files[0];    
    dataString.append('tipo', "facturacion");   
    dataString.append('file', logofacturacion);   
  
    $.ajax({
        url: url,
        type: "POST",
        data: dataString,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            agregarFila(data.objeto);
        }, error: function (data) {
            alert("Error no identificado");
        }

    });
}
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
    var columna = tbllista.row($(this).parents('tr')).data();
    txtcodigo.val(columna[1]);
    buscarEmpresa(columna[1]);
    txtoperacion.val("editar");   
});

function buscarEmpresa(id) {
    var url = ORIGEN + "/Administrador/Empresa/BuscarEmpresa";
    var obj = {id:id};
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data != null) {
            txtcodigoubigeo.value = data.codigoubigeo;
            txtpaginaweb.value = data.paginaweb;
            txtcodigo.val(data.idempresa);
            txtcelular.val(data.celular);
            txttelefono.val(data.telefono);
            txtruc.val(data.ruc);
            txtdescripcion.val(data.descripcion);
            txtemail.val(data.email);
            txtcorrelativo.val(data.correlativo);
            cmbestado.val(data.estado);
            txtnombrecomercial.val(data.nombrecomercial);
            txtcodsunat.val(data.codestablecimientosunat);
            txtdireccion.val(data.direccion);    
            txtimagen.attr('src', '/imagenes/empresas/' + data.imagen);
            logofacturacion.src = '/imagenes/empresas/' + data.logofacturacion;
            txtoperacion.val('editar');
            txtcodigo.prop('readonly', true);
            fnListarSucursal(data.idempresa, data.idsucursalalmacen);
            cmbdepartamento.value = data.iddepartamento === '' ? '' : data.iddepartamento;
            let procontroller = new ProvinciaController();
            procontroller.Listar(data.iddepartamento, data.idprovincia, 'cmbprovincia', null);
            let discontroller = new DistritoController();
            discontroller.Listar(data.idprovincia, data.iddistrito, 'cmbdistrito', null);
            $('#modalregistro').modal('show');
        }
    }).fail(function (data) {
       
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}
function agregarFila(data) {
 
    tbllista.row.add([
        '<img src="/imagenes/empresas/'+data.imagen+'" style="width:100px;height:60px" />',
        data.idempresa,
        data.correlativo,
        data.ruc,
        data.descripcion,
        data.nombrecomercial,
        data.telefono,
        data.celular,
        data.direccion,
        data.estado,
        ` <div class="btn-group btn-group-sm">          
            <button class="btn btn-sm btn-warning waves-effect btn-pasar"><i class="fa fa-edit" data-toggle="tooltip" data-placement="top" title="Editar empresa"></i></button>
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
var img = document.getElementById("txtimagen");
$("#txtfile").change(function () {
    let reader = new FileReader();
    var file = document.querySelector('input[id=txtfile]')['files'][0];
    reader.readAsDataURL(file);
    var imagen = "";
    reader.onload = function () {
        img.src = reader.result;
        _IMAGEN = reader.result;
    };
});

$('#btnnuevo').click(function () {
   // txtcodigo.prop('readonly', false);

});
function fnListarSucursal(idempresa,idsucursal) {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbalmacen', idempresa, null, idsucursal);
}
function fnListarDepartamentos() {
    let controller = new DepartamentoController();
    controller.Listar('cmbdepartamento', null);
}
cmbdepartamento.addEventListener('change', function () {
    let controller = new ProvinciaController();
    controller.Listar(cmbdepartamento.value, '', 'cmbprovincia', null);
});
cmbprovincia.addEventListener('change', function () {

    let controller = new DistritoController();
    controller.Listar(cmbprovincia.value, '', 'cmbdistrito', null);

});
txtlogofacturacion.addEventListener('change', function () {    
    let reader = new FileReader();
    var file = document.querySelector('input[id=txtlogofacturacion]')['files'][0];
    reader.readAsDataURL(file);
    reader.onload = function () {
        logofacturacion.src = reader.result;
    };
});
function probarapi() {
    var dataString = new FormData();
    var url = ORIGEN + "/Administrador/Empresa/subirarchivoapi";

    $.ajax({
        url: url,
        type: "POST",
        data: dataString,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            agregarFila(data.objeto);
        }, error: function (data) {
            alert("Error no identificado");
        }

    });
}
