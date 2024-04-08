//inputs
var txtusuario = document.getElementById('txtusuario');
var txtnombreempresa = document.getElementById('txtnombreempresa');
var txtidsucursal = document.getElementById('txtidsucursal');
var txtmotivo = document.getElementById('txtmotivo');
var txtidingreso = document.getElementById('txtidingreso');
var formregistro = document.getElementById('formregistro');
var cmbalmacen = document.getElementById('cmbalmacen');
var txtseriedoc = document.getElementById('txtseriedoc');
var txtnumdoc = document.getElementById('txtnumdoc');
//buttons

var btnimprimir = document.getElementById('btnimprimir');
var btncancelar = document.getElementById('btncancelar');
var btnnuevo = document.getElementById('btnnuevo');
var btnnuevoproducto = document.getElementById('btnnuevoproducto');
var btnactualizarstock = document.getElementById('btnactualizarstock');
var btnguardar = document.getElementById('btnguardar');

//variables
var tbldetalle;
var _almacenes=[];
$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: false       
    });
    fnlistarsucursal();
    fngetcorrelativos('');
    
});

window.addEventListener('keydown', function (e) {
    var tecla = e.key;
    //if (tecla === '+')
    //    fnAbrirModalProductos();
    if (tecla === 'F1') {
        e.preventDefault();
        btnguardar.click();
    }
    if (tecla === 'F2') {
        e.preventDefault();
        fnNuevo();
    }
    if (tecla === 'F3') {
        e.preventDefault();
        fnimprimir();
    }
    //if (tecla === 'F4') {
    //    e.preventDefault();
    //    fnCancelar();
    //}
});

btnactualizarstock.addEventListener('click', function () {
    $('#modalproductosstock').modal('show');
});

btnnuevo.addEventListener('click', function () {
    fnNuevo();
});

$(document).on('click', '.btnpasarproducto', function () {
    var idproducto = this.getAttribute('idproducto');
    fnbuscarproducto(idproducto);
});

$(document).on('click', '.MPS_btnseleccionarstock', function () {
    var idstock = this.getAttribute('idstock');
    fnbuscarstockproducto(idstock);
});

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

$(document).on('click', '.isfraccion', function () {
    if (this.checked) {
        var fila = this.parentNode.parentNode;
        console.log(fila);
        //var isblister = fila.getElementsByClassName('isblister')[0];
        //isblister.checked = false;
    }
});

formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    if (tbldetalle.rows().data().length === 0) {
        mensaje('W', 'No hay datos en el detalle', 'TC');
        return;
    }
    fnguardar();
});

txtidsucursal.addEventListener('change', function () {
    IDSUCURSAL = txtidsucursal.value;
    fngetcorrelativos(IDSUCURSAL)
    //fnlistaralmacensucursal();
    //fnverificarsiexistenproductosconstock();   
});

function fnbuscarstockproducto(idstock) {
    if (fnverificarsielitemestaendetalle(idstock.toString())) {
        mensaje('W', 'El item se encuentra en el detalle');
        return;
    }
    let controller = new StockController();
    controller.BuscarStock(idstock, function (data) {     
       
        var fraccion = '<input type="checkbox" class="isfraccion " disabled/>';
        //var blister = '<input type="checkbox" class="isblister" disabled/>';
      
        if (data.multiplo > 1)
            fraccion = '<input type="checkbox" class="isfraccion" />';
        //if (data.venderblister && data.multiploblister > 1)
        //    blister = '<input type="checkbox" class="isblister" />';
    
       var fila= tbldetalle.row.add([
            '<span class="index"></span>',
            data.codigoproducto,
            data.nombre,
           data.areaalmacen,
            '<input type="number" min="1" class="cantidad inputdetalle" required>',
            fraccion,
            //blister,
           data.lote ,
           data.fechavencimiento ,
           data.regsanitario,
            '<button class="btn btn-sm btn-danger btnquitaritem"><i class="fas fa-trash"><i></button>'
       ]).draw(false).node();         
        fila.setAttribute('idstock', data.idstock);

        fnagregarindex();
    });
}

function fnagregarindex() {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 1;
    filas.forEach(function (e) {
        e.getElementsByClassName('index')[0].textContent = c;
        c++;
    });
}

function fngetdetalle() {
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    var array = [];
    filas.forEach(function (e) {
        var obj = new ADetalleSalidaManual();
        obj.cantidad = e.getElementsByClassName('cantidad')[0].value;      
        obj.idstock = e.getAttribute('idstock');     
        obj.isfraccion = e.getElementsByClassName('isfraccion')[0].checked;
        //obj.isblister = e.getElementsByClassName('isblister')[0].checked;
        array.push(obj);
    });
    return array;
}

function fnNuevo() {
    swal({
        title: '¿Desea realizar un nuevo registro?',
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
            location.href = ORIGEN + '/almacen/asalida/registrar';
        } else
            swal.close();
    });
   
}
function fnguardar() {
   
   
    var obj = $('#formregistro').serializeArray();
    obj.push({ name: 'seriedoc', value: txtseriedoc.value });
    obj.push({ name: 'numdoc', value: txtnumdoc.value });

    obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fngetdetalle()) };
    console.log(obj);
    swal({
        title: '¿Desea registrar la salida?',
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
            let controller = new ASalidaManualController();
            controller.Registrar(obj, function (data) {
                btnguardar.disabled = true;
                btnimprimir.setAttribute('href', ORIGEN + "/Almacen/ASalida/Imprimir_Guia/?idsalida=" + data.objeto.idsalida);
                fnimprimir();
            });
        } else
            swal.close();
    });
}

function fnlistarsucursal() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('txtidsucursal', IDSUCURSAL, function () { });
}

function fngetcorrelativos(idsucursal) {
    let controller = new SucursalController();
    controller.ListarCorrelativos(idsucursal, function (data) {
        var serie = (data[0].serie);
        var actual = (data[0].actual);
        txtseriedoc.value = serie;
        txtnumdoc.value = actual;
    });
}

function fnverificarsielitemestaendetalle(idstock) {
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    if (tbldetalle.rows().data().length == 0)
        return false;
    var band = false;
    filas.forEach(function (e) {

        var aux = e.getAttribute('idstock');
        if (idstock == aux)
            band = true;
    });
    return band;
}


function fnimprimir() {
    var href = btnimprimir.getAttribute('href');
    ABRIR_MODALIMPRECION(href, 'SALIDA MANUAL');
}

btnimprimir.addEventListener('click', function () {
    fnimprimir();
});