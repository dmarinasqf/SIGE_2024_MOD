var cmbsucursal = document.getElementById('cmbsucursal');
var cmbalmacen = document.getElementById('cmbalmacen');
var txtcantidad = document.getElementById('txtcantidad');
var txttipo = document.getElementById('txttipo');
var txtstockactual = document.getElementById('txtstockactual');

var cmbformula = document.getElementById('cmbformula');
var cmblaboratorio = document.getElementById('cmblaboratorio');

var btnguardartodo = document.getElementById('btnguardartodo');
var btncargarxformula = document.getElementById('btncargarxformula');
var btncargarstockxlaboratorio = document.getElementById('btncargarstockxlaboratorio');

$(document).ready(function () {

    init();

});
function init() {
    let sucucontroller = new SucursalController();
    sucucontroller.ListarTodasSucursales('cmbsucursal');
    let procontroller = new ProductoController();
    var fn = procontroller.BuscarProductosSelect2('FM');
    $('#cmbformula').select2({
        allowClear: true,
        ajax: fn,
        width: '100%'
    }).on("change", function (e) {
        fnonchangecmbproducto();
    });
    let labcontroller = new LaboratorioController();
    var fn = labcontroller.BuscarLaboratoriosSelect2();
    $('#cmblaboratorio').select2({
        allowClear: true,
        ajax: fn,
        width: '100%'
    });
}


cmbsucursal.addEventListener('change', function () {
    let almacencontroller = new AlmacenSucursalController();
    almacencontroller.ListarAlmacenxSucursal('cmbalmacen', cmbsucursal.value);
});


btnguardartodo.addEventListener('click', function () {
    txttipo.value = 'todo';
    if (!(txtcantidad.value > 0)) {
        mensaje('I', 'Ingrese cantidad');
        return;
    }
    if ((cmbalmacen.value == '')) {
        mensaje('I', 'Seleccione almacen');
        return;
    }
    swal({
        title: '¿DESEA CARGAR STOCK?',
        text: "No se podrá revertir la acción",
        type: 'warning',
        icon: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No [Esc]',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si [Enter]',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            $('#modalvalidarusuario').modal('show');
        }
        else
            swal.close();
    });
});
btncargarxformula.addEventListener('click', function () {
    txttipo.value = 'xfm';
    if (!(txtcantidad.value > 0)) {
        mensaje('I', 'Ingrese cantidad');
        return;
    }
    if ((cmbalmacen.value == '')) {
        mensaje('I', 'Seleccione almacen');
        return;
    }
    if (cmbformula.value == '') {
        mensaje('I', 'Seleccione formula');
        return;
    }
    swal({
        title: '¿DESEA CARGAR STOCK DE LA FORMULA SELECCIONADA?',
        text: "No se podrá revertir la acción",
        type: 'warning',
        icon: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No [Esc]',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si [Enter]',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            $('#modalvalidarusuario').modal('show');
        }
        else
            swal.close();
    });
});
btncargarstockxlaboratorio.addEventListener('click', function () {
    txttipo.value = 'xlaboratorio';
    if (!(txtcantidad.value > 0)) {
        mensaje('I', 'Ingrese cantidad');
        return;
    }
    if ((cmbalmacen.value == '')) {
        mensaje('I', 'Seleccione almacen');
        return;
    }
    if (cmblaboratorio.value == '') {
        mensaje('I', 'Seleccione laboratorio');
        return;
    }
    swal({
        title: '¿DESEA CARGAR STOCK POR LABORATORIO?',
        text: "No se podrá revertir la acción",
        type: 'warning',
        icon: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No [Esc]',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si [Enter]',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            $('#modalvalidarusuario').modal('show');
        }
        else
            swal.close();
    });
});
MVUbtnaceptar.addEventListener('click', function () {
    MVUfnvalidarcredenciales(fncargarstock);
});
cmbformula.addEventListener('change', function () {
    

});

    

function fncargarstock(empleado) {
    var idtabla = '';
    if (txttipo.value == 'tipo')
        idtabla = '';
    else if (txttipo.value == 'xfm')
        idtabla = cmbformula.value;
    else if (txttipo.value == 'xlaboratorio')
        idtabla = cmblaboratorio.value;
    var obj = {
        idalmacen: cmbalmacen.value,
        cantidad: txtcantidad.value,
        idusuario: empleado.idempleado,
        tipo: txttipo.value,
        idtabla: idtabla
    };
    MVUbtnaceptar.disabled = true;
    let controller = new StockController();
    controller.CargarStock(obj, function () {
        mensaje('S', 'Operación completada')
        $('#modalvalidarusuario').modal('hide');
        MVUbtnaceptar.disabled = false;
        fnlimpiar();
        
    });
}
function fnlimpiar() {
    cmblaboratorio.value = '';
    cmbformula.value = '';
    cmbformula.innerText = '';
    cmblaboratorio.innerText = '';
    txtcantidad.value = '';
    txtstockactual.value = '';
}
function fnonchangecmbproducto() {
   
    if (cmbformula.value == '')
        txtstockactual.value = '';
    else {
        var obj = '';
        if (cmbalmacen.value != '') {
            obj = {
                idproducto: cmbformula.value,
                idalmacen: cmbalmacen.value,
                idsucursal: 0
            }
        } else if (cmbsucursal != '') {
            obj = {
                idproducto: cmbformula.value,
                idalmacen: 0,
                idsucursal: cmbsucursal.value
            }
        }
        let controller = new StockController();        
        if (obj != '')
            controller.GetStockProducto(obj, (data) => {
                txtstockactual.value = data[0].stock;
            });
    }
}