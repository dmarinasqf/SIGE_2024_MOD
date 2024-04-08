
var MAP_txtidempleadoasigna = $('#MAP_txtidempleadoasigna');
var MAP_txtempleadoasigna = $('#MAP_txtempleadoasigna');
var MAP_txtfechaasigna = $('#MAP_txtfechaasigna');
var MAP_cmbmotorizado = $('#MAP_cmbmotorizado');
var MAP_txtnumeropedidos = $('#MAP_txtnumeropedidos');
var MAP_cmbestadoentrega = $('#MAP_cmbestadoentrega');
var IDUSUARIO = $('#IDUSUARIO');
//botones
var btnguardar = $('btnGuardar');



$(document).ready(function () {
    MAPfnlistarmotorizados();
});
$(window).on('shown.bs.modal', function () {
    
    MAP_cmbmotorizado.val("");
    MAP_txtidempleadoasigna.val(IDUSUARIO.val());
    MAP_txtempleadoasigna.val(NOMBREUSUARIO);
    MAP_txtnumeropedidos.val(totalseleccionados);
    MAP_cmbestadoentrega.val("ASIGNADO");
});


$('#MAP_form-registro').submit(function (e) {
    e.preventDefault();
    var objentrega;
    var listaRegistros = [];
    for (var i = 0; i < listaselecciones.length; i++) {
        var obj = $('#MAP_form-registro').serializeArray();
        objentrega = new EntregaPedido('', listaselecciones[i], obj[1].value, obj[0].value, obj[2].value, '', '', '', '');
        listaRegistros.push(objentrega);
    }  
    var lista = { entrega: listaRegistros };
    let controller = new DeliveryController();
    btnguardar.prop('disabled', true);
    controller.CrearEntregaDelivery(lista, () => {
        listardelivery();
        btnguardar.prop('disabled', false);
    }, () => { btnguardar.prop('disabled', false);});
   

});

function MAPfnlistarmotorizados() {
    var controller = new EmpleadoController();
    controller.ListarMotorizados('MAP_cmbmotorizado');
}
//objetos

class EntregaPedido {
    constructor(identregadelivery, iddelivery, emp_codigo, idpersonalasigna, estadoentrega, fotocliente,
        estado, fechaenruta, fechaentregado) {
        this.identregadelivery = identregadelivery;
        this.iddelivery = iddelivery;
        this.emp_codigo = emp_codigo;
        this.idpersonalasigna = idpersonalasigna;
        this.fotocliente = fotocliente;
        this.estadoentrega = estadoentrega;
        this.estado = estado;
        this.fechaenruta = fechaenruta;
        this.fechaentregado = fechaentregado;
    }
}