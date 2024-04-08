//VARIABLES
var tbllista;
var tblcajas;
var tblcajasucursal;
var LABORATORIOS = [];
var _CAJAS = [];
var _LISTAS = [];
var _CAJASCORRELATIVO = [];
var _SUCURSAL = new Object();
var tbllaboratorios;

//INPUTS
var txtsucursal = $('#txtsucursal');
var txtcodigo = $('#txtcodigo');
var txtdireccion = $('#txtdireccion');
var cmbtiposucursal = $('#cmbtiposucursal');
var cmblabasignado = $('#cmblabasignado');
var txtserie = $('#txtserie');
var txtcmp = $('#txtcmp');
var txtgerentesucursal = $('#txtgerenteSucursal');
var cmbsucursal = $('#cmbsucursal');
var cmbempresa = $('#cmbempresa');
var cmblugar = $('#cmblugar');
var txtcodigoestablecimiento = $('#txtcodigoestablecimiento');
var txtcoddigemid = document.getElementById('txtcoddigemid');
var checkisprimario = document.getElementById('checkisprimario');
var checkgeneraguia = document.getElementById('checkgeneraguia');
var btnguardar = $('#btn-guardar');
var txtoperacion = $('#TIPOOPERACION');
var txtCantidadConsultorioAnterior = $('#txtCantidadConsultorioAnterior');
var checkesdelivery = document.getElementById('checkesdelivery');
var cmbdepartamento = document.getElementById('cmbdepartamento');
var cmbprovincia = document.getElementById('cmbprovincia');
var cmbdistrito = document.getElementById('cmbdistrito');
var txttelefono = document.getElementById('txttelefono');
var txtcelular = document.getElementById('txtcelular');
var txtcentrocosto = document.getElementById('txtcentrocosto');

//TABLAS
var tbltbodylistaprecios = document.getElementById('tbltbodylistaprecios');

//TABS
var tabcajas = document.getElementById('cajas-tab');
var tabcorrelativos = document.getElementById('correlativos-tab');
var tablistaprecios = document.getElementById('listaprecios-tab');

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
    tbllaboratorios = $('#tbllaboratorios').DataTable({
        "searching": false,
        lengthChange: false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "ordering": false,
        "language": LENGUAJEDATATABLE() 
        
    }); 
    tblcajas = $('#tblcajas').DataTable({
        "searching": false,
        lengthChange: false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "ordering": false,
        paging: false,
        info:false,
        "language": LENGUAJEDATATABLE()
    }); 
    tblcajasucursal = $('#tblcajasucursal').DataTable({
        "searching": false,
        lengthChange: false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "ordering": false,
        paging: false,
        info: false,
        "language": LENGUAJEDATATABLE()

    }); 
    actualizarLaboratorios();
    fnListarDepartamentos();
    fnListarCajas();
    fnListarListaPrecios();

});



$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = '';
    if (txtoperacion.val() === 'nuevo')
        url = ORIGEN + "/Administrador/Sucursal/Create";
    else
        url = ORIGEN + "/Administrador/Sucursal/Edit";

    var obj = $('#form-registro').serializeArray();
    console.log(obj);
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');
            } else if (txtoperacion.val() === "editar") {
                mensaje('S', 'Registro actualizado');
                tbllista.row('.selected').remove().draw(false);

            }

            if ($('select[id="cmbtiposucursal"] option:selected').text() == "PRODUCCIÓN") {
                data.objeto.nombreLaboratorio = data.objeto.descripcion;
            }
            else
                data.objeto.nombreLaboratorio = $('select[id="cmblabasignado"] option:selected').text();
            agregarFila(data.objeto);
            limpiar();
        } else if (data.mensaje === "Existe registros")
            mensaje("W", "No se puede cambiar a local porque existen sucursales asociados a este local de producción");
        else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
});

