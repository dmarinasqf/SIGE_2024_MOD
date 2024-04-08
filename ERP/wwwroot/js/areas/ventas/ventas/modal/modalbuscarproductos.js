
var MBP_lblnombretablagenerico = $('#MBP_lblnombretablagenerico');

var MBP_txtprecioproducto = $('#MBP_precioproducto');
var MBP_txtmultiploproducto = $('#MBP_multiploproducto');
var MBP_lblcodigoproducto = $('#MBP_lblcodigoproducto');

var MBP_txtbuscarproducto = $('#MBP_txtbuscarproducto');
var MBP_cmblistaprecios = document.getElementById('MBP_cmblistaprecios');
var MBP_tbodytblgenericos = document.getElementById('MBP_tbodytblgenericos');
var MBPtbodyproductos = document.getElementById('MBPtbodyproductos');
var sieselprimeroabrimodal = true;
var MBP_tblgenericos;

var MBP_tblproductos;

$(document).ready(function (e) {
    //BP_iniciarTablaProductos();
    //MBP_tblproductos = $('#MBP_tblproductos').DataTable({
    //    "searching": false,
    //    lengthChange: false,
    //    "ordering": false,
    //    paging: false,
    //    info: false,
    //});
    //MBP_tblgenericos = $('#MBP_tblgenericos').DataTable({
    //    "searching": false,
    //    lengthChange: false,
    //    "ordering": false,
    //    paging: false,
    //    info: false
    //});
  
    MBP_fnlistassucursal();
});


