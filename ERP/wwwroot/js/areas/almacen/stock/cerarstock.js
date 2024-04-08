var cmblaboratorio = document.getElementById('cmblaboratorio');
var cmbtipoproducto = document.getElementById('cmbtipoproducto');
var radtodo = document.getElementById('radtodo');
var radlaboratorio = document.getElementById('radlaboratorio');
var btnguardar = document.getElementById('btnguardar');


$(document).ready(function () {
    radtodo.checked = true;
    init();
});
function init() {
    let sucucontroller = new SucursalController();
    sucucontroller.ListarTodasSucursales('cmbsucursales', null, function () {
        var demo1 = $('#cmbsucursales').bootstrapDualListbox({
            nonSelectedListLabel: 'Non-selected',
            selectedListLabel: 'Selected',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: true,
        });
        var container1 = demo1.bootstrapDualListbox('getContainer');
        container1.find('.btn').removeClass('btn-default').addClass('btn-xs btn-outline-info btn-h-outline-info btn-bold m-0')
            .find('.glyphicon-arrow-right').attr('class', 'fa fa-arrow-right').end()
            .find('.glyphicon-arrow-left').attr('class', 'fa fa-arrow-left')
    });
    let labcontroller = new LaboratorioController();
    var fn = labcontroller.BuscarLaboratoriosSelect2();
    $('#cmblaboratorio').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Seleccione laboratorios",
    });
    let tipoprodcontroller = new ProductoController();
    tipoprodcontroller.ListarTipoProducto('cmbtipoproducto');
}
function fngetsucursales() {
    var options = $('select[name="cmbsucursales[]_helper2"]').find('option');
    var sucursales = '';
    for (var i = 0; i < options.length; i++) {
        if (options[i].value != '') {
            if (options.length - 1 != i)
                sucursales += options[i].value + '|';
            else
                sucursales += options[i].value;
        }
    }
    return sucursales;
}

radlaboratorio.addEventListener('click', function () {
    cmblaboratorio.disabled = false;
});
radtodo.addEventListener('click', function () {
    cmblaboratorio.disabled = true;
});


btnguardar.addEventListener('click', function () {
    var sucursal = fngetsucursales();
    var laboratorios = $('#cmblaboratorio').val(); 
     
    if (sucursal == '') {
        mensaje('I', 'Seleccione sucursal');
        return;
    }
    if (radlaboratorio.checked) {
        if (laboratorios.length == 0) {
            mensaje('I', 'Seleccione laboratorios');
            return;
        }
    }
    swal({
        title: '¿DESEA CERAR EL STOCK?',
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
 
    MVUfnvalidarcredenciales(fncerarstock);
});
function fncerarstock(empleado) {
    var tipo = 'todo'; 
    if (radlaboratorio.checked)
        tipo = 'laboratorio';
    if (cmbtipoproducto.value == '') {
        mensaje('I', 'Seleccione tipo producto');
        return;
    }
    var obj = {
        laboratorios: $('#cmblaboratorio').val(),
        sucursales: fngetsucursales(),
        tipo: tipo,
        tipoproducto: cmbtipoproducto.value,
        idusuario: empleado.idempleado
    };
    MVUbtnaceptar.disabled = true;
    let controller = new StockController();
    controller.CerarStock(obj, function () {
        mensaje('S', 'Operación completada')
        $('#modalvalidarusuario').modal('hide');
        MVUbtnaceptar.disabled = false;
    });
}