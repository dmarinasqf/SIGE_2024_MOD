
var btnnuevo = document.getElementById("btnnuevo");

var tbldetalle;
$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: false
    });

    
    //console.log(MPS_cmbtipoproducto.value);
    //fnlistarsucursal();
    //fngetcorrelativos('');

});

btnactualizarstock.addEventListener('click', function () {
    MPS_cmbtipoproducto[0].value = "EC";
    //MPS_cmbtipoproducto[0].setAttribute("disabled","true");
    for (var i = 0; i < MPS_cmbtipoproducto[0].options.length; i++) {
        if (MPS_cmbtipoproducto[0].options[i].value == "EC" || MPS_cmbtipoproducto[0].options[i].value == "IS") {
            var a = "";
        } else {
            MPS_cmbtipoproducto[0].options[i].setAttribute("hidden", "true");
        }
    }
    $('#modalproductosstock').modal('show');
});


$(document).on('click', '.MPS_btnseleccionarstock', function () {
    var idstock = this.getAttribute('idstock');
    fnbuscarstockproducto(idstock);
});
function fnbuscarstockproducto(idstock) {
    if (fnverificarsielitemestaendetalle(idstock.toString())) {
        mensaje('W', 'El item se encuentra en el detalle');
        return;
    }
    let controller = new StockController();
    controller.BuscarStock(idstock, function (data) {
        var fila = tbldetalle.row.add([
            '<span class="index"></span>',
            data.codigoproducto,
            data.nombre,
            data.areaalmacen,
            '<input type="number" min="1" class="cantidad inputdetalle" required>',
            '<button class="btn btn-sm btn-danger btnquitaritem"><i class="fas fa-trash"><i></button>'
        ]).draw(false).node();
        fila.setAttribute('idstock', data.idstock);
        fila.setAttribute("idproducto", data.idproducto);
        fila.setAttribute("candisponible", data.candisponible);

        fnagregarindex();
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
$('#tbldetalle tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetalle.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.btnquitaritem', function () {
    tbldetalle.row('.selected').remove().draw(false);
    fnagregarindex();
});
function fnagregarindex() {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 1;
    filas.forEach(function (e) {
        e.getElementsByClassName('index')[0].textContent = c;
        c++;
    });
}

formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    let bvalidar = true;
    if (tbldetalle.rows().data().length === 0) {
        mensaje('W', 'No hay datos en el detalle', 'TC');
        bvalidar = false;
    } else {
        var filas = document.querySelectorAll('#tbldetalle tbody tr');
        filas.forEach(function (e) {
            let canDisponible = e.getAttribute('candisponible');
            let cantidad = e.getElementsByClassName('cantidad')[0].value;
            if (cantidad > parseInt(canDisponible)) {
                mensaje('W', 'La cantidad supera la cantidad disponible.');
                bvalidar = false;
                return;
            }
        });
    }
    if (bvalidar) {
        fnguardar();
    }
});
function fnguardar() {
    var obj = $('#formregistro').serializeArray();
    //obj.push({ name: 'seriedoc', value: txtseriedoc.value });
    //obj.push({ name: 'numdoc', value: txtnumdoc.value });

    obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fngetdetalle()) };
    //console.log(obj);
    swal({
        title: '¿Desea registrar el Consumo Economato?',
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
            let controller = new AConsumoEconomatoController();
            controller.Registrar(obj, function (data) {
                btnguardar.disabled = true;
                //location.href = ORIGEN + "/Almacen/AConsumoEconomato/Index";
                //btnimprimir.setAttribute('href', ORIGEN + "/Almacen/ASalida/Imprimir_Guia/?idsalida=" + data.objeto.idsalida);
                //fnimprimir();
            });
        } else
            swal.close();
    });
}
function fngetdetalle() {
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    var array = [];
    filas.forEach(function (e) {
        let obj = new AConsumoEconomatoDetalle();
        obj.cantidad = e.getElementsByClassName('cantidad')[0].value;
        obj.idproducto = e.getAttribute('idproducto');
        obj.idstock = e.getAttribute('idstock');
        //obj.isfraccion = e.getElementsByClassName('isfraccion')[0].checked;
        //obj.isblister = e.getElementsByClassName('isblister')[0].checked;
        array.push(obj);
    });
    return array;
}

$(document).on('keyup', '.cantidad', function (e) {
    var cantidad = $(this).parents("tr").find('.cantidad').val();
    var cantidadDisponible = $(this).parents("tr")[0].getAttribute("candisponible");
    if (cantidad > parseInt(cantidadDisponible)) {
        mensaje('W', 'Cantidad disponible: ' + cantidadDisponible);
    }
});

btnnuevo.addEventListener('click', function () {
    location.href = ORIGEN + '/Almacen/AConsumoEconomato/Registrar';
});