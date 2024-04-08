
var txtcodigoproducto = document.getElementById("txtcodigoproducto");
var txtnombreproducto = document.getElementById("txtnombreproducto");

var tbodydetalle = document.getElementById('tbodydetalle');
var tbllista;

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        responsive: true,
        "paging": false,
        "language": LENGUAJEDATATABLE()
    });
    ListarProductosAgrupados();
});

function ListarProductosAgrupados() {
    var obj = {
        codigoproducto: txtcodigoproducto.value,
        nombreproducto: txtnombreproducto.value
    }
    let controller = new ProductoParecidoController();
    controller.ListarProductosAgrupados(obj, function (data) {
        var data = JSON.parse(data);
        if (data.length > 0) {
            var fila = "";
            for (var i = 0; i < data.length; i++) {
                fila += '<td class="details-control"></td>';
                fila += '<td>' + data[i].idproducto + '</td>';
                fila += '<td>' + data[i].codigoproducto + '</td>';
                fila += '<td>' + data[i].idtipoproducto + '</td>';
                fila += '<td>' + data[i].nombre + '</td>';
                fila += '<td><button class="btn btn-sm btn-warning btneditar" idproducto="' + data[i].idproducto + '"><i class="fas fa-pen"></i></button></td>';
                fila += '<tr id="row' + data[i].idproducto + '" class="hijo"></tr>';
            }
            tbodydetalle.innerHTML = fila;
        }
    });
}
$('#tbodydetalle').on('click', 'tr td.details-control', function () {
    var fila = this.parentNode;
    var idproducto = fila.childNodes[1].innerText;
    var filahija = document.getElementById('row' + idproducto);
    if (fila.classList.contains('details')) {
        fila.classList.remove('details');
        filahija.innerHTML = '';
    }
    else {
        fila.classList.add('details');

        $('#row' + idproducto).show();
        ListarProductosParecidos(idproducto, filahija);
    }
});
function ListarProductosParecidos(idproducto, fila) {
    var obj = {
        idproducto: idproducto
    }
    let controller = new ProductoParecidoController();
    controller.ListarProductosParecidos(obj, function (data) {
        var data = JSON.parse(data);
        if (data.length > 0) {
            var cabecera = '<td colspan="5"><table class="text-center table-hover" width="80%"><tr><th>ID</th><th>CODIGO</th><th>TIPO</th><th>PRODUCTO PARECIDO</th></tr>'
            var cuerpo = "<tbody>";
            for (var i = 0; i < data.length; i++) {
                cuerpo += '<tr class="hijo">';
                cuerpo += '<td>' + data[i].idproductoparecido + '</td>';
                cuerpo += '<td>' + data[i].codigoproducto + '</td>';
                cuerpo += '<td>' + data[i].idtipoproducto + '</td>';
                cuerpo += '<td>' + data[i].nombre + '</td>';
            }
            fila.innerHTML = cabecera + cuerpo + "</tbody></table></td>";
        }
    });
}

$(document).on('click', '.btneditar', function () {
    var fila = this.parentNode.parentNode;
    var idproducto = fila.childNodes[1].innerText;
    location.href = ORIGEN + "/Almacen/AProductoParecido/Registrar?idproducto=" + idproducto;
});