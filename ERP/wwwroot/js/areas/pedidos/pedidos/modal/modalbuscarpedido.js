var MBPEDtxtcodigo = document.getElementById('MBPEDtxtcodigo');
var MBPEDbtnbuscarpedido = document.getElementById('MBPEDbtnbuscarpedido');
var MBPEDtbltbody = document.getElementById('MBPEDtbltbody');
var MBPEDtblpedidos = document.getElementById('MBPEDtblpedidos');
var MBPEDcmbpaciente = document.getElementById('MBPEDcmbpaciente');
var MBPEDcmbcliente = document.getElementById('MBPEDcmbcliente');
var MEPDtxtfecha = document.getElementById('MEPDtxtfecha');

$(document).ready(function () {
    let cliente = new ClienteController();
    var fn = cliente.BuscarClientesSelect2('documento');
    $('#MBPEDcmbcliente').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    });
    let paciente = new PacienteController();
    var fn = paciente.BuscarPacientesSelect2('documento');
    $('#MBPEDcmbpaciente').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    });
});
function MBPEDlistarpedidos(numpagina, tammano) {
    let controller = new PedidoController();
    var obj = {
        pagine: {
            tamanopagina: tammano ?? 10,
            numpagina: numpagina ?? 1
        },
        fechainicio: MEPDtxtfecha.value,
        fechafin: MEPDtxtfecha.value,
        sucursal: IDSUCURSAL,     
        cliente: MBPEDcmbcliente.value,
        paciente: MBPEDcmbpaciente.value,
        porusuario: false,
        vista : 'pedidos'
    };
  
    controller.ListarPedidosVista(obj, function (response) {
        var data = response.data;
        var fila = '';
      
        for (var i = 0; i < data.length; i++) {
            fila += '<tr idpedido="' + data[i].idpedido + '" >';
            fila += '<td class="details-control" ></td>';          
            fila += '<td class="text-center  ">' + data[i].idpedido  + '</td>';
            fila += '<td>' + data[i].sucursal + '</td>';           
            fila += '<td>' + (moment(data[i].fecha).format('DD/MM/YYYY hh:mm')) + '</td>';

            fila += '<td>' + (data[i].cliente ?? '') + '</td>';          
            fila += '<td>' + (data[i].paciente ?? '') + '</td>';
            fila += '<td>'+(data[i].numboleta ?? '')+'</td>';
            fila += '<td class="text-right">' + (data[i].total ?? 0).toFixed(2) + '</td>';
            fila += '<td class="text-right">' + (data[i].adelanto ?? 0).toFixed(2) + '</td>';
            fila += '<td class="text-right saldo">' + (data[i].saldo ?? 0).toFixed(2) + '</td>';
            fila += '<td>' + (data[i].usuario ?? '') + '</td>';
            fila += '<td >' + data[i].estadopedido + '</td>';             
            fila += '<td ><button class="btn btn-success btn-sm MBPEDbtnseleccionarpedido"><i class="fas fa-check"></i></button></td>';
            fila += '</tr>';
            fila += '<tr id="rowpedido' + data[i].idpedido + '" class="hijo"></tr>';
        }
       
        MBPEDtbltbody.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'MEPDlinkpaginacion', 'MEPDpaginacion');
    })
}
$('#modalbuscarpedido').on('shown.bs.modal', function () {
    MBPEDlistarpedidos();

});
$('#MBPEDtbltbody').on('click', 'tr td.details-control', function () {
    var fila = this.parentNode;
  
    var idpedido = fila.getAttribute('idpedido');
    var filahija = document.getElementById('rowpedido' + idpedido);
    if (fila.classList.contains('details')) {
        fila.classList.remove('details');
        filahija.innerHTML = '';
    }
    else {
        fila.classList.add('details');

        $('#rowpedido' + idpedido).show();
        MEPDfnagregardetalle(idpedido, filahija);
    }
});
$('#MBPEDtbltbody').on('click', 'tr', function () {
    var filas = document.querySelectorAll('#MBPEDtbltbody tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    if (!this.classList.contains('hijo'))
        this.classList.add('selected');
});
$(document).on('click', '.MEPDlinkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
   
    MBPEDlistarpedidos(numpagina, 10);
    var pages = document.getElementsByClassName('MEPDlinkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});

//buscar pedido
MBPEDbtnbuscarpedido.addEventListener('click', function () {
    MBPEDlistarpedidos();
});
function MEPDfnagregardetalle(idpedido, fila) {
    let controller = new PedidoController();
    controller.BuscarDetallePedido(idpedido, function (data) {
        var numfilas = MBPEDtblpedidos.getElementsByTagName('thead')[0].getElementsByTagName('th');
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