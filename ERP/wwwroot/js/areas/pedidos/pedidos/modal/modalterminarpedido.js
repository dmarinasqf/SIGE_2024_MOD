var MTPlblnumpedido = document.getElementById('MTPlblnumpedido');
var MTPcmbformulador = document.getElementById('MTPcmbformulador');
var MTPbtnterminarpedido = document.getElementById('MTPbtnterminarpedido');
var _formulador = [];

$(document).ready(() => {
    let controller = new SucursalController();
    controller.ListarEmpleadosSucursal(null, (data) => { _formulador = data });
    /*controller.ListarEmpleadosSucursal(null, function (data) {    
        var option = '<option value="">[SELECCIONE]</option>';
        for (var i = 0; i < data.length; i++)
            option += '<option value="' + data[i].idempleado + '">' + data[i].usuario + '-' + data[i].nombres + ' ' + data[i].appaterno + ' ' + data[i].apmaterno + '</option>';

        MTPcmbformulador.innerHTML = option;
    });*/
});

function MDDIPfnbuscardetalleformula(idpedido) {
    MDDIPlblnumpedido.innerText = idpedido;
    let controller = new PedidoController();
    controller.BuscarDetallePedido(idpedido, (data) => {
        var fila = '';
        if (data.length > 0)

            for (var i = 0; i < data.length; i++) {
                if (data[i].tipoitem == 'FM')
                    fila += '<tr id= ' + data[i].iddetalle + '>' +
                        "<td>" + data[i].formula + "</td>" +
                        "<td>" + MDDIPfnagregarformulador(data[i].idformulador) + "</td>" +
                        "</tr > ";
            }


        MDDIPtbodyformulador.innerHTML = fila;
    });
}

function MDDIPfnagregarformulador(idformulador) {
    var select = '<option value="" >[SELCCIONE]</option>';
    for (var i = 0; i < _formulador.length; i++) {
        if (idformulador == _formulador[i].idempleado)
            select += '<option value="' + _formulador[i].idempleado + '" selected>' + _formulador[i].usuario + '-' + _formulador[i].nombres + ' ' + _formulador[i].appaterno + ' ' + _formulador[i].apmaterno + '</option>';
        else
            select += '<option value="' + _formulador[i].idempleado + '">' + _formulador[i].usuario + '-' + _formulador[i].nombres + ' ' + _formulador[i].appaterno + ' ' + _formulador[i].apmaterno + '</option>';

    }
    return '<select class="MDDIPcmbformulador">' + select + '</select>';
}

$(document).on('change', '.MDDIPcmbformulador', function () {
    if (this.value != '') {
        var fila = this.parentNode.parentNode;
        let controller = new LaboratorioPedidoController();
        var obj = {
            iddetalle: fila.getAttribute('id'),
            idformulador: this.value
        };
        controller.CambiarFormuladorxItem(obj, () => { mensaje('S', 'FORMULADOR ASIGNADO') });
    }
});

MTPbtnterminarpedido.addEventListener('click', function () {
    var obj = {
        idpedido: MTPlblnumpedido.innerText,
        idformulador: 0
    };
    let controller = new LaboratorioPedidoController();
    controller.TerminarPedido(obj, () => {
        mensaje('S', 'Pedido terminado');
        var fila = tbodydetalle.getElementsByClassName('selected')[0];
        fila.getElementsByClassName('ultimafila')[0].innerHTML = '';
        fila.getElementsByClassName('estado')[0].innerHTML = '<span class="badge badge-dark" style="font-size:9px"><i class="fas fa-check"></i> TERMINADO</span>';
        fila.getElementsByClassName('txtnumeroboleta')[0].setAttribute('contenteditable', false);
        fila.getElementsByClassName('txtordenproduccion')[0].setAttribute('contenteditable', false);

    });
});