var MDDIPlblnumpedido = document.getElementById('MDDIPlblnumpedido');
var MDDIPtbodydetalle = document.getElementById('MDDIPtbodydetalle');

var _dificultadformula = [];

$(document).ready(() => {
    let controller = new LaboratorioPedidoController();
    controller.ListarDificultad('HABILITADO', (data) => { _dificultadformula = data });
});

function MDDIPfnbuscardetalle(idpedido) {
    MDDIPlblnumpedido.innerText = idpedido;
    let controller = new PedidoController();
    controller.BuscarDetallePedido(idpedido, (data) => {       
        var fila = '';
        if (data.length > 0)

            for (var i = 0; i < data.length; i++) {
                if (data[i].tipoitem == 'FM') {
                    var checkboxTerminado = "";
                    if (data[i].laboratorioCabecera == data[i].idlaboratorio) {
                        var checked = "";
                        if (data[i].estadoProcesoDetalle == "TERMINADO") checked = "checked";
                        checkboxTerminado = "<label'><input type='checkbox' class='MDDIPCheckTerminado' " + checked + ">TERMINADO</label>";
                    }
                    fila += '<tr id= ' + data[i].iddetalle + '>' +
                        "<td>" + MDDIPfnagregardificultad(data[i].iddificultad) + "</td>" +
                        "<td>" + (data[i].codigoproducto ?? data[i].codprecioanterior) + "</td>" +
                        "<td>" + data[i].formula + "</td>" +
                        '<td class="text-right">' + data[i].cantidad + '</td>' +
                        "<td>" + MDAsignarLaboratorio(data[i].idlaboratorio) + "</td>" +
                        "<td>" + checkboxTerminado + "</td>" +
                        "</tr > ";
                }
            }


        MDDIPtbodydetalle.innerHTML = fila;
    });
}
function MDDIPfnagregardificultad(iddificultad) {
    var select = '<option value="" >[SELCCIONE]</option>';
    for (var i = 0; i < _dificultadformula.length; i++) {
        if (iddificultad == _dificultadformula[i].iddificultad)
            select += '<option value="' + _dificultadformula[i].iddificultad + '" selected>' + _dificultadformula[i].descripcion + '</option>';
        else
            select += '<option value="' + _dificultadformula[i].iddificultad + '">' + _dificultadformula[i].descripcion + '</option>';

    }
    return '<select class="MDDIPcmbdificultad">' + select + '</select>';
}
function MDAsignarLaboratorio(idlaboratorio) {
    var select = '<option value="" >[SELCCIONE]</option>';
    for (var i = 0; i < listaLaboratorio.length; i++) {
        if (idlaboratorio == listaLaboratorio[i].idsucursal)
            select += '<option value="' + listaLaboratorio[i].idsucursal + '" selected>' + listaLaboratorio[i].sucursal + '</option>';
        else
            select += '<option value="' + listaLaboratorio[i].idsucursal + '">' + listaLaboratorio[i].sucursal + '</option>';

    }
    return '<select class="MDcmbAsignarLaboratorio">' + select + '</select>';
}

$(document).on('change', '.MDDIPcmbdificultad', function () {
    if (this.value != '') {
        var fila = this.parentNode.parentNode;
        let controller = new LaboratorioPedidoController();
        var obj = {
            iddetalle: fila.getAttribute('id'),
            iddificultad:this.value
        };
        controller.CambiarDificultadItem(obj, () => { mensaje('S','Dificultad cambiada')});
    }
});
$(document).on('change', '.MDcmbAsignarLaboratorio', function () {
    if (this.value != '') {
        var fila = this.parentNode.parentNode;
        let controller = new LaboratorioPedidoController();
        var obj = {
            iddetalle: fila.getAttribute('id'),
            idlaboratorio: this.value
        };
        controller.CambiarLaboratorioAsignado(obj, () => { mensaje('S', 'Laboratorio cambiado.') });
    }
});
$(document).on('change', '.MDDIPCheckTerminado', function () {
    var fila = this.parentNode.parentNode.parentNode;
    let controller = new LaboratorioPedidoController();
    var obj = {
        iddetalle: fila.getAttribute('id'),
        estadoTerminado: this.checked
    };
    controller.CambiarEstadoDetalleTerminado(obj, () => { mensaje('S', 'Producto Terminado.') });
});