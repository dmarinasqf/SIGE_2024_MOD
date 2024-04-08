var hrefanalissproducto = document.getElementById('hrefanalissproducto');

var popupanalisisGENERAL = null;
$('#hrefanalissproducto').click(function () {
    var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto';

    if (popupanalisisGENERAL == null || popupanalisisGENERAL.closed) {     
        popupanalisisGENERAL = window.open(url, "Análisis de producto", 'width=1100,height=600,Titlebar=NO,Toolbar=NO');
        popupanalisisGENERAL.addEventListener('DOMContentLoaded', function () {
            popupanalisisGENERAL.focus();
          
        });
    }
    else 
        popupanalisisGENERAL.focus();
      
});



$(document).ready(function () {
    var isModalActive = false;
    var activeModal = null;
    var contadorCierre = 1; // Inicializa el contador en 1
    var minutosinactivo = 20;
    var tiempoDeInactividad = minutosinactivo*60000; // 20 segundos (ajustado según tus necesidades)

    function clickbutton() {
        contadorCierre++; // Incrementa el contador en 1
        localStorage.setItem('logoutRequested', contadorCierre.toString());
    }

    function updateLastActivity() {
        var timestamp = new Date().getTime();
        localStorage.setItem('lastActivity', timestamp);
    }

    function hasRecentActivity() {
        var lastActivity = localStorage.getItem('lastActivity');
        var currentTimestamp = new Date().getTime();
        var difference = currentTimestamp - (lastActivity || 0);
        return difference < tiempoDeInactividad;
    }

    function handleSessionExpiry() {
        if (isModalActive || hasRecentActivity()) {
            return;
        }

        isModalActive = true;
        $(document).idle('stop');

        activeModal = $.confirm({
            title: 'Alerta de Inactividad!',
            content: 'La sesión está a punto de expirar.',
            autoClose: 'expirar|30000', // Control de la alerta regresiva (20 segundos)
            type: 'red',
            icon: 'fa fa-spinner fa-spin',
            buttons: {
                expirar: {
                    text: 'Cerrar Sesión',
                    btnClass: 'btn-red',
                    action: function () {
                        closeSessionAndNotifyOthers();
                    }
                },
                permanecer: function () {
                    isModalActive = false;
                    $(document).idle('start');
                    localStorage.setItem('closeAllModalsSignal', new Date().getTime().toString());
                    window.location.toString();
                }
            }
        });
    }

    function closeDirectModal() {
        if (activeModal) {
            activeModal.close();
        }
    }

    function closeSessionAndNotifyOthers() {
        contadorCierre++;
        localStorage.setItem('logoutRequested', contadorCierre.toString());
        clickbutton();
        $("#action-button_salir").click();
    }

    // Escuchamos el evento storage para saber si la sesión se cerró en otra pestaña.
    window.addEventListener('storage', function (e) {
        if (e.key === 'closeAllModalsSignal') {
            closeDirectModal();
        }
    });

    window.addEventListener('storage', function (e) {
        if (e.key === 'logoutRequested') {
            // Obtenemos el valor del contador desde el almacenamiento local
            var requestNumber = parseInt(e.newValue, 10);
            if (requestNumber > contadorCierre) {
                // Realiza aquí la acción de cierre de sesión
                // Puedes mostrar un mensaje en la consola o realizar una redirección
                console.log('Cerrando sesión en todas las pestañas...');
                // Simula el clic en el botón de "Cerrar Sesión" en la ventana actual
                $("#action-button_salir").click();
                // Luego, restablece el valor en el almacenamiento local
                localStorage.setItem('logoutRequested', contadorCierre.toString());
            }
        }
    });


    $(document).on('click keyup mousemove', function () {
        updateLastActivity();
    });

    $(document).idle({
        onIdle: function () {
            handleSessionExpiry();
        },
        onActive: function () { },
        onShow: function () {
            setTimeout(function () {
                $('#visibility').toggleClass('idle').html('Visible!');
            }, 250);
        },
        idle: tiempoDeInactividad,
        keepTracking: true
    });

    // Coloca el evento de clic en '#action-button' al final.
    $(document).on('click', '#action-button', function () {
        console.log('action button clicked');
        clickbutton(); // Realiza el seguimiento de cierre al hacer clic en el botón
    });
});












