
var APPSYSTEM = 'SERVIDOR';
var URLIMPRECION = location.origin.toString() + "/Impresiones/";
var APPREPORTE = '/archivos/reportes';
var ORIGEN = location.origin.toString();
var URLAUDIO = location.origin.toString() + "/archivos/audio/notificacion/";

var FECHAINICIO = "";
var FECHAFIN = "";



$(window).on('load', function () {

    if (window.opener) {
        setTimeout(function () {
            $(".loader-page").css({ visibility: "hidden", opacity: "0" })
        }, 2000);      
    } else {
        $('#loader').removeClass('loader-page');
    }

});
$(document).ready(function () {
    initSite();
    var url = location.pathname;
    url = url.split('?');
    //console.log(url[0]);
    //console.log($('a.itemmenu[href="' + url[0] + '"] ').parent().parent().parent()[0]);  
    //primer nivel
    try {
        $('a.nav-link[href="' + url[0] + '"] ').parent().addClass('active');
        $('a.nav-link[href="' + url[0] + '"] ').parent().parent().parent()[0].classList.add('show');
        $('a.nav-link[href="' + url[0] + '"] ').parent().parent().parent().parent().addClass('active open');
        //ultimo nivel   
        $('a.nav-link[href="' + url[0] + '"] ').parent().parent().parent().parent().parent().parent().addClass('show');
        $('a.nav-link[href="' + url[0] + '"] ').parent().parent().parent().parent().parent().parent().parent().addClass('active open');
    } catch (e) {

    }
    //_fnDateRangePickerLoad();
    initFechaRango('txtfecharango');
    $('[data-toggle="tooltip"]').tooltip();
});
function initSite() {
    try {
        
            $('.modal-header').addClass('color-modal-header');
            $('.modal-footer').addClass('color-modal-footer');
        $('.nocolor').removeClass('color-modal-header');
      
    } catch (e) {

    }
   
}

