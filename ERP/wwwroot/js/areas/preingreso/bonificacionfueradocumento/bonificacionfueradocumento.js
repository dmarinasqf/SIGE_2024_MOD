var tbllista;
var txtcodigoingreso = document.getElementById('txtcodigoingreso');
var txtid = document.getElementById('txtid');
var txtidfactura = document.getElementById('txtidfactura');
var txtempresa = document.getElementById('txtempresa');
var txtnumdoc = document.getElementById('txtnumdoc');
var txtseriedoc = document.getElementById('txtseriedoc');
var txtfechadoc = document.getElementById('txtfechadoc');
var txtruc = document.getElementById('txtruc');
var txtrazonsocial = document.getElementById('txtrazonsocial');
var txtalmacen = document.getElementById('txtalmacen');
var txtobservacion = document.getElementById('txtobservacion');
var txtfecha = document.getElementById('txtfecha');
var txttipodocumento = document.getElementById('txttipodocumento');


var btnnuevo = document.getElementById('btnnuevo');
var btnguardar = document.getElementById('btnguardar');
var formregistro = document.getElementById('formregistro');


$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        paging: false
    });
    txtfecha.value = moment().format('DD/MM/YYYY');
    
});
$(window).on('load', function () {

    if (window.opener) {
        _fnocultarbarra();
        fnbuscarfacturabonificacion(window.opener.txtidfactura.val());
    } else {
      
    }

});
txtseriedoc.addEventListener('click', function () {
    $('#modalbuscarpreingresos').modal('show');
});
txtnumdoc.addEventListener('click', function () {
    $('#modalbuscarpreingresos').modal('show');

});
txttipodocumento.addEventListener('click', function () {
    $('#modalbuscarpreingresos').modal('show');

});
$(document).on('click', '.btnpasarpreingreso', function () {
    var idfactura = this.getAttribute('idfactura');
    fnbuscarfacturabonificacion(idfactura);
});
formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
  
    if (tbllista.rows().data().length == 0) {
        mensaje('W', 'No existen datos en el detalle');
        return;
    }
    var obj = {
        bonificaciones: fnobtenerdetalle()
    };
    let controller = new PreingresoController();
    btnguardar.disabled = true;
    controller.RegistrarEditarBonificacionFueraDoc(obj, function (data) {
      
        //txtcodigoingreso.value = data.objeto.codigoingreso;
        //txtid.value = data.objeto.id;
        btnguardar.disabled = true;
        alertaSwall('S', 'REGISTRO GUARDADO', '');

    }, function () {
            btnguardar.disabled = false;
    });
});
btnnuevo.addEventListener('click', function () {
    location.href = ORIGEN + '/PreIngreso/PIPreingreso/BonificacionFueraDocumento';
});
$(document).on('click', '.btneliminar_detalle', function (e) {
    tbllista.row('.selected').remove().draw(false);
    fnagregarindex();
});
function fnagregarindex() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var c = 1;
    filas.forEach(function (e) {
        e.getElementsByTagName('td')[0].textContent = c;
        c++;
    });
}
function fnobtenerdetalle() {
    var filas = document.querySelectorAll('#tbllista tbody tr');
    var array = [];
    for (var i = 0; i < filas.length; i++) {
        var obj = new DetalleBonificacionFueraDocumento();
        obj.idfactura = txtidfactura.value;
        obj.cantidadingresada = filas[i].getElementsByClassName('cantidadingresada')[0].value;
        obj.cantidadoc = filas[i].getElementsByClassName('cantidadoc')[0].innerText;
        obj.fechavencimiento = filas[i].getElementsByClassName('fechavencimiento')[0].value;
        obj.lote = filas[i].getElementsByClassName('lote')[0].value;
        obj.regsanitario = filas[i].getElementsByClassName('regsanitario')[0].value;
        obj.idproducto = filas[i].getAttribute('idproducto');
        obj.idcotizacionbonfi = filas[i].getAttribute('iddetallecotizacion');
        obj.promocion = filas[i].getAttribute('promocion');
        obj.iddetallepreingreso = filas[i].getAttribute('iddetallepreingreso');
        array.push(obj);
    }
    return array;
}
function fnbuscarfacturabonificacion(idfactura) {
    console.log(idfactura)
    let controller = new PreingresoController();
    controller.GetBonificacionxFactura(idfactura, function (data) {
        $('#modalbuscarpreingresos').modal('hide');
        data = data[0];
        var cabecera = JSON.parse(data.cabecera)[0];
        var detalle = JSON.parse(data.detalle);

        txtempresa.value = cabecera.empresa;
        txtruc.value = cabecera.rucproveedor;
        txtrazonsocial.value = cabecera.proveedor;
        txtalmacen.value = cabecera.areaalmacen;
        txtidfactura.value = cabecera.idfactura;
        txttipodocumento.value = cabecera.documentotributario;
        txtseriedoc.value = cabecera.serie;
        txtnumdoc.value = cabecera.numdoc;
        txtfechadoc.value = cabecera.fechadocumento;
        //tbllista.clear().draw(false);
        if (detalle != null) {
            for (var i = 0; i < detalle.length; i++) {
                var datalote = detalle[i].lote[0];
                var fv = datalote.fechavencimiento == "1900-01-01" ? "" : datalote.fechavencimiento;
                var fila = tbllista.row.add([
                    i + 1,
                    detalle[i].codigoproducto,
                    detalle[i].producto,
                    detalle[i].idtipoproducto,
                    '<span class="cantidadoc">' + detalle[i].cantidad + '</span>',
                    '<input type="number" width="100%" class="cantidadingresada inputdetalle" min=0 max=' + detalle[i].cantidad + ' required />',
                    '<input type="text" class="lote inputdetalle" min=0 value="' + datalote.lote + '"  />',
                    '<input type="date" class="fechavencimiento " value="' + fv + '"  />',
                    '<input type="text" class="regsanitario inputdetalle " min=0 value="' + datalote.registrosanitario + '"  />',
                    '<button class="btn btn-danger btneliminar_detalle" type="button" ><i class="fas fa-trash-alt"></i></button>'
                ]).draw(false).node();
                fila.setAttribute('iddetallepreingreso', detalle[i].iddetallepreingreso);
                fila.setAttribute('idproducto', detalle[i].idproducto);
                fila.setAttribute('iddetallecotizacion', detalle[i].iddetallecotizacion);
                fila.setAttribute('promocion', detalle[i].promocion);
            }
        }


        if (tbllista.rows().data().length == 0) {
            mensaje('W', 'La factura no presenta bonificaciones', '', '', true);
        }
    });
}
