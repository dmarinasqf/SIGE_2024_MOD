var lblnumformulas = document.getElementById('lblnumformulas');
var lblnumpedidos = document.getElementById('lblnumpedidos');
var lblnumdevueltoslab = document.getElementById('lblnumdevueltoslab');
var lblnumdevueltos = document.getElementById('lblnumdevueltos');
var lblnumentregados = document.getElementById('lblnumentregados');
var lblnumterminados = document.getElementById('lblnumterminados');
var lblnumenproceso = document.getElementById('lblnumenproceso');
var lblnumpendientes = document.getElementById('lblnumpendientes');
function CEfnagregardatosetiqueta(data) {
    var etiquetas = data.etiquetas;

    var total = 0;
    lblnumpendientes.innerText = 0;
    lblnumenproceso.innerText = 0;
    lblnumentregados.innerText = 0;
    lblnumterminados.innerText = 0;
    lblnumdevueltos.innerText = 0;
    lblnumdevueltoslab.innerText = 0;
    lblnumpedidos.innerText = 0;
    lblnumformulas.innerText = 0;
    var numformulas;
    for (var i = 0; i < etiquetas.length; i++) {
         numformulas = etiquetas[i].numformulas;
        if (etiquetas[i].estadopedido == 'PENDIENTE') { lblnumpendientes.innerText = etiquetas[i].num; total += etiquetas[i].num; }
        if (etiquetas[i].estadopedido == "EN PROCESO") { lblnumenproceso.innerText = etiquetas[i].num; total += etiquetas[i].num; }
        if (etiquetas[i].estadopedido == "TERMINADO") { lblnumterminados.innerText = etiquetas[i].num; total += etiquetas[i].num; }
        if (etiquetas[i].estadopedido == "ENTREGADO") { lblnumentregados.innerText = etiquetas[i].num; }
        if (etiquetas[i].estadopedido == "DEVUELTO") { lblnumdevueltos.innerText = etiquetas[i].num; total += etiquetas[i].num; }
        if (etiquetas[i].estadopedido == "DESCARGADO") {
            lblnumdevueltoslab.innerText = etiquetas[i].num; total += etiquetas[i].num;
        }

    }
    lblnumpedidos.innerText = total;
    lblnumformulas.innerText = numformulas??0;
}