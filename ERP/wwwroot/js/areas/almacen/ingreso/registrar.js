//inputs
var txtusuario = document.getElementById('txtusuario');
var txtnombreempresa = document.getElementById('txtnombreempresa');
var txtidsucursal = document.getElementById('txtidsucursal');
var txtobservacion = document.getElementById('txtobservacion');
var txtidingreso = document.getElementById('txtidingreso');
var formregistro = document.getElementById('formregistro');
var cmbalmacen = document.getElementById('cmbalmacen');
var cmblaboratorio = document.getElementById('cmblaboratorio');
//buttons

var btnimprimir = document.getElementById('btnimprimir');
var btncancelar = document.getElementById('btncancelar');
var btnnuevo = document.getElementById('btnnuevo');
var btnnuevoproducto = document.getElementById('btnnuevoproducto');
var btnactualizarstock = document.getElementById('btnactualizarstock');
var btnguardar = document.getElementById('btnguardar');

//modal laboratorio
var lblMlaboratorio = document.getElementById('lblMlaboratorio');
var btnMproductonuevo = document.getElementById('btnMproductonuevo');
var btnMstockexistente = document.getElementById('btnMstockexistente');

//variables
var tbldetalle;
var _almacenes = [];
var productos = [];
$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = false;
    datatable.ordering = false;
    datatable.buttons = [];
    
    var util = new UtilsSisqf();
    tbldetalle = util.Datatable('tbldetalle', true, datatable);
   
    fnlistarsucursal();
    fnlistarsucursalxlab();
    let controller = new LaboratorioController();
    var fn = controller.BuscarLaboratoriosSelect2();
    select2lab = $('#cmblaboratorio').select2({
        placeholder: "Buscar Laboratorios",
        allowClear: true,
        ajax: fn
    }).on("change", function (e) {
        fnlistarproductoslista($(this).find('option:selected').text());
    });
    
});
window.addEventListener('keydown', function (e) {
    var tecla = e.key;
    //if (tecla === '+')
    //    fnAbrirModalProductos();
    if (tecla === 'F1') {
        e.preventDefault();
        btnguardar.click();
    }
    if (tecla === 'F2') {
        e.preventDefault();
        fnNuevo();
    }
    if (tecla === 'F3') {
        e.preventDefault();
        fnimprimir();
    }
    //if (tecla === 'F4') {
    //    e.preventDefault();
    //    fnCancelar();
    //}
});
btnnuevoproducto.addEventListener('click', function () {
    $('#modalproductos').modal('show');
});
btnactualizarstock.addEventListener('click', function () {
    $('#modalproductosstock').modal('show');
});
btnnuevo.addEventListener('click', function () {
    fnNuevo();
});
$(document).on('click', '.btnpasarproducto', function () {
    var idproducto = this.getAttribute('idproducto');
    fnbuscarproducto(idproducto);
});
$(document).on('click', '.MPS_btnseleccionarstock', function () {
    var idstock = this.getAttribute('idstock');
    fnbuscarstockproducto(idstock);
});
$(document).on('click', '.btnquitaritem', function () {
    tbldetalle.row('.selected').remove().draw(false);
    fnagregarindex();
});
$('#tbldetalle tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetalle.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.isfraccion', function () {
    if (this.checked) {
        var fila = this.parentNode.parentNode;
        console.log(fila);
        //var isblister = fila.getElementsByClassName('isblister')[0];
        //isblister.checked = false;
    }
});
//$(document).on('click', '.isblister', function () {
//    if (this.checked) {
//        var fila = this.parentNode.parentNode;
//        console.log(fila);
//        var isfraccion = fila.getElementsByClassName('isfraccion')[0];
//        isfraccion.checked = false;
//    }
//});
formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    if (fngetdetalle().length === 0) {
        mensaje('W', 'No se han registrado cantidades', 'TC');
        return;
    }

    fnguardar();
});
cmbalmacen.addEventListener('click', function () {
    var cmbalmacenes = document.getElementsByClassName('cmbalmacen');
    for (var i = 0; i < cmbalmacenes.length; i++) {
        if (!cmbalmacenes[i].disabled) 
            cmbalmacenes[i].value = cmbalmacen.value;
    }
});
txtidsucursal.addEventListener('change', function () {
    IDSUCURSAL = txtidsucursal.value;
    fnverificarsiexistenproductosconstock();
    fnlistaralmacensucursal();
   
});
$(document).on('keyup', '.cantidad', function () {
    var fila = this.parentNode.parentNode;
    var idproducto = fila.getAttribute('idproducto');
    fnverificaratributosrequerid(idproducto,fila);
});
btnMproductonuevo.addEventListener('click', function () {
    let controller = new ProductoController();
    controller.ListarProductosxLaboratorio(cmblaboratorio.value, function (data) {
        for (var i = 0; i < data.length; i++) {
            try {  fncargardataproducto(data[i]); } catch (e) {       }
        }
        fnagregarindex();
    });
});
btnMstockexistente.addEventListener('click', function () {
    let controller = new StockController();
    var obj = {
        idlaboratorio: cmblaboratorio.value,
        idsucursal:IDSUCURSAL
    };
    controller.BuscarStockXLaboratorio(obj, function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            try { fncargardatastock(data[i]); } catch (e) { }
        }
        fnagregarindex();
    });
});
function fnbuscarstockproducto(idstock) {
    if (fnverificarsielitemestaendetalle(idstock.toString())) {
        mensaje('W', 'El item se encuentra en el detalle');
        return;
    }
    let controller = new StockController();
    controller.BuscarStock(idstock, function (data) {      
        fncargardatastock(data);
        fnagregarindex();
    });
}
function fncargardatastock(data) {
    let almacontroller = new AlmacenSucursalController();
    var fraccion = '<input type="checkbox" class="isfraccion " disabled/>';
    //var blister = '<input type="checkbox" class="isblister" disabled/>';
    var lote = '<input class="lote inputdetalle" type="text" value="' + data.lote + '" disabled/>';
    var fv = '<input class="fechavencimiento inputdetalle" type="date" value="' + data.fechavencimiento + '" disabled/>';
    var reg = '<input class="regsanitario inputdetalle" type="text" value="' + data.regsanitario + '" disabled/>';
    var cmbalmacen = almacontroller.LllenarComboAlmacenSucursalAux(document.createElement('select'), _almacenes, data.idalmacensucursal);
    cmbalmacen.classList.add('form-control');
    cmbalmacen.classList.add('form-control-sm');
    cmbalmacen.classList.add('cmbalmacen');
    cmbalmacen.disabled = true;
    if (data.multiplo > 1)
        fraccion = '<input type="checkbox" class="isfraccion" />';
    //if (data.venderblister && data.multiploblister > 1)
    //    blister = '<input type="checkbox" class="isblister" />';

    var fila = tbldetalle.row.add([
        '<span class="index"></span>',
        data.codigoproducto,
        data.nombre,
        cmbalmacen.outerHTML,
        '<input type="number" min="0" class="cantidad inputdetalle" >',
        fraccion,
        //blister,
        lote,
        fv,
        reg,
        '<button class="btn btn-sm btn-danger btnquitaritem"><i class="fas fa-trash"><i></button>'
    ]).draw(false).node();
    fila.getElementsByClassName('cmbalmacen')[0].value = data.idalmacensucursal;
    fila.setAttribute('idproducto', data.idproducto);
    fila.setAttribute('idstock', data.idstock);

}
function fnbuscarproducto(idproducto) {
    let controller = new ProductoController();
    controller.BuscarProducto(idproducto, function (data) {
        fncargardataproducto(data);
        fnagregarindex();
    });
  
}
function fncargardataproducto(data) {
    productos.push(data);
    let almacontroller = new AlmacenSucursalController();
    var fraccion = '<input type="checkbox" class="isfraccion" disabled/>';
    var blister = '<input type="checkbox" class="isblister" disabled/>';
    var lote = '<input class="lote inputdetalle" type="text"/>';
    var fv = '<input class="fechavencimiento inputdetalle" min="' + moment().format('YYYY-MM-DD') + '"  type="date"/>';
    var reg = '<input class="regsanitario inputdetalle" type="text" value="' + (data.regsanitario ?? "") + '"/>';
    var cmbalmacen = almacontroller.LllenarComboAlmacenSucursalAux(document.createElement('select'), _almacenes, '');
    cmbalmacen.classList.add('form-control');
    cmbalmacen.classList.add('form-control-sm');
    cmbalmacen.classList.add('cmbalmacen');
    //cmbalmacen.required = true;
    
    if (data.multiplo > 1)
        fraccion = '<input type="checkbox" class="isfraccion" />';
    //if (data.venderblister && data.multiploblister > 1)
    //    blister = '<input type="checkbox" class="isblister" />';

    //if (data.aceptalote)
    //    lote = '<input class="lote inputdetalle" type="text" required/>';
    //if (data.aceptaregsanitario)
    //  reg = '<input class="regsanitario inputdetalle" type="text" required/>';
    //if (data.aceptafechavence)
    //    fv = '<input class="fechavencimiento inputdetalle" type="date" min="' + moment().format('YYYY-MM-DD') + '" required/>';
    var fila = tbldetalle.row.add([
        '<span class="index"></span>',
        data.codigoproducto,
        data.nombre,
        cmbalmacen.outerHTML,
        '<input type="number" min="0" class="cantidad inputdetalle" >',
        fraccion,
        //blister,
        lote,
        fv,
        reg,
        '<button class="btn btn-sm btn-danger btnquitaritem"><i class="fas fa-trash"><i></button>'
    ]).draw(false).node();
    fila.setAttribute('idproducto', data.idproducto);
    fila.getElementsByClassName('cmbalmacen')[0].value = document.getElementById('cmbalmacen').value;

    fila.setAttribute('idstock', '');

}
function fnagregarindex() {
    var filas = $(tbldetalle.rows().nodes());
    var c = 1;
    for (var i = 0; i < filas.length; i++) {
        var e = filas[i];
        try {
            e.getElementsByClassName('index')[0].textContent = c;
            c++;
        } catch (e) {    }
    }
 
}
function fnlistaralmacensucursal() {
    let controller = new AlmacenSucursalController();
    controller.ListarAlmacenxSucursal('', txtidsucursal.value, '', function (data) {
        _almacenes = data;
        let contro_aux = new AlmacenSucursalController();
        contro_aux.LllenarComboAlmacenSucursalAux(document.getElementById('cmbalmacen'), _almacenes);

        var cmbalmacenes = document.getElementsByClassName('cmbalmacen');    
     
        for (var i = 0; i < cmbalmacenes.length; i++) {
            
            if (!cmbalmacenes[i].disabled) {
                var cmbalmacen = contro_aux.LllenarComboAlmacenSucursalAux(cmbalmacenes[i], _almacenes, data.idalmacensucursal);
                cmbalmacenes[i] = cmbalmacen;
            }
          
        }   
    });
}
function fngetdetalle() {
    var filas = $(tbldetalle.rows().nodes());
    
    var array = [];
    for (var i = 0; i < filas.length; i++) {
        var e = filas[i];
        var obj = new ADetalleIngresoManual();
        if (e.getElementsByClassName('cantidad')[0].value > 0) {
            obj.cantidad = e.getElementsByClassName('cantidad')[0].value;
            obj.idproducto = e.getAttribute('idproducto');
            obj.idstock = e.getAttribute('idstock');
            obj.lote = e.getElementsByClassName('lote')[0].value;
            obj.idalmacensucursal = e.getElementsByClassName('cmbalmacen')[0].value;
            obj.fechavencimiento = e.getElementsByClassName('fechavencimiento')[0].value;
            obj.regsanitario = e.getElementsByClassName('regsanitario')[0].value;
            obj.isfraccion = e.getElementsByClassName('isfraccion')[0].checked;
            //obj.isblister = e.getElementsByClassName('isblister')[0].checked;
            array.push(obj);
        }
      
    }
    
    return array;
}
function fnNuevo() {
    swal({
        title: '¿Desea realizar un nuevo registro?',
        text: '',
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
            location.href = ORIGEN + '/almacen/aingreso/registrar';
        } else
            swal.close();
    });
   
}
function fnguardar() {
   
   
    var obj = $('#formregistro').serializeArray();
   
    obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fngetdetalle()) };
    console.log(obj);
    swal({
        title: '¿Desea registrar el ingreso?',
        text: '',
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
            BLOQUEARCONTENIDO('formregistro', 'Guardando datos ...');
            
            let controller = new IngresoManualController();
            controller.Registrar(obj, function (data) {
                btnguardar.disabled = true;
               DESBLOQUEARCONTENIDO('formregistro');
            }, () => { DESBLOQUEARCONTENIDO('formregistro'); btnguardar.disabled = false;});
        } else
            swal.close();
    });
}
function fnlistarsucursal() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('txtidsucursal', IDSUCURSAL, function () { fnlistaralmacensucursal();   });
    

}


