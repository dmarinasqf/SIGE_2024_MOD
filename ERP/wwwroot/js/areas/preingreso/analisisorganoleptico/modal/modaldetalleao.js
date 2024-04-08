//DATOS PRODUCTO
var MDAO_producto = $('#MDAO_producto');
var MDAO_txtiddetallepreingreso = $('#MDAO_txtiddetallepreingreso');
var MDAO_txtidanalisisorgdetalle = $('#MDAO_txtidanalisisorgdetalle');
var MDAO_txtcingreso = $('#MDAO_txtcingreso');
var MDAO_txtcmuestra = $('#MDAO_txtcmuestra');
var MDAO_txtrechazada = $('#MDAO_txtrechazada');
var MDAO_cmbresultado = $('#MDAO_cmbresultado');
var MDAO_txtobservacion = $('#MDAO_txtobservacion');
var MDAO_txtidproducto = $('#MDAO_txtidproducto');
var MDAO_txtidstock = $('#MDAO_txtidstock');
var MDAO_lote = $('#MDAO_lote');
var MDAO_txtidlote = $('#MDAO_txtidlote');

var MDAO_ARRAYCARACTERISTICAAO = [];
var MDAO_ARRAYDETALLEAO = [];
$(document).ready(function () {
    // MDAO_fnListarCaracteristicasAO("HABILITADO", "");
});

//CARGAR MODALES
function MDAO_fnListarCategorias() {
    let controller = new CategoriaAOController();
    controller.ListarHabilitados(MDAO_fncargarModalCategoria);   
}

function MDAO_fnListarCaracteristicasAO(idcategoria, estado) {
    let controller = new CaracteristicaAOController();
    let obj = { estado: estado, idcategoria: idcategoria }
    controller.ListarCaracteristicaxCategoria(obj, function (data) {

        var lbls = '';
        var divcategoria = document.getElementById('MDAO_Categoria' + idcategoria);
        for (let i = 0; i < data.length; i++) {
           // console.log('CATEGORIA___' + data[i].idcaracteristicaao);
            lbls += `<div class="col-xl-12 col-xs-12">
                     <input type="checkbox" id="MDAO_Caracteristica`+ data[i].idcaracteristicaao + `" value="` + data[i].idcaracteristicaao + `" class="chk-col-blue mdao_caracteristica" checked/>
                     <label for="MDAO_Caracteristica`+ data[i].idcaracteristicaao + `"><strong>` + data[i].descripcion + `</strong></label>
                 </div> `
        }
        divcategoria.innerHTML = lbls
    });
}

function MDAO_fncargarModalCategoria(data) {
    let tabpane = document.getElementById('MDAO_tabpanefill');
    let modal = '';

    let datos = data.objeto;

    for (let i = 0; i < datos.length; i++) {
        MDAO_fnListarCaracteristicasAO(datos[i].idcategoriaao, 'HABILITADO');
        modal += `<div class="col-xl-4 col-xs-12">
                <div class="card">
                    <div class="card-header">
                        <h6 class="font-black">`+ datos[i].descripcion + `</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-xl-12 col-sm-12">
                                <div id="MDAO_Categoria`+ datos[i].idcategoriaao + `" class="demo-checkbox">
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>`;
    }
    tabpane.innerHTML = `<div class="row">` + modal + `</div>`;
}
   


//REGISTRO
$('#MDAO_form-registro').submit(function (e) {
    e.preventDefault();
    let detalle = new PIAnalisisOrgDetalle();
    detalle.idanalisisorgdetalle = MDAO_txtidanalisisorgdetalle.val();

    detalle.iddetallepreingreso = MDAO_txtiddetallepreingreso.val();
    detalle.idproducto = MDAO_txtidproducto.val();
    detalle.idstock = MDAO_txtidstock.val();
    //detalle.idlote = MDAO_txtidlote.val();
    detalle.cantidadmuestra = MDAO_txtcmuestra.val();
    detalle.cantidadaprobada = MDAO_txtcingreso.val();
    detalle.cantidadrechazada = MDAO_txtrechazada.val();
    detalle.resultado = MDAO_cmbresultado.val();
    detalle.observacion = MDAO_txtobservacion.val();
    detalle.detallecaracteristicajson = JSON.stringify(MDAO_fnGetDetalleCaracteristicaAO());        
    try {
        var filadetalle = $('#tbldetalle tbody .selected')[0];
        detalle.idlote = filadetalle.getAttribute('idlote');
    } catch (e) {  }
    let pos = MDAO_fnBuscarDetalle(MDAO_ARRAYDETALLEAO, MDAO_txtidstock.val());
    if (pos >= 0)
        MDAO_ARRAYDETALLEAO[pos] = detalle;
    else
        MDAO_ARRAYDETALLEAO.push(detalle);
    fnCambiarDatosTabla(MDAO_txtidstock.val(), parseInt(MDAO_txtrechazada.val()));
    
    $('#MDAO_modaldetalleao').modal('hide');

   
});
function MDAO_fnGetDetalleCaracteristicaAO() {
    MDAO_ARRAYCARACTERISTICAAO = [];
    let data = document.getElementsByClassName('mdao_caracteristica');
    for (let i = 0; i < data.length; i++) {
        if (data[i].checked == true) {
            let obj = new PICaracteristicaDetalleAO();
            obj.idcaracteristicadetalleao = 0;
            obj.idcaracteristicaao = data[i].value;
            obj.idanalisisorgdetalle = MDAO_txtidanalisisorgdetalle.val();
            obj.iddetallepreingreso = MDAO_txtiddetallepreingreso.val();
            MDAO_ARRAYCARACTERISTICAAO.push(obj)
        }
    }
    return MDAO_ARRAYCARACTERISTICAAO;
}

//ESTADOS DE AO
MDAO_cmbresultado.change(function () {
    MDAO_fnModificarSeleccionxEstado();
});
function MDAO_fnModificarSeleccionxEstado() {
    if (MDAO_cmbresultado.val() == "LB") {
        MDAO_txtrechazada.prop("readonly", true);
        MDAO_txtrechazada.val(0);
        $('.mdao_caracteristica').prop('checked', true);
    }
    else {
        MDAO_txtrechazada.prop("readonly", true);
        MDAO_txtrechazada.val(MDAO_txtcingreso.val());
        $('.mdao_caracteristica').prop('checked', false);
    }
}
// Funciones
function MDAO_fnBuscarDetalle(array, idstock) {
    let pos = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i].idstock == idstock) {
            pos = i;
            break;
        }
    }
    return pos;
}

function MDAO_fnCargarCaracteristicasSeleccionadas(detalle) {
    console.log(detalle);
    let datos = JSON.parse(detalle);
    $('.mdao_caracteristica').prop('checked', false);
    for (let i = 0; i < datos.length; i++) {
        try {
            //$('.mdao_caracteristica').prop('checked', false);
            //console.log('#MDAO_Caracteristica' + datos[i].idcaracteristicaao);
            $('#MDAO_Caracteristica' + datos[i].idcaracteristicaao).prop('checked', true);
        } catch (error) { console.log(error); }

    }
}