
var MDDLADetalle = document.getElementById('MDDLADetalle');
var MDLAnombrecodigoproducto = document.getElementById('MDLAnombrecodigoproducto');
var MDLAlaboratorioorigen = document.getElementById('MDLAlaboratorioorigen');
var MDLAestadoproceso = document.getElementById('MDLAestadoproceso');

var MBPEDbtnbuscarpedido = document.getElementById('MBPEDbtnbuscarpedido');

function MDDLAListar(idlaboratorio) {
    var obj = {
        idlaboratorio: idlaboratorio,
        idlaboratorioOrigen: MDLAlaboratorioorigen.value,
        nombrecodigoproducto: MDLAnombrecodigoproducto.value,
        estadoproceso: MDLAestadoproceso.value,
    };
    let controller = new LaboratorioPedidoController();
    controller.ListarDetallePorLaboratorioAsignado(obj, (data) => {
        var fila = '';
        if (data.length > 0)
            for (var i = 0; i < data.length; i++) {
                var estadoProceso = "";
                var colorbuttonEstado = MDLAObtenerClassColorBotonPorEstadoProceso(data[i].estadoProceso);
                var buttonEstado = "<td><button class='btn btn-block btn-sm " + colorbuttonEstado + " MDDLAbtnAvanzarEstadoProceso' iddetalle='" + data[i].detp_codigo + "'>" + data[i].estadoProceso + "</button></td>";
                estadoProceso = buttonEstado;

                if (data[i].estadoProceso == "RECEPCIONADO")
                    estadoProceso = "<td class='bg-success p-1'>" + data[i].estadoProceso + "</td>";

                
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
        MDDLADetalle.innerHTML = fila;
    });
}

$(document).on('click', '.MDDLAbtnAvanzarEstadoProceso', function () {
    var iddetalle = this.attributes[1].value;
    var thisInterno = this;
    let controller = new LaboratorioPedidoController();
    var obj = {
        iddetalle: iddetalle
    };
    controller.CambiarEstadoProcesoDetalle(obj, function (data) {
        var classBtn = MDLAObtenerClassColorBotonPorEstadoProceso(data.objeto);
        thisInterno.innerText = data.objeto;
        var BtnClassCompleto = "btn btn-block btn-sm " + classBtn + " MDDLAbtnAvanzarEstadoProceso";
        thisInterno.setAttribute("class", BtnClassCompleto);
        mensaje('S', 'Estado cambiado.');
    });
});

function MDLAObtenerClassColorBotonPorEstadoProceso(estadoProceso) {
    var colorbuttonEstado = "";
    if (estadoProceso == "TRANSFERIDO")
        colorbuttonEstado = "btn-primary";
    else if (estadoProceso == "EN CURSO")
        colorbuttonEstado = "btn-warning";
    else if (estadoProceso == "TERMINADO")
        colorbuttonEstado = "btn-dark";
    else if (estadoProceso == "EN CAMINO")
        colorbuttonEstado = "btn-secondary disabled";
    else if (estadoProceso == "RECEPCIONADO")
        colorbuttonEstado = "btn-success disabled";
    return colorbuttonEstado;
}

MBPEDbtnbuscarpedido.addEventListener("click", function () {
    MDDLAListar(txtlaboratorio.value);
});