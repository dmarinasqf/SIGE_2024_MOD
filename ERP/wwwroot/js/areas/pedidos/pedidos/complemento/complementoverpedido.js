
var MVPlblestadopedido = document.getElementById('MVPlblestadopedido');
var MVPtxtfecha = document.getElementById('MVPtxtfecha');
var MVPtxtfechatermino = document.getElementById('MVPtxtfechatermino');
var MVPtxtordenproduccion = document.getElementById('MVPtxtordenproduccion');
var MVPtxtnumcomprobante = document.getElementById('MVPtxtnumcomprobante');
var MVPtxtsucursal = document.getElementById('MVPtxtsucursal');
var MVPtxtlaboratorio = document.getElementById('MVPtxtlaboratorio');
var MVPtxttipopedido = document.getElementById('MVPtxttipopedido');
var MVPtxtdocpaciente = document.getElementById('MVPtxtdocpaciente');
var MVPtxtnombrepaciente = document.getElementById('MVPtxtnombrepaciente');
var MVPtxttipopaciente = document.getElementById('MVPtxttipopaciente');
var MVPtxtcolegiatura = document.getElementById('MVPtxtcolegiatura');
var MVPtxtmedico = document.getElementById('MVPtxtmedico');
var MVPtxtempleado = document.getElementById('MVPtxtempleado');
var MVPtxtdiagnostico = document.getElementById('MVPtxtdiagnostico');
var MVPtxtobservacion = document.getElementById('MVPtxtobservacion');

var MVP_carrusel_items = document.getElementById('MVP_carrusel_items');
var MVP_carrusel_body = document.getElementById('MVP_carrusel_body');
var MVPtbody_archivos = document.getElementById('MVPtbody_archivos');

var MVPtbodydetalle = document.getElementById('MVPtbodydetalle');
var MVPlblSubtotal = document.getElementById('MVPlblSubtotal');//EARTCOD1009
var MVPlblDescuento = document.getElementById('MVPlblDescuento');//EARTCOD1009
var MVPlblTotal = document.getElementById('MVPlblTotal');//EARTCOD1009

let imageFunctions = {};
let pacienteActual = "";
function MVPbuscarpedido(idpedido) {
    $('#modalverpedido').modal('show');
    MVPlblnumpedido.innerText = idpedido;
    let controller = new PedidoController();
 
    controller.BuscarPedidoCompleto(idpedido, function (data) {
        data = data.pedido;
        if (data.length > 0) {
            var detalle = JSON.parse(data[0].detalle);
            var cabecera = JSON.parse(data[0].cabecera)[0];
          
            MVPlblestadopedido.innerText = cabecera.estadopedido;
            MVPtxtfecha.value = cabecera.fecha;
            MVPtxtfechatermino.value = cabecera.fechafin;
            MVPtxtordenproduccion.value = cabecera.ordenproduccion;
            MVPtxtnumcomprobante.value = cabecera.numdocumento;
            MVPtxtsucursal.value = cabecera.sucursal;
            MVPtxtlaboratorio.value = cabecera.laboratorio;
            //se traslado al detalle
      /*      MVPtxttipopedido.value = cabecera.tipopedido;*/
            MVPtxtdocpaciente.value = cabecera.docpaciente;
            MVPtxtnombrepaciente.value = cabecera.paciente;
            MVPtxttipopaciente.value = cabecera.tipopaciente;
            MVPtxtcolegiatura.value = cabecera.cmp;
            MVPtxtmedico.value = cabecera.medico;
            MVPtxtempleado.value = cabecera.empleado??'';
            MVPtxtdiagnostico.value = cabecera.diagnostico ?? '';
            MVPtxtobservacion.value = cabecera.observacion;
            pacienteActual = cabecera.paciente;
            var fila = '';
            var total = 0;
            for (var i = 0; i < detalle.length; i++) {
                fila += '<tr>';
                fila += '<td>' + (detalle[i].codigoproducto ?? detalle[i].codprecioanterior) + '</td>';
                fila += '<td>' + (detalle[i].formula) + '</td>';
                fila += '<td>' + (detalle[i].tipopedido) + '</td>';
                fila += '<td class="text-right">' + (detalle[i].precio.toFixed(2)) + '</td>';
                fila += '<td class="text-right">' + (detalle[i].cantidad) + '</td>';
                fila += '<td class="text-right">' + (detalle[i].subtotal.toFixed(2)) + '</td>';
                fila += '</tr>';
                total += detalle[i].subtotal;
            }
            MVPtbodydetalle.innerHTML = fila;

            MVPlblSubtotal.innerText = total.toFixed(2);//EARTCOD1009
            MVPlblDescuento.innerText = cabecera.pkdescuento.toFixed(2);//EARTCOD1009
            MVPlblTotal.innerText = (total.toFixed(2) - cabecera.pkdescuento.toFixed(2)).toFixed(2);//EARTCOD1009
        }
    });
 /*   controller.ListarArchivosPedido(idpedido, function (data) {*/
    controller.ListarArchivosPedidobitaimagen(idpedido, function (data) {
        clearCarouselAndTable();
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                if (item.imagen.toLowerCase().endsWith('.pdf')) {
                    item.imagenURL = ORIGEN + '/Pedidos/Pedido/GetFile?imagen_codigo=' + item.imagen_codigo;
                } else if (item.imagenBase64 === null) {
                    // Si imagenBase64 es null, construye la dirección del archivo manualmente
                    var tipo = item.imagen.split('_');
                    if (tipo[0] == 'sisqf')
                        item.imagenURL = '/imagenes/pedido/' + item.tipo + '/' + item.imagen;
                    else
                        item.imagenURL = '/imagenes/pedido/receta/' + item.imagen;
                } else {
                    let ext = item.imagen.split('.').pop().toLowerCase();
                    item.imagenURL = "data:image/" + ext + ";base64," + item.imagenBase64;

                    let funcKey = "func_" + item.imagen_codigo;
                    imageFunctions[funcKey] = () => openBase64ImageInNewWindow(item.imagenBase64, `image/${ext}`, item.imagen);
                    item.imagenFuncKey = funcKey;
                }
            });
            fillCarouselAndTable(data);
        }
    });
}




function openBase64ImageInNewWindow(base64, mimeType, title = "Imagen") {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    const newWindow = window.open(blobUrl, '_blank');
    newWindow.document.title = title;
}





function fillCarouselAndTable(data) {
    let items = [];
    let bodies = [];
    let filas = [];

    data.forEach((datum, i) => {
        let active = i === 0 ? 'active' : '';
        let fileElement;
        let downloadName = `${datum.pedido_codigo}_${datum.tipo}_${pacienteActual}_${datum.imagen}`;

        if (datum.imagen.toLowerCase().endsWith('.pdf')) {
            fileElement = `
                <object data="${datum.imagenURL}" type="application/pdf" width="400px" height="400px">
                    <embed src="${datum.imagenURL}" type="application/pdf" />
                </object>`;
        } else {
            fileElement = `<img src="${datum.imagenURL}" class="d-block w-100 IMP_img-potes" alt="${datum.imagen}" width="400px" height="400px">`;
        }

        items.push(`<li data-slide-to="${i}" class="${active}"></li>`);
      

        bodies.push(`<div class="carousel-item ${active}">${fileElement}</div>`);
        if (datum.imagenFuncKey) {
            filas.push(`
                <tr>
                        
                    <td><a href="${datum.imagenURL}" download="${downloadName}">${datum.imagen}</a></td>
                    <td>${datum.tipo}</td>
                    <td align="center">
                        <a class="btn btn-sm btn-outline-info" onclick="imageFunctions['${datum.imagenFuncKey}']()">
                            <i class="fas fa-eye"></i>
                        </a>
                    </td>
                </tr>`);
        } else {
            filas.push(`
                <tr>
                    <td><a href="${datum.imagenURL}" download="${downloadName}">${datum.imagen}</a></td>
                    <td>${datum.tipo}</td>
                    <td align="center">
                        <a class="btn btn-sm btn-outline-info" href="${datum.imagenURL}" target="_blank">
                            <i class="fas fa-eye"></i>
                        </a>
                    </td>
                </tr>`);
        }
    });

    MVP_carrusel_items.innerHTML = items.join('');
    MVP_carrusel_body.innerHTML = bodies.join('');
    MVPtbody_archivos.innerHTML = filas.join('');
}

function clearCarouselAndTable() {
    // Limpia o inicializa tu carrusel y tabla aquí. 
    // Esto dependerá de cómo estén implementados en tu código.
    MVP_carrusel_items.innerHTML = '';
    MVP_carrusel_body.innerHTML = '';
    MVPtbody_archivos.innerHTML = '';
}





//function fillCarouselAndTable(data) {
//    let items = [];
//    let bodies = [];
//    let filas = [];

//    data.forEach((datum, i) => {
//        let active = i === 0 ? 'active' : '';
//        let fileElement;

//        if (datum.imagen.toLowerCase().endsWith('.pdf')) {
//            fileElement = `<iframe src="${datum.imagenURL}" width="400px" height="400px"></iframe>`;
//        } else {
//            fileElement = `<img src="${datum.imagenURL}" class="d-block w-100 IMP_img-potes" alt="${datum.imagen}" width="400px" height="400px">`;
//        }

//        items.push(`<li data-slide-to="${i}" class="${active}"></li>`);
//        bodies.push(`<div class="carousel-item ${active}">${fileElement}</div>`);
//        filas.push(`
//            <tr>
//                <td><a href="${datum.imagenURL}" download="${datum.imagen}">${datum.imagen}</a></td>
//                <td>${datum.tipo}</td>
//                <td align="center"><a class="btn btn-sm btn-outline-info" target="_blank" href="${datum.imagenURL}"><i class="fas fa-eye"></i></a></td>
//            </tr>`);
//    });

//    MVP_carrusel_items.innerHTML = items.join('');
//    MVP_carrusel_body.innerHTML = bodies.join('');
//    MVPtbody_archivos.innerHTML = filas.join('');
//}
















//function fillCarouselAndTable(data) {
//    let items = [];
//    let bodies = [];
//    let filas = [];

//    data.forEach((datum, i) => {
//        let active = i === 0 ? 'active' : '';

//        items.push(`<li data-slide-to="${i}" class="${active}"></li>`);
//        bodies.push(`
//            <div class="carousel-item ${active}">
//                <img src="${datum.imagenURL}" class="d-block w-100 IMP_img-potes" alt="Otro archivo(pdf,...)" width="400px" height="400px">
//            </div>`);
//        filas.push(`
//            <tr>
//                <td><a href="${datum.imagenURL}" download="${datum.imagen}">${datum.imagen}</a></td>
//                <td>${datum.tipo}</td>
//                <td align="center"><a class="btn btn-sm btn-outline-info" target="_blank" href="${datum.imagenURL}"><i class="fas fa-eye"></i></a></td>
//            </tr>`);
//    });

//    MVP_carrusel_items.innerHTML = items.join('');
//    MVP_carrusel_body.innerHTML = bodies.join('');
//    MVPtbody_archivos.innerHTML = filas.join('');
//}
