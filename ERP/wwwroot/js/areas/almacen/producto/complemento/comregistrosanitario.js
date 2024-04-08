//tabs
var navregsanitariotab = document.getElementById('nav-regsanitario-tab');
var navregsanitario = document.getElementById('nav-regsanitario');
var formregsanitario = document.getElementById('formregsanitario');
var tbodyRSregsanitarios = document.getElementById('tbodyRSregsanitarios');

var txtRSid = document.getElementById('txtRSid');
var txtRSreg = document.getElementById('txtRSreg');
var txtRSfechainicio = document.getElementById('txtRSfechainicio');
var txtRSfechafin = document.getElementById('txtRSfechafin');
var cmbestado = document.getElementById('cmbestado');

var btnlimpiar = document.getElementById('btnlimpiar'); 

formregsanitario.addEventListener('submit', function (e) {
    e.preventDefault();
    let controller = new RegistroSanitarioController();
    var obj = $('#formregsanitario').serializeArray();
    obj[obj.length] = { name:"idproducto", value: txtidproducto.val() };
    controller.RegistrarEditar(obj, function (data) {
        fnRSlistarregistros();
        fnRSlimpiar();
    });
});
navregsanitariotab.addEventListener('click', function () {
    fnRSlistarregistros();
}); 

$(document).on('click', '.btnRSeditar', function () {
    var fila = this.parentNode.parentNode;
    var id = fila.getAttribute('id');
    let controller = new RegistroSanitarioController();
    controller.Buscar(id, function (data) {
        if (data.mensaje == 'ok') {
            var obj = data.objeto;         
            txtRSreg.value = obj.registro;
            txtRSid.value = obj.id;
            cmbestado.value = obj.estado;
            txtRSfechainicio.value = moment( obj.fechainicio).format('YYYY-MM-DD');
            txtRSfechafin.value = moment( obj.fechafin).format('YYYY-MM-DD');
        }
    });
   
});
function fnRSlimpiar() {
    formregsanitario.reset();
    txtRSid.value = '';
}
function fnRSlistarregistros() {
    let controller = new RegistroSanitarioController();
    controller.ListarxProducto(txtidproducto.val(), function (data) {       
        var fila = '';
        var tipotabla = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].estado == 'DESHABILITADO')
                tipotabla = 'class="table-warning"';
            fila += '<tr id="' + data[i].id + '" ' + tipotabla+'>';
            fila += '<td><button class="btn btn-warning btnRSeditar"><i class="fas fa-edit"></i></button></td>';
            fila += '<td>'+(i+1)+'</td>';
            fila += '<td>'+data[i].registro+'</td>';
            fila += '<td>'+moment( data[i].fechainicio).format('DD/MM/YYYY')+'</td>';
            fila += '<td>'+moment( data[i].fechafin).format('DD/MM/YYYY')+'</td>';
            fila += '<td>'+data[i].estado+'</td>';
            fila+='</tr>';
        }
        tbodyRSregsanitarios.innerHTML = fila;
    });
}