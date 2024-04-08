var tblsucursal;
var tblproductos;
var tblincentivos;
var checkallsucursal = document.getElementById('checkallsucursal');
var txtfiltroproducto = document.getElementById('txtfiltroproducto');
var cmbtipoproducto = document.getElementById('cmbtipoproducto');
var tbodyincentivos = document.getElementById('tbodyincentivos');
var tbodyproductos = document.getElementById('tbodyproductos');
var tbodycambios = document.getElementById('tbodycambios');
var txtcantidadparatodos = document.getElementById('txtcantidadparatodos');
var txtcantidadparatodosreceta = document.getElementById('txtcantidadparatodosreceta');
var txtfechainiciotodos = document.getElementById('txtfechainiciotodos');
var txtfechafintodos = document.getElementById('txtfechafintodos');

var step1 = document.getElementById('step-1');
var step2 = document.getElementById('step-2');
var step3 = document.getElementById('step-3');
var btnsiguiente2wizard = document.getElementById('btnsiguiente2wizard');
var btnfinalizarwizard2 = document.getElementById('btnfinalizar2wizard');
var btnsiguiente1wizard = document.getElementById('wizard-1-next');
var btnfinalizarwizard = document.getElementById('wizard-1-finish');
var txtidproducto = document.getElementById('txtidproducto');
var txtnombreproducto = document.getElementById('txtnombreproducto');
var _sucursales = [];
var _incentivos = [];
$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = false;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    tblsucursal = util.Datatable('tblsucursal', false, datatable);

    init();
});
window.addEventListener('keydown', function (e) {
    var tecla = e.key;
 
    if (tecla === 'ArrowRight' || tecla == 'ArrowLeft')
        this.setTimeout(function () {
            fnaccionessiguiente();
        }, 1000);
        
  
});
function init() {
    let productocontroller = new ProductoController();
    productocontroller.ListarTipoProducto('cmbtipoproducto');
    let sucursalcontroller = new SucursalController();
    sucursalcontroller.ListarTodasSucursales(null, null, function (data) {
        for (var i = 0; i < data.length; i++) {
            var fila = tblsucursal.row.add([
                '<input type="checkbox" class="checksucursal" />',
                data[i].idsucursal,
                data[i].sucursal,
            ]).draw(false).node();
            fila.setAttribute('idsucursal', data[i].idsucursal);
        }
    }, null);
}
checkallsucursal.addEventListener('click', function () {
    var nodos = $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', true);
    if (this.checked) {
        $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', true);
        mensaje('I', 'Se ha seleccionado ' + nodos.length + ' sucursales');
    }
    else
        $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', false);
});

txtfiltroproducto.addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        fnbuscarproductos();
    }
});
cmbtipoproducto.addEventListener('change', function (e) { 
        fnbuscarproductos();    
});


$(document).on('click', '#btnsiguiente2wizard', function () {
    fnaccionessiguiente();
});

$('#tblproductos tbody').on('click', 'tr', function () {
    //fncargarsucursal();
    txtidproducto.value = this.getAttribute('codproducto');
    txtnombreproducto.value = this.getElementsByTagName('td')[1].innerText;

    var filas = document.querySelectorAll('#tblproductos tbody tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    $(this).addClass('selected');
    fncargartablaincentivos();
  
});
$(document).on('click', '#btnfinalizar2wizard', function () {
    swal({
        title: '¿Desea guardar incentivos?',
        text: '',
        icon: 'info',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            let controller = new IncentivoController();
            var obj = { data: JSON.stringify(fnverificarcantidades()) };
            controller.RegistrarIncentivos(obj, function (data) {
                setTimeout(function () {
                    location.reload();
                }, 2000);
            });
        }
        else
            swal.close();
    });

});
$(document).on('change', '.incentivo', function () {
    fnactualizararrayincentivos();
});
$(document).on('change', '.fechainicio', function () {
    fnactualizararrayincentivos();
});
$(document).on('change', '.fechafin', function () {
    fnactualizararrayincentivos();
});
$(document).on('keyup', '.incentivo', function () {
    fnactualizararrayincentivos();
});
$(document).on('keyup', '.incentivoreceta', function () {
    fnactualizararrayincentivos();
});
$(document).on('keyup', '.fechainicio', function () {
    fnactualizararrayincentivos();
});
$(document).on('keyup', '.fechafin', function () {
    fnactualizararrayincentivos();
});

