//step2
var cmbtipodescuento = document.getElementById('cmbtipodescuento');
var tbodyproductos = document.getElementById('tbodyproductos');
var tbodydescuentos = document.getElementById('tbodydescuentos');
var btntodolaboratorio = document.getElementById('btntodolaboratorio');
$('#tbodyproductos').on('click', 'tr', function () {

    var filas = document.querySelectorAll('#tbodyproductos tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    $(this).addClass('selected');
    fncargardescuentos(this);
});
$(document).on('click', '.btnpasarproducto', function () {
    var idproducto = this.getAttribute('idproducto');
    let controller = new ProductoController();
    if (cmbtipodescuento.value == 'uno') {
        if (fnverificarsiseencuentraendetalle(idproducto)) {
            mensaje('I', 'El item ya se encuentra en el detalle');
            return;
        }
    }
    //else
    //    if (!fnverificarsieselmismoproducto(idproducto)) {
    //        mensaje('I', 'El item no es el mismo que el primero');
    //        return;
    //    }



    //var obj = { idproducto: idproducto, tipo: 'producto' };
    controller.BuscarProducto(idproducto, function (data) {
        $('#modalproductos').modal('show');

        var filas = document.querySelectorAll('#tbodyproductos tr');
        var fila = '<tr idproducto="' + data.idproducto + '" index="' + (_productos.length) + '">';
        fila += '<td>' + fncomboproductoprimario(filas.length) + '</td>';
        fila += '<td >' + data.codigoproducto + '</td>';
        fila += '<td class="nombrepro">' + data.nombre + '</td>';
        fila += '<td>' + data.laboratorio + '</td>';
        fila += '<td><input class="cantidad inputdetalle" value="1" disabled/></td>';
        fila += '<td class="preciocompra">' + (data.vvf ?? 0) + '</td>';
        fila += '</tr>';
        _productos.push(data);
        tbodyproductos.innerHTML = tbodyproductos.innerHTML + fila;

    });
});
//step2
$(document).on('keyup', '.dessucursal', function () {
    fncalculardescuentos(this, 'sucursal');
    fnactualizararraydescuentos();
});
$(document).on('keyup', '.desproveedor', function () {
    fncalculardescuentos(this, 'proveedor');
    fnactualizararraydescuentos();
});
$(document).on('change', '.dessucursal', function () {
    fncalculardescuentos(this, 'sucursal');
    fnactualizararraydescuentos();
});
$(document).on('change', '.desproveedor', function () {
    fncalculardescuentos(this, 'proveedor');
    fnactualizararraydescuentos();
});
btntodolaboratorio.addEventListener('click', function () {
    $('#modalproductosxlaboratorio').modal('show');
});
function fncalculardescuentos(event, tipo) {
    var preciocompra = tbodyproductos.getElementsByClassName('selected')[0].getElementsByClassName('preciocompra')[0].innerText;
    var descuento = event.value;
    var fila = event.parentNode.parentNode;
    var pventa = fila.getElementsByClassName('precioventa')[0].value;
    var descuentopara = '';
    pventa = parseFloat(pventa) ?? 0;
    if (pventa <= 0)
        return;

    var desproveedor = parseFloat(fila.getElementsByClassName('desproveedor')[0].value) ?? 0;
    var dessucursal = parseFloat(fila.getElementsByClassName('dessucursal')[0].value) ?? 0;
    if (isNaN(desproveedor)) desproveedor = 0;
    if (isNaN(dessucursal)) dessucursal = 0;

    var descuentototal = dessucursal + desproveedor;
    var preciofinal = pventa - ((pventa * descuentototal) / 100);
    //if (tipo == 'sucursal') {
    //    var preciofinal = pventa * ((100 - descuento) / 100);
    //    var otrodescuento = parseFloat(fila.getElementsByClassName('desproveedor')[0].value) ?? 0;
    //    if (isNaN(otrodescuento)) otrodescuento = 0;
    //    if (otrodescuento >= 0)
    //        preciofinal = preciofinal * ((100 - otrodescuento) / 100);
    //}
    //else if (tipo == 'proveedor') {

    //    var otrodescuento = parseFloat(fila.getElementsByClassName('dessucursal')[0].value) ?? 0;
    //    if (isNaN(otrodescuento)) otrodescuento = 0;
    //    var preciofinal = pventa * ((100 - otrodescuento) / 100);
    //    if (otrodescuento >= 0)
    //        preciofinal = preciofinal * ((100 - descuento) / 100);

    //}
    if (preciofinal < preciocompra) {
        fila.getElementsByClassName('preciofinal')[0].classList.add('text-danger');
        fila.getElementsByClassName('preciofinal')[0].setAttribute('tipodes', 'afecto');

    }
    else {
        fila.getElementsByClassName('preciofinal')[0].classList.remove('text-danger');
        fila.getElementsByClassName('preciofinal')[0].setAttribute('tipodes', 'inafecto');

    }

    fila.getElementsByClassName('preciofinal')[0].value = preciofinal.toFixed(2);
}

function fncomboproductoprimario(c) {
    var descuentopor = cmbtipodescuento.value;
    var disabled = '';
    if (descuentopor == 'uno')
        disabled = 'disabled';
    var combo = '';
    if (c == 0 || descuentopor == 'uno')
        combo += `<select class="cmbtipoitem"><option value="primario" selected>Primario</option><option ${disabled} value="secundario">Secundario</option></select>`;
    else
        combo += `<select class="cmbtipoitem"><option value="primario" >Primario</option><option ${disabled} value="secundario" selected>Secundario</option></select>'`;

    return combo;
}
function fncargardescuentos(event) {

    var idproducto = event.getAttribute('idproducto');
    var index = event.getAttribute('index');
    var pos = fngetposarraydescuentos(index);
  
    var fila = '';
    if (pos == -1) {
        var listas = '';
        for (var i = 0; i < _listas.length; i++)
            listas += _listas[i].split('/')[0] + '|';
        //console.log("las listas de lista precio");
        //console.log(listas);
        let controller = new ListaPreciosController();
        var obj = {
            idproducto: idproducto,
            listas: listas
        };

        controller.ListarPreciosxListasyProducto(obj, function (data) {
            for (var i = 0; i < data.length; i++) {
                fila += '<tr idlista="' + data[i].idlistaprecio + '" idproducto="' + idproducto + '" index="' + index + '">';
                fila += '<td class="nombrelista">' + data[i].lista + '</td>';
                fila += '<td><input type="number" min="0" step="any" class="precioventa inputdetalle" value="' + (data[i].precio ?? 0).toFixed(2) + '" disabled/></td>';
                fila += '<td><input type="number" min="0" step="any" class="dessucursal inputdetalle"/></td>';
                fila += '<td><input type="number" min="0" step="any" class="desproveedor inputdetalle"/></td>';
                fila += '<td><input type="number" min="0" step="any" class="preciofinal inputdetalle" value="' + (data[i].precio ?? 0).toFixed(2) + '" disabled/></td>';
                fila += '</tr>';
            }
            tbodydescuentos.innerHTML = fila;
        });
    }
    else {
        var array = _descuentos[pos];
        var data = array.data;
        for (var i = 0; i < data.length; i++) {
            var preciocompra = tbodyproductos.getElementsByClassName('selected')[0].getElementsByClassName('preciocompra')[0].innerText;
            var textdanger = '';
            if (data[i].preciofinal < preciocompra) textdanger = 'text-danger';
            fila += '<tr idlista="' + data[i].idlista + '" idproducto="' + idproducto + '" index="' + index + '">';
            fila += '<td class="nombrelista">' + data[i].nombrelista + '</td>';
            fila += '<td><input type="number" min="0" step="any" class="precioventa inputdetalle" value="' + (data[i].pventa ?? 0).toFixed(2) + '" disabled/></td>';
            fila += '<td><input type="number" min="0" step="any" class="dessucursal inputdetalle" value="' + (data[i].dessucursal) + '"/></td>';
            fila += '<td><input type="number" min="0" step="any" class="desproveedor inputdetalle" value="' + (data[i].desproveedor) + '"/></td>';
            fila += '<td><input type="number" min="0"step="any" class="preciofinal ' + textdanger + ' inputdetalle"  tipodes="' + (data[i].tipodescuento) + '" value="' + (data[i].preciofinal ?? 0).toFixed(2) + '" disabled/></td>';
            fila += '</tr>';
        }
        tbodydescuentos.innerHTML = fila;
    }
}
function fnactualizararraydescuentos() {
    var filas = document.querySelectorAll('#tbodydescuentos tr');
    var index;
    var pos = -1;
    if (filas.length > 0) {
        var array = [];
        filas.forEach(function (e) {
            index = e.getAttribute('index');
            pos = fngetposarraydescuentos(index);
            var obj = new ListaDescuento();
            obj.pventa = parseFloat(e.getElementsByClassName('precioventa')[0].value);
            obj.desproveedor = e.getElementsByClassName('desproveedor')[0].value;
            obj.dessucursal = e.getElementsByClassName('dessucursal')[0].value;
            obj.nombrelista = e.getElementsByClassName('nombrelista')[0].innerText;
            obj.preciofinal = parseFloat(e.getElementsByClassName('preciofinal')[0].value);
            obj.idlista = (e.getAttribute('idlista'));
            obj.tipodescuento = (e.getElementsByClassName('preciofinal')[0].getAttribute('tipodes'));
            array.push(obj);
        });
        if (pos != -1)
            _descuentos[pos] = { index: index, data: array };
        else
            _descuentos.push({ index: index, data: array });
    }
}
function fngetposarraydescuentos(index) {
    var pos = -1;
    for (var i = 0; i < _descuentos.length; i++) {
        if (_descuentos[i].index == index)
            return i;
    }
    return pos;
}
function fnquitaritemproducto() {
    var fila = tbodyproductos.getElementsByClassName('selected')[0];
    var index = fila.getAttribute('index');
    var pos = fngetposarraydescuentos(index);

    if(pos!=-1)
         _descuentos.splice(pos, 1);
    fila.outerHTML = '';
    tbodydescuentos.innerHTML = '';
}
function fnverificarsieselmismoproducto(idproducto) {
    var filas = document.querySelectorAll('#tbodyproductos tr');
    if (filas.length > 0)
        if (filas[0].getAttribute('idproducto') == idproducto)
            return true;
    return false;
}
function fnverificarsiseencuentraendetalle(idproducto) {
    var filas = document.querySelectorAll('#tbodyproductos tr');
    var res = false;
    for (var i = 0; i < filas.length; i++) {
        var e = filas[i];
        if (e.getAttribute('idproducto') == idproducto) {
            return  true;
        }
    } 

    return res;
}
$(document).ready(function () {
    $("#menuopciones").hide();
    $("#tbodyproductos").on("contextmenu", 'tr', function (e) {
        var filas = document.querySelectorAll('#tbodyproductos tr');
        filas.forEach(function (e) {
            e.classList.remove('selected');
        });
        $(this).addClass('selected');
        $("#menuopciones").css({ 'display': 'block', 'left': e.pageX, 'top': e.pageY - 100 });

        return false;
    });
    $(document).click(function (e) {
        if (e.button == 0) {
            $("#menuopciones").css("display", "none");
        }
    });
    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            $("#menuopciones").css("display", "none");
        }
    });
    $("#menuopciones").click(function (e) {
        switch (e.target.id) {
            case "eliminar":
                fnquitaritemproducto();
                break;
        }
    });
});		