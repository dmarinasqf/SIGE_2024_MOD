var formregistro = document.getElementById('formregistro');
var txtfecha = document.getElementById('txtfecha');
var txtserie = document.getElementById('txtserie');
var txtnumdocumento = document.getElementById('txtnumdocumento');
var cmbtipoegreso = document.getElementById('cmbtipoegreso');
var txtmonto = document.getElementById('txtmonto');
var txtdetallegasto = document.getElementById('txtdetallegasto');
var btnguardar = document.getElementById('btnguardar');
var btnlimpiar = document.getElementById('btnlimpiar');

$(document).ready(function () {
    let controller = new IngresoEgresosController();
    controller.ListarTipoEgresos('cmbtipoegreso');
});

formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    var obj = $('#formregistro').serializeArray();
    obj[obj.length] = { name: 'idaperturacaja', value: _DATOSCAJA.idaperturacaja};
    let controller = new IngresoEgresosController();
    btnguardar.disabled = true;
    
    controller.RegistrarEgreso(obj,
        function (data) { btnguardar.disabled = false; formregistro.reset();},
        function () {
            btnguardar.disabled = false;      
    });
});