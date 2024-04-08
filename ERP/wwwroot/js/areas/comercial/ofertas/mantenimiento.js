
var txtid = document.getElementById('txtid');
var txtnombre = document.getElementById('txtnombre');
var cmbtipo = document.getElementById('cmbtipo');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var cmbestado = document.getElementById('cmbestado');


var tbdoyoferta = document.getElementById('tbdoyoferta');
var tbodydetalle = document.getElementById('tbodydetalle');
var formregistro = document.getElementById('formregistro');

var btnadditemdetalle = document.getElementById('btnadditemdetalle');
var btnadditemobsequio = document.getElementById('btnadditemobsequio');
var btnguardar = document.getElementById('btnguardar');
var btnlimpiar = document.getElementById('btnlimpiar');
var btnbuscaroferta = document.getElementById('btnbuscaroferta');
var btnasignarsucursal = document.getElementById('btnasignarsucursal');
var btnguardarofertassucubloque = document.getElementById('btnguardarofertassucubloque');

//odal sucursal
var checkallsucursal = document.getElementById('checkallsucursal');
var _tipoitem = '';
var tblsucursal;
var _sucursales = [];
$(document).ready(function () {
    tblsucursal = $('#tblsucursal').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[12, 25, 50, -1], [12, 25, 50, "All"]],      
        "language": LENGUAJEDATATABLE()
      
    });
    fnlistarsucursal();
});

btnbuscaroferta.addEventListener('click', function () {
    $('#modalofertas').modal('show');
});
btnadditemdetalle.addEventListener('click', function () {
    _tipoitem = 'detalle';
    $('#modalproductos').modal('show');
});
btnadditemobsequio.addEventListener('click', function () {
    _tipoitem = 'obsequio';
    $('#modalproductos').modal('show');
});
btnasignarsucursal.addEventListener('click', function () {
    if (txtid.value.length != 0) {
        $('#modalasignarsucursal').modal('show');
        fnbuscarofertasucursal(txtid.value);
    }
});
$(document).on('click', '.btnpasarproducto', function () {
    let controller = new ProductoController();
    controller.BuscarProducto(this.getAttribute('idproducto'), function (data) {

        $('#modalproductos').modal('hide');
        var fraccion = '<input type="checkbox" class="isfraccion" disabled/>';
        if (data.multiplo != null && data.multiplo > 1)
            fraccion = '<input type="checkbox" class="isfraccion" />';

        if (_tipoitem == 'detalle') {
            var fila = '<tr idproducto="' + data.idproducto + '" id="0">';
            //fila += '<td></td>';
            fila += '<td>' + data.codigoproducto + '</td>';
            fila += '<td>' + data.nombre + '</td>';
            fila += '<td>' + data.laboratorio + '</td>';
            fila += '<td>' + fraccion + '</td>';
            fila += '<td><input class="cantidad inputdetalle" type="number" step="any" min=1/></td>';
            fila += '<td><button type="button" class="btn btn-sm btn-danger btndeletedetalle"><i class="fas fa-trash"></i></button></td>';

            fila += '</tr>';
            //tbodydetalle.innerHTML = tbodydetalle.outerHTML + fila;
            tbodydetalle.innerHTML = tbodydetalle.outerHTML+ fila;
            //fnagregarindex('tbodydetalle');

        }
        else if (_tipoitem == 'obsequio') {
            var fila = '<tr idproducto="' + data.idproducto + '" id="0">';
            //fila += '<td></td>';
            fila += '<td>' + data.codigoproducto + '</td>';
            fila += '<td>' + data.nombre + '</td>';
            fila += '<td>' + data.laboratorio + '</td>';
            fila += '<td>' + fraccion + '</td>';
            fila += '<td><input  class="cantidad inputdetalle" type="number" step="any" min=1/></td>';
            fila += '<td><input class="descuento inputdetalle" type="number" value="100" min=1/></td>';
            fila += '<td><button type="button" class="btn btn-sm btn-danger btndeleteobsequio"><i class="fas fa-trash"></i></button></td>';
            fila += '</tr>';
            //tbdoyoferta.innerHTML = tbdoyoferta.outerHTML + fila;
            tbdoyoferta.innerHTML =tbdoyoferta.outerHTML+fila;
            //fnagregarindex('tbdoyoferta');
        }
    });
});

