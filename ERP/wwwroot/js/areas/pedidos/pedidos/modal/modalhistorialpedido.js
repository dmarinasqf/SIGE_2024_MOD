var MHPlblnombre_cli_pac = document.getElementById('MHPlblnombre_cli_pac');
var MHPlbltipo = document.getElementById('MHPlbltipo');
var MHPbtnbuscar = document.getElementById('MHPbtnbuscar');
var MHPtbdata = document.getElementById('MHPtbdata');
var MHPtbody = document.getElementById('MHPtbody');
var MHPtxtrango = document.getElementById('MHPtxtrango');
var MHPtxtidpaccli = document.getElementById('MHPtxtidpaccli');


var MHPfechainicio, MHPfechafin;

$(document).ready(function () {
    initFechaRango('MHPtxtrango');
});

MHPbtnbuscar.addEventListener('click', function () {
    fnMHPllenartabla(10, 1);
});
//FECHAS
$('input[id="MHPtxtrango"]').on('apply.daterangepicker', function (ev, picker) {

    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    MHPfechainicio = picker.startDate.format('DD/MM/YYYY');
    MHPfechafin = picker.endDate.format('DD/MM/YYYY');
});

$('input[id="MHPtxtrango"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
    MHPfechainicio = "";
    MHPfechafin = "";
});
function fnMHPlistarhistorial() {
    fnMHPllenartabla(10, 1);
}
function fnMHPllenartabla(tammano,numpagina) {
    let controller = new PedidoController();
    var obj = {
        pagine: {
            tamanopagina: tammano ?? 10,
            numpagina: numpagina ?? 1
        },
        fechainicio: MHPfechainicio,
        fechafin: MHPfechafin,
        tipo: MHPlbltipo.innerText.trim(),
        id:MHPtxtidpaccli.value
      
    };
    controller.HistorialPedidoPacCli(obj, (response) => {
        var data = response.data;
      
        var fila = '';
        for (var i = 0; i <data.length; i++) {
            fila += '<tr idpedido='+data[i].idpedido+'>';
            fila += '<td class="details-control" ></td>';
            fila += '<td>' + data[i].codigopedido+'</td>';
            fila += '<td>' + data[i].sucursal+'</td>';
            fila += '<td>' + data[i].fecha+'</td>';
            fila += '<td>' + data[i].cliente+'</td>';
            fila += '<td>' + data[i].paciente+'</td>';
            fila += '<td>' + data[i].medico+'</td>';
            fila += '<td>' + data[i].numboleta+'</td>';
            fila += '<td>' + data[i].orden+'</td>';
            fila += '<td>' +( data[i].total??0).toFixed(2)+'</td>';
            fila += '<td> <button class="btn btn-sm btn-success MHPbtncargarpedido"><i class="fas fa-check"></i></button></td>';
            fila += '<tr id="MHProw' + data[i].idpedido + '" class="hijo"></tr>';
            fila+='</tr>';
        }
        MHPtbody.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'MHPlinkpaginacion', 'MHPpaginacion');
    });
}
$(document).on('click', '.MHPlinkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    fnMHPllenartabla(10,numpagina);
    var pages = document.getElementsByClassName('MHPlinkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});

$('#MHPtbody').on('click', 'tr td.details-control', function () {
    var fila = this.parentNode;
    var idpedido = fila.getAttribute('idpedido');
    var filahija = document.getElementById('MHProw' + idpedido);
    if (fila.classList.contains('details')) {
        fila.classList.remove('details');
        filahija.innerHTML = '';
    }
    else {
        fila.classList.add('details');

        $('#row' + idpedido).show();
        fnMHPagregardetalle(idpedido, filahija);
    }
});

function fnMHPagregardetalle(idpedido, fila) {
    let controller = new PedidoController();
    controller.BuscarDetallePedido(idpedido, function (data) {
        var numfilas = MHPtbdata.getElementsByTagName('thead')[0].getElementsByTagName('th');
        var cabecera = '<td class="text-center" colspan="' + numfilas.length + '"><table class="text-center table-hover" style="width:80%;font-size:13px;margin-left:30px"><tr> <th>Id </th><th>Tipo </th> <th style="width:50%">Detalle</th> <th>COD. Precio</th> <th>Unidades</th> <th>Precio </th> <th>Total </th>  </tr>'
        var cuerpo = "<tbody>";
        for (var i = 0; i < data.length; i++) {

            cuerpo += '<tr class="hijo">' +
                "<td>" + data[i].iddetalle + "</td>" +
                "<td>" + data[i].tipoitem + "</td>" +
                "<td>" + data[i].formula + "</td>" +
                "<td>" + (data[i].codigoproducto ?? '') + "</td>" +
                '<td class="text-right">' + data[i].cantidad + '</td>' +
                '<td class="text-right">' + (data[i].precio ?? 0).toFixed(2) + "</td>" +
                '<td class="text-right">' + (data[i].subtotal ?? 0).toFixed(2) + "</td>" +
                "</tr > ";
        }
        fila.innerHTML = cabecera + cuerpo + "</tbody></table></td>";
    });

}