$(document).keydown(function (e) {
    var tecla = e.key;
    if (tecla === 'F12') {
        e.preventDefault();
        $('#sidebarCollapse').click();
    }
    if (tecla == 'Enter')
        e.preventDefault();
});
function initFechaRango(input) {
    try {
        $('input[id="' + input + '"]').daterangepicker({
            showDropdowns: true,
            minYear: 2019,
            maxYear: parseInt(moment().format('YYYY'), 10) + 1,
            autoUpdateInput: false,
            "alwaysShowCalendars": true,
            "showCustomRangeLabel": false,
            locale: {
                cancelLabel: 'Limpiar'
            },
            ranges: {
                'Hoy': [moment(), moment()],
                'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                'Este mes': [moment().startOf('month'), moment().endOf('month')],
                'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        });
    } catch (e) {

    }
    
 
}
function BOTONESDATATABLE(titulo, orientacion, colvis) {
    if (orientacion.toUpperCase() === 'V')
        orientacion = 'portrait';
    if (orientacion.toUpperCase() === 'H')
        orientacion = 'landscape';
    var ocultar;
    if (colvis)
        ocultar = {
            "extend": "colvis",
            "text": "<i class='far fa-eye text-125 text-dark-m2'></i> <span class='d-none'>Mostar/Ocultar columns</span>",
            "className": "btn-light-default btn-bgc-white btn-h-outline-primary btn-a-outline-primary",
            columns: ':not(:first)'
        };
    return [           
        {
            "extend": "copy",
            "text": "<i class='far fa-copy text-125 text-purple'></i> <span class='d-none'>Copiar</span>",
            "className": "btn-light-default btn-bgc-white btn-h-outline-primary btn-a-outline-primary"
        },
        , {
            "extend": "csv",
            "text": "<i class='fa fa-database text-125 text-success-m1'></i> <span class='d-none'>Export to CSV</span>",
            "className": "btn-light-default btn-bgc-white btn-h-outline-primary btn-a-outline-primary"
        },
        {
            extend: 'excelHtml5',
            "text": "<i class='fa fa-file-excel text-125 text-success-m1'></i> <span class='d-none'>Export to excel</span>",
            "className": "btn-light-default btn-bgc-white btn-h-outline-primary btn-a-outline-primary",
            exportOptions: {
                columns: ':visible'
            },
        },
        {
            extend: 'pdfHtml5',
            title: titulo,
            "text": "<i class='fa fa-file-pdf text-125 text-danger'></i> <span class='d-none'>PDF</span>",
            "className": "btn-light-default btn-bgc-white btn-h-outline-primary btn-a-outline-primary",
            //download: 'open',
            orientation: orientacion,
            exportOptions: {
                columns: ':visible'
            },
            //className: 'btn btn-sm btn-secondary ',                
            customize: function (doc) {
                doc.defaultStyle.fontSize = 8;
                doc.styles.tableHeader = {
                    fillColor: '#525659',
                    color: '#FFF',
                    fontSize: '8',
                    alignment: 'left',
                    bold: true,
                    width: '100%'

                };
            }
        },
        {
            "extend": "print",
            "text": "<i class='fa fa-print text-125 text-orange-d1'></i> <span class='d-none'>Imprimir</span>",
            "className": "btn-light-default btn-bgc-white  btn-h-outline-primary btn-a-outline-primary",
            customize: function (win) {
                $(win.document.body)
                    .css('font-size', '9pt');

                $(win.document.body).find('table')
                    .addClass('compact')
                    .css('font-size', 'inherit').css('width', '100%');
            }
        },
        ocultar
    ];
}
function LENGUAJEDATATABLE() {
    return {
        search: '<i class="fa fa-search pos-abs mt-2 pt-3px ml-25 text-blue-m2"></i>',
        searchPlaceholder: " Buscar registros",
        "sSearch": "",
        "lengthMenu": "Mostrar _MENU_ entradas",
        "zeroRecords": "No hay registros",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        "infoEmpty": "No hay información",
        "infoFiltered": "(filtered from _MAX_ total records)",       
        "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Anterior"
        },

    };
}

$('#maximiseCollapse').click(function () {

    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        }
        else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        }
        else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) { document.cancelFullScreen(); }
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
        else if (document.webkitCancelFullScreen) { document.webkitCancelFullScreen(); }
    }

});
$('.addtooltip').tooltip();
//$('.mayusculas').keyup(function (e) {
//    this.classList.add('text-uppercase');
//});
function fnmayusculas(e) {
    e.value = e.value.toUpperCase();
}

