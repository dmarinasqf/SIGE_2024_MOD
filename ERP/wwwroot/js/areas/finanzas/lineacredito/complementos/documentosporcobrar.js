var DCcheckpagado = document.getElementById('DCcheckpagado');
var DCtbodydocumentos = document.getElementById('DCtbodydocumentos');
var DCbtnconsultar = document.getElementById('DCbtnconsultar');
var DCbtnexportar = document.getElementById('DCbtnexportar');
var DCbtnguardarpagos = document.getElementById('DCbtnguardarpagos');
var DCtotalmontopagado = document.getElementById('DCtotalmontopagado');
var DCtxtfechainicio = document.getElementById('DCtxtfechainicio');
var DCtxtfechafin = document.getElementById('DCtxtfechafin');


var documentosporcobrartab = document.getElementById('documentosporcobrar-tab');
function DCfnlistardocumentoporcobrar(numpagina) {
    var obj = {
        idcliente: txtidcliente.value,
        pagado: DCcheckpagado.value,
        fechainicio: DCtxtfechainicio.value,
        fechafin: DCtxtfechafin.value,
        pagine: {
            numpagina: numpagina,
            tamanopagina: 25,
        }
    };
    var controller = new LineaCreditoController();
    controller.ListarDocumentosPorCobrar(obj, function (response) {
        var fila = '';
        var total = 0;
        DCtbodydocumentos.innerHTML = '';
        DCtotalmontopagado.innerText = '';
        console.log(response);
        var data = response.data;
        if (data != null) {
           
            for (var i = 0; i < data.length; i++) {
                var inputpagado = '<input type="checkbox" class="DCcheckpagar"/>';
                if (data[i].ispagado) {
                    inputpagado = '';
                }
                fila += '<tr id=' + data[i].idcobro + '>';
                fila += '<td></td>';
                fila += '<td>' + moment(data[i].fecha).format('DD/MM/YYYY hh:mm') + '</td>';
                fila += '<td>' + data[i].serie + '</td>';
                fila += '<td>' + data[i].numdocumento + '</td>';
                fila += '<td>' + data[i].moneda + '</td>';
                fila += '<td class="text-right">' + data[i].total.toFixed(2) + '</td>';
                fila += '<td class="text-right">' + data[i].totaligv.toFixed(2) + '</td>';
                fila += '<td class="text-right">' + data[i].subtotal.toFixed(2) + '</td>';
                fila += '<td class="text-right text-success font-weight-bold montopagado">' + data[i].montopagado.toFixed(2) + '</td>';
                fila += '<td>' + data[i].estado + '</td>';
                fila += '<td>' + data[i].usuario + '</td>';
                fila += '<td>' + (data[i].ispagado ? '✓' : '') + '</td>';
                fila += '<td class="text-center">' + inputpagado + '</td>';
                fila += '</tr>';
                total += data[i].montopagado;
            }
            DCtbodydocumentos.innerHTML = fila;
            DCtotalmontopagado.innerText = total.toFixed(2);
            var pagine = new UtilsSisqf();
            pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'DClinkpagedoccobrar', 'DCpaginacion');
        }
    });
}
documentosporcobrartab.addEventListener('click', function () {
    if (txtidcliente.value != '') {
        DCfnlistardocumentoporcobrar();
    } else
        mensaje('W', 'Seleccione un cliente');
});
DCbtnconsultar.addEventListener('click', function () {
    if (txtidcliente.value != '') {
        DCfnlistardocumentoporcobrar();
    } else
        mensaje('W', 'Seleccione un cliente');
});
DCbtnexportar.addEventListener('click', function () {
    if (txtidcliente.value != '') {
        var obj = {
            idcliente: txtidcliente.value,
            pagado: DCcheckpagado.value,
            fechainicio: DCtxtfechainicio.value,
            fechafin: DCtxtfechafin.value
        };
        var controller = new LineaCreditoController();
        controller.GenerarExcelDocCobrar(obj);
    } else
        mensaje('W', 'Seleccione un cliente');
});
$('#DCtbodydocumentos').on('click', 'tr', function () {

    var filas = document.querySelectorAll('#DCtbodydocumentos tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    $(this).addClass('selected');
});
DCbtnguardarpagos.addEventListener('click', function () {
    if (DCfngetdocumentospagados() == 0)
        return;
    swal({
        title: '¿Desea guardar los datos?',
        text: 'Se realizara el pagó de ' + DCtotalapagar.innerText,
        icon: 'info',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            var obj = {
                ids: DCfngetdocumentospagados()
            };
            var controller = new LineaCreditoController();
            controller.RegistrarPagosDocumentos(obj, function (data) {
                mensaje('S', 'Datos guardados');
                DCbtnconsultar.click();
            });
        }
        else
            swal.close();
    });


});
$(document).on('click', '.DCcheckpagar', function () {
    DCfncalculartotalseleccionados()
});
function DCfngetdocumentospagados() {
    var array = [];
    var obj = new Object();
    var filas = document.querySelectorAll('#DCtbodydocumentos tr');
    filas.forEach(function (e) {
        if (e.getElementsByClassName('DCcheckpagar').length > 0)
            if (e.getElementsByClassName('DCcheckpagar')[0].checked) {
                array.push(e.getAttribute('id'));
            }
    });
    return array;
}
function DCfncalculartotalseleccionados() {
    var total = 0;
    var filas = document.querySelectorAll('#DCtbodydocumentos tr');
    filas.forEach(function (e) {
        if (e.getElementsByClassName('DCcheckpagar').length > 0)
            if (e.getElementsByClassName('DCcheckpagar')[0].checked) {
                total += parseFloat(e.getElementsByClassName('montopagado')[0].innerText);
            }
    });
    DCtotalapagar.innerText = total.toFixed(2);
}



$(document).on('click', '.DClinkpagedoccobrar', function () {
    var numpagina = this.getAttribute('numpagina');
    DCfnlistardocumentoporcobrar(numpagina);
    var pages = document.getElementsByClassName('pagelink');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});