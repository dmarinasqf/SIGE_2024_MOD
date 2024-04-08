var txtfecharango = document.getElementById('txtcodigo');

var tbllista;



//variables modalEditar pago

var MED_txtnumoperacion = document.getElementById('MED_txtnumoperacion');
var MED_txtobservacion = document.getElementById('MED_txtobservacion');
var MED_txtxtidpago = document.getElementById('MED_txtxtidpago');
var MED_txtsistema = document.getElementById('MED_txtsistema');
var formeditardatospago = document.getElementById('formeditardatospago');

//variables modalEditar pago

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;

    var util = new UtilsSisqf();
    tbllista = util.Datatable('tblReportes', true, datatable);

    getReporteGeneral();
});

function getReporteGeneral() {
    var url = '/Pedidos/Depositos/GetListaDepositoAprobado';
    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        top: 100,
        tipo: 'CONSULTA'
    };
    BLOQUEARCONTENIDO('cardacciones', 'Consultando reporte ...');
    $.post(url, data).done(function (data) {
        cargarTabla(data);        
        DESBLOQUEARCONTENIDO('cardacciones');
    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');
     
        mensaje("W", "El numero de datos consultados ha execido la memoria, reduzca el rango de fecha.");
        $('#btnConsultar').prop('disabled', false);
        spiner.addClass('mostrar');
    });
}


$(document).on('click', '.btneditarpago', function () {
    $('#modaleditarpago').modal('show');

    var fila = (tbllista.row($(this).parents('tr')).data());

    MED_txtnumoperacion.value = fila[6];
    MED_txtobservacion.value = fila[10];
    MED_txtxtidpago.value = this.getAttribute('idpago');
    MED_txtsistema.value = this.getAttribute('sistema');
    console.log(this.getAttribute('idpago'));
});



function cargarTabla(datos) {
    tbllista.clear().draw(false);
    var check = '';
    for (var i = 0; i < datos.length; i++) {
        
        if (datos[i]['VALIDADO'])
            check = 'checked';
        else
            check = '';
        var src = '';
        var tipo = datos[i]['IMAGEN'].split('_');
        
        if (tipo[0] == 'sisqf')
            src = location.hostname + ':9011/imagenes/pedido/depositos/' + datos[i]['IMAGEN'] ;
        else
            src = 'http://sistemaenlinea.qf.com.pe:9001/imagenes/finanzas/depositos/' + datos[i]['IMAGEN'] ;

     
        tbllista.row.add([
            '<img src="' + src + '" style="width:50px;height:50px" class="img"/>',
            datos[i]['SUCURSAL REGISTRO'],
            moment(datos[i]['FECHA REGISTRO']).format('DD/MM/YYY hh:mm'),
            datos[i]['FECHA DEPOSITO'],
            datos[i]['BANCO'],
            datos[i]['CUENTA'],
            datos[i]['NUMERO OPERACION'],
            datos[i]['INTERBANCARIO'] === true ? 'SI' : 'NO',
            datos[i]['MONTO'].toFixed(2),
            //datos[i]['ID TABLA'],
            datos[i]['TABLA'].replace('-', ' '),
            datos[i]['OBSERVACION'],
            datos[i]['USUARIO REGISTRA'],
            datos[i]['USUARIO VALIDA'],
            '<input type="checkbox" style="width:20px;height:20px" sistema="' + datos[i].sistema + '" idpago="' + datos[i]['ID'] + '" class="checkvalida" ' + check + '/>',
            '<button class="btn btn-warning btn-sm btneditarpago"  sistema="' + datos[i].sistema + '" idpago="' + datos[i]['ID'] + '"><i class="fas fa-edit"></i></button>'
        ]).draw(false);
    }
    tbllista.columns.adjust().draw();
    //fnIniciarTablaEdit();
}

$(document).on('click', '.checkvalida', function (e) {
    var check = $(this).prop('checked');
    console.log(check);
    var idpago = this.getAttribute('idpago');
    var url = '/Pedidos/Depositos/SetEditarValido';
    var data = {
        id: idpago
        //sistema: this.getAttribute('sistema')
    };

    //console.log(data);
    $.post(url, data).done(function (data) {
        //console.log(data);
        if (data.mensaje === 'ok') {
            if (check)
                mensaje('S', 'Pago aprobado.');
            else
                mensaje('S', 'Vuelva a aprobar el pago nuevamente');
        } else
            mensaje('W', data.mensaje);
    }).fail(function (data) {
        console.log(data);
        if (data.status === 401)
            mensaje('D', 'No tiene permisos para realizar esta operación');
        else
            mensaje('D', 'Error en el servidor');

    });

});


//modal Editar pago
formeditardatospago.addEventListener('submit', function (e) {
    e.preventDefault();
    var obj = $('#formeditardatospago').serializeArray();
    var url = ORIGEN + '/Pedidos/Depositos/SetEditar';
    //console.log(obj);

    $.post(url, obj).done(function (data) {
        if (data.mensaje === 'ok') {
            mensaje('S', 'Datos guardados');
            $('#modaleditarpago').modal('hide');
            formeditardatospago.reset();
            getReporteGeneral();
        }
        else
            mensaje('W', data.mensaje);

    }).fail(function (data) {
        mensajeError(data);
    });
});
//modal Editar pago