//NOTIFICACIONES
function mensaje(tipo, mensaje, position, delay, sound) {    
    if (delay === null || delay === undefined || delay === '' )
        delay = 3000;
    if (position === null || position === undefined || position === '' )
        position = 'tr';
    position = position.toLowerCase();

    var sonido = new UtilsSisqf();
    if (sound)
        sonido.Sonar(tipo);

    if (tipo === "S") {
        $.aceToaster.add({
            placement: position,
            body: "<div class='d-flex'>\
                    <div class='bg-success text-white px-3 pt-3'>\
                        <div class='border-2 brc-white px-3 py-25 radius-round'>\
                            <i class='fa fa-check text-150'></i>\
                        </div>\
                    </div>\
                    <div class='p-3 mb-0 flex-grow-1'>\
                        <h4 class='text-130'>Operación completada</h4>\
                        "+mensaje+"\
                    </div>\
                    <button data-dismiss='toast' class='align-self-start btn btn-xs btn-outline-grey btn-h-light-grey py-2px mr-1 mt-1 border-0 text-150'>&times;</button></div>\
                   </div>",
                
            width: 420,
            delay: delay,
            close: true,
            zIndex:'99999',
            className: 'bgc-white-tp1 shadow border-0',
            bodyClass: 'border-0 p-0 text-dark-tp2',
            headerClass: 'd-none',
        });              
    } else if (tipo === "W") {
        $.aceToaster.add({
            placement: position,
            body: "<div class='d-flex'>\
                    <div class='bg-warning text-white px-3 pt-3'>\
                        <div class='border-2 brc-white px-3 py-25 radius-round'>\
                            <i class='fa fa-exclamation-triangle text-150'></i>\
                        </div>\
                    </div>\
                    <div class='p-3 mb-0 flex-grow-1'>\
                        <h4 class='text-130'>Advertencia</h4>\
                        "+mensaje+"\
                    </div>\
                    <button data-dismiss='toast' class='align-self-start btn btn-xs btn-outline-grey btn-h-light-grey py-2px mr-1 mt-1 border-0 text-150'>&times;</button></div>\
                   </div>",
                
            width: 420,
            delay: delay,
            close: true,
            className: 'bgc-white-tp1 shadow border-0',
            bodyClass: 'border-0 p-0 text-dark-tp2',
            headerClass: 'd-none',
        });              
    } else if (tipo === "D") {
         $.aceToaster.add({
            placement: position,
            body: "<div class='d-flex'>\
                    <div class='bg-danger text-white px-3 pt-3'>\
                        <div class='border-2 brc-white px-3 py-25 radius-round'>\
                            <i class='fas fa-exclamation-triangle text-150'></i>\
                        </div>\
                    </div>\
                    <div class='p-3 mb-0 flex-grow-1'>\
                        <h4 class='text-130'>Error</h4>\
                        "+mensaje+"\
                    </div>\
                    <button data-dismiss='toast' class='align-self-start btn btn-xs btn-outline-grey btn-h-light-grey py-2px mr-1 mt-1 border-0 text-150'>&times;</button></div>\
                   </div>",
                
            width: 420,
            delay: delay,
            close: true,
            className: 'bgc-white-tp1 shadow border-0',
            bodyClass: 'border-0 p-0 text-dark-tp2',
            headerClass: 'd-none',
        });               
       
    }
    else if (tipo === "I") {
         $.aceToaster.add({
            placement: position,
            body: "<div class='d-flex'>\
                    <div class='bg-info text-white px-3 pt-3'>\
                        <div class='border-2 brc-white px-3 py-25 radius-round'>\
                            <i class='fas fa-info text-150'></i>\
                        </div>\
                    </div>\
                    <div class='p-3 mb-0 flex-grow-1'>\
                        <h4 class='text-130'>Información</h4>\
                        "+mensaje+"\
                    </div>\
                    <button data-dismiss='toast' class='align-self-start btn btn-xs btn-outline-grey btn-h-light-grey py-2px mr-1 mt-1 border-0 text-150'>&times;</button></div>\
                   </div>",
                
            width: 420,
            delay: delay,
            close: true,
            className: 'bgc-white-tp1 shadow border-0',
            bodyClass: 'border-0 p-0 text-dark-tp2',
            headerClass: 'd-none',
        });    
       
    }

}
function mensajeError(e) {
    console.log(e);
    if (e.status === 400)
        mensaje("D", "El servidor web no puede procesar tu petición (Bad Request)");
    else if (e.status === 401)
        mensaje("D", "No tiene permiso para realizar esta operación (Authorization Required)");
    else if (e.status === 403)
        mensaje("D", "No se permite la operación (Forbidden)");
    else if (e.status === 404)
        mensaje("D", "No se encontro la operación (Not found)");
    else if (e.status === 500)
        mensaje("D", "Error en el servidor (500)");
    else
        mensaje("D", "Error desconocido");
}

function mensajeModificarEstado(titulo,fn,data) {
    swal({
        title: titulo,
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            fn(data);
        }
        else
            swal.close();
    });
}

