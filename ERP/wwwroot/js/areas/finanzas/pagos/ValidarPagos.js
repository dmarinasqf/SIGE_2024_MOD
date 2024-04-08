var tbllista;
var lista;

var txtfechainicio = '';
var txtfechafin = '';
var spiner = $('#spinners');

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": true,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "ordering": false,
        "info": false,
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "",
            "zeroRecords": "",
            "info": "",
            "infoEmpty": "No hay información",
            "infoFiltered": "",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "order": [[1, 'asc']]
        }
    });

    listarDepositos();

});

$('input[id="txtfecharango"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    txtfechainicio = picker.startDate.format('DD/MM/YYYY');
    txtfechafin = picker.endDate.format('DD/MM/YYYY');
});
$('input[id="txtfecharango"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
    txtfechainicio = "";
    txtfechafin = "";
});

function listarDepositos() {
    $('#btnConsultar').prop('disabled', true);
    let controller = new PagoController();
    spiner.removeClass('mostrar');
  
    if (txtfechainicio.length === 0) {
        txtfechainicio = moment().format('DD/MM/YYYY');
        txtfechafin = moment().format('DD/MM/YYYY');
    }
    var obj = {
        fechainicio: txtfechainicio,
        fechafin: txtfechafin,
        tipo: 'CONSULTA'
    };

    controller.ListarDepositos(obj, crearCuerpoVP, (data) => {
        console.log(data);
        mensaje("W", "El numero de datos consultados ha execido la memoria, reduzca el rango de fecha.");
        $('#btnConsultar').prop('disabled', false);
    });


    //$.post(url, data).done(function (data) {
    //    spiner.addClass('mostrar');
    //    var datos = $.parseJSON(data);
    //    crearCuerpo(datos);
    //    $('#btnConsultar').prop('disabled', false);
    //}).fail(function (data) {
    //    console.log(data);
    //    mensaje("W", "El numero de datos consultados ha execido la memoria, reduzca el rango de fecha.");
    //    $('#btnConsultar').prop('disabled', false);
    //    spiner.addClass('mostrar');
    //});
}

function crearCuerpoVP(datos) {
    tbllista.clear().draw(false);
    var check = '';
    for (var i = 0; i < datos.length; i++) {
        if (datos[i]['VALIDADO'])
            check = 'checked';
        else
            check = '';
        var src = '';
        if (datos[i].sistema == 'gdp')
            src = 'src = "/imagenes/finanzas/depositos/' + datos[i]['IMAGEN'] + '"';
        else if (datos[i].sistema == 'sisqf')
            src = 'src="' + URLSISQF + 'imagenes/pedido/depositos/' + datos[i]['IMAGEN'] + '"';
        tbllista.row.add([
            '<img ' + src + ' style="width:50px;height:50px" class="img"/>',
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
    $('#btnConsultar').prop('disabled', false);
    spiner.addClass('mostrar');
    //fnIniciarTablaEdit();
}

$(document).on('click', '.checkvalida', function (e) {
    var check = $(this).prop('checked');
    console.log(check);
    var idpago = this.getAttribute('idpago');
    let controller = new PagoController();
    var obj = {
        idpago: idpago,
        sistema: this.getAttribute('sistema')
    };

    controller.AprobarPago(obj, (data) => {
        if (check)
            mensaje('S', 'Pago aprobado.');
        else
            mensaje('S', 'Vuelva a aprobar el pago nuevamente');
    }, (errData) => {
            if (errData.status === 401)
                mensaje('D', 'No tiene permisos para realizar esta operación');
            else
                mensaje('D', 'Error en el servidor');
    });

    /*$.post(url, data).done(function (data) {
        console.log(data);
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

    });*/

});

function fnIniciarTablaEdit() {
    $('#tbllista').Tabledit({
        deleteButton: false,
        saveButton: true,
        autoFocus: true,
        buttons: {
            edit: {
                class: 'btn btn-sm btn-warning',
                html: '<span class="fas fa-edit"></span> &nbsp EDIT',
                action: 'edit'
            }, save: {
                class: 'btn btn-sm btn-primary',
                html: '<span class="fas fa-save"></span> &nbsp SAVE',
                action: 'save'
            },
        },
        columns: {
            identifier: [0, 'id'],
            editable: [[6, 'txtnumoperacion'], [12, 'txtobservacion']]
        }
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
