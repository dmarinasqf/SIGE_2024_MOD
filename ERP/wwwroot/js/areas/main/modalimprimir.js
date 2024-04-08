var frameimprecion = $('#frameimprecion');
var loadingimpresion = $('#loadingimpresion');
var lblnombreimprecion = $('#lblnombreimprecion');
var contadorimpresion = 0;
function ABRIR_MODALIMPRECION(ruta, nombre) {
    frameimprecion.addClass('ocultar');
    loadingimpresion.removeClass('ocultar');
    $('#modalimprimir').modal('show');
    //frameimprecion.addClass('mostrar');
    frameimprecion.empty();
    lblnombreimprecion.text(nombre);
    frameimprecion.attr('src', ruta);
    setTimeout(function () {
        loadingimpresion.addClass('ocultar');
        frameimprecion.removeClass('ocultar');
    }, 2000);
    //if (contadorimpresion === 0) {      
    //    setTimeout(function () {
    //        frameimprecion.empty();
    //        frameimprecion.attr('src', ruta);

    //    }, 2000);

    //}
    contadorimpresion++;
}
function CERRAR_MODALIMPRECION() {
    $('#modalimprimir').modal('hide');
}
function IMPRIMIR_PDF() {
    document.getElementById("frameimprecion").contentWindow.print();
}

$('#modalimprimir').on('hidden.bs.modal', function (e) {
    //lblnombreimprecion.addClass('ocultar');
});
function GENERAR_PDF() {
    window.parent.frames[0].generarPDF();
}

//var win = window.open('https://localhost:44307/Ventas/Venta/ImprimirTicket?idventa=46', 'PrintWindow');
//setTimeout(function () {
//    win.document.close();
//    win.focus();
//    win.print();
//    win.close();
//}, 1000);