function justNumbers(e) {
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum === 8) || (keynum === 46))
        return true;

    return /\d/.test(String.fromCharCode(keynum));
}
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
        return false;

    return true;
}
function isLetrasKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 44 || charCode == 46 || charCode == 241 || charCode == 209)
    /*
     || charCode == 225 || charCode == 233
        || charCode == 237 || charCode == 243
        || charCode == 250
        || charCode == 193 || charCode == 201
        || charCode == 205 || charCode == 211
        || charCode == 218
        */
    {
        return true;
    }

    return false;
}
//**********************************************
function agregartabla(valor1, valor2) {
    return `<div class="text-center" style="width:100%">
            <div style="border-bottom:1px solid rgba(13, 13, 13, 0.5)">
                <span> `+ valor1 + `  </span>
            </div>
             <div>
                <span> `+ valor2 + ` </span>
            </div>  </div>`;
}
function primervalortablaendetalle(data, posicion) {
    var respuesta = data.split('<span>');
    if (respuesta.length === 1)
        return respuesta[0];
    if (posicion === 1)
        return (respuesta[posicion].split('</span>')[0]);
    if (posicion === 2)
        return (respuesta[posicion].split('</span>')[0]);
}
//**********************************************
function mensajePermanente(tipo, mensaje) {
    if (tipo === "S") {
        $.notify({
            // options
            icon: 'fas fa-check',
            title: 'Operacion completada',
            message: mensaje,
            target: '_blank'
        }, {
            // settings
            type: 'success',
            z_index: 99999,
            delay: 216000
        });
    } else if (tipo === "W") {
        $.notify({
            // options
            icon: 'fas fa-exclamation-triangle',
            title: 'Advertencia',
            message: mensaje

        }, {
            // settings
            type: 'warning',
            z_index: 99999,
            delay: 216000
        });
    } else if (tipo === "D") {
        $.notify({
            // options
            icon: 'flaticon-alarm-1',
            title: 'Error',
            message: mensaje,
            target: '_blank'
        }, { 
            // settings
            type: 'danger',
            z_index: 99999,
            delay: 216000
        }); 
    }
    else if (tipo === "I") {
        $.notify({
            // options
            icon: 'fas fa-exclamation',
            title: 'Información',
            message: mensaje,
            target: '_blank'
        }, {
            // settings
            type: 'info',
            z_index: 99999,
            delay: 216000
        });
    }

}

function alertaSwall(tipo, mensaje1, mensaje2) {
    var btn = '';
    var icon = '';
    if (tipo === 'I') { btn = icon = 'info'; }
    if (tipo === 'S') { btn = icon = 'success'; }
    if (tipo === 'D') { btn = 'danger'; icon = 'error'; }
    if (tipo === 'W') { btn = 'warning'; icon = 'warning'; }
    swal(mensaje1, mensaje2, {
        icon: icon,        
        buttons: {
            confirm: {
                className: 'btn btn-success'
            }
        }
    });
}
function mensajeConfirmacion(tipo, information, fnAcepta,fnCancela) {
    var btnvisible = '';
    var icon = '';
    if (tipo === 'S') { btn = icon = 'success'; btnvisible = false; }
    if (tipo === 'D') { btn = 'danger'; icon = 'error'; btnvisible = false; }
    if (tipo === 'W') { btn = 'warning'; icon = 'warning'; btnvisible = false; }
    if (tipo === 'Q') { btn = 'primary'; icon = 'primary'; }//Question
    swal(information, "", {
        icon: icon,
        buttons: {
            confirm: {
                text: 'ACEPTAR',
                className: 'btn btn-success'
            },
            cancel: {
                visible: btnvisible,
                text: 'CANCELAR',
                className: 'btn btn-danger'
            }
        }
    }).then((confirmar) => {
        if (confirmar) {
            if (fnAcepta != null && fnAcepta != '')
             fnAcepta();
        } else {
            if (fnCancela != null && fnCancela != '')
            fnCancela();
            swal.close();
        }
    }); 
}



