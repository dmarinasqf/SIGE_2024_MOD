var navgenericotab = document.getElementById('nav-generico-tab');
//genericos
var CGbtnbuscargenerico = document.getElementById('CGbtnbuscargenerico');
var CGtbldetallegenericos = document.getElementById('CGtbldetallegenericos');
var CGtbodygenerico = document.getElementById('CGtbodygenerico');
//accion farmacologica
var CGbtnbuscaraccionfarma = document.getElementById('CGbtnbuscaraccionfarma');
var CGtblaccionfarma = document.getElementById('CGtblaccionfarma');
var CGtbodyaccionfarma = document.getElementById('CGtbodyaccionfarma');
//principio activo
var CGbtnbuscarprincipio = document.getElementById('CGbtnbuscarprincipio');
var CGtbldetalleprincipio = document.getElementById('CGtbldetalleprincipio');
var CGtbodyprincipio = document.getElementById('CGtbodyprincipio');

navgenericotab.addEventListener('click', function () {
    //fnGNlistargenericos();
    fnGNlistarprincipiosactivos();
    fnGNlistaraccionesfarmacologicas();
});
$(document).on('click', '.MBGbtnseleccionargenerico', function () {
    var fila = this.parentNode.parentNode;
    var idgenerico = fila.getAttribute('idproducto');
   
    var obj = {
        idproducto: _IDPRODUCTO,
        idproductogenerico: idgenerico
    };
    let controller = new ProductoController();
    controller.RegistrarGenerico(obj, function (data) {
        $('#modalgenericos').modal('hide');
        fnGNlistargenericos();
    });
});
$(document).on('click', '.GNbtnquitargenerico', function () {
    var fila = this.parentNode.parentNode;
    var id = fila.getAttribute('iddetallegenerico');
    let controller = new ProductoController();
    controller.EliminarGenerico(id, function (data) {
        mensaje('S', 'Generico eliminado');
        fnGNlistargenericos();
    });
});
$(document).on('click', '.GNbtnactualizargenerico', function () {
    var fila = this.parentNode.parentNode;
    
    var obj = new DetalleGenerico();
    obj.iddetallegenerico = fila.getAttribute('iddetallegenerico');
    obj.idproductogenerico = fila.getAttribute('idproductogenerico');
    obj.idproducto = fila.getAttribute('idproducto');
    obj.codconcentracion = fila.getElementsByClassName('GNcodconcentracion')[0].value;
    let controller = new ProductoController();
    controller.EditarGenerico(obj, function (data) {
       // fnGNlistargenericos();
        fila.getElementsByClassName('GNbtnactualizargenerico')[0].classList.remove('bg-success');
    });
});

$(document).on('click', '.GNbtnquitarprincipio', function () {
    var fila = this.parentNode.parentNode;
    var id = fila.getAttribute('iddetalle');
    let controller = new ProductoController();
    controller.EliminarPrincipioACtivo(id, function (data) {
        mensaje('S', 'Principio activo eliminado');
        fnGNlistarprincipiosactivos();
    });
});
$(document).on('click', '.GNbtnactualizarprincipio', function () {
    var fila = this.parentNode.parentNode;

    var obj = new DetallePrincipioActivo();
    obj.iddetalle = fila.getAttribute('iddetalle');
    obj.idproducto = fila.getAttribute('idproducto');
    obj.idprincipio = fila.getAttribute('idprincipio');
    obj.codconcentracion = fila.getElementsByClassName('GNcodconcentracion')[0].value;
    obj.idunidadmedida = fila.getElementsByClassName('GNcmbuma')[0].value;
    let controller = new ProductoController();
    controller.RegistrarEditarPrincipio(obj, function (data) {      
        fila.getElementsByClassName('GNbtnactualizarprincipio')[0].classList.remove('bg-success');
    });
});
$(document).on('keyup', '.GNcodconcentracion', function () {
    var fila = this.parentNode.parentNode;    
    fila.getElementsByClassName('GNbtnactualizarprincipio')[0].classList.add('bg-success');
});
$(document).on('change', '.GNcmbuma', function () {
    var fila = this.parentNode.parentNode;
    fila.getElementsByClassName('GNbtnactualizarprincipio')[0].classList.add('bg-success');
});

