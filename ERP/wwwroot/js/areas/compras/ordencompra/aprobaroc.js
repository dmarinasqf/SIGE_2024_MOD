
var tbllista;
var txtnumerooc = $('#txtnumerooc');
var txtusuario = $('#txtusuario');
var txtiduser = $('#txtiduser');
var txtclave = $('#txtclave');
var codigooc;
var oc_aprobar = [];
var btnguardar = $('#btnguardar');

//OTRAS VARIABLES
var row;
var pos;
//botones
var btn_validar = $('#btn_validar');

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        // "order": [[1, 'asc']]
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    });
    fnListarOrdenes();
});

$(document).on('click', '.btn-pasar', function (e) {

    pos = -1;
    var columna = tbllista.row($(this).parents('tr')).data();

    pos = oc_aprobar.indexOf(columna[0]);
    //console.log("pos = "+pos);
    if (pos < 0) {
        oc_aprobar.push(columna[0]);

    } else {
        oc_aprobar.splice(pos, oc_aprobar.length);
    }
    btnguardar.prop("disabled", false);
    //console.log(oc_aprobar.length);
    if (oc_aprobar.length > 0) {
        btn_validar.prop("disabled", false);
    } else {
        btn_validar.prop("disabled", true);
    }

});
function btnmostrarmodal_validar() {
    $('#modalvalidarusuario').modal('show');
}


function aprobar(id) {
    var url = ORIGEN + "/Compras/COrdenCompra/AprobarOC";
    var obj = {
        idordencompra: id,
        usuarioaprueba: txtiduser.val()
    };
    console.log(obj);
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.mensaje === "ok") {
            tbllista.row($("#" + id + '_tr')).remove().draw(false);
            mensaje("S", "SE APROBÓ CORRECTAMENTE LA ORDEN DE COMPRA");

        }
        else {
            mensaje("W", data.mensaje);
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}

function buscarporcodigo(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (e.keyCode === 13) {
        fnListarOrdenes();
    }
}
function fnListarOrdenes() {
    var obj = {
        id: txtnumerooc.val(),       
        estado: 'TERMINADO',
        top:999999
    };
    let controller = new OrdenCompraController();
    controller.ListarCompras(obj, fnLLenarTablaOrdenesAprobar);
}
function fnLLenarTablaOrdenesAprobar(data) {
  
    tbllista.clear().draw(false);
    if (data != null) {
        oc_aprobar = [];      
        for (var i = 0; i < data.length; i++) {
            row = tbllista.row.add([
                data[i]['ID'],
                '<a class="btn btn-sm btn-outline-info" target="_blank" href="' + ORIGEN + '/Compras/COrdenCompra/RegistrarEditar/' + data[i]['ID']+'"><i class="fas fa-eye"></i></a>',
                data[i]['CODIGO'],
                data[i]['SUCURSALDESTINO'],
                moment(data[i]['FECHA']).format("DD/MM/YYYY HH:mm"),
                data[i]['FEVENCIMIENTO'],
                data[i]['RAZONSOCIAL'],
                data[i]['TOTAL'],             
                ` <input class="btn-pasar" type="checkbox" id=`+ data[i]['ID'] + `>`,
                            ''
            ]).draw(false);
            row.nodes().to$().attr('id', data[i]['ID'] + '_tr');
        }
        //tbllista.columns().adjust().draw();
    }
    else {
        mensaje("I", "No hay información");
    }


}

///////////////////////////////////////////////////////////////////////////////////
//          MODAL VALIDAR USUARIO
$('#form-validarusuario').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Compras/COrdenCompra/VerificarCredenciales_OrdenCompra";
    var obj = $('#form-validarusuario').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.mensaje === "ok") {
            txtiduser.val(data.objeto);
            for (var i = 0; i < oc_aprobar.length; i++) {
                aprobar(oc_aprobar[i]);
            }
            limpiar();
            $('#modalvalidarusuario').modal('hide');

        }
        else if (data.mensaje === "ntp") {
            mensaje("I", "USTED NO TIENE PERMISOS PARA REALIZAR ESTA OPERACION");
        }
        else if (data.mensaje === "Credenciales incorrectas") {
            mensaje("I", "Usuario o contraseña son incorrectas");
        } else
            mensaje('I', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {

        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
});




$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

function limpiar() {
    txtiduser.val("");
    txtusuario.val("");
    txtclave.val("");
    oc_aprobar = [];
    btn_validar.prop("disabled", true);
}

