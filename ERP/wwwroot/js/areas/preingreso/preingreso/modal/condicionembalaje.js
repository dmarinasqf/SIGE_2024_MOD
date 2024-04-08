var _itemsembalaje = [];
var _CONDICIONEMBALAJE = [];
var tbodyCE = document.getElementById('tbodyCE');
var txtCEindex = document.getElementById('txtCEindex');
var checkCEtodos = document.getElementById('checkCEtodos');
var btnCEconservarcambios = document.getElementById('btnCEconservarcambios');
$(document).ready(function () {
    fnCElistaritemembalaje();
});

function fnCElistaritemembalaje() {
    let controller = new PreingresoController();
    controller.ListarItemsCondicionEmbalaje(function (data) {
        _itemsembalaje = data;
    });
}
function fnCEcargarembalajesproducto(embalajedetalle) {
    if (embalajedetalle.length == 0) {
        var fila = '';
        for (var i = 0; i < _itemsembalaje.length; i++) {
            var obj = _itemsembalaje[i];
            fila += '<tr iddetalle="0" iditem="' + obj.iditem + '"  tipo="' + obj.input +'">';
            fila += '<td style="width:70%">' + obj.descripcion + '</td>';       
            if (obj.input == 'select') {
                obj.html = '<option value="15 - 25">15-25</option><option value="15 - 30">15-30</option>';
                fila += '<td><select>' + obj.html + '></select></td>';
            }
            else
                fila += '<td><input class="CEinput" type="' + obj.input + '" value="' + (obj.input == 'checkbox' ? true : '') + '"  '+(obj.input == 'checkbox' ? 'checked' : '')+' /></td>';
            fila += '</tr>';

        }
        tbodyCE.innerHTML = fila;
    } else {
        var fila = '';
        for (var i = 0; i < embalajedetalle.length; i++) {
            var detalle = embalajedetalle[i];
            var item = _itemsembalaje.find(x => x.iditem == detalle.iditem);
            var checked = '';
            if (item.input == 'checkbox' && detalle.valor == 'true')
                checked = 'checked';

            fila += '<tr iddetalle="' + detalle.iddetalle + '" iditem="' + detalle.iditem + '" tipo="'+item.input+'">';
            fila += '<td style="width:70%">' + item.descripcion + '</td>';
            if (item.input =='select')
                fila += '<td><select>' + item.html.replace(detalle.valor, detalle.valor+"\" selected ")  + '></select></td>';
            else
                fila += '<td><input class="CEinput" type="' + item.input + '"  value="' + detalle.valor + '" ' + checked + '/></td>';
            console.log((item.html??'').replace(detalle.valor, detalle.valor + "\" selected"));
            fila += '</tr>';

        }
        tbodyCE.innerHTML = fila;
    }
}

btnCEconservarcambios.addEventListener('click', function () {
    var filas = document.querySelectorAll('#tbodyCE tr');
    var array = [];
    _CONDICIONEMBALAJE[parseInt(txtCEindex.value)] = array;
    filas.forEach(function (e) {
        var obj = new CondicionEmbalaje();
        obj.estado = 'HABILITADO';
        obj.iddetalle = e.getAttribute('iddetalle');
        obj.iditem = e.getAttribute('iditem');
        if (e.getAttribute('tipo') == 'checkbox' || e.getAttribute('tipo') == 'input')
            obj.valor = e.getElementsByTagName('input')[0].value;
        else if (e.getAttribute('tipo') == 'select')
            obj.valor = e.getElementsByTagName('select')[0].value;

        array.push(obj);
    });
    _CONDICIONEMBALAJE[parseInt(txtCEindex.value)] = array;
    $('#modalcondicionembalaje').modal('hide');
});

function guardarDatosPorDefectoEnArray() {
    var filas = document.querySelectorAll('#tbodyCE tr');
    var array = [];
    filas.forEach(function (e) {
        var obj = new CondicionEmbalaje();
        obj.estado = 'HABILITADO';
        obj.iddetalle = e.getAttribute('iddetalle');
        obj.iditem = e.getAttribute('iditem');
        if (e.getAttribute('tipo') == 'checkbox' || e.getAttribute('tipo') == 'input')
            obj.valor = e.getElementsByTagName('input')[0].value;
        else if (e.getAttribute('tipo') == 'select')
            obj.valor = e.getElementsByTagName('select')[0].value;

        array.push(obj);
    });
    _CONDICIONEMBALAJE[parseInt(txtCEindex.value)] = array;
}

$(document).on('change', '.CEinput', function () {
    var tipo = this.getAttribute('type');
    if (tipo == 'checkbox')
        if (this.checked)
            this.value = true;
        else
            this.value = false;
});
checkCEtodos.addEventListener('click', function () {
    var filas = document.querySelectorAll('#tbodyCE tr');
    var input = this;
    filas.forEach(function (e) {
        if (e.getElementsByTagName('input').length>0)
        if (e.getElementsByTagName('input')[0].getAttribute('type') == 'checkbox')
            if (input.checked) {
                e.getElementsByTagName('input')[0].checked = true;
                e.getElementsByTagName('input')[0].value = true;
            } else {
                e.getElementsByTagName('input')[0].checked = false;
                e.getElementsByTagName('input')[0].value = false;
            }
    });
});