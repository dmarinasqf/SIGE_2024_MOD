var MLCtbodylista = document.getElementById('MLCtbodylista');
var MLCtxtfiltro = document.getElementById('MLCtxtfiltro');
var MLCtxtidcliente = document.getElementById('MLCtxtidcliente');


MLCtxtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MLCfnbuscarproductos();
});

function MLCfnbuscarproductos(numpagina, tamanopagina) {
    $('#modallistacliente').modal('show');
    var controller = new ListaPreciosClienteController();
    var obj = {
        filtro: MLCtxtfiltro.value,
        cliente: MLCtxtidcliente.value,
        pagine: {
            numpagina: numpagina??1,
            tamanopagina: tamanopagina??20,
        }
    };
    controller.BuscarProductosLista(obj, function (response) {
        var fila = '';
        var datos = response.data;
        for (var i = 0; i < datos.length; i++) {            
            datos[i].incentivo = datos[i].incentivo ?? '';
            fila += '<tr idproducto=' + datos[i].idproducto + ' idlistaprecio=' + datos[i].idprecioproducto + '>';
            fila += '<td><div class="btn-group btn-group-sm"><button class="btn-success MLCbtnseleccionar"><i class="fas fa-check"></i></button></div></td>';
            fila += '<td class="info codigoproducto">' + datos[i].codigoproducto + '</td>';
            fila += '<td class="info producto">' + datos[i].producto.replace('.','. ') + '</td>';
            fila += '<td class="info tipoproducto">' + datos[i].tipoproducto + '</td>';
            fila += '<td class="info descripcion">' + datos[i].descripcion + '</td>';
            fila += '<td class="info formulacion">' + datos[i].formulacion+ '</td>';
            fila += '<td class="info presentacion">' + datos[i].presentacion + '</td>';
            fila += '<td class="info etiqueta">' + datos[i].etiqueta + '</td>';
            fila += '<td class="info text-right precio">' + datos[i].precio.toFixed(2) + '</td>';
            fila += '<td class="info observacion">' + datos[i].observacion + '</td>';

            fila += '</tr>';
        }
        MLCtbodylista.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'MLClinkpage', 'MLCpaginacion');
    });

}
$(document).on('click', '.MLClinkpage', function () {
    var numpagina = this.getAttribute('numpagina');
    MLCfnbuscarproductos(numpagina, 20);
    var pages = document.getElementsByClassName('MLClinkpage');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
$('#MLCtbodylista').on('click', 'tr', function () {

    var filas = document.querySelectorAll('#MLCtbodylista tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    $(this).addClass('selected');
});