function verificarnulos(data) {
    if (data === null)
        return ' ';
    else
        return data;
}
$('#modalregistro').on('hidden.bs.modal', function (e) {
    try {
        limpiar();

    } catch (e) {

    }
});
//PARA GENERAR LAS TABLAS DE UN DATATABLE 

function crearCuerpo(datos, tablename, numfilas) {
    var fila = "";
    //var cabeceras = GetHeaders(datos);

    for (var i = 0; i < datos.length; i++) {
        fila += '<tr>';
        var valores = GetValores(datos[i]);
        if (numfilas == undefined || numfilas == null)
            numfilas = valores.length;
        for (var j = 0; j < numfilas; j++) {
            if (valores[j] == null) valores[j] = '';       
            fila += "<td>" + valores[j] + "</td>";
        }
        fila += '</tr>';
    }
    $(tablename + " tbody").append(fila);
}
function crearCabeceras(datos, tablename, sticky,numfilas) {
    var stick = '';
    if (sticky)
        stick = 'class="header-sticky"';
    var cabeceras = GetHeaders(datos);    
    var nuevaFila = "<tr>";
    if (numfilas == undefined || numfilas == null)
        numfilas = cabeceras.length;
    for (var i = 0; i < numfilas; i++) {
        nuevaFila += "<th " + stick + ">" + cabeceras[i] + "</th>";
    }
    nuevaFila += "</tr>"; 
    $(tablename + ' thead').append(nuevaFila);
    $(tablename + ' thead').addClass('thead-dark');
}

function GetHeaders(obj) {
    var cols = new Array();
    var p = obj[0];
    for (var key in p) {
        cols.push(key);
    }
    return cols;
}
function GetValores(obj) {
    var cols = new Array();
    for (var key in obj) {
        cols.push(obj[key]);
    }
    return cols;
}
function limpiarTablasGeneradas(contenedortable, tablename, sticky,classthead) {
    $(contenedortable).empty();
    var tablasticky = '';
    if (sticky)
        tablasticky = 'tabla-sticky';
    classthead = classthead ?? 'border-0 bgc-white bgc-h-yellow-l3 shadow-sm';
    var tabla = `<table class="table table-sm table-bordered table-hover ` + tablasticky + ` " id="` + tablename + `" style="width:100%">
        <thead class="  `+ classthead + `" >          
        </thead >
        <tbody class="">
        </tbody>`;
    $(contenedortable).append(tabla);
}

function restarfechas(fecha1actual, fecha2) {

    fecha1 = fecha1actual;
    fecha2 = fecha2;
    var añoactual = moment(fecha1).format('YYYY');
    var mesactual = moment(fecha1).format('MM');
    var diaactual = moment(fecha1).format('DD');

    var año2 = moment(fecha2).format('YYYY');
    var mes2 = moment(fecha2).format('MM');
    var dia2 = moment(fecha2).format('DD');

    var num1 = parseInt(añoactual) * 365 + parseInt(mesactual) * 30 + parseInt(diaactual);
    var num2 = parseInt(año2) * 365 + parseInt(mes2) * 30 + parseInt(dia2);

    var resultado = num2 - num1;
    //console.log(resultado);

    var añores = 0;
    var mesres = 0;
    var diares = 0;
    var diferencia = 0;
    if (resultado > 365) {
        añores = resultado / 365;
        resultado = resultado % 365;
    }
    mesres = resultado / 30;
    resultado = resultado % 30;
    diares = resultado;

    var response = "";
    añores = parseInt(añores);
    mesres = parseInt(mesres);
    diares = parseInt(diares);
    if (añores < 0 || mesres < 0 || diares < 0)
        return 'Ha vencido';
    if (añores === 0)
        response += "";
    else if (añores === 1)
        response += añores + " año ";
    else if (añores > 1)
        response += añores + " años ";
    if (mesres === 0)
        response += "";
    else if (mesres === 1)
        response += mesres + " mes ";
    else
        response += mesres + " meses ";
    if (diares === 1)
        response += diares + " dia ";
    else
        response += diares + " dias.";
    console.log(response);
    return response;


}
//para evitar que se envien los datos del formulario al hacer enter
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input').forEach(node => node.addEventListener('keypress', e => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }));
    //document.querySelectorAll('input[type=date]').forEach(node => node.addEventListener('keypress', e => {
    //    if (e.keyCode === 13) {
    //        e.preventDefault();
    //    }
    //}));
    //document.querySelectorAll('input[type=checkbox]').forEach(node => node.addEventListener('keypress', e => {

    //    if (e.keyCode === 13) {
    //        e.preventDefault();
    //    }
    //}));
    //document.querySelectorAll('input[type=number]').forEach(node => node.addEventListener('keypress', e => {
    //    if (e.keyCode === 13) {
    //        e.preventDefault();
    //    }
    //}));
    //document.querySelectorAll('input[type=number]').forEach(node => node.addEventListener('keydown', e => {
    //    if (e.keyCode === 13) {
    //        e.preventDefault();
    //    }
    //}));
    //document.querySelectorAll('input[type=number]').forEach(node => node.addEventListener('keyup', e => {
    //    if (e.keyCode === 13) {
    //        e.preventDefault();
    //    }
    //}));
});