txtcantidadparatodos.addEventListener('keyup', function () {
    var filas = document.querySelectorAll('#tbodyincentivos tr');
    var valor = txtcantidadparatodos.value;
    filas.forEach(function (e) {
        e.getElementsByClassName('incentivo')[0].value = valor;
    });
    fnactualizararrayincentivos();
});
txtcantidadparatodosreceta.addEventListener('keyup', function () {
    var filas = document.querySelectorAll('#tbodyincentivos tr');
    var valor = txtcantidadparatodosreceta.value;
    filas.forEach(function (e) {
        e.getElementsByClassName('incentivoreceta')[0].value = valor;
    });
    fnactualizararrayincentivos();
});
txtfechainiciotodos.addEventListener('change', function () {
    var filas = document.querySelectorAll('#tbodyincentivos tr');
    var valor = txtfechainiciotodos.value;
    filas.forEach(function (e) {
        e.getElementsByClassName('fechainicio')[0].value = moment(valor).format('YYYY-MM-DD');
    });
    fnactualizararrayincentivos();
});
txtfechafintodos.addEventListener('change', function () {
    var filas = document.querySelectorAll('#tbodyincentivos tr');
    var valor = txtfechafintodos.value;
    filas.forEach(function (e) {
        e.getElementsByClassName('fechafin')[0].value = moment(valor).format('YYYY-MM-DD');
    });
    fnactualizararrayincentivos();
});


function fnaccionessiguiente() {
    if (step1.style.display == 'block')
        init();
    if (step2.style.display == 'block') {
        fnbuscarproductos();
        _sucursales = fngetallsucursales();
    }

    if (step3.style.display == 'block')
        fncargarcambios();
}
function fnbuscarproductos() {
    let controller = new ProductoController();
    var obj = {
        nombreproducto: txtfiltroproducto.value.trim(),
        tipoproducto: cmbtipoproducto.value,
        top: 100
    }
    controller.BuscarProductos(obj, function (data) {

        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr codproducto="' + data[i].CODIGO + '">';
            fila += '<td>' + data[i].CODIGO + '</td>';
            fila += '<td>' + data[i].PRODUCTO + '</td>';
            fila += '<td>' + data[i].LABORATORIO + '</td>';
            fila += '</tr>';
        }
        tbodyproductos.innerHTML = fila;
    });
}
function fngetallsucursales() {
    var array = [];
    var nodos = $(tblsucursal.rows({ filter: 'applied' }).nodes());
    for (var i = 0; i < nodos.length; i++) {
        var ischecked = nodos[i].getElementsByClassName('checksucursal')[0].checked;
        if (ischecked) {
            array.push(nodos[i].getAttribute('idsucursal') + '/' + nodos[i].getElementsByTagName('td')[2].innerText);
        }


    }
    return array;
}
function fnactualizararrayincentivos() {
    var filas = document.querySelectorAll('#tbodyincentivos tr');
    var index = fngetarrayindexincentivos(txtidproducto.value);
    if (filas.length > 0) {
        var array = [];
        filas.forEach(function (e) {
            var obj = new Incentivo();
            obj.fechafin = e.getElementsByClassName('fechafin')[0].value;
            obj.fechainicio = e.getElementsByClassName('fechainicio')[0].value;
            obj.incentivo = e.getElementsByClassName('incentivo')[0].value;
            obj.incentivoreceta = e.getElementsByClassName('incentivoreceta')[0].value;
            obj.sucursal = e.getElementsByTagName('th')[0].innerText;
            obj.idsucursal = e.getAttribute('idsucursal');
            obj.codigoproducto = e.getAttribute('codproducto');
            obj.producto = txtnombreproducto.value;
            array.push(obj);
        });
        
        if (index != -1)
            _incentivos[index] = array;
        else
            _incentivos.push(array);

    }
    
}
function fncargartablaincentivos() {
  
    var index = fngetarrayindexincentivos(txtidproducto.value);

    var fila = '';
    if (index == -1)
        for (var i = 0; i < _sucursales.length; i++) {
            var sucu = _sucursales[i].split('/');
            fila += '<tr idsucursal="' + sucu[0] + '" codproducto="' + txtidproducto.value + '">';
            fila += '<th>' + sucu[1] + '</th>';
            fila += '<td><input type="number" step="any" class="incentivo inputdetalle"/></td>';
            fila += '<td><input type="number" step="any" class="incentivoreceta inputdetalle"/></td>';
            fila += '<td><input type="date"  class="fechainicio" value="' + moment().format('YYYY-MM-DD') + '" /></td>';
            fila += '<td><input type="date"  class="fechafin" min="' + moment().format('YYYY-MM-DD') + '"/></td>';
            fila += '</tr>';
        }
    else {
        var incentivos = _incentivos[index];
        for (var i = 0; i < incentivos.length; i++) {
            fila += '<tr idsucursal="' + incentivos[i].idsucursal + '" codproducto="' + incentivos[i].codigoproducto + '">';
            fila += '<th>' + incentivos[i].sucursal + '</th>';
            fila += '<td><input type="number" step="any" class="incentivo inputdetalle" value="' + incentivos[i].incentivo + '" /></td>';
            fila += '<td><input type="number" step="any" class="incentivoreceta inputdetalle" value="' + incentivos[i].incentivoreceta + '" /></td>';
            fila += '<td><input type="date"  class="fechainicio" value="' + moment(incentivos[i].fechainicio).format('YYYY-MM-DD') + '" /></td>';
            fila += '<td><input type="date" min="' + moment().format('YYYY-MM-DD') + '" class="fechafin"  value="' + (incentivos[i].fechafin == '' ? '' : moment(incentivos[i].fechafin).format('YYYY-MM-DD')) + '"/></td>';
            fila += '</tr>';
        }
    }
    tbodyincentivos.innerHTML = fila;    
}
function fngetarrayindexincentivos(codigo) {
    var pos = -1;
    for (var i = 0; i < _incentivos.length; i++) {
        if (_incentivos[i][0].codigoproducto == codigo)
            return i;
    }
    return pos;
}
function fncargarcambios() {
    var fila = '';
    for (var i = 0; i < _incentivos.length; i++) {

        for (var j = 0; j < _incentivos[i].length; j++) {
            fila += '<tr>';
            fila += '<td>' + _incentivos[i][j].producto + '</td>';
            fila += '<td>' + _incentivos[i][j].sucursal + '</td>';
            fila += '<td>' + _incentivos[i][j].incentivo + '</td>';
            fila += '<td>' + _incentivos[i][j].incentivoreceta + '</td>';
            fila += '<td>' + _incentivos[i][j].fechainicio + '</td>';
            fila += '<td>' + _incentivos[i][j].fechafin + '</td>';
            fila += '</tr>';
        }


    }
    tbodycambios.innerHTML = fila;
}
function fnverificarcantidades() {
    var array = [];
    for (var i = 0; i < _incentivos.length; i++) {
        for (var j = 0; j < _incentivos[i].length; j++) {
            if (parseFloat(_incentivos[i][j].incentivo ?? 0) > 0 || parseFloat(_incentivos[i][j].incentivoreceta ?? 0) > 0)
                array.push(_incentivos[i][j]);
        }
    }
    return array;
}