MBP_txtbuscarproducto.keyup(function (e) {
    if (e.key == 'Enter')
        fnMBPBuscarProducto();

});
function fnMBPBuscarProducto(numpagina, tamanopagina) {
    var controller = new ListaPreciosController();
  
    var obj = {
        producto: MBP_txtbuscarproducto.val().trim().toUpperCase(),
        lista: MBP_cmblistaprecios.value,
        pagine: {
            numpagina: numpagina??1,
            tamanopagina: tamanopagina??30,
        }
    };
    controller.BuscarProductosListaConIncentivo(obj, fnMBPAgregarProductosTabla);
}
function fnMBPAgregarProductosTabla(response) {
    var datos = response.data;
    var fila = '';
   
    for (var i = 0; i < datos.length; i++) {    
        fila += '<tr idproducto="' + datos[i].idproducto +'" tabindex="'+i+'">';
        fila += '<td class="info codigo"> ' + datos[i].codigoproducto+'</td>';
        fila += '<td class="producto info"> ' + datos[i].nombre+'</td>';
        fila += '<td class="font-10 info"> ' + datos[i].laboratorio+'</td>';
        
        fila += '<td class="info"> ' + datos[i].presentacion + '</td>';
        fila += '<td class="info text-right"> ' + (datos[i].incentivo ?? '') + '</td>';
        fila += '<td class="info text-right"> ' + (datos[i].stock ?? 0) + '</td>';
        fila += '<td class="info text-right"> ' + (datos[i].precio??0).toFixed(2)+'</td>';
        fila += '<td class="info text-right"> ' + (datos[i].precioxfraccion ?? 0).toFixed(2)+'</td>';
        fila += '<td class=""> <button type = "button" class="btnstockotrassucursales btn btn-sm btn-dark" data-toggle="tooltip" title = "Stock de sucursales" > <i class="fas fa-warehouse"></i></button ></td>';
        fila+='</tr>';
          
    }    
    MBPtbodyproductos.innerHTML = fila;
    var pagine = new UtilsSisqf();
    pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'MBPlinkpaginacion', 'MBPpaginacionproducto');
}
$(document).on('click', '.MBPlinkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    fnMBPBuscarProducto(numpagina, 30);
    var pages = document.getElementsByClassName('MBPlinkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
}); 
function fnMBPBuscarStockYGenericosALCambiar(fila, idproducto) { 
    var producto = fila.getElementsByClassName('producto')[0].innerText;
    MBP_lblcodigoproducto.text(fila.getElementsByClassName('codigo')[0].innerText);
    MBP_lblnombretablagenerico.text(producto);

    MBP_lblnombreproductotablastock.text(producto);
    MBP_buscargenericoproductos(idproducto, producto);
    MBP_buscarstock(idproducto);
}
$('#MBP_tblstock tbody').on('click', 'tr', function (e) {

    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        MBP_tblstock.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

$('#MBP_tblproductos tbody').on('click', 'tr td.info', function (e) {
   
    var filas = document.querySelectorAll('#MBP_tblproductos tr');   
    filas.forEach(function (e) {
        e.classList.remove('selected');      
    });

    var fila = $(this).parent('tr')[0];
    fila.classList.add('selected');
    fnMBPBuscarStockYGenericosALCambiar(fila, fila.getAttribute('idproducto'));
});
//$('#MBP_tblproductos tbody').on('keydown', 'tr', function (e) {
//    if (e.key === 'Enter') {
//        $(this).addClass('selected');
//        var columna = MBP_tblproductos.row($(this)).data();
//        fnMBPBuscarStockYGenericosALCambiar(columna, this.getAttribute('idproducto'));
//    }

//});
$('#MBP_tbodytblgenericos').on('click', 'tr', function (e) {

    REMOVER_SELECT_TABLE(document.querySelectorAll('#MBP_tbodytblgenericos .selected'));
    this.classList.add('selected');
    var fila = this;
    console.log(fila);
    var producto = fila.getElementsByClassName('generico')[0].innerText;
    var codproducto = fila.getElementsByClassName('codgenerico')[0].innerText;
    MBP_lblnombreproductotablastock.text(producto);
    MBP_lblcodigoproducto.text(codproducto);
    MBP_buscarstock(this.getAttribute('idproducto'));
});
MBP_cmblistaprecios.addEventListener('change', function () {
    fnMBPBuscarProducto();
});
$(document).on('click', '.btnstockotrassucursales', function (e) {
    
    var fila = this.parentNode.parentNode;
    
    fila.classList.add('selected');
    lblMSSnombrescliente.innerText = fila.getElementsByClassName('producto')[0].innerText;
    txtMCCidproducto.value = fila.getAttribute('idproducto');
    
    $('#modalstocksucursales').modal('show');
});
function MBP_buscargenericoproductos(id, nombre) {
    //MBP_lblnombretablagenerico.text(nombre);
    //MBP_lblnombreproductotablastock.text(nombre);

    //let controller = new StockController();
    //var obj = {
    //    idproducto: id,
    //    idlista: MBP_cmblistaprecios.value
    //};

    //controller.GetGenericosXProductosConStock(obj, function (datos) {

    //    var fila = '';
    //    MBP_tbodytblgenericos.innerHTML = '';
    //    for (var i = 0; i < datos.length; i++) {
    //        fila += '<tr idproducto="' + datos[i].idgenerico + '">';
    //        fila += '<td class="codgenerico">' + datos[i].codigogenerico + '</td>';
    //        fila += '<td><span class="generico">' + datos[i].generico + '</span></br><span class="font-10">' + datos[i].genenombreabreviado + '</span></td>';
    //        fila += '<td><span class="font-11">Presentación ' + datos[i].presentacion + '</span></br>  <span class="font-11">Multiplo ' + datos[i].multiplo + ' </span> - <span class="font-11">Blister ' + datos[i].multiploblister + ' </span></td>';
    //        fila += '<td>' + datos[i].precio.toFixed(2) + '</td>';
    //        fila += '<td>' + datos[i].precioxfraccion.toFixed(2) + '</td>';
    //        fila += '</tr>';
    //    }
    //    MBP_tbodytblgenericos.innerHTML = fila;
    //});

}


function MBP_fnlistassucursal() {
    let controller = new SucursalController();
    controller.ListarListasSucursal('', 'MBP_cmblistaprecios', null);
}


$('#modalbuscarproducto').on('show.bs.modal', function (e) {
    //MBP_txtbuscarproducto.attr('autofocus', true);  
    MBP_txtbuscarproducto.val('');
    MBP_txtbuscarproducto.focus();
    fnMBPBuscarProducto();

});

function MBP_abrirmodal() {
    $('#modalbuscarproducto').modal('show');
}
function MBP_Cerrarmodal() {
    $('#modalbuscarproducto').modal('hide');
}

$('#modalbuscarproducto').on('keydown', 'tr', function (e) {
    var aux = document.getElementById('MBP_tblproductos');
    aux.onkeydown = MANEJAR_TABLA('MBP_tblproductos');

});