$(".modal").draggable({
    handle: ".modal-header"
});

$("#txtfiltrotabladetalle").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    //console.log(value);
    $("#tbllista tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});
$('#tbllista tbody').on('click', 'tr', function () {
    if (this.getAttribute('role') != 'row')
        return;
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
//$(function () {
//    for (var i = window.location, o = $(".ml-menu a").filter(function () {
//        return this.href == i;
//    }).addClass("active").parent().addClass("active"); ;) {
//        if (!o.is("li")) break;
//        o = o.parent().addClass("in").parent().addClass("active");
//    }
//})

function FN_GETDATOHTML(html, classname) {
    try {
        var aux = document.createElement('div');
        aux.innerHTML = html; 
        var valor = aux.getElementsByClassName(classname)[0].innerHTML;
        return valor === "null" ? null : valor;
    } catch (e) {
        return '';
    }

}


function GETMENSAJECARGA(mensaje) {
    return `  <div class="row "  >
        <div class="col-xl-12 col-sm-12 text-center">
            <div class="spinner-border" role="status">
              
            </div>
            <label>`+ mensaje + `</label>
        </div>
    </div>`;
}
function BLOQUEARCONTENIDO(contenedor, mensaje) {
    $('#' + contenedor).block({
        message: GETMENSAJECARGA(mensaje)

    });
}
function DESBLOQUEARCONTENIDO(contenedor) {
    $('#' + contenedor).unblock();
}

function VerificarSiEs0(data) {
    if (data === 0 || data === '0')
        return '';
    else
        return data;
}

function CONVERT_FORM_TO_JSON(obj) {
    var data = {};
    $(obj).each(function (index, obj) {
        data[obj.name] = obj.value;
    });
    return (data);
}
function REDONDEAR_DECIMALES(num, numdecimales) {
    if (numdecimales === null || isNaN(numdecimales) || numdecimales === 0)
        numdecimales = 2;
    return +(Math.round(num + "e+" + numdecimales) + "e-" + numdecimales);
}
function REDONDEO_SIN_INCREMENTO(num,numdecimalredo,numdecimales) {
    var auxredondeoarray = '0.00'; //parseFloat(num).toFixed(numdecimales).split('.');
    return parseFloat(auxredondeoarray[0] + "." + auxredondeoarray[1].substr(0, numdecimalredo)).toFixed(numdecimales);
}
function LLENAR_COMBO(array, idcmb, defaultt) {
    var cmb = document.getElementById(idcmb);
    var option = document.createElement('option');
    option.value = '';
    option.text = defaultt;
    option.selected = true;
    cmb.appendChild(option);
    for (var i = 0; i < array.length; i++) {
        option = document.createElement('option');
        option.value = array[i];
        option.text = array[i];
        cmb.appendChild(option);
    }
}
function MANEJAR_TABLA(tabla) {
    var event = window.event;
    var rows = document.getElementById(tabla).getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;
    $("#" + tabla + " tbody tr").removeClass('selected');
    if (event.keyCode == 40) { //down
        var idx = $("#" + tabla + " tbody tr:focus").attr("tabindex");
        idx++;
        if (idx > rows) {
            idx = 0;
        }
        $("#" + tabla + " tbody tr[tabindex=" + idx + "]").focus();
    }
    if (event.keyCode == 38) { //up
        var idx = $("#" + tabla + " tbody tr:focus").attr("tabindex");
        idx--;
        if (idx < 0) {
            idx = rows;
        }
        $("#" + tabla + " tbody tr[tabindex=" + idx + "]").focus();
    }
    $("#" + tabla + " tbody tr[tabindex=" + idx + "]").addClass('selected');
}
function REMOVER_SELECT_TABLE(filas) {
    filas.forEach(function (e) {
        if (e.classList.contains('selected'))
            e.classList.remove('selected');
    });
}
$(document).on('click', 'input[type=number]', function () {
    $(this).select();
});
$(document).on('click', '.editable-number', function () {

    $(this).focus().select();
});

$(document).on('keypress', '.editable-number', function () {
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum === 8) || (keynum === 46))
        return true;
    return /\d/.test(String.fromCharCode(keynum));

});

(function () {
    var actualizarHora = function () {       
        var fecha = new Date(),
            horas = fecha.getHours(),
            ampm,
            minutos = fecha.getMinutes(),
            segundos = fecha.getSeconds() ;
        if (horas >= 12) {
            horas = horas - 12;
            ampm = 'PM';
        } else {
            ampm = 'AM';
        }
        if (horas == 0) {
            horas = 12;
        }
        // Minutos y Segundos
        if (minutos < 10) { minutos = "0" + minutos; }
        if (segundos < 10) { segundos = "0" + segundos; }
        var horaactual = horas + ":" + minutos + ":" + segundos + ampm;
        $('.horaactual').text( moment().format('DD/MM/YYYY')+" "+horaactual);
    };

    actualizarHora();
    var intervalo = setInterval(actualizarHora, 1000);
}())


$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function () {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});