function fnlistarsucursalxlab() {
    let controller = new SucursalController();
    controller.ListarTodasSucursalesMLaboratorios('txtidsucursal', IDSUCURSAL, function () { fnlistaralmacensucursal(); });


}



function fncargaralmacenesdetalle() {
    var cmbalmacenes = document.getElementsByClassName('cmbalmacen');
    var almacontroller = new AlmacenSucursalController();
    
    for (var i = 0; i < cmbalmacenes.length; i++) {
        var cmbalmacen = almacontroller.LllenarComboAlmacenSucursalAux(document.createElement('select'), _almacenes, data.idalmacensucursal);
        cmbalmacenes[i] = cmbalmacen;
    }   
}
function fnverificarsiexistenproductosconstock() {
    var cmbalmacenes = document.getElementsByClassName('cmbalmacen');
    var array = [];
    for (var j = 0; j < cmbalmacenes.length; j++) {      
        if (cmbalmacenes[j].disabled)
            array.push(cmbalmacenes[j].parentNode.parentNode);
    }
    for (var i = 0; i < array.length; i++) 
        tbldetalle.row($(array[i])).remove().draw(false);        
    
    fnagregarindex();
  
}
function fnverificarsielitemestaendetalle(idstock) {
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    if (tbldetalle.rows().data().length == 0)
        return false;
    var band = false;
    filas.forEach(function (e) {

        var aux = e.getAttribute('idstock');
        if (idstock == aux)
            band = true;
    });
    return band;
}
function fnlistarproductoslista(laboratorio) {
    if (laboratorio == '')
        return;
    swal({
        title: '¿Desea cargar productos del laboratorio '+laboratorio+'?',
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            lblMlaboratorio.innerText = laboratorio;
            $('#modalagregarproductoslab').modal('show');            
            
        }
        else {
            swal.close();
            cmblaboratorio.value = '';
        }
    });
}
function fnverificaratributosrequerid(idproducto,fila) {
    var cantidad = fila.getElementsByClassName('cantidad')[0].value;
    if (cantidad > 0) {
        try {
            var data = productos.find(obj => obj.idproducto == idproducto);

            fila.getElementsByClassName('cmbalmacen')[0].required = true;
            if (data.aceptalote)
                fila.getElementsByClassName('lote')[0].required = true;
            //if (data.aceptaregsanitario)
            //  reg = '<input class="regsanitario inputdetalle" type="text" required/>';
            if (data.aceptafechavence) {
                fila.getElementsByClassName('fechavencimiento')[0].required = true;
                fila.getElementsByClassName('fechavencimiento')[0].setAttribute('min', moment().format('YYYY-MM-DD'));
            }   
        } catch (e) {

        }
            
    }
    
        
}



