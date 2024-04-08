//inputs
var txtusuario = document.getElementById('txtusuario');
var txtnombreempresa = document.getElementById('txtnombreempresa');
var txtidsucursal = document.getElementById('txtidsucursal');
var txtdescripcion = document.getElementById('txtdescripcion');
var txtidrequerimiento = document.getElementById('txtidrequerimiento');
var formregistro = document.getElementById('formregistro');
var cmbgrupo = document.getElementById('cmbgrupo');

//buttons
//var btnimprimir = document.getElementById('btnimprimir');
//var btncancelar = document.getElementById('btncancelar');
var btnnuevo = document.getElementById('btnnuevo');
var btnagregarproducto = document.getElementById('btnagregarproducto');
//var btnactualizarstock = document.getElementById('btnactualizarstock');
var btnguardar = document.getElementById('btnguardar');

var tbldetalle;
var productos = [];
$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = false;
    datatable.lengthChange = false;
    datatable.ordering = false;
    datatable.buttons = [];

    var util = new UtilsSisqf();
    tbldetalle = util.Datatable('tbldetalle', false, datatable);

    fnlistarsucursal();
    fnlistarGrupos();

    if (MODELO.idrequerimiento != 0) {
        fnBuscarRequerimiento(MODELO.idrequerimiento);
    }
        
});


btnagregarproducto.addEventListener('click', function () {
    $('#modalproductos').modal('show');
});
$(document).on('click', '.btnpasarproducto', function () {
    var idproducto = this.getAttribute('idproducto');
    fnbuscarproducto(idproducto);
});

function fnbuscarproducto(idproducto) {
    let controller = new ProductoController();
    controller.BuscarProducto(idproducto, function (data) {
        fncargardataproducto(data);
        fnagregarindex();
    });
}
function fncargardataproducto(data) {
    productos.push(data);
    var fila = tbldetalle.row.add([
        '<span class="index"></span>',
        data.codigoproducto,
        data.nombre,
        '<input type="number" min="0" class="cantidad inputdetalle" >',
        '<button type="button" class="btn btn-sm btn-danger btnquitaritem"><i class="fas fa-trash"><i></button>'
    ]).draw(false).node();
    fila.setAttribute('idproducto', data.idproducto);
}
function fnagregarindex() {
    var filas = $(tbldetalle.rows().nodes());
    var c = 1;
    for (var i = 0; i < filas.length; i++) {
        var e = filas[i];
        try {
            e.getElementsByClassName('index')[0].textContent = c;
            c++;
        } catch (e) { }
    }

}
$(document).on('click', '.btnquitaritem', function () {
    tbldetalle.row('.selected').remove().draw(false);
    fnagregarindex();
});
$('#tbldetalle tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetalle.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

function fnlistarsucursal() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('txtidsucursal', IDSUCURSAL);
}
function fnlistarGrupos() {
    let controller = new ModulosGrupoController();
    controller.ListarGrupos('cmbgrupo');
}

formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    if (fngetdetalle().length === 0) {
        mensaje('W', 'No se han registrado cantidades', 'TC');
        return;
    }

    fnguardar();
});
function fnguardar() {
    var obj = $('#formregistro').serializeArray();
    obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fngetdetalle()) };
    swal({
        title: '¿Desea registrar el ingreso?',
        text: '',
        icon: 'info',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            BLOQUEARCONTENIDO('formregistro', 'Guardando datos ...');
            let controller = new RequerimientoController();
            controller.RegistrarEditar(obj, function (data) {
                btnguardar.disabled = true;
                btnagregarproducto.disabled = true;
                if(data.mensaje == "ok")
                    mensaje("S", "Registro guardado correctamente.");
                else
                    mensaje("W", "Error al guardar.");
                DESBLOQUEARCONTENIDO('formregistro');
            }, () => { DESBLOQUEARCONTENIDO('formregistro'); btnguardar.disabled = false; btnagregarproducto.disabled = true;});
        } else
            swal.close();
    });
}

function fngetdetalle() {
    var filas = $(tbldetalle.rows().nodes());

    var array = [];
    for (var i = 0; i < filas.length; i++) {
        var e = filas[i];
        if (e.getElementsByClassName('cantidad')[0].value > 0) {
            array.push({ idproducto: e.getAttribute('idproducto'), cantidad: e.getElementsByClassName('cantidad')[0].value});
        }
    }
    return array;
}

function fnBuscarRequerimiento(idrequerimiento) {
    let controller = new RequerimientoController();
    controller.BuscarRequerimientoCompleto(idrequerimiento, function (data) {
        btnguardar.disabled = true;
        btnagregarproducto.disabled = true;

        var cabecera = JSON.parse(data[0]['CABECERA']);
        var detalle = JSON.parse(data[0]['DETALLE']);

        if (cabecera[0].idordencompra == 0) {
            btnguardar.removeAttribute("disabled");
            btnagregarproducto.removeAttribute("disabled");

        }
        //MODELO = cabecera;
        cmbgrupo.value = cabecera[0].idgrupo;
        txtidrequerimiento.value = cabecera[0].idrequerimiento;
        fnCargarDatosAldetalle(detalle);
    });
}
function fnCargarDatosAldetalle(detalle) {
    tbldetalle.clear().draw(false);
    //_DETALLE = detalle;
    for (var i = 0; i < detalle.length; i++) {
        var fila = tbldetalle.row.add([
            '<span class="index_detalle">' + (i + 1) + '</span>',
            detalle[i].codigoproducto,
            detalle[i].nombre,
            '<input type="number" min="0" class="cantidad inputdetalle" value="' + detalle[i].cantidad + '">',
            '<button type="button" class="btn btn-sm btn-danger btnquitaritem"><i class="fas fa-trash"><i></button>',
        ]).draw(false).node();
        fila.setAttribute('idproducto', detalle[i].idproducto);
        $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
    }
}

btnnuevo.addEventListener('click', function () {
    location.href = ORIGEN + '/Compras/CRequerimiento/RegistrarEditar';
});