$(document).on('click', '.inputselection', function () {
    $(this).select();
});
$('input[type=checkbox]').click(function () {
    if (this.checked)
        this.value = true;
    else
        this.value = false;
});
function _fnocultarbarra() {

        $('#sidebar').addClass('ocultar');
        $('#navbar').addClass('ocultar');
        $('#footer').addClass('ocultar');
    $('#footer').removeClass('d-sm-block');

   
}

//FECHAS
$('input[id="txtfecharango"]').on('apply.daterangepicker', function (ev, picker) {
  
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    FECHAINICIO = picker.startDate.format('DD/MM/YYYY');
    FECHAFIN = picker.endDate.format('DD/MM/YYYY');
});

$('input[id="txtfecharango"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
    FECHAINICIO = "";
    FECHAFIN = "";
});

function _fnDateRangePickerLoad(){
    $('input[id="txtfecharango"]').daterangepicker({
        showDropdowns: true,
        minYear: 2020,
        maxYear: parseInt(moment().format('YYYY'), 10) + 1,
        autoUpdateInput: false,
        "alwaysShowCalendars": true,
        "showCustomRangeLabel": false,
        locale: {
            cancelLabel: 'Limpiar'
        },
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });
}
   

$(document).on('dblclick', 'img', function (e) {
    getFullscreen(this);
});
function getFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}