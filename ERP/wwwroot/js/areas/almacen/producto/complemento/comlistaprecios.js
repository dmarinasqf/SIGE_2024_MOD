var CLPtbllistas = document.getElementById('CLPtbllistas');
var CLPtbltbodylista = document.getElementById('CLPtbltbodylista');
var CLPbtnguardar = document.getElementById('CLPbtnguardar');
var navlistaprecios = document.getElementById('nav-listaprecios-tab');
var txtprecio = $('#txtprecio');
//txtmultiplo
navlistaprecios.addEventListener('click', function () {
    CLPfnlistarlistas();
});

CLPbtnguardar.addEventListener('click',function () {
    let controller = new ProductoController();
    var obj = { precios: CLPfngetdatosdetalle()};
    controller.AgregarEliminarProductoLista(obj, function () {

    });
});
function CLPfngetdatosdetalle() {
    var filas = document.querySelectorAll('#CLPtbltbodylista tr');
    var array = [];
    filas.forEach(function (e) {
        var obj = new PreciosProducto();
        obj.idlistaprecio = e.getAttribute('idlista');
        obj.idproducto=txtidproducto.val();
        obj.precio = e.getElementsByClassName('precio')[0].value;
        obj.precioxfraccion = e.getElementsByClassName('precioxfraccion')[0].value;
        obj.agregareditar = e.getElementsByClassName('CLPcheckprecio')[0].checked;
        array.push(obj);
    });
    return array;
}
function CLPfnlistarlistas() {
    let controller = new ProductoController();
    var obj = { idproducto: txtidproducto.val(), tipo: 'lista' };
    controller.ListarListapreciosConproducto(obj, function (data) {       
        CLPtbltbodylista.innerHTML = '';
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            var precios = JSON.parse(data[i].precios)[0];
            var check = '<input type="checkbox" class="CLPcheckprecio"/>';
            if (precios == undefined) 
                precios = { precio: '', precioxfraccion: '' };   
            if (JSON.parse(data[i].precios).length > 0)
                check = '<input type="checkbox" class="CLPcheckprecio" checked/>';
            fila += '<tr idlista="' + data[i].idlistaprecio+'">';
            fila += '<td>' + check+'</td>';
            fila += '<td>' + data[i].lista + '</td>';
            //if (data[i].lista == 'MEDICAMENTOS') {
            //    fila += '<td><input type="number" id="txtprecio" class="form-control form-control-sm precio" value="' + txtpvfp.val() + '"/></td>';
            //    fila += '<td><input type="number" class="form-control form-control-sm precioxfraccion" value="' + txtprecioxfraccion.value+ '"/></td>';
            //} else {
            //    fila += '<td><input type="number" class="form-control form-control-sm precio" value="' + (precios.precio ?? '') + '"/></td>';
            //    fila += '<td><input type="number" class="form-control form-control-sm precioxfraccion" value="' + (precios.precioxfraccion ?? '') + '"/></td>';
            //}
            fila += '<td><input type="number" class="form-control form-control-sm precio" value="' + (precios.precio ?? '') + '"/></td>';
            fila += '<td><input type="number" class="form-control form-control-sm precioxfraccion" value="' + (precios.precioxfraccion ?? '') + '"/></td>';
            //fila += '<td></td>';
            //fila +='</tr>';
        }
        CLPtbltbodylista.innerHTML = fila;

    });
}

//txtprecio.keyup(function () {
//    txtpvfp.val() = txtprecio.val();
//    //calcularpreciocompra(txtporcentajeganancia.val());

//});