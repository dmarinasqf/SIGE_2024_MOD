var txtcodigo = $('#txtcodigo');
var txtruc = $('#txtruc');
var txtruc2 = document.getElementById('txtruc');
var txtrazonsocial = $('#txtrazonsocial');


var cmbubicacion = $('#cmbubicacion');
var cmbpais = $('#cmbpais');
var txtdirecciond = $('#txtdirecciond');
var txttelefonod = $('#txttelefonod');
var txtcorreo = $('#txtcorreo');
//var txtctaproveedor = $('#txtctaproveedor');
var cmbmoneda = $('#cmbmoneda');
var cbtipoproveedor = $('#cbtipoproveedor');
var cmbcondicionpago = $('#cmbcondicionpago');
var cmbsituacion = $('#cmbsituacion');
var txtdocumentocontacto = $('#txtdocumentocontacto');
var txtnombrescontacto = $('#txtnombrescontacto');
var txttelefonocontacto = $('#txttelefonocontacto');
var txtcelularcontacto = $('#txtcelularcontacto');
var txtobservaciones = $('#txtobservaciones');
var txtdescuento = $('#txtdescuento');
var txtoperacion = $('#txtoperacion');
var cmbcondicionpago = $('#cmbcondicionpago');
var cmbhabido = $('#cmbhabido');
//var cmbbanco = $('#cmbbanco');
var tbllista;
var btnguardar = $('#btn-guardar');

var txtnombrecomercial = document.getElementById('txtnombrecomercial');
var cmbdepartamento = document.getElementById('cmbdepartamento');
var cmbprovincia = document.getElementById('cmbprovincia');
var cmbdistrito = document.getElementById('cmbdistrito');


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
    let controller = new DepartamentoController();
    controller.Listar( 'cmbdepartamento', null);
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    txtcodigo.val("");
    cmbdepartamento.value = '';
    cmbprovincia.innerHTML = '';
    cmbdistrito.innerHTML = '';
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Compras/CProveedor/RegistrarEditar";
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
            agregarFila(data.objeto);
            buscar(data.objeto.idproveedor);
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            agregarFila(data.objeto);
            buscar(data.objeto.idproveedor);
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
cmbubicacion.change(function () {
    if ($('#cmbubicacion option:selected').text() == 'NACIONAL')
        $("#cmbpais option:contains(PERU)").attr('selected', true);
});
$('#modalregistro').on('hidden.bs.modal', function (e) {
    limpiar();
});
txtruc2.addEventListener('keyup', function (e) {
    console.log(e.key);
    if (e.key === 'Enter') {
        console.log(e.key);
        if (txtruc.val().length === 11) {
            let controller = new ApiController();
            controller.BuscarSunatReniec(txtruc.val(),'ruc', fnbuscarrucsunat);
        }
    }
});

cmbdepartamento.addEventListener('change', function () {
    fnbuscarprovincias();
});
cmbprovincia.addEventListener('change', function () {
    let controller = new DistritoController();
    controller.Listar(cmbprovincia.value, '', 'cmbdistrito', null);
});

function agregarFila(data) {

    console.log(data);
    tbllista.row.add([
        data.idproveedor,
        data.ruc,
        data.razonsocial,
        data.direcciond,
        data.telefonod,
        '',
        //data.ctaproveedor,
        data.des1,
        data.situacion,
        data.contacto.nombres,
        `<div class="btn-group btn-group-sm " >    
           <a class="btn btn-sm btn-outline-info waves-effect  font-10" data-toggle="tooltip" data-placement="top" title="Agregar insumos"  href="/Compras/CProductoProveedor/Index/` + data.idproveedor + `" target="_blank"><i class="fas fa-pills"></i></a>
           <a class="btn btn-sm btn-outline-success waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Agregar laboratorio" onclick="DPL_abrirmodal(` + data.idproveedor + `)"><i class="fas fa-bong"></i></a>
                                    <a class="btn btn-sm btn-outline-secondary waves-effect  font-10" data-toggle="tooltip" data-placement="top" title="Agregar contacto"  href="/Compras/CProveedor/IndexContactos/` + data.idproveedor + `" target="_blank"><i class="fas fa-user"></i></a>
          <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Editar Registro" onclick="buscar(`+ data.idproveedor + `)" href="#panelregistro"><i class="fas fa-edit"></i></a>
          <button class="btn btn-sm btn-outline-danger waves-effect font-10" data-toggle="tooltip" data-placement="top" title="Eliminar Registro" onclick="mensajeeliminar(`+ data.idproveedor + `)"><i class="fas fa-trash-alt"></i></button>         
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
    var url = ORIGEN + "/Compras/CDistribuidor/Eliminar/" + id;
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
    var url = ORIGEN + "/Compras/CProveedor/Buscar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                console.log(data.objeto);
                $('#modalregistro').modal('show');
                txtcodigo.val(data.objeto.idproveedor);
                txtruc.val(data.objeto.ruc);
                txtrazonsocial.val(data.objeto.razonsocial);
                txtnombrecomercial.value=(data.objeto.nombrecomercial);
                cmbubicacion.val(data.objeto.ubicacion);
                cmbpais.val(data.objeto.idpais);
                cmbhabido.val(data.objeto.habido);                
                txtdirecciond.val(data.objeto.direcciond);
                txttelefonod.val(data.objeto.telefonod);
                txtcorreo.val(data.objeto.email);                
                cmbmoneda.val(data.objeto.idmoneda);              
                cmbsituacion.val(data.objeto.estado);
                txtdescuento.val(data.objeto.des1);
                cmbcondicionpago.val(data.objeto.idcondicionpago);
                txtobservaciones.val(data.objeto.observaciones);
                txtoperacion.val('editar');
                cbtipoproveedor.val(data.objeto.idtipoproducto);
                ////cmbdepartamento.value = data.iddepartamento;
                ////let procontroller = new ProvinciaController();
                ////procontroller.Listar(data.iddepartamento, data.idprovincia, 'cmbprovincia', null);
                ////let discontroller = new DistritoController();
                ////discontroller.Listar(data.idprovincia, data.iddistrito, 'cmbdistrito', null);
                ////fnbuscarprovincias_conid(data.idprovincia);
                //CAMBIOS SEMANA2
                cmbdepartamento.value=data.objeto.iddepartamento;
                let procontroller = new ProvinciaController();
                procontroller.Listar(data.objeto.iddepartamento, data.objeto.idprovincia, 'cmbprovincia', null);
                let discontroller = new DistritoController();
                discontroller.Listar(data.objeto.idprovincia, data.objeto.iddistrito, 'cmbdistrito', null);
                fnbuscarprovincias_conid(data.objeto.idprovincia);
                fnlistarcuentasproveedor(id);

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
function fnbuscarrucsunat(data) { 
    txtrazonsocial.val(data.result.RazonSocial);
    txtdirecciond.val(data.result.DomicilioFiscal);
    //cmbhabido.val(data.result.condicion);
    txtnombrecomercial.value = data.result.NombreComercial;
    $('#cmbdepartamento option:contains(' + data.result.Departamento + ')').attr('selected', true);    
    fnbuscarprovincias();

}
function mostrarLaboratorios(id) {
    $('#modaldetalleproveedorlab').modal();
}
function fnbuscarprovincias() {
    let controller = new ProvinciaController();
    controller.Listar(cmbdepartamento.value, '', 'cmbprovincia', null);
}