$(document).on('dblclick', '#tbodyMPAprincipio tr', function () {
    var fila = this;
    console.log(fila);
    var idprincipio = fila.getAttribute('idprincipio');
    var obj = {
        idproducto: _IDPRODUCTO,
        idprincipio: idprincipio,
        iddetalle:0
    };
    let controller = new ProductoController();
    controller.RegistrarEditarPrincipio(obj, function (data) {
        $('#modalprincipioactivo').modal('hide');
        fnGNlistarprincipiosactivos();
    });
})

$(document).on('click', '.btnpasaraccionfarma', function () {
    var id = this.getAttribute('idaccionfarma');
    let controller = new ProductoController();
    var obj = {
        idaccionfarma: id,
        idproducto: _IDPRODUCTO
    };
    console.log(obj);
    controller.RegistrarAccionFarmacologica(obj, function (data) {
        $('#modalaccionesfama').modal('hide');
        fnGNlistaraccionesfarmacologicas();
    });
});
$(document).on('click', '.GNbtnquitaraccion', function () {
    var fila = this.parentNode.parentNode;
    var id = fila.getAttribute('iddetalleaccionfarma');
    let controller = new ProductoController();
    controller.EliminarAccionFarmacologica(id, function (data) {
        mensaje('S', 'Acción farmacologica eliminada');
        fnGNlistaraccionesfarmacologicas();
    });
});

function fnGNlistargenericos() {
    let controller = new ProductoController();
    controller.ListarGenericos(_IDPRODUCTO, function (data) {
       
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr idproducto="'+data[i].idproducto+'" idproductogenerico="' + data[i].idproductogenerico + '" iddetallegenerico="' + data[i].iddetallegenerico+'">';
            fila += '<td>' + data[i].iddetallegenerico+'</td>';
            fila += '<td>' + data[i].productogenerico+'</td>';
            fila += '<td><input class="GNcodconcentracion" value="' + data[i].codconcentracion + '" max="20"/></td>';
            fila += '<td>' + data[i].uma + '</td>';
            fila += '<td><button class="GNbtnactualizargenerico"><i class="fas fa-save"></i></button><button class="GNbtnquitargenerico"><i class="fas fa-trash"></i></button></td>';
            
            fila += '</tr>';
        }
        CGtbodygenerico.innerHTML = fila;
    });
}

function fnGNlistaraccionesfarmacologicas() {
    let controller = new ProductoController();
    controller.ListarAccionFarmacologica(_IDPRODUCTO, function (data) {       
        var fila = '';
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            fila += '<tr iddetalleaccionfarma="' + data[i].iddetalleaccionfarma+'" >';
            fila += '<td>' + data[i].iddetalleaccionfarma+'</td>';
            fila += '<td>' + data[i].acccionfarmacologica+'</td>';           
            fila += '<td><button class="GNbtnquitaraccion"><i class="fas fa-trash"></i></button></td>';
            
            fila += '</tr>';
        }
        CGtbodyaccionfarma.innerHTML = fila;
    });
}

function fnGNlistarprincipiosactivos() {
    let controller = new ProductoController();
    controller.ListarPrincipiosActivos(_IDPRODUCTO, function (data) {

        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr idproducto="' + data[i].idproducto + '" iddetalle="' + data[i].iddetalle + '" idprincipio="' + data[i].idprincipio + '">';          
            fila += '<td>' + data[i].principio + '</td>';
            fila += '<td><input class="form-control form-control-sm GNcodconcentracion" value="' + (data[i].codconcentracion??'') + '" max="20"/></td>';
            fila += '<td><select class="form-control form-control-sm GNcmbuma">' + document.getElementById('cmbuma').innerHTML + '</select></td>';
            fila += '<td><button class="GNbtnactualizarprincipio"><i class="fas fa-save"></i></button><button class="GNbtnquitarprincipio"><i class="fas fa-trash"></i></button></td>';

            fila += '</tr>';
        }
        CGtbodyprincipio.innerHTML = fila;
        var filas = CGtbodyprincipio.getElementsByTagName('tr');
        for (var i = 0; i < filas.length; i++) {
            filas[i].getElementsByClassName('GNcmbuma')[0].value = data[i].idunidadmedida;
        }
    });
}