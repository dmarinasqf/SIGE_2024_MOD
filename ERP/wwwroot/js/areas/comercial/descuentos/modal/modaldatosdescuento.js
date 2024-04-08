var MDDtblproductos = document.getElementById('MDDtblproductos');
var MDDtbodyproductos = document.getElementById('MDDtbodyproductos');
var MDDtxtfechainicio = document.getElementById('MDDtxtfechainicio');
var MDDtxtfechafin = document.getElementById('MDDtxtfechafin');
var MDDcmbestado = document.getElementById('MDDcmbestado');
var MDDtxtdescripcion = document.getElementById('MDDtxtdescripcion');
var MDDtxtiddescuento = document.getElementById('MDDtxtiddescuento');

var MDDtxtdesqf = document.getElementById('MDDtxtdesqf');
var MDDtxtdesproveedor = document.getElementById('MDDtxtdesproveedor');


var MDDbtnguardar = document.getElementById('MDDbtnguardar');

function MDDfngetdescuento(id) {
    MDDtxtdesqf.value = '';
    MDDtxtdesproveedor.value = '';
    let controller = new DescuentoController();
    controller.GetDescuentoCompleto(id, function (data) {
        var cabecera = JSON.parse(data.cabecera)[0];
        var detalle = JSON.parse(data.detalle);

        MDDtxtfechainicio.value = moment(cabecera.fechainicio).format('YYYY-MM-DDTHH:mm');
        MDDtxtfechafin.value = moment(cabecera.fechafin).format('YYYY-MM-DDTHH:mm');
        MDDcmbestado.value = cabecera.estado;
        MDDtxtdescripcion.value = cabecera.descripcion;
        MDDtxtiddescuento.value = cabecera.iddescuento;
        var fila = '';
        for (var i = 0; i < detalle.length; i++) {
            fila += '<tr>';
            fila += '<td>' + detalle[i].tipo + '</td>';
            fila += '<td>' + detalle[i].nombre + '</td>';
            fila += '<td>' + detalle[i].laboratorio + '</td>';
            fila += '<td>' + (detalle[i].pvf ?? 0.00) + '</td>';
            var descuentos = detalle[i].detalle;

            if (descuentos.length > 0) {           
                var listas = '<table border="1" width="100%" ><tr class="font-9"><th>Lista</th><th>Pv</th><th>DesQf</th><th>DesProveedor</th><th>Total</th></tr>';
                for (var j = 0; j < descuentos.length; j++) {
                    listas += '<tr class="font-9" id="' + descuentos[j].id+'">';
                    listas += '<td>' + (descuentos[j].lista ?? '') + '</td>';
                    listas += '<td class="precioventa">' + ((parseFloat(descuentos[j].precioventa) ?? 0).toFixed(2) ?? '') + '</td>';
                    listas += '<td class="desqf editable-number" contenteditable="true">' + (descuentos[j].dessucursal ?? '') + '</td>';
                    listas += '<td class="desproveedor editable-number" contenteditable="true">' + (descuentos[j].desproveedor ?? '') + '</td>';
                    var total = fncalcularprecioventa(parseFloat(descuentos[j].precioventa) ?? 0, descuentos[j].dessucursal, descuentos[j].desproveedor);
                    if (descuentos[j].tipodescuento == 'afecto' || total <= detalle[i].pvf)
                        listas += '<td class="text-danger">' + ((total ?? 0).toFixed(2) ?? '') + '</td>';
                    else
                        listas += '<td class="total"> ' + ((total ?? 0).toFixed(2) ?? '') + '</td>';

                    listas += '</tr>';
                }
                listas += '</table>';
                fila += '<td>' + listas + '</td>';
            } else
                fila += '<td></td>';

            fila += '</tr>';
        }
        MDDtbodyproductos.innerHTML = fila;
    });
}

//--------------------------
function fncalcular() {

}
//--------------------------

function fncalcularprecioventa(pventa, sucudescuento, prodescuento) {
    //var preciofinal = pventa * ((100 - sucudescuento) / 100);  
    //if (isNaN(prodescuento)) prodescuento = 0;
    //if (prodescuento >= 0)
    //    preciofinal = preciofinal * ((100 - prodescuento) / 100);
    var preciofinal = pventa - (pventa * (sucudescuento + prodescuento)) / 100;
    return parseFloat(preciofinal.toFixed(2));
}

MDDbtnguardar.addEventListener('click', function () {
    var descuento = {
        descripcion: MDDtxtdescripcion.value,
        fechainicio: MDDtxtfechainicio.value,
        fechafin: MDDtxtfechafin.value,
        estado: MDDcmbestado.value,
        iddescuento: MDDtxtiddescuento.value
    };
    var obj = {
        descuento: descuento,
        detalle: MDDfngetdatosdetalle() 
    }
    let controller = new DescuentoController();
    controller.EditarDescuento(obj, function () { fnlistardescuentos(1, 20); });
});

MDDtxtdesqf.addEventListener('keyup', function (e) {
    if (('0123456789.').includes(e.key) || e.key == 'Backspace' || e.key == 'Delete') {
        var filas = document.getElementsByClassName('desqf');
        for (var i = 0; i < filas.length; i++) {
            filas[i].innerText = MDDtxtdesqf.value;
            var fila = filas[i].parentNode;
            var pventa = parseFloat(fila.getElementsByClassName('precioventa')[0].innerText);
            var desqf = parseFloat(fila.getElementsByClassName('desqf')[0].innerText);
            var despro = parseFloat(fila.getElementsByClassName('desproveedor')[0].innerText);
            if (isNaN(pventa)) pventa = 0;
            if (isNaN(desqf)) desqf = 0;
            if (isNaN(despro)) despro = 0;
            fila.getElementsByClassName('total')[0].innerText = fncalcularprecioventa(pventa, desqf, despro);
        }
    }

});
MDDtxtdesproveedor.addEventListener('keyup', function (e) {
    if (('0123456789.').includes(e.key) || e.key == 'Backspace' || e.key == 'Delete') {
        var filas = document.getElementsByClassName('desproveedor');
        for (var i = 0; i < filas.length; i++) {
            filas[i].innerText = MDDtxtdesproveedor.value;
            var fila = filas[i].parentNode;
            var pventa = parseFloat(fila.getElementsByClassName('precioventa')[0].innerText);
            var desqf = parseFloat(fila.getElementsByClassName('desqf')[0].innerText);
            var despro = parseFloat(fila.getElementsByClassName('desproveedor')[0].innerText);
            if (isNaN(pventa)) pventa = 0;
            if (isNaN(desqf)) desqf = 0;
            if (isNaN(despro)) despro = 0;
            fila.getElementsByClassName('total')[0].innerText = fncalcularprecioventa(pventa, desqf, despro);
        }
    }
});
$(document).on('keyup', '.desqf', function (e) {

    MDDfnaccionestxtdescuento(this.parentNode);
});
$(document).on('keyup', '.desproveedor', function (e) {

    MDDfnaccionestxtdescuento(this.parentNode);
});
function MDDfnaccionestxtdescuento(fila) {
    var pventa = parseFloat(fila.getElementsByClassName('precioventa')[0].innerText);
    var desqf = parseFloat(fila.getElementsByClassName('desqf')[0].innerText);
    var despro = parseFloat(fila.getElementsByClassName('desproveedor')[0].innerText);
    if (isNaN(pventa)) pventa = 0;
    if (isNaN(desqf)) desqf = 0;
    if (isNaN(despro)) despro = 0;
    fila.getElementsByClassName('total')[0].innerText = fncalcularprecioventa(pventa, desqf, despro);
}
function MDDfngetdatosdetalle() {
    var filas = document.getElementsByClassName('desproveedor');
    var array = [];
    for (var i = 0; i < filas.length; i++) {
       
        var fila = filas[i].parentNode;
        var pventa = parseFloat(fila.getElementsByClassName('precioventa')[0].innerText);
        var desqf = parseFloat(fila.getElementsByClassName('desqf')[0].innerText);
        var despro = parseFloat(fila.getElementsByClassName('desproveedor')[0].innerText);
        var id = fila.getAttribute('id');
        if (isNaN(pventa)) pventa = 0;
        if (isNaN(desqf)) desqf = 0;
        if (isNaN(despro)) despro = 0;
      array.push(id+'|'+desqf+'|'+despro)
    }
    return array;
}