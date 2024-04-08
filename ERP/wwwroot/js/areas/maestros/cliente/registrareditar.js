
var txtfileimagen = document.getElementById('txtfileimagen');
var txtimagen = document.getElementById('txtimagen');

var tabasociado = document.getElementById('asociado-tab');

$(document).ready(function () {
    if (IDEMPRESA > 1999 && IDEMPRESA < 3000) {
        cargarTipoCliente();
    }
    if (_idcliente != null) {
        fnbuscarcliente(_idcliente);
    }
});