$(document).on('click', '.btndeletedetalle', function () {
    var fila = this.parentNode.parentNode;
    fila.classList.add('ocultar');
    //fila.remove();
    //fnagregarindex('tbodydetalle');
});
$(document).on('click', '.btndeleteobsequio', function () {
    var fila = this.parentNode.parentNode;
    fila.classList.add('ocultar');
    //fila.remove();
    //fnagregarindex('tbdoyoferta');
});
$(document).on('click', '.btncargaroferta', function () {
    var id = this.getAttribute('id');
    fnbuscaroferta(id);
    $('#modalofertas').modal('hide');
});
$(document).on('click', '.hasoferta', function () {
    let controller = new OfertaController();
    var obj = {
        idoferta: txtid.value,
        idsucursal:this.parentNode.parentNode.getAttribute('idsucursal')
    };   
    controller.AsignarOfertaSucursal(obj);
});
btnlimpiar.addEventListener('click', function () {
    location.href = ORIGEN + '/Comercial/Oferta/mantenimiento';
});
txtid.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnbuscaroferta(txtid.value);
});
formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    var obj = $('#formregistro').serializeArray();
    if (fngetdetalle().length == 0) {
        mensaje('W', 'Agregue datos al detalle');
        return;
    } if (fngetobsequios().length == 0) {
        mensaje('W', 'Agregue la oferta');
        return;
    }
    /*if (fngetdetalle().filter(x => x.estado == "HABILITADO").length > 1) {
        mensaje('W', 'Solo debe haber un producto en el detalle');
        return;
    }
    if (fngetobsequios().filter(x => x.estado == "HABILITADO").length > 1) {
        mensaje('W', 'Solo debe haber un producto en la oferta');
        return;
    }*/
    obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fngetdetalle()) };
    obj[obj.length] = { name: 'jsonobsequios', value: JSON.stringify(fngetobsequios()) };

    let controller = new OfertaController();
    controller.RegistrarEditar(obj, function (data) {
        txtid.value = data.objeto.idoferta;
    });

});
checkallsucursal.addEventListener('click', function () {
    var nodos = $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', true);
    if (this.checked) {
        $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', true);
        mensaje('I', 'Se ha seleccionado ' + nodos.length + ' sucursales');
    }
    else
        $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', false);
});
btnguardarofertassucubloque.addEventListener('click', function () {
    let controller = new OfertaController();
    var obj = {
        idoferta: txtid.value,
        idsucursal: (fngetallsucursaloferta())
    };   
    controller.AsignarOfertaSucursalEnBloque(obj);
});
$('#modalasignarsucursal').on('shown.bs.modal', function () {
    checkallsucursal.checked = false;
});

