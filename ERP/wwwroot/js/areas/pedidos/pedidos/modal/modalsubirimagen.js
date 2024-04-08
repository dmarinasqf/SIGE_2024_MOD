var MSItxtarchivo = document.getElementById('MSItxtarchivo');
var MSIcmbtipo = document.getElementById('MSIcmbtipo');
var MSIbtnaddarchivo = document.getElementById('MSIbtnaddarchivo');
var MSItbodydetalle = document.getElementById('MSItbodydetalle');
var MSIform = document.getElementById('MSIform');
var _arrayArchivosPedido = [];

var _arrayArchivosIniciales = [];
MSIform.addEventListener('submit', function (e) {
    e.preventDefault();
    var selectFile = (MSItxtarchivo).files[0];   
    MSItxtarchivo.value = '';  
    if (selectFile === undefined)
        return;
    _arrayArchivosPedido[_arrayArchivosPedido.length] = selectFile;
    _arrayArchivosPedido[_arrayArchivosPedido.length - 1].tipo = MSIcmbtipo.value;   
    _arrayArchivosPedido[_arrayArchivosPedido.length - 1].tipoarchivo = 'FILE';   
    MSIlistarArchivos();
});

function MSIlistarArchivos() {
    var fila = '';
    for (var i = 0; i < _arrayArchivosPedido.length; i++) {
        fila += '<tr>';
        fila += '<td>' + (i + 1)+'</td>';
        fila += '<td>' + _arrayArchivosPedido[i].name + '</td>';
        fila += '<td>' + _arrayArchivosPedido[i].tipo + '</td>';
        fila += '<td>' + ((_arrayArchivosPedido[i].tipoarchivo === 'FILE') ? _arrayArchivosPedido[i].type : _arrayArchivosPedido[i].tipo)+'</td>';
      
        fila += '<td>' + ((_arrayArchivosPedido[i].tipoarchivo === 'FILE') ? ((_arrayArchivosPedido[i].size / 1024) / 1024).toFixed(4) : '')+'</td>';
        fila += '<td>' + ((_arrayArchivosPedido[i].tipoarchivo === 'FILE') ? '<button class="btn btn-sm btn-danger MSIbtnquitaritem"><i class="fas fa-trash"></i></button>' :
            '<button class="btn btn-sm btn-danger MSIbtnquitaritem"><i class="fas fa-trash"></i></button>' 
           /* + '<a href="' + _arrayArchivosPedido[i].ruta + '" target="_blank" class="btn btn-sm btn-primary "><i class="fas fa-eye"></i></a>'*/
             ) + '</td>';
        fila+='</tr>';       
    }
    MSItbodydetalle.innerHTML = fila;
}
function MSIfnlimpiar() {
    MSItbodydetalle.innerHTML = '';
    MSItxtarchivo.value = '';
    _arrayArchivosPedido = [];
}

$(document).on('click', '.MSIbtnquitaritem', function (e) {
    var index = this.parentNode.parentNode.getElementsByTagName('td')[0].innerText;   
    _arrayArchivosPedido.splice(index - 1, 1); 
    MSIlistarArchivos();
});


function MSIregistrarimagenes(idpedido)
{
    var datosAntiguos = _arrayArchivosPedido.filter(item => item.imagen_codigo !== undefined);
    var datosnuevos = _arrayArchivosPedido.filter(item => item.imagen_codigo === undefined);
    if (_arrayArchivosIniciales.length > datosAntiguos.length) {
        // Filtrar los elementos de _arrayArchivosIniciales cuyos imagen_codigo no están en datosAntiguos
        var codigosFaltantes = _arrayArchivosIniciales.filter(itemInicial => {
            return !datosAntiguos.some(itemAntiguo => itemAntiguo.imagen_codigo === itemInicial.imagen_codigo);
        }).map(item => item.imagen_codigo);

        var editarbit = new FormData();

        for (var i = 0; i < codigosFaltantes.length; i++) {
            editarbit.append("imagen_codigo[]", codigosFaltantes[i]);
        }

        editarbit.append("idpedido", idpedido);
        let controller = new PedidoController();
        controller.EditarImagenPedidobit(editarbit, function () {
            mensaje('S', 'Imagenes guardadas');         
        });

    }


    if (datosnuevos.length > 0) {
        if (_arrayArchivosPedido.length == 0)
            return;
        var dataString = new FormData();
        var archivos = _arrayArchivosPedido.filter(item => item.imagen_codigo === undefined);

        for (var i = 0; i < archivos.length; i++) {
            dataString.append("archivos", archivos[i])
            dataString.append("tipos", archivos[i].tipo)
            dataString.append("idimagen", archivos[i].idimagen)
            dataString.append("nombre", archivos[i].name)
        }
        dataString.append("idpedido", idpedido);
        dataString.append("tipo", 'file');


        let controller = new PedidoController();
        controller.RegistrarImagenPedidobit(dataString, function () {
            mensaje('S', 'Imagenes guardadas');
            MSIfnlimpiar();
        });

    } else {
        MSIfnlimpiar();
    }


  
}



//function MSIregistrarimagenes(idpedido) {
//    if (_arrayArchivosPedido.length == 0)
//        return;

//    var dataString = new FormData();

//    var imagenes = [];
//    var otrosArchivos = [];

//    for (var i = 0; i < _arrayArchivosPedido.length; i++) {
//        if (_arrayArchivosPedido[i].type.startsWith("image/")) {
//            imagenes.push(_arrayArchivosPedido[i]);
//            dataString.append("imagenes", _arrayArchivosPedido[i]);
//            dataString.append("tiposImagen", _arrayArchivosPedido[i].tipo);
//            dataString.append("idimagenImagen", _arrayArchivosPedido[i].idimagen);
//        } else {
//            otrosArchivos.push(_arrayArchivosPedido[i]);
//            dataString.append("otrosArchivos", _arrayArchivosPedido[i]);
//            dataString.append("tiposArchivo", _arrayArchivosPedido[i].tipo);
//            dataString.append("idimagenArchivo", _arrayArchivosPedido[i].idimagen);
//        }
//    }

//    dataString.append("idpedido", idpedido);
//    dataString.append("tipo", "file");

//    let controller = new PedidoController();
//    controller.RegistrarImagenPedido(dataString, function () {
//        mensaje('S', 'Imagenes y archivos guardados');
//        MSIfnlimpiar();
//    });
//}