$(document).on('click', '.btn-pasar', function (e) {
    var columna = tbllista.row($(this).parents('tr')).data();
    txtcodigo.val(columna[0]);
    txtdescripcion.val(columna[1]);
    cmbestado.val(columna[2]);
    txtoperacion.val("editar");
    $('#modalregistro').modal('show');
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
cmbdepartamento.addEventListener('change', function () {
    let controller = new ProvinciaController();
    controller.Listar(cmbdepartamento.value, '', 'cmbprovincia', null);
});
cmbprovincia.addEventListener('change', function () {

    let controller = new DistritoController();
    controller.Listar(cmbprovincia.value, '', 'cmbdistrito', null);

});
tabcorrelativos.addEventListener('click', function () {
    let controller = new CajaController();
    controller.ListarCajaSucursal(function (data) {
        _CAJASCORRELATIVO = data;
        tblcajasucursal.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            tblcajasucursal.row.add([
                data[i].nombre,
                '<button class="btn btn-sm btn-dark btnconfigcajasucursal" nombrecaja="' + data[i].nombre + '" idcajasucursal="' + data[i].idcajasucursal + '"> <i class="fas fa-cog"></i></button>'
            ]).draw(false);
        }


    }, txtcodigo.val());
});
$('#btnnuevo').click(function () {
    limpiar();
    txtoperacion.val("nuevo");
    $('#modalregistro').modal('show');
    cmbempresa.prop('disabled', false);
    $('#tabopciones').addClass('deshabilitartodo');
    cargarLaboratorios(LABORATORIOS, []);
});
$(document).on('click', '.hassucursal', function (e) {
    var idlab = tbllaboratorios.row($(this).parents('tr')).data()[0];
    var ischeck = $(this).prop('checked');
    console.log(ischeck);
    var obj = {
        idlaboratorio: idlab,
        idsucursal: txtcodigo.val()
    };
    if (txtcodigo.val() === '')
        return;
    var url = ORIGEN+'/Administrador/Sucursal/AgregarEliminarLaboratorio';
    $.post(url, obj).done(function (data) {
        if (data.mensaje === 'ok') {
            if (ischeck)
                mensaje('S', 'Laboratorio agregado');
            else
                mensaje('S', 'Laboratorio removido');
        } else {
            mensaje('W', data.mensaje);
        }
    }).fail(function (data) {
        mensaje("D", 'Error en el servidor');
    });
});
$(document).on('click', '.hascajacheck', function (e) {
    
    var ischeck = $(this).prop('checked');
    var idcaja = this.getAttribute('idcaja');
    var obj = {
        idcaja: idcaja,
        idsucursal: txtcodigo.val()
    };
    if (txtcodigo.val() === '')
        return;
    var url = ORIGEN +'/Administrador/Sucursal/AgregarEliminarCaja';
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.mensaje === 'ok') {
            if (ischeck)
                mensaje('S', 'CAJA ASIGNADA');
            else
                mensaje('S', 'CAJA REMOVIDA');
        } else {
            mensaje('W', data.mensaje);
        }
    }).fail(function (data) {
        mensaje("D", 'Error en el servidor');
    });
});
$(document).on('click', '.haslistapreciocheck', function (e) {

    var ischeck = $(this).prop('checked');
    var idlista = this.getAttribute('idlista');

    var obj = {
        idlista: idlista,
        idsucursal: txtcodigo.val()
    };
    if (txtcodigo.val() === '')
        return;
    let controller = new SucursalController();
    controller.AsignarListaPrecios(obj, ischeck, null);
   
});
checkesdelivery.addEventListener('click', function () {
    if (this.checked)
        checkesdelivery.value = true;
    else
        checkesdelivery.value = false;
   
});
checkisprimario.addEventListener('click', function () {
    if (this.checked)
        checkisprimario.value = true;
    else
        checkisprimario.value = false;   
});
checkgeneraguia.addEventListener('click', function () {
    if (this.checked)
        checkgeneraguia.value = true;
    else
        checkgeneraguia.value = false;
});

$(document).on('click', '.btnconfigcajasucursal', function () {
    MC_fnlimpiar();
    $('#modalconfigcaja').modal('show');
    var idcajasucursal = this.getAttribute('idcajasucursal');
    var nombrecaja = this.getAttribute('nombrecaja');
    MC_lblnombrecaja.innerHTML = nombrecaja;
    MC_txtidcajasucursal.value = idcajasucursal;
    MC_cmbidcajacorrelativoasociado.innerHTML = '';
    //cajas asociadas
    var option = document.createElement('option');
    option.value = '';
    option.text = '[SELECCIONE]';
    MC_cmbidcajacorrelativoasociado.appendChild(option);
    for (var i = 0; i < _CAJASCORRELATIVO.length; i++) {
        var option = document.createElement('option');
        option.value = _CAJASCORRELATIVO[i].idcajasucursal;
        option.text = _CAJASCORRELATIVO[i].nombre;
        MC_cmbidcajacorrelativoasociado.appendChild(option);
    }
    //documentos tributarios
    let doctricontroller = new DocumentoTributarioController();
    doctricontroller.Listar('MC_cmbdoctributario', null);

    //buscar cajasucursal
    let cajacontroller = new CajaController();
    cajacontroller.BuscarCajaSucursal(idcajasucursal, function (data) {
        if (data.correlativoasociadoaotracaja) {
            MC_checkcorrelativoasociadoaotracaja.checked = data.correlativoasociadoaotracaja;
            MC_cmbidcajacorrelativoasociado.value = data.idcajacorrelativoasociado;
            MC_seleccionarcajaasociada.classList.remove('deshabilitartodo');
            MC_tabladocumentos.classList.add('deshabilitartodo');
        } else {
            MC_checkcorrelativoasociadoaotracaja.checked = false;
            MC_seleccionarcajaasociada.classList.add('deshabilitartodo');
            MC_tabladocumentos.classList.remove('deshabilitartodo');
        }
        MC_txtnombreimpresora.value = data.nombreimpresora;
        MC_txtserieimpresora.value = data.serieimpresora;
        MC_txtipimpresora.value = data.ipimpresora;

    });
    //correlativos de caja
    fnListarCorrelativosPorCaja(idcajasucursal);
});


function fnListarDepartamentos() {
    let controller = new DepartamentoController();
    controller.Listar('cmbdepartamento',null);
}
function fnListarCajas() {
    let controller = new CajaController();
    controller.ListarCajas(function (data) {
        _CAJAS = data;
    });
}
function fnListarListaPrecios() {
    let controller = new ListaPreciosController();
    controller.ListarListasHabilitadas(function (data) {
        _LISTAS = data;
    });
}
function fnCargarCajaSucursal(cajassucursal) {   
    tblcajas.clear().draw(false);
    for (var i = 0; i < _CAJAS.length; i++) {
        var checked = '';
        for (var j = 0; j < cajassucursal.length; j++) {
            if (_CAJAS[i].idcaja === cajassucursal[j])
                checked = 'checked';
        }
        tblcajas.row.add([
            _CAJAS[i].idcaja,
            _CAJAS[i].descripcion,
            '<input type="checkbox" idcaja="' + _CAJAS[i].idcaja+'"  class="hascajacheck" ' + checked + '/>'
        ]).draw(false);
    }
}
function fnCargarListaSucursal(listas) {   
   
    tbltbodylistaprecios.innerHTML = '';
    var fila = '';
    for (var i = 0; i < _LISTAS.length; i++) {
        var checked = '';
        for (var j = 0; j < listas.length; j++) {
            if (_LISTAS[i].idlistaprecio === listas[j])
                checked = 'checked';
        }
        fila += '<tr>';
        fila += '<td>' + _LISTAS[i].idlistaprecio+'</td>';
        fila += '<td>' + _LISTAS[i].descripcion+'</td>';
        fila += '<td>' + '<input type="checkbox" idlista="' + _LISTAS[i].idlistaprecio + '"  class="haslistapreciocheck" ' + checked + '/></td>';
        fila += '</tr>';       
    }
    tbltbodylistaprecios.innerHTML = fila;
}
function cargarLaboratorios(data, labsucursal) {
    tbllaboratorios.clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        var checked = '';
        for (var j = 0; j < labsucursal.length; j++) {
            if (data[i].suc_codigo === labsucursal[j])
                checked = 'checked';
        }
        tbllaboratorios.row.add([
            data[i].suc_codigo,
            data[i].descripcion,
            '<input type="checkbox" style="width:20px;height:20px"  class="hassucursal" ' + checked + '/>'
        ]).draw(false);
    }
}

function actualizarLaboratorios() {

    var url = ORIGEN + '/Administrador/Sucursal/cargarProducion';
    $.post(url).done(function (data) {
        LABORATORIOS = data;
        cargarLaboratorios(data, []);
    }).fail(function (data) {
        mensaje("D", data);
    });
}

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    txtcodigo.val("");
}

function agregarFila(data) {
    var badge = '';
    if (data.estado == "HABILITADO")
        badge = ' <span class="badge badge-info">' + data.estado + '</span>';
    else
        badge = ' <span class="badge badge-warning">' + data.estado + '</span>';

    tbllista.row.add([
        data.suc_codigo,
        data.serie,
        //data.codigoestablecimiento,
        data.descripcion,
        data.idempresa,
        data.direccion,
        data.ciudad,
        data.tipoSucursal,       
        badge,
        '<button class="btn  btn-outline-warning btn-xs" onclick="mostrarSucursal(' + data.suc_codigo + ')"><i class="fas fa-edit fa-1x"></i></button> '
    ]).draw(false);
}
function mostrarSucursal(data) {
    $('#laboratorio-tab').click();
    var url = ORIGEN + '/Administrador/Sucursal/Buscar';
    var obj = { id: data };
    $.post(url, obj).done(function (data) {
        cmbempresa.prop('disabled', true);
        txtoperacion.val("editar");
        $('#modalregistro').modal('show');
        txtsucursal.val(data.descripcion);
        txtdireccion.val(data.direccion);
        txtcodigoestablecimiento.val(data.codigoestablecimiento);
        txtcodigo.val(data.suc_codigo);
        cmbtiposucursal.val(data.tipoSucursal);
        cmblabasignado.val(data.labasignado);
        txtserie.val(data.serie);
        txtgerentesucursal.val(data.gerenteSucursal);
        txtcmp.val(data.cqfp);
        cmblugar.val(data.idlugar);
        checkesdelivery.checked = data.issucursalentrega;
        checkesdelivery.value = data.issucursalentrega;
        checkisprimario.checked = data.isprimario;
        checkisprimario.value = data.isprimario;
        checkgeneraguia.checked = data.generaguia;
        checkgeneraguia.value = data.generaguia;
        txtcoddigemid.value = data.coddigemid;
        txtcelular.value = data.celular;
        txttelefono.value = data.telefono;
        txtcentrocosto.value = data.centrocosto;
        if (data.idempresa === "" || data.idempresa === null)
            cmbempresa.prop('disabled', false);
        cmbempresa.val(data.idempresa);
        $('#tabopciones').removeClass('deshabilitartodo');
        cmbdepartamento.value = data.iddepartamento === '' ? '' : data.iddepartamento;
        let procontroller = new ProvinciaController();
        procontroller.Listar(data.iddepartamento, data.idprovincia, 'cmbprovincia', null);
        let discontroller = new DistritoController();
        discontroller.Listar(data.idprovincia, data.iddistrito, 'cmbdistrito', null);
        cargarLaboratorios(LABORATORIOS, data.idlaboratorios);
        fnCargarCajaSucursal(data.idcajas);
        fnCargarListaSucursal(data.idlistas);
    }).fail(function (data) {
        mensaje("W", data);
    });
}

function eliminarSucursal(data, tipo) {
    if (tipo == 'D') {
        swal({
            title: '¿Desea deshabilitar?',
            text: "Asegurese de que no exista locales relacionados con producción.",
            type: 'warning',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'Cancelar',
                    className: 'btn btn-danger'
                },
                confirm: {
                    text: 'DESHABILITAR',
                    className: 'btn btn-success'
                }
            }
        }).then((willDelete) => {
            if (willDelete) {
                eliminar(data, tipo);
            }
            else
                swal.close();

        });
    }
    if (tipo == 'H') {
        swal({
            title: '¿Desea habilitar?',
            text: "Se habilitará la sucursal.",
            type: 'warning',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'Cancelar',
                    className: 'btn btn-danger'
                },
                confirm: {
                    text: 'HABILITAR',
                    className: 'btn btn-success'
                }
            }
        }).then((willDelete) => {
            if (willDelete) {
                eliminar(data, tipo);
            }
            else
                swal.close();

        });
    }
}