function fnagregarindex(tabla) {
    var filas = document.querySelectorAll('#' + tabla + ' tr');
    for (var i = 0; i < filas.length; i++) {
        filas[i].getElementsByTagName('td')[0].innerText = (i + 1);
    }
}
function fngetdetalle() {
    var array = [];
    var filas = document.querySelectorAll('#tbodydetalle tr');
    filas.forEach(function (e) {
        var obj = new DetalleOferta();
        obj.iddetalle = e.getAttribute('id');
        obj.idoferta = (txtid.value == '') ? 0 : txtid.value;
        obj.idproducto = e.getAttribute('idproducto');
        obj.isfraccion = e.getElementsByClassName('isfraccion')[0].checked;
        if (cmbtipo.value == 'CANTIDAD')
            obj.cantidad = e.getElementsByClassName('cantidad')[0].value;
        else if (cmbtipo.value == 'MONTO')
            obj.monto = e.getElementsByClassName('cantidad')[0].value;
        if (e.classList.contains('ocultar'))
            obj.estado = 'ELIMINADO';
        else
            obj.estado = 'HABILITADO';

        array.push(obj);

    });
    return array;
}
function fngetobsequios() {
    var array = [];
    var filas = document.querySelectorAll('#tbdoyoferta tr');
    filas.forEach(function (e) {
        var obj = new ObsequioOferta();
        obj.idobsequio = e.getAttribute('id');
        obj.idoferta = (txtid.value == '') ? 0 : txtid.value;
        obj.idproducto = e.getAttribute('idproducto');
        obj.isfraccion = e.getElementsByClassName('isfraccion')[0].checked;
        obj.descuento = e.getElementsByClassName('descuento')[0].value;
        if (cmbtipo.value == 'CANTIDAD')
            obj.cantidad = e.getElementsByClassName('cantidad')[0].value;
        else if (cmbtipo.value == 'MONTO')
            obj.monto = e.getElementsByClassName('cantidad')[0].value;
        if (e.classList.contains('ocultar'))
            obj.estado = 'ELIMINADO';
        else
            obj.estado = 'HABILITADO';
        array.push(obj);

    });
    return array;
}
function fnbuscaroferta(id) {
    let controller = new OfertaController();
    controller.BuscarOfertaCompleta(id, function (resp) {
        resp = resp[0];
        var oferta = JSON.parse(resp.oferta)[0];
        var detalle = JSON.parse(resp.detalle);
        var obsequio = JSON.parse(resp.obsequio);
        txtid.value = oferta.idoferta;
        txtnombre.value = oferta.nombre;
        cmbtipo.value = oferta.tipo;
        cmbestado.value = oferta.estado;
        txtfechainicio.value = moment(oferta.fechainicio).format('YYYY-MM-DD');
        txtfechafin.value = moment(oferta.fechafin).format('YYYY-MM-DD');
        var fila = '';
        for (var i = 0; i < detalle.length; i++) {
            var data = detalle[i];
            var fraccion = '<input type="checkbox" class="isfraccion" disabled/>';
            var checked = '';
            if (data.isfraccion)
                checked = 'checked';
            if (data.multiplo != null && data.multiplo > 1)
                fraccion = '<input type="checkbox" class="isfraccion" ' + checked + '/>';
           
           fila = '<tr idproducto="' + data.idproducto + '" id="' + data.iddetalle + '">';
            //fila += '<td></td>';
            fila += '<td>' + data.codigoproducto + '</td>';
            fila += '<td>' + data.producto + '</td>';
            fila += '<td>' + data.laboratorio + '</td>';
            fila += '<td>' + fraccion + '</td>';
            if (oferta.tipo == 'CANTIDAD')
                fila += '<td><input class="cantidad inputdetalle" type="number" value="' + data.cantidad + '" step="any" min=1/></td>';
            else
                fila += '<td><input class="cantidad inputdetalle" type="number" value="' + data.monto + '" step="any" min=1/></td>';

            fila += '<td><button type="button" class="btn btn-sm btn-danger btndeletedetalle"><i class="fas fa-trash"></i></button></td>';

            fila += '</tr>';
          
        }
        tbodydetalle.innerHTML = fila;
        //fnagregarindex('tbodydetalle');
        fila = '';
        for (var i = 0; i < obsequio.length; i++) {
            var data = obsequio[i];
            var fraccion = '<input type="checkbox" class="isfraccion" disabled/>';
            var checked = '';
            if (data.isfraccion)
                checked = 'checked';
            if (data.multiplo != null && data.multiplo > 1)
                fraccion = '<input type="checkbox" class="isfraccion" ' + checked+'/>';
           fila+= '<tr idproducto="' + data.idproducto + '" id="' + data.idobsequio + '">';
            //fila += '<td>'+(i+1)+'</td>';
            fila += '<td>' + data.codigoproducto + '</td>';
            fila += '<td>' + data.producto + '</td>';
            fila += '<td>' + data.laboratorio + '</td>';
            fila += '<td>' + fraccion + '</td>';
            if (oferta.tipo == 'CANTIDAD')
                fila += '<td><input class="cantidad inputdetalle" type="number" value="' + data.cantidad + '" step="any" min=1/></td>';
            else
                fila += '<td><input class="cantidad inputdetalle" type="number" value="' + data.monto + '" step="any" min=1/></td>';
            fila += '<td><input class="descuento inputdetalle" type="number" value="' + data.descuento + '" value="100" min=1/></td>';
            fila += '<td><button type="button" class="btn btn-sm btn-danger btndeleteobsequio"><i class="fas fa-trash"></i></button></td>';
            fila += '</tr>';

        }      
        tbdoyoferta.innerHTML = fila;
        //fnagregarindex('tbdoyoferta');
    });
   
}
function fnbuscarofertasucursal(idoferta) {
    let controller = new OfertaController();
    controller.ListarOfertaSucursal(idoferta, function (data) {
        fncargarsucursaloferta(data);
    });
}
function fnlistarsucursal() {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnTable('', function (data) {
        _sucursales = data;
    });
}
function fncargarsucursaloferta(data) {
    tblsucursal.clear().draw(false);
    for (var i = 0; i < _sucursales.length; i++) {
        var checked = '';
        if (_sucursales[i].tipo == 'LOCAL') {
            for (var j = 0; j < data.length; j++) {
                if (_sucursales[i].idsucursal === data[j].idsucursal)
                    checked = 'checked';
            }
            var fila = tblsucursal.row.add([
                _sucursales[i].descripcion,
                '<input type="checkbox"   class="hasoferta" ' + checked + '/>'
            ]).draw(false).node();
            fila.setAttribute('idsucursal', _sucursales[i].idsucursal);
        }
       
    }
}
function fngetallsucursaloferta() {
    var array = [];
    var nodos = $(tblsucursal.rows({ filter: 'applied' }).nodes());
    for (var i = 0; i < nodos.length; i++) {
        var ischecked = nodos[i].getElementsByClassName('hasoferta')[0].checked;
        if (ischecked)
            array.push("true - " + nodos[i].getAttribute('idsucursal'));
        else
            array.push("false - " + nodos[i].getAttribute('idsucursal'));

    }
    return array;
}