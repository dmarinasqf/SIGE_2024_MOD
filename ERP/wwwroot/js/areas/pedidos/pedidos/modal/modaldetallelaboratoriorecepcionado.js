
var MDDLRDetalle = document.getElementById('MDDLRDetalle');
var MDLRnombrecodigoproducto = document.getElementById('MDLRnombrecodigoproducto');
var MDLRlaboratorioorigen = document.getElementById('MDLRlaboratorioorigen');
var MDLRestadoproceso = document.getElementById('MDLRestadoproceso');

var MBPEDRbtnbuscarpedido = document.getElementById('MBPEDRbtnbuscarpedido');

function MDDLRListar(idlaboratorio) {
    var obj = {
        idlaboratorio: idlaboratorio,
        idlaboratorioOrigen: MDLRlaboratorioorigen.value,
        nombrecodigoproducto: MDLRnombrecodigoproducto.value,
        estadoproceso: MDDLRDetalle.value,
    };
    let controller = new LaboratorioPedidoController();
    controller.ListarDetallePorLaboratorioRecepcionado(obj, (data) => {
        var fila = '';
        if (data.length > 0)
            for (var i = 0; i < data.length; i++) {
                var estadoProceso = "";
                var colorbuttonEstado = MDLRObtenerClassColorBotonPorEstadoProceso(data[i].estadoProceso);
                var buttonEstado = "<td><button class='btn btn-block btn-sm " + colorbuttonEstado + " MDDLRbtnAvanzarEstadoProceso' iddetalle='" + data[i].detp_codigo + "'>" + data[i].estadoProceso + "</button></td>";
                estadoProceso = buttonEstado;

                fila += '<tr id= ' + data[i].detp_codigo + '>' +
                    "<td>" + data[i].detp_codigo + "</td>" +
                    "<td>" + data[i].pedido_codigo + "</td>" +
                    "<td>" + data[i].tipoitem + "</td>" +
                    "<td>" + data[i].codigoprecio + "</td>" +
                    "<td>" + data[i].producto + "</td>" +
                    "<td>" + data[i].cantidad + "</td>" +
                    "<td>" + data[i].laboratorioOrigen + "</td>" +
                    estadoProceso +
                    "</tr > ";
            }
        MDDLRDetalle.innerHTML = fila;
    });
}

$(document).on('click', '.MDDLRbtnAvanzarEstadoProceso', function () {
    var iddetalle = this.attributes[1].value;
    var thisInterno = this;
    let controller = new LaboratorioPedidoController();
    var obj = {
        iddetalle: iddetalle
    };
    controller.CambiarEstadoProcesoDetalle(obj, function (data) {
        var classBtn = MDLRObtenerClassColorBotonPorEstadoProceso(data.objeto.estadoproceso);
        thisInterno.innerText = data.objeto.estadoproceso;
        var BtnClassCompleto = "btn btn-block btn-sm " + classBtn + " MDDLRbtnAvanzarEstadoProceso";
        thisInterno.setAttribute("class", BtnClassCompleto);
        mensaje('S', 'Estado cambiado.');
    });
});

function MDLRObtenerClassColorBotonPorEstadoProceso(estadoProceso) {
    var colorbuttonEstado = "";
    if (estadoProceso == "EN CAMINO")
        colorbuttonEstado = "btn-secondary";
    else if (estadoProceso == "RECEPCIONADO")
        colorbuttonEstado = "btn-success disabled";
    return colorbuttonEstado;
}

MBPEDRbtnbuscarpedido.addEventListener("click", function () {
    MDDLRListar(txtlaboratorio.value);
});