// CODIGO PARA LOS MODALES 
// Asociar el evento de clic al botón para abrir el modal





function abrirModalAutomatico(data) {
    var jsonDataArray = JSON.parse(data);

    // Iterar sobre el array de datos y abrir un modal para cada elemento
    jsonDataArray.forEach(function (jsonData) {
        // Clonar el modal original y asignar un nuevo ID único
        var newModal = $("#idModalParamodalPersonalizados").clone();
        var newModalId = "idModalParamodalPersonalizados_" + Date.now();
        newModal.attr("id", newModalId);

        // Agregar el nuevo modal al cuerpo del documento
        $("body").append(newModal);

        // Configurar el nuevo modal con los datos específicos
        configurarModal(newModalId, jsonData);
    });
}








function configurarModal(modalId, jsonData) {
    // Obtener valores de los controles

    var imagenopdf = jsonData.imagen;
    var extencionpdf = jsonData.nombreimagen;
    var contenido = "";
    var extension = extencionpdf.split('.').pop().toLowerCase(); // Obtener la extensión del archivo

    var tamanio = jsonData.tamanomodal;
    var color = jsonData.colormodal;
    var texto = jsonData.mensajemodal;
    var icono = jsonData.tipomodal;// Obtener el valor del nuevo combo

    // Definir el tamaño y color del modal según las selecciones
    var width, height, colores, iconos, coloresiconos;
    switch (tamanio) {
        case "PEQUEÑO":
            width = 400;
            height = 400;
            break;
        case "MEDIANO":
            width = 600;
            height = 600;
            break;
        case "GRANDE":
            width = 1300;
            height = 800;
            break;
        default:
            width = 400; // Valor predeterminado
            height = 400; // Valor predeterminado
    }
    switch (color) {
        case "ROJO-CLARO":
            colores = "rgb(243, 95, 95)";
            break;
        case "VERDE-CLARO":
            colores = "rgb(74, 249, 61)";
            break;
        case "AZUL-CLARO":
            colores = "rgb(52, 68, 246)";
            break;
        case "MORADO":
            colores = "rgb(226, 36, 233)";
            break;
        case "CELESTE":
            colores = "rgb(88, 194, 244)";
            break;
        case "NEGRO":
            colores = "rgb(0, 0, 0)";
            break;
        case "AMARILLO":
            colores = "rgb(220, 255, 21)";
            break;
        case "BLANCO":
            colores = "rgb(200, 200, 200)"; // Color predeterminado o el color que prefieras
            break;
        default:
            colores = "rgb(200, 200, 200)"; // Color predeterminado o el color que prefieras
    }
    switch (icono) {
        case "INFORMACIÓN":
            iconos = "fa fa-info";
            coloresiconos = "#46b8da";
            break;
        case "ADVERTENCIA":
            iconos = "fa fa-exclamation";
            coloresiconos = "#F8D486";
            break;
        case "ERROR":
            iconos = "fa fa-times";
            coloresiconos = "red";
            break;
        case "ÉXITO":
            iconos = "fa fa-check";
            coloresiconos = "#449d44 ";
            break;
        default:
            iconos = "fa fa-info";
            coloresiconos = "#46b8da";
    }

    // Actualizar el tamaño del modal
    $("#" + modalId + "  .modal-dialog").css({
        "max-width": width + "px",
        "max-height": height + "px"
    });

    var modalHeaderIcon = $("#" + modalId + "  .modal-header i");
    modalHeaderIcon.removeClass().addClass(iconos);
    modalHeaderIcon.css({
        "color": coloresiconos,
        "border-color": coloresiconos // Añadir esta línea para establecer el color del borde
    });

    //$("#idModalParamodalPersonalizados .modal-content").css("background-color", colores);
    //$("#idModalParamodalPersonalizados .modal-dialog").css("background-color", colores);
    $("#" + modalId + " .modal-content-Modal-Per .modal-header").css("background-color", colores);
    $("#" + modalId + " .modal-content-Modal-Per .modal-footer").css("background-color", colores);
    $("#" + modalId + "  .modal-header i").removeClass().addClass(iconos);
    $("#" + modalId + "  .modal-body h2").text(texto);
    $("#" + modalId + "  .modal-body h2").css({
        "font-weight": "bold"
    });



    // Actualizar título del modal
    var tituloHtml = '<h2 class="modal-title" style=" font-weight: bold;">' + texto + '</h2>';

    if (extension === "pdf") {
        // Si es un PDF, mostrar visor de PDF
        contenido = '<div id="pdfViewer" style="width: 100%; height: 600px;"></div>';

        // Obtener datos del PDF en formato base64
        var pdfData = atob(jsonData.imagen);

        // Llamar a la función para mostrar el visor de PDF en el modal
        mostrarVisorPDF(pdfData, "pdfViewer",tamanio);

        // Agregar enlace de descarga para el PDF
        contenido += '<a href="data:application/pdf;base64,' + jsonData.imagen + '" download="' + jsonData.nombreimagen + '">Descargar PDF</a>';
    } else if (extension === "no contiene imagen"){

    }else {
        // Si no es un PDF, asumir que es una imagen y mostrarla
        contenido = ' <h2 class="modal-title">' + texto + '</h2>';
        contenido = '<img src="data:image/png;base64,' + jsonData.imagen + '" alt="Descripción de la imagen" style="max-width: 100%; height: auto;">';

        // Agregar enlace de descarga para la imagen
        contenido += '<a href="data:image/png;base64,' + jsonData.imagen + '" download="' + jsonData.nombreimagen + '">Descargar Imagen</a>';

    }
    // Actualizar contenido del modal con el título encima de la imagen y el enlace de descarga
    contenido = tituloHtml + contenido;

    $("#" + modalId + "  .modal-body").html(contenido);

    // Actualizar el contenido del cuerpo del modal
    $("#" + modalId + "  .modal-body").html(contenido);

    $("#" + modalId + "").modal('show');
}

var tiempodeReposicion = 0;
    function showAlertIfOnDesiredPage() {
        // Obtén la URL de la página actual
        var urlCompleta = window.location.href;

        // Utiliza el objeto URL para obtener la parte específica
        var urlObj = new URL(urlCompleta);
        var ruta = urlObj.pathname;
    
                var obj = {
                    fecha: "12/12/2023",
                    ruta: ruta
                };
                var url = ORIGEN + "/Administrador/Sucursal/ListarModalesActivos";
                var url1 = ORIGEN + "/Administrador/Sucursal/ListarUsuarioActivadoModal";
                 $.post(url, obj).done(function (data) {
                     if (data && JSON.parse(data).length > 0) {
                         var jsonDataArray = JSON.parse(data);
                         var fechayhoraactual = new Date();
                     

             
                         jsonDataArray.forEach(function (jsonData) {

                             var idmodalpersonalizado = jsonData.idmodalpersonalizado;
                          
                             var obj2 = {
                                 idmodalpersonalizado: idmodalpersonalizado
                             };
                             $.post(url1, obj2).done(function (data1) {
                                 var idmodalpersonalizadopara = jsonData.idmodalpersonalizado;
                                 var tiempo = jsonData.cantidadtiempo;
                                 var rangotiempo = jsonData.rangotiempo;
                                 var nuevaFecha = sumarTiempoAFecha(tiempo, rangotiempo);
                                 var fecha1 = nuevaFecha.toLocaleDateString();
                                 var hora1 = nuevaFecha.toLocaleTimeString();
                                 var fechaactualpara = fecha1 + " " + hora1;
                                 if (data1 && JSON.parse(data1).length > 0) {
                                     var jsonDataArraylista = JSON.parse(data1);
                                     jsonDataArraylista.forEach(function (jsonDatalista) {
                                         var idmodalpersonalizadousuario = jsonDatalista.idModalActivadoPorUsuario;
                                         var fechalista = jsonDatalista.ProximaFechaActivacion;
                                         var fechaModal = new Date(fechalista);

                                         if (fechayhoraactual > fechaModal) {

                                             guardarusuarioactivo(idmodalpersonalizadousuario, idmodalpersonalizadopara, fechaactualpara,1);
                                             abrirModalAutomatico(JSON.stringify([jsonData]));
                                     
                                             nuevaFecha = "";
                                         }
                                     });
                     
                                 } else {
                                     guardarusuarioactivo(0, idmodalpersonalizadopara, fechaactualpara, 0);
                                     abrirModalAutomatico(JSON.stringify([jsonData]));
                                   
                                     nuevaFecha = "";
                                 }

                             });
                             
                            

                         });
                     } else {
                         // No hay datos, no hacer nada o realizar otras acciones según sea necesario
                     }
                 }).fail(function (data) {
                    fn(null);
                    mensajeError(data);
                 });
        
        }

        window.addEventListener('load', showAlertIfOnDesiredPage);


function guardarusuarioactivo( idModalActivadoPorUsuario,  idmodalpersonalizado,  fechaactualpara,  tipo) {
    var url = ORIGEN + "/Administrador/Sucursal/GuardarEditarUsuarioActivadoModal";
    var obj = {
        idModalActivadoPorUsuario: idModalActivadoPorUsuario,
        idmodalpersonalizado: idmodalpersonalizado,
        fechaactualpara: fechaactualpara,
        tipo: tipo
    };
    $.post(url, obj).done(function (data) {

    });
}



var estadomodales = false;

function sumarTiempoAFecha( tiempo, rangotiempo) {
    var fecha = "";
     fecha = new Date();
    // Convertir la cantidad de tiempo a milisegundos
    switch (rangotiempo.toLowerCase()) {
        case 'segundos':
            fecha.setSeconds(fecha.getSeconds() + tiempo);
            break;
        case 'minutos':
            fecha.setMinutes(fecha.getMinutes() + tiempo);
            break;
        case 'horas':
            fecha.setHours(fecha.getHours() + tiempo);
            break;
        case 'días':
            fecha.setDate(fecha.getDate() + tiempo);
            break;
        case 'meses':
            fecha.setMonth(fecha.getMonth() + tiempo);
            break;
        case 'anual':
            fecha.setFullYear(fecha.getFullYear() + tiempo);
            break;
        default:
            console.error('Rango de tiempo no válido');
    }

    return fecha;
}

function mostrarVisorPDF(pdfData, viewerId, tamanio) {
    // Cargar el visor de PDF utilizando pdf.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'path/to/pdf.worker.js';

    // Configurar el visor de PDF
    var loadingTask = pdfjsLib.getDocument({ data: pdfData });

    loadingTask.promise.then(function (pdf) {
        // Configurar el contenedor del visor con scroll
        var viewerContainer = document.getElementById(viewerId);
        viewerContainer.style.overflowY = 'auto';

        // Establecer dimensiones según el tamaño especificado
        switch (tamanio) {
            case "PEQUEÑO":
                viewerContainer.style.maxWidth = '400px';
                viewerContainer.style.maxHeight = '400px';
                break;
            case "MEDIANO":
                viewerContainer.style.maxWidth = '600px';
                viewerContainer.style.maxHeight = '600px';
                break;
            case "GRANDE":
                viewerContainer.style.maxWidth = '1300px';
                viewerContainer.style.maxHeight = '600px';
                break;
            default:
                viewerContainer.style.maxWidth = '400px'; // Valor predeterminado
                viewerContainer.style.maxHeight = '400px'; // Valor predeterminado
        }

        // Recorrer las páginas del PDF y renderizarlas en el visor
        for (var pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            pdf.getPage(pageNumber).then(function (page) {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var viewport = page.getViewport({ scale: viewerContainer.clientWidth / page.getViewport({ scale: 1 }).width });

                // Establecer el tamaño del lienzo según las dimensiones de la página
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Renderizar la página en el lienzo
                page.render({ canvasContext: context, viewport: viewport });

                // Agregar el lienzo al contenedor del visor
                viewerContainer.appendChild(canvas);
            });
        }
    });
}



//  FIN CODIGO MODALES 