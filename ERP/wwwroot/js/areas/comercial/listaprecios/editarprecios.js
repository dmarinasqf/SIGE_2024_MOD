
var txtfiltro = document.getElementById('txtfiltro');
var lblidlista = document.getElementById('lblidlista');
var tblitemdetalle = document.getElementById('tblitemdetalle');
var cmblaboratorio = document.getElementById('cmblaboratorio');
var imglimpiarlab = document.getElementById('imglimpiarlab');


//buttons
var btnguardarcambios = document.getElementById('btnguardarcambios');
var btnverificarcambios = document.getElementById('btnverificarcambios');
var btncancelar = document.getElementById('btncancelar');
var btndescargar = document.getElementById('btndescargar');

//variables
var PRECIOSEDITADOS = [];
var select2lab;
$(document).ready(function () {
    fnlistarproductoslista(1,20);
    let controller = new LaboratorioController();
    var fn = controller.BuscarLaboratoriosSelect2();
    select2lab = $('#cmblaboratorio').select2({
        placeholder: "Buscar Laboratorios",
        allowClear: true,
        ajax: fn
    }).on("change", function (e) {
        fnlistarproductoslista();
    });
});
function fnlistarproductoslista(numpagina, tamanopagina) {
    let controller = new ListaPreciosController();
    var obj = {
        producto: txtfiltro.value.trim().toUpperCase(),
        top: 50,
        lista: lblidlista.innerText,
        laboratorio: cmblaboratorio.value,
        pagine: {
            numpagina: numpagina??1,
            tamanopagina: tamanopagina??50,
        }
       
    };
    
    controller.BuscarProductosListaPrecios(obj, function (datos) {
        tblitemdetalle.innerHTML = '';
        var fila = '';
      
        var data = datos.data;
      
        for (var i = 0; i < data.length; i++) {
            if (data[i].precio == null) data[i].precio = 0;
            if (data[i].precioxfraccion == null) data[i].precioxfraccion = 0;
            //if (data[i].precioxblister == null) data[i].precioxblister = 0;
            //if (data[i].incentivo == null) data[i].incentivo = 0;
            //if (data[i].incentivoxfraccion == null) data[i].incentivoxfraccion = 0;
            fila += '<tr idprecio="' + data[i].idprecioproducto + '">';
            fila += '<td class="idproducto">' + data[i].idproducto + '</td>';
            fila += '<td class="codigoproducto">' + data[i].codigoproducto + '</td>';
            fila += '<td class="nombre">' + data[i].nombre + '</td>';
            fila += '<td class="laboratorio font-10">' + data[i].laboratorio + '</td>';
            fila += '<td class="clase font-10">' + data[i].clase + '</td>';
            fila += '<td class="subclase font-10">' + data[i].subclase + '</td>';
            fila += '<td class="multiplo">' + data[i].multiplo + '</td>';
            //fila += '<td class="multiploblister">' + data[i].multiploblister + '</td>';
            fila += '<td class="idlistaprecio" > ' + data[i].idlistaprecio + '</td>';
            fila += '<td class="text-center"><input min=0 type="number" step="any" class="inputdetalle precio text-center"  value="' + data[i].precio.toFixed(2) + '" /></td>';
            fila += '<td class="text-center"><input min=0 type="number" step="any" class="inputdetalle precioxfraccion text-center"  value="' + data[i].precioxfraccion.toFixed(2) + '" /></td>';
            //fila += '<td class="text-center"> <input min=0 type="number" step="any" class="inputdetalle precioxblister text-center"  value="' + data[i].precioxblister.toFixed(2) +'" /></td>';
            //fila += '<td class="text-center"> <input min=0 type="number" step="any" class="inputdetalle incentivo text-center"  value="' + data[i].incentivo.toFixed(2) + '" /></td>';
            //fila += '<td class="text-center"> <input min=0 type="number" step="any" class="inputdetalle incentivoxfraccion text-center"  value="' + data[i].incentivoxfraccion.toFixed(2) + '" /></td>';

            fila += '</tr>';
        }
        tblitemdetalle.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(datos.totalpaginas, datos.paginaactual, 'linkpageprecios', 'paged');
    });
}
function fnencontrarindex(idprecio) {
    var pos = -1;
    for (var i = 0; i < PRECIOSEDITADOS.length; i++) {
        if (PRECIOSEDITADOS[i].idprecioproducto === (idprecio)) {
            return i;
        }
    }
    return pos;
}
function fneventosinput(event) {
    var fila = event.parentNode.parentNode;

    var obj = new PreciosProducto();
    obj.idprecioproducto = fila.getAttribute('idprecio');
    obj.idlistaprecio = fila.getElementsByClassName('idlistaprecio')[0].innerText;
    obj.idproducto = fila.getElementsByClassName('idproducto')[0].innerText;
    obj.codigoproducto = fila.getElementsByClassName('codigoproducto')[0].innerText;
    obj.nombre = fila.getElementsByClassName('nombre')[0].innerText;
    obj.laboratorio = fila.getElementsByClassName('laboratorio')[0].innerText;
    obj.precio = parseFloat(fila.getElementsByClassName('precio')[0].value);
    obj.precioxfraccion = parseFloat(fila.getElementsByClassName('precioxfraccion')[0].value);
    //obj.precioxblister = parseFloat( fila.getElementsByClassName('precioxblister')[0].value);
    //obj.incentivo = parseFloat(fila.getElementsByClassName('incentivo')[0].value);
    obj.multiplo = parseFloat(fila.getElementsByClassName('multiplo')[0].innerText);
    //obj.multiploblister = parseFloat(fila.getElementsByClassName('multiploblister')[0].innerText);
    //var txtincentivofraccion = fila.getElementsByClassName('incentivoxfraccion')[0];
    //var incentivoxfraccion = parseFloat(fila.getElementsByClassName('incentivoxfraccion')[0].value);

    //if (obj.incentivo > 0 && obj.multiplo > 1 && obj.incentivo / obj.multiplo > incentivoxfraccion)
    //    txtincentivofraccion.value = obj.incentivo / obj.multiplo;

    //obj.incentivoxfraccion = parseFloat(txtincentivofraccion.value);

    var index = fnencontrarindex(obj.idprecioproducto);
    if (index === -1)
        PRECIOSEDITADOS.push(obj);
    else
        PRECIOSEDITADOS[index] = obj;
}
function fneventosinputincentivo(event) {
    var fila = event.parentNode.parentNode;

    var obj = new PreciosProducto();
    obj.idprecioproducto = fila.getAttribute('idprecio');
    obj.idlistaprecio = fila.getElementsByClassName('idlistaprecio')[0].innerText;
    obj.idproducto = fila.getElementsByClassName('idproducto')[0].innerText;
    obj.codigoproducto = fila.getElementsByClassName('codigoproducto')[0].innerText;
    obj.nombre = fila.getElementsByClassName('nombre')[0].innerText;
    obj.precio = parseFloat(fila.getElementsByClassName('precio')[0].value);
    obj.precioxfraccion = parseFloat(fila.getElementsByClassName('precioxfraccion')[0].value);
    //obj.precioxblister = parseFloat(fila.getElementsByClassName('precioxblister')[0].value);
    //obj.incentivo = parseFloat(fila.getElementsByClassName('incentivo')[0].value);
    obj.multiplo = parseFloat(fila.getElementsByClassName('multiplo')[0].innerText);
    //obj.multiploblister = parseFloat(fila.getElementsByClassName('multiploblister')[0].innerText);    
    //obj.incentivoxfraccion = parseFloat(fila.getElementsByClassName('incentivoxfraccion')[0].value);
    var index = fnencontrarindex(obj.idprecioproducto);
    if (index === -1)
        PRECIOSEDITADOS.push(obj);
    else
        PRECIOSEDITADOS[index] = obj;
}
function fnnuevo() {
    btnverificarcambios.classList.remove('ocultar');
    txtfiltro.disabled = false;
    btnguardarcambios.classList.add('ocultar');
    btncancelar.classList.add('ocultar');
    fnlistarproductoslista();
    PRECIOSEDITADOS = [];
}
$(document).on('keyup', '.precio', function () {
    var fila = this.parentNode.parentNode;
    var multiplo = parseFloat(fila.getElementsByClassName('multiplo')[0].innerText);
    if (multiplo > 1) {
        var precio = parseFloat(this.value);
        fila.getElementsByClassName('precioxfraccion')[0].value = (precio / multiplo).toFixed(2);
    }
    fneventosinput(this);



});
$(document).on('change', '.precio', function () {
    var fila = this.parentNode.parentNode;
    var multiplo = parseFloat(fila.getElementsByClassName('multiplo')[0].innerText);
    if (multiplo > 1) {
        var precio = parseFloat(this.value);
        fila.getElementsByClassName('precioxfraccion')[0].value = (precio / multiplo).toFixed(2);
    }
    fneventosinput(this);

});
$(document).on('keyup', '.precioxfraccion', function () {
    fneventosinput(this);
});
$(document).on('change', '.precioxfraccion', function () {
    fneventosinput(this);
});
//$(document).on('keyup', '.precioxblister', function () {
//    fneventosinput(this);
//});
//$(document).on('change', '.precioxblister', function () {
//    fneventosinput(this);
//});
//$(document).on('keyup', '.incentivo', function () {
//    fneventosinput(this);
//});
//$(document).on('change', '.incentivo', function () {
//    fneventosinput(this);
//}); $(document).on('keyup', '.incentivoxfraccion', function () {
//    fneventosinputincentivo(this);
//});
//$(document).on('change', '.incentivoxfraccion', function () {
//    fneventosinputincentivo(this);
//});
//$(document).on('mousewheel', '.incentivoxfraccion', function (e) {
//    this.blur();
//});
//$(document).on('mousewheel', '.incentivo', function (e) {
//    this.blur();
//});
//$(document).on('mousewheel', '.precioxblister', function (e) {
//    this.blur();
//});
$(document).on('mousewheel', '.precioxfraccion', function (e) {
    this.blur();
});
$(document).on('mousewheel', '.precio', function (e) {
    this.blur();
});
btnverificarcambios.addEventListener('click', function () {
    document.getElementById('paged').innerHTML = '';
    if (PRECIOSEDITADOS.length > 0) {
        btnverificarcambios.classList.add('ocultar');
        btnguardarcambios.classList.remove('ocultar');
        btncancelar.classList.remove('ocultar');
        txtfiltro.disabled = true;

        tblitemdetalle.innerHTML = '';
        var fila = '';
        var data = PRECIOSEDITADOS;
        for (var i = 0; i < data.length; i++) {
            fila += '<tr class="text-success" idprecio="' + data[i].idprecioproducto + '">';
            fila += '<td class="idproducto">' + data[i].idproducto + '</td>';
            fila += '<td class="codigoproducto">' + data[i].codigoproducto + '</td>';
            fila += '<td class="nombre">' + data[i].nombre + '</td>';
            fila += '<td class="laboratorio font-9">' + data[i].laboratorio + '</td>';
            fila += '<td class="clase font-9">' + data[i].clase + '</td>';
            fila += '<td class="subclase font-9">' + data[i].subclase + '</td>';
            fila += '<td class="multiplo">' + data[i].multiplo + '</td>';
            //fila += '<td class="multiploblister">' + data[i].multiploblister + '</td>';
            fila += '<td class="idlistaprecio" > ' + data[i].idlistaprecio + '</td>';
            fila += '<td class="text-center"><input min=0 type="number" step="any" class="inputdetalle precio text-center"  value="' + data[i].precio.toFixed(2) + '" /></td>';
            fila += '<td class="text-center"><input min=0 type="number" step="any" class="inputdetalle precioxfraccion text-center"  value="' + data[i].precioxfraccion.toFixed(2) + '" /></td>';
            //fila += '<td class="text-center"> <input min=0 type="number" step="any" class="inputdetalle precioxblister text-center"  value="' + data[i].precioxblister.toFixed(2) + '" /></td>';
            //fila += '<td class="text-center"> <input min=0 type="number" step="any" class="inputdetalle incentivo text-center"  value="' + data[i].incentivo.toFixed(2) + '" /></td>';
            //fila += '<td class="text-center"> <input min=0 type="number" step="any" class="inputdetalle incentivoxfraccion text-center"  value="' + data[i].incentivoxfraccion.toFixed(2) + '" /></td>';

            fila += '</tr>';
        }
        tblitemdetalle.innerHTML = fila;

    }
});
btnguardarcambios.addEventListener('click', function () {
    let controller = new ListaPreciosController();
    var obj = { lista: PRECIOSEDITADOS };
    controller.EditarPreciosProducto(obj, function () {
        fnnuevo();
    });
});
btncancelar.addEventListener('click', function () {
    fnnuevo();
});

txtfiltro.addEventListener('keyup', function (e) {
    if (txtfiltro.value.length % 2 === 0)
        fnlistarproductoslista();
});
$('#tblprecios tbody').on('click', 'tr', function (e) {

    $('#tblprecios tbody tr').removeClass('selected');
    $(this).addClass('selected');

});
imglimpiarlab.addEventListener('click', function () {
    $('#cmblaboratorio').empty();
    fnlistarproductoslista();
});

btndescargar.addEventListener('click', function () {
    var obj = {
        producto: txtfiltro.value.trim().toUpperCase(),
        top: 99999,
        lista: lblidlista.innerText,
        laboratorio: cmblaboratorio.value,
        tipo: 'excel'
    };
    let controller = new ListaPreciosController();
    controller.ExportarLista(obj);
});


$(document).on('click', '.linkpageprecios', function () {
    var numpagina = this.getAttribute('numpagina');
    fnlistarproductoslista(numpagina,40);
    var pages = document.getElementsByClassName('pagelink');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});