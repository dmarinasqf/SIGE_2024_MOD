var navarchivostab=document.getElementById('nav-archivos-tab');

var txtCAnombrearchivo = document.getElementById('txtCAnombrearchivo');
var formarchivos = document.getElementById('formarchivos');
var txtCAidarchivo = document.getElementById('txtCAidarchivo');
var txtCAfile = document.getElementById('txtCAfile');
var btnCAguardar = document.getElementById('btnCAguardar');
var tblCAarchivos = document.getElementById('tblCAarchivos');
var tblCAtbodyarchivo = document.getElementById('tblCAtbodyarchivo');


navarchivostab.addEventListener('click', function () {
    fnCAlistararchivosproveedor();
});

function fnCAlistararchivosproveedor() {
    let controller = new ProveedorController();
    controller.ListarArchivos(txtcodigo.val(), function (data) {
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            var archivo = (data[i].archivo ?? '').split('/');
            console.log(archivo);
            fila += '<tr id="' + data[i].idarchivo+'">';
            fila += '<td>' + data[i].nombre+'</td>';
            fila += '<td><a download href="' + data[i].archivo +'" class="btnCAdescargar" >'+archivo[archivo.length-1]+'</a> </td>';
            fila += '<td><button class="btnCAeliminar" ><i class="fas fa-trash"></i></button></td>';
            fila+='</tr>';            
        }
        tblCAtbodyarchivo.innerHTML = fila;
    });
}
function fnCAlimpiar() {
    formarchivos.reset();
    txtCAidarchivo.value = '';
}
formarchivos.addEventListener('submit', function (e) {   
    e.preventDefault();
    let controller = new ProveedorController();
    var selectFile = ($('#txtCAfile'))[0].files[0];
    var dataString = new FormData();
    dataString.append("obj.idarchivo", txtCAidarchivo.value);
    dataString.append("obj.nombre", txtCAnombrearchivo.value);
    dataString.append("obj.estado", 'HABILITADO');
    dataString.append("obj.idproveedor", txtcodigo.val());
    dataString.append('file', selectFile);  
    controller.RegistrarDatosArchivo(dataString, function () {
        fnCAlimpiar();
        mensaje('S', 'Archivo guardado');
        fnCAlistararchivosproveedor();
    });
});

$(document).on('click', '.btnCAeliminar', function () {
    var id = this.parentNode.parentNode.getAttribute('id');
    let controller = new ProveedorController();
    controller.EliminarArchivo(id, function () {
        fnCAlistararchivosproveedor();
    });
});
