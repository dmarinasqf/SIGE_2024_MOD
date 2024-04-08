var CD_cmbsucursal = $('#CD_cmbsucursal');
var CD_cmbsucursalalmacen = $('#CD_cmbsucursalalmacen');
var CD_txtidlaboratorio = $('#CD_txtidlaboratorio');
var CD_txtlaboratorio = $('#CD_txtlaboratorio');
var CD_cmbclase = $('#CD_cmbclase');
var CD_cmbsubclase = $('#CD_cmbsubclase');
var CD_txtproducto = $('#CD_txtproducto');
var CD_sugerido = document.getElementById('CD_sugerido');
var CD_ChkProductosNuevos = document.getElementById('CD_ChkProductosNuevos');

var CD_txtidproducto = $('#CD_txtidproducto');
var CD_txtidalmacensucursal = $('#CD_txtidalmacensucursal');
var CD_lblproducto = document.getElementById('CD_lblproducto');
var CD_spastockactual = document.getElementById('CD_lblstockactual');
var CD_lbllaboratorio = document.getElementById('CD_lbllaboratorio');
var limpiartbl = document.getElementById('limpiartbl');
//TABLA
var CD_tbldistribucion;
var CD_tblproductos;
var CD_timerbusqueda;
//ARRAYS
var CD_arrayguias = [];
var CD_arraydetaleproductos = [];
//lista de objetos
var CD_DetalleDistribucion = [];
var filaselecionadaAtrasDelante = null;
var ultimafiladato = 0;
$(document).ready(function () {
    CD_tblproductos = $('#CD_tblproductos').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE()
        //"columnDefs": [
        //    {
        //        "targets": [0],
        //        "visible": false,
        //        "searchable": false
        //    }
        //]
    });
    CD_cargarcombo_almacenes();
    CD_cargarcombo_clases();

});

function iniciarTablaDistribucion(idproducto) {

    CD_tbldistribucion = $('#CD_tbldistribucion').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "lengthMenu": [[10, 25, 50], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [idproducto],
                "visible": false,
                "searchable": false
            }
        ]
    });
}

function CD_cargarcombo_almacenes() {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursalEmpleado('', IDSUCURSAL, null, function (datos) {

        let data = JSON.parse(datos); // Ya es un array de objetos
        var almacenes = fnObtenerTipoALmacen(data);
        var cmb = document.getElementById("CD_cmbsucursalalmacen");
        cmb.innerHTML = "";
        for (var i = 0; i < almacenes.length; i++) {
            var tituloAlmacen = document.createElement("h6");
            tituloAlmacen.className = "dropdown-header";

            if (!(almacenes[i].includes("CUARENTENA"))) {
                var seCreoElemento = false; // Variable para verificar si se creó algún elemento en el segundo bucle

                if (almacenes[i]) {
                    tituloAlmacen.className += " text-primary";
                    tituloAlmacen.innerText = almacenes[i];
                } else {
                    tituloAlmacen.className += " text-danger";
                    tituloAlmacen.innerText = "NO ASIGNADO";
                }
                cmb.appendChild(tituloAlmacen);

                for (var j = 0; j < data.length; j++) {
                    if (almacenes[i] === data[j].almacen && !(data[j].areaalmacen.includes("CUARENTENA"))) {
                        var a = document.createElement("a");
                        a.className = "dropdown-item";

                        var input = document.createElement("input");
                        input.className = "form-check-input chkAlmacen";
                        input.type = "checkbox";
                        input.id = data[j].idalmacensucursal;
                        input.value = data[j].idalmacensucursal;
                        input.name = "Almacen " + data[j].idalmacensucursal;
                        var label = document.createElement("label");
                        label.className = "form-check-label";
                        label.setAttribute("for", data[j].idalmacensucursal);
                        label.innerText = data[j].areaalmacen + ' ' + data[j].idtipoproducto;

                        a.appendChild(input);
                        a.appendChild(label);

                        cmb.appendChild(a);
                        seCreoElemento = true; // Se establece en true porque se creó al menos un elemento
                    }
                }

                // Ocultar el título si no se creó ningún elemento en el segundo bucle
                if (!seCreoElemento) {
                    tituloAlmacen.style.display = "none";
                }
            }
        }
    
    });
}

var arrayClasesGeneral = [];
function CD_cargarcombo_clases() {
    var cmb = document.getElementById("CD_cmbclase");
    cmb.innerHTML = "";

    for (var j = 0; j < lListaClases.length; j++) {
        if (lListaClases[j].estado == "HABILITADO"){
            var a = document.createElement("a");
            a.className = "dropdown-item";
            //a.href = "#!";

            var input = document.createElement("input");
            input.className = "form-check-input chkClase";
            input.type = "checkbox";
            input.id = lListaClases[j].idclase;
            input.value = lListaClases[j].idclase;
            input.name = "Clase " + lListaClases[j].idclase;
            var label = document.createElement("label");
            label.className = "form-check-label";
            label.setAttribute("for", lListaClases[j].idclase);
            label.innerText = lListaClases[j].descripcion;

            arrayClasesGeneral.push([lListaClases[j].idclase, lListaClases[j].descripcion]);

            a.appendChild(input);
            a.appendChild(label);

            cmb.appendChild(a);
        }
    }
}

//EVENTOS
$('#CD_txtlaboratorio').click(function () {
    $('#ML_idmodallaboratorio').modal();
});
$('#limpiartbl').click(function () {
    CD_limpiarpanelbusqueda();
});

window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


//$(document).on('click', '.ML_btnpasarlaboratorio', function (e) {
//    var columna = ML_tbllaboratorio.row($(this).parents('tr')).data();
//    var arrLaboratorioFiltro = [];
//    arrLaboratorioFiltro.push(columna[0]);
//    CD_txtidlaboratorio.val(columna[0]);
//    CD_txtlaboratorio.val(columna[1]);
//    $('#ML_idmodallaboratorio').modal('hide');
//    CD_ListarProductos();
//});

$(document).on('click', '.close', function (e) {
    var arrIdLabs = [];
    var checkbox = document.getElementById('CD_sugerido');
    ML_tbllaboratorio.$('.checkboxLaboratorio').each(function () {
        let inic = $(this);
        if (inic[0].checked) {
            let idlaboratorio = $(this).attr('idlaboratorio');
            let descripcion = $(this).attr('descripcion');
            arrIdLabs.push({ idlaboratorio, descripcion });
        }
    });

    if (arrIdLabs.length > 0) {
        var desLabs = "";
        var idLabs = "";
        for (var i = 0; i < arrIdLabs.length; i++) {
            if (i == 0) {
                desLabs += arrIdLabs[i].descripcion;
                idLabs += arrIdLabs[i].idlaboratorio;
            } else {
                desLabs += ", " + arrIdLabs[i].descripcion;
                idLabs += "," + arrIdLabs[i].idlaboratorio;
            }
        }
        CD_txtlaboratorio.val(desLabs);
        CD_txtidlaboratorio.val(idLabs);
    } else {
        CD_txtlaboratorio.val("");
        CD_txtidlaboratorio.val("");
    }
    // Verifica si el checkbox está marcado
    if (checkbox.checked) {
        procesarCheckbox();
        // Aquí puedes realizar acciones adicionales si el checkbox está marcado
    } else {

        CD_ListarProductos();
    }
 
});

function CD_fncargaproductoseleccionado(idproducto, nombreproducto, laboratorio, stockactual, idalmacensucursal, codigoproducto) {
    fncd_guardardatostabla();
    let iditem = idproducto;
    //let posnuevoitem = cdfn_buscaritemdistribucion(iditem);

    CD_txtidproducto.val(iditem);
    CD_txtidalmacensucursal.val(idalmacensucursal);
    CD_lblproducto.innerHTML = nombreproducto;
    CD_lbllaboratorio.innerHTML = laboratorio;
    CD_spastockactual.innerHTML = stockactual;
    CD_listarSucursalesDistribuir(iditem, CC_cmbrango.val(), codigoproducto).then(r => {

        cdfn_cargaritemspreguardados(iditem);
    }).catch((error) => { console.log('ALGO SALIO MAL' + error); console.log(error); DESBLOQUEARCONTENIDO('contenedordistribucion'); });
}

function fncd_guardardatostabla() {
  console.log(CD_arrayguias);
    if (CD_arrayguias.length == 0) 
        CD_fnCargarGuiasSucursales();
    CD_fnGuardarDetallexSucursal();
}

function CD_fnGuardarDetallexSucursal() {
    var array = [];
    var c = 0;
    var cantidadenviar = 0;
    try {
        let datatable = CD_tbldistribucion.rows().data();
        if (!(datatable.length > 0))
            null;
        var filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
        filas.forEach(function (e) {
            let posguia = CD_fnBuscarGuiaDistribucion(datatable[c][0]);
            let detalle = new ADetalleGuiaSalida();
            detalle.idsucursaldestino = (datatable[c][0] === '') ? '0' : datatable[c][0];
            detalle.idproducto = (datatable[c][getRango() + 7] === '') ? '0' : datatable[c][getRango() + 7];
            detalle.laboratorio = CD_lbllaboratorio.innerHTML;
            detalle.producto = CD_lblproducto.innerHTML;
            detalle.cantidadgenerada = document.getElementsByClassName("cd_txtcantidadindividual")[c].value;
            detalle.idalmacensucursalorigen = CD_txtidalmacensucursal.val();
            cantidadenviar = parseFloat(detalle.cantidadgenerada);
            console.log(detalle);
            //aca log
            if (cantidadenviar > 0)
                CD_fnGuardarDetalle(posguia, detalle);
            else
                CD_fnRevisarRegistro(posguia, detalle);
            c++;
        });
        if (total > 0) {
            let objdetalledistribucion = new detalledistribucion();
            objdetalledistribucion.idproducto = CD_txtidproducto.val();
            objdetalledistribucion.detalle = JSON.stringify(array);
            return objdetalledistribucion;
        } else
            return null;

    } catch (error) {
        return null
    }
}
//FUNCIONES DE GUARDADO EN ARRAYS
function CD_fnGuardarDetalle(pos, obj) {
    //aca otro log
    let posdetalle = CD_fnBuscarDetalleGuiaDistribucion(pos, obj.idproducto);
    let detalle = [];
    let stringdetalle = CD_arrayguias[pos].jsondetalle;
    if (stringdetalle.length > 0)
        detalle = JSON.parse(stringdetalle);
    else
        detalle = [];

    if (posdetalle == -1) {
        detalle[detalle.length] = obj;
        console.log(detalle,obj);
        CD_arrayguias[pos].jsondetalle = JSON.stringify(detalle);
    }
    else {
        detalle[posdetalle] = obj;
        CD_arrayguias[pos].jsondetalle = JSON.stringify(detalle);
    }
}

//ELIMINAR SI ESTÁ EL ITEM PERO SE MODIFICÓ A 0
function CD_fnRevisarRegistro(pos, obj) {
    let posdetalle = CD_fnBuscarDetalleGuiaDistribucion(pos, obj.idproducto);
    let detalle = [];
    let stringdetalle = CD_arrayguias[pos].jsondetalle;
    if (stringdetalle.length > 0) {
        detalle = JSON.parse(stringdetalle);
        if (posdetalle >= 0) {
            detalle.splice(posdetalle, 1);
            CD_arrayguias[pos].jsondetalle = JSON.stringify(detalle);
        }
    }
}

//CARGA LAS GUIAS DE ACUERDO A LA SUCURSAL
function CD_fnCargarGuiasSucursales() {
    var c = 0;
    try {
        let datatable = CD_tbldistribucion.rows().data();
        if (!(datatable.length > 0))
            null;
        var filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
        filas.forEach(function (e) {
            let guia = new AGuiaSalida();
            guia.idempresa = IDEMPRESA;
            guia.idsucursal = IDSUCURSAL;
            guia.idsucursaldestino = (datatable[c][0] === '') ? '0' : datatable[c][0];
            guia.sucursaldestino = (datatable[c][1] === '') ? '' : datatable[c][1];
            guia.idcorrelativo = $('#CC_cmbserie option:selected').attr('idcorrelativo');
            guia.idcaja = $('#CC_cmbserie option:selected').attr('idcaja');
            guia.encargado = NOMBREUSUARIO;
            guia.idalmacensucursalorigen = CD_txtidalmacensucursal.val();
            guia.seriedoc = $('#CC_cmbserie').val();
            guia.fechatraslado = CC_fechatraslado.val();
            CD_arrayguias[c] = guia;

            c++;
        });
    } catch (error) {
        return null
    }
}
//FUNCIONES DE BUSQUEDA EN ARRAYS
function CD_fnBuscarGuiaDistribucion(idsucursaldestino) {
    for (let i = 0; i < CD_arrayguias.length; i++) {
        if (CD_arrayguias[i].idsucursaldestino == idsucursaldestino) {
            return i;
        }
    }
    return -1;
}

function CD_fnBuscarDetalleGuiaDistribucion(pos, idproducto) {
    if (CD_arrayguias[pos].jsondetalle.length > 0) {
        let detalle = JSON.parse(CD_arrayguias[pos].jsondetalle);
        for (let i = 0; i < detalle.length; i++) {
            if (detalle[i].idproducto == idproducto) {
                return i;
            }
        }
        return -1;
    }
    else {
        return -1;
    }

}

//FUNCIONES PARA PRODUCTOS
function CD_limpiarpanelbusqueda() {
    CD_txtidlaboratorio.val('');
    CD_txtlaboratorio.val('');
    CD_cmbclase.val('');
    CD_cmbsubclase.val('');
    CD_txtproducto.val('');
    CD_ListarProductosnuevo();
    modalAbiertoPrimeraVez = true;
    // Codigo para deselecionar ckeck de sugerido a enviar
    $('#CD_sugerido').prop('checked', false);
}

function CD_ListarProductos() {
    let controller = new ProductoController();
    var contadorInterno = 0;
    var sSucursalAlmacen = "";
    var obj = $('#CC_form-registro').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("Almacen")) {
            if (contadorInterno == 0)
                sSucursalAlmacen += obj[i].value;
            else
                sSucursalAlmacen += "_" + obj[i].value;

            contadorInterno += 1;
        }
    }

    contadorInterno = 0;
    var sClases = "";
    var obj = $('#CD_form-panel-busqueda-producto').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("Clase")) {
            if (contadorInterno == 0)
                sClases += obj[i].value;
            else
                sClases += "," + obj[i].value;

            contadorInterno += 1;
        }
    }

    contadorInterno = 0;
    var sSubClases = "";
    var obj = $('#CD_form-panel-busqueda-producto').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("SubClas")) {
            if (contadorInterno == 0)
                sSubClases += obj[i].value;
            else
                sSubClases += "," + obj[i].value;

            contadorInterno += 1;
        }
    }

    let params = {
        tipoproducto: '',
        codigo: '',
        nombreproducto: CD_txtproducto.val(),
        laboratorio: CD_txtidlaboratorio.val(),
        clase: sClases,
        subclase: sSubClases,
        estado: 'HABILITADO',
        idsucursalalmacen: sSucursalAlmacen,//CD_cmbsucursalalmacen.val()
        top: '100'
    };

    BLOQUEARCONTENIDO('contenedortblproductos', 'Guardando datos lv...');
    controller.ListarProductosxAlmacenSucursal(params, CD_cargarProductos);
    modalAbiertoPrimeraVez = true;

}

function CD_ListarProductosnuevo() {
    var contadorInterno = 0;
    var sSucursalAlmacen = "";
    var obj = $('#CC_form-registro').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("Almacen")) {
            if (contadorInterno == 0)
                sSucursalAlmacen += obj[i].value;
            else
                sSucursalAlmacen += "_" + obj[i].value;

            contadorInterno += 1;
        }
    }
    //let arrSucursalAlmacen = CD_cmbsucursalalmacen.val();
    //let sSucursalAlmacen = "";
    //for (let i = 0; i < arrSucursalAlmacen.length; i++) {
    //    if (i > 0) {
    //        sSucursalAlmacen += "_";
    //    }
    //    sSucursalAlmacen += arrSucursalAlmacen[i];
    //}

    let controller = new ProductoController();
    let params = {
        tipoproducto: '',
        codigo: '',
        nombreproducto: '',
        laboratorio: '',
        clase: '',
        estado: 'HABILITADO',
        idsucursalalmacen: sSucursalAlmacen,
        top: '100'
    };

    BLOQUEARCONTENIDO('contenedortblproductos', 'Guardando datos...');
    controller.ListarProductosxAlmacenSucursal(params, CD_cargarProductos);
}

function CD_ProductosNuevosDistribucion() {
    var contadorInterno = 0;
    var sSucursalAlmacen = "";
    var obj = $('#CC_form-registro').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("Almacen")) {
            if (contadorInterno == 0)
                sSucursalAlmacen += obj[i].value;
            else
                sSucursalAlmacen += "," + obj[i].value;

            contadorInterno += 1;
        }
    }

    let controller = new ProductoController();
    let params = {
        idsucursalalmacen: sSucursalAlmacen
    };

    BLOQUEARCONTENIDO('contenedortblproductos', 'Guardando datos...');
    controller.ListarProductosNuevosDistribucion(params, CD_cargarProductos);
}

function CD_cargarProductos(data) {
    if (data.length > 0) {
        CD_tblproductos.clear().draw(false);
        let totalRegistros = 0; // Variable para almacenar la cantidad de registros

        for (let j = 0; j < data.length; j++) {
            if (data[j].mensaje === "ok") {
                let datos = JSON.parse(data[j].objeto);
                datos.sort(function (x, y) {
                    if (x.LABORATORIO < y.LABORATORIO) {
                        return -1;
                    }
                    if (x.LABORATORIO > y.LABORATORIO) {
                        return 1;
                    }

                    if (x.ABC < y.ABC) {
                        return -1;
                    }
                    if (x.ABC > y.ABC) {
                        return 1;
                    }

                    if (x.stockactual < y.stockactual) {
                        return -1;
                    }
                    if (x.stockactual > y.stockactual) {
                        return 1;
                    }
                });
                totalRegistros += datos.length; // Suma la cantidad de registros
                for (let i = 0; i < datos.length; i++) {
                    ultimafiladato += 1;
                    let fila = CD_tblproductos.row.add([
                        datos[i]["ID"],
                        datos[i]["CODIGO"],
                        datos[i]["ABREVIATURA"],
                        datos[i]["LABORATORIO"],
                        datos[i]["STOCKACTUAL"],
                        datos[i]["STOCKINDIVIDUAL"],
                        datos[i]["ABC"],
                        '<button class="btn btn-xs btn-success CD_btnpasarproducto"><i class="fas fa-check fa-1x"></i></button>'
                        + '<button class="btnanalisisproducto " codigo="' + datos[i]["CODIGO"] + '" producto="' + datos[i]["ABREVIATURA"] + '" laboratorio="' + datos[i]["LABORATORIO"] + '"  idproducto="' + datos[i]["ID"] + '"  idproveedor="' + datos[i]["IDPROVEEDOR"] + '"><i class="fas fa-cash-register"></i></button>'
                    ]).draw(false).nodes();
                    $(fila).attr('tabindex', i);
                    $(fila).attr('onkeydown', 'movertabla(' + i + ')');
                    $(fila).attr('idalmacensucursal', datos[i]["IDALMACENSUCURSAL"]);
                }
            }
        }
        $("#numRegistros").text(totalRegistros);
        DESBLOQUEARCONTENIDO('contenedortblproductos');
    } else {
        DESBLOQUEARCONTENIDO('contenedortblproductos');
    }
    ML_buscarLaboratorio();
}

var popupanalisis = null;
var idanterioranalisis = '';
$(document).on('click', '.btnanalisisproducto', function (e) {
    var fila = this.parentNode.parentNode;
    var idproducto = this.getAttribute('idproducto');
    var idproveedor = null;
    var producto = this.getAttribute('CODIGO');
    var codigo = this.getAttribute('producto');
    var lab = this.getAttribute('LABORATORIO');
    //var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto?idproducto=' + idproducto + '&&idproveedor=' + idproveedor;
    var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto';
    if (popupanalisis == null || popupanalisis.closed) {
        idanterioranalisis = idproducto;
        popupanalisis = window.open(url, "Análisis de producto", 'width=1100,height=600,Titlebar=NO,Toolbar=NO');
        popupanalisis.addEventListener('DOMContentLoaded', function () {
            popupanalisis.focus();
            popupanalisis._idproductoanalisis = idproducto;
            popupanalisis._idproveedoranalisis = idproveedor;
            popupanalisis.fnBuscarPrecioProducto(idproducto);
            popupanalisis.fnBuscarProducto(idproducto);
            popupanalisis.fnbuscaranalisis();
            //popupanalisis.txtcodarticuloanalisis.value = fila.getElementsByClassName('detalle_codpro')[0].innerText;
            popupanalisis.txtcodarticuloanalisis.value = producto;
            popupanalisis.txtarticulodescripcionanalisis.value = codigo;
            popupanalisis.txtlaboratorionombreanalisis.value = lab;
        });
    }
    else {
        if (idanterioranalisis != idproducto) {
            popupanalisis._idproductoanalisis = idproducto;
            popupanalisis._idproveedoranalisis = idproveedor;
            popupanalisis.fnBuscarPrecioProducto(idproducto);
            popupanalisis.fnBuscarProducto(idproducto);
            popupanalisis.fnbuscaranalisis();
        }
        idanterioranalisis = idproducto;
        popupanalisis.focus();
        popupanalisis.txtcodarticuloanalisis.value = fila.getElementsByClassName('detalle_codpro')[0].innerText;
        popupanalisis.txtarticulodescripcionanalisis.value = fila.getElementsByClassName('detalle_nompro')[0].innerText;
        popupanalisis.txtlaboratorionombreanalisis.value = fila.getElementsByClassName('laboratorio')[0].innerText;
    }
});

//LISTA LOS DATOS DE TODAS LAS SUCURSALES DE ACUERDO A UN PRODUCTO Y RANGO
function CD_listarSucursalesDistribuir(idproducto, rango, codigoproducto) {
    var rp = CD_sugerido.checked;
    var rps = parseInt(0);
    if (rp == true) {
        rps = parseInt(0);
    }
    BLOQUEARCONTENIDO('contenedordistribucion', 'CARGANDO ...');
    return new Promise(function (resolve, reject) {
        let url = ORIGEN + "/Almacen/AGuiaSalida/ListarSucursalDistribuir/";
        let obj = {
            idproducto: idproducto,
            rango: rango,
            sucursales: listasucursalesseleccionadas.join('|'),
            tipo: rps
        };
        $.post(url, obj).done(function (data) {
            DESBLOQUEARCONTENIDO('contenedordistribucion');
            if (data.mensaje === "ok") {
                {
                    let datos = JSON.parse(data.objeto);
                    if (CD_spastockactual.innerHTML == "0") {
                        for (let i = 0; i < datos.length; i++) {
                            datos[i].SUGERIDO_ENVIAR = 0;
                        }
                    }
                    limpiarTablasGeneradas('#CD_tabla-distribucion', 'CD_tbldistribucion', true, 'thead-dark');
                     CD_crearCabeceras(datos, "#CD_tbldistribucion", true, codigoproducto);
                     CD_crearCuerpo(datos, '#CD_tbldistribucion');
                    iniciarTablaDistribucion(getRango() + 7);
                }
            }
            else
                mensaje("W", data.mensaje);

            resolve("ok");
        }).fail(function (data) {
            DESBLOQUEARCONTENIDO('contenedordistribucion');
            resolve(data);
            mensaje("D", 'Error en el servidor');
        });
    });
}

function CD_crearCabeceras(datos, tablename, sticky, codigoproducto) {
    var stick = '';
    if (sticky)
        stick = 'class="header-sticky"';
    var cabeceras = GetHeaders(datos);
    let rango = getRango() + 1;
    var nuevaFila = "<tr>";
    for (var i = 0; i < cabeceras.length; i++) {
        nuevaFila += "<th " + stick + ">" + cabeceras[i] + "</th>";
        if (i == 1) {
            for (var j = rango; j > 0; j--) {
                var headerLabel = codigoproducto.startsWith("EC") ? "CONSUMO " : "VENTAS ";
                //moment.locale('es');
                //if (j === rango)
                //    nuevaFila += "<th " + stick + ">" + 'VENTAS ' + moment().subtract(1, 'years').format('YYYY/MM') + "</th>";
                //else
                nuevaFila += "<th " + stick + ">" + headerLabel + moment().subtract(j - 1, 'months').format('YYYY/MM') + "</th>";
            }
            i = rango + 1;
        }
    }
    nuevaFila += "<th " + stick + ">" + "STOCK A ENVIAR" + "</th>";
    nuevaFila += "</tr>";
    $(tablename + ' thead').append(nuevaFila);
}
//agregar datos a la tabla de stock a enviar
function CD_crearCuerpo(datos, tablename) {
    var fila = "";
    let stockdisponible = parseFloat(CD_lblstockactual.innerHTML);
    var totalSugeridoEnviar = 0;

    for (var i = 0; i < listasucursalesseleccionadas.length; i++) {
        for (let h = 0; h < datos.length; h++) {
            if (listasucursalesseleccionadas[i] == datos[h]["IDSUCURSAL"]) {
                fila += '<tr>';
                var valores = GetValores(datos[h]);
                var cabeceras = GetHeaders(datos);
                console.log(cabeceras);
                var stock_enviar = 0;
                for (var j = 0; j < valores.length; j++) {
                    if (cabeceras[j] == 'STOCK ACTUAL') {
                        fila += '<td class="text-right" style="font-size:15px;font-weight:bold">' + valores[j] + "</td>";
                    } else if (cabeceras[j] == 'SUCURSAL') {
                        fila += '<td>' + valores[j] + "</td>";
                    } else if (cabeceras[j] == 'SUGERIDO_ENVIAR') {
                        fila += '<td class="text-right">' + valores[j] + "</td>";
                        stock_enviar = parseFloat(valores[j]);
                        totalSugeridoEnviar += stock_enviar;
                    } else {
                        fila += '<td class="text-right">' + valores[j] + "</td>";
                    }
                }
                fila += `<td> <input type="number" class="text-center cd_txtcantidadindividual" style="width:100px;" value="${stock_enviar}" min="0"/> </td>`;
                fila += '</tr>';
                break;
            }
        }
    }
    
    // Agregar una fila adicional al final con el total de la columna 'SUGERIDO_ENVIAR'
    fila += '<tr>';
    for (var k = 0; k < cabeceras.length; k++) {
        fila += '<td></td>';
    }
    fila += `<td><label style="font-size:25px;font-weight:bold;color:red;text-align:center;display:block;" id="CD_lbltotalguia">0</label></td>`;
    fila += '</tr>';
    
        $(tablename + " tbody").append(fila);

        var todasLasFilas = $(tablename + " tbody tr");
        var estadovista = true;
        var stockdisponiblerestante = stockdisponible;
        todasLasFilas.each(function () {
            var cantidadInput = $(this).find('.cd_txtcantidadindividual');
            var cantidad = parseFloat(cantidadInput.val());

                if (stockdisponiblerestante > 0) {

                    if (cantidad >= stockdisponible) {
                        cantidadInput.val(stockdisponiblerestante);
                            stockdisponiblerestante = stockdisponiblerestante - cantidad;
                    } else {
                        // Si no cumple la condición, establecer a cero
                        cantidadInput.val(cantidad);
                    }
                } else {
                    cantidadInput.val(0);
                }
        });

    if (totalSugeridoEnviar > stockdisponible)
        totalSugeridoEnviar = stockdisponible;
        
    CD_lbltotalguia.textContent = totalSugeridoEnviar;

    }
//CONTROLAR LA CANTIDAD DE LOS REGISTROS ESTÉ DENTRO DEL STOCK
$(document).on('change keyup', '.cd_txtcantidadindividual', function () {
    let cantidad = $(this).val();
    if (cantidad === '' || cantidad === 0) { cantidad = 0; $(this).val(0); }
    let stockdisponible = parseFloat(CD_lblstockactual.innerHTML);
    let total = fncd_calcularmontos();
    let diferencia = stockdisponible - total;
    let subtotal = total - cantidad;
    let faltante = stockdisponible - subtotal;
    if (diferencia < 0) {
        mensaje("I", "Usted solo cuenta con <strong>" + faltante + "</strong> Unidades");
        $(this).val(faltante);
    }
    CD_lbltotalguia.textContent = fncd_calcularmontos();
});
//SUMA LAS CANTIDADES DE LA TABLA
function fncd_calcularmontos() {
    let filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
    filas = Array.from(filas).slice(0, -1);
    let c = 0;
    let total = 0.0;
    let datatable = CD_tbldistribucion.rows().data().length-1;
    if (datatable > 0)
        filas.forEach(function (e) {
            cantidad = parseFloat(document.getElementsByClassName("cd_txtcantidadindividual")[c].value);
            if (isNaN(cantidad) || cantidad < 1) {
                document.getElementsByClassName("cd_txtcantidadindividual")[c].value = "0";
                cantidad = 0;
            }
            total += cantidad;
            c++;
        });
    return total;
}
//CAPTURA DATOS DE LA TABLA
function fncd_obtenerDatosDetalle() {
    var array = [];
    var c = 0;
    var total = 0;
    try {
        let datatable = CD_tbldistribucion.rows().data();
        if (!(datatable.length > 0))
            null;
        var filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
        filas.forEach(function (e) {
            let detalle = new Object();
            detalle.idsucursaldestino = (datatable[c][0] === '') ? '0' : datatable[c][0];
            detalle.idproducto = (datatable[c][getRango() + 7] === '') ? '0' : datatable[c][getRango() + 7];
            detalle.laboratorio = CD_lbllaboratorio.innerHTML;
            detalle.cantidadgenerada = document.getElementsByClassName("cd_txtcantidadindividual")[c].value;
            total += parseFloat(detalle.cantidadgenerada);
            //if (total > 0)
            array[c] = detalle;
            c++;
        });
        if (total > 0) {
            let objdetalledistribucion = new detalledistribucion();
            objdetalledistribucion.idproducto = CD_txtidproducto.val();
            objdetalledistribucion.detalle = JSON.stringify(array);
            return objdetalledistribucion;
        } else
            return null;

    } catch (error) {
        return null;
    }
}
//BUSCAR SI EL ITEM YA ESTÁ REGISTRADO
function cdfn_buscaritemdistribucion(id) {
    var pos = -1;
    for (let i = 0; i < CD_arrayguias.length; i++) {
        let detalle = JSON.parse(CD_arrayguias[i].jsondetalle);
        for (let j = 0; j < detalle.length; j++) {
            if (detalle[j].idproducto == id) {
                pos = i;
                break;
            }
        }

    }
    return pos;
}

function cdfn_eliminaritemdistribucion(pos) {
    //CD_DetalleDistribucion.splice(pos, 1)
}

//CARGAR LOS VALORES QUE ESTÁN PREGUARDADOS.
function cdfn_cargaritemspreguardados(idproducto) {
    let datatable = CD_tbldistribucion.rows().data();
    let totalprecargado = 0;
    let pdetalle = false;
    for (let i = 0; i < CD_arrayguias.length; i++) {
        if (datatable[i][0] == CD_arrayguias[i].idsucursaldestino) {
            let stringdetalle = CD_arrayguias[i].jsondetalle;
            if (stringdetalle.length > 0) {
                detalle = JSON.parse(stringdetalle);
                let posdetalle = CD_fnBuscarDetalleGuiaDistribucion(i, idproducto);
                if (posdetalle >= 0) {
                    pdetalle = true;
                    document.getElementsByClassName("cd_txtcantidadindividual")[i].value = detalle[posdetalle].cantidadgenerada;
                    totalprecargado += parseInt(detalle[posdetalle].cantidadgenerada);
                }
            }
        }
    }
    if (pdetalle) 
        CD_lbltotalguia.textContent = totalprecargado;
}

$('#btnnuevoregistro').click(function () {
    //LIMPIAR ARRAYS
    modalAbiertoPrimeraVez = true;
    listasucursalesseleccionadas = [];
    CD_arrayguias = [];
    CC_cmbrango.val("");
    //LIMPIAR PANEL DE BUSQUEDA
    $('#CD_form-panel-busqueda-producto').trigger('reset');
    CD_txtidlaboratorio.val('');
    //LIMPIAR DESCRIPCIÓN DE ITEM
    CD_txtidproducto.val("");
    CD_lblproducto.innerHTML = "";
    CD_lbllaboratorio.innerHTML = "";
    CD_spastockactual.innerHTML = "";
    //LIMPIAR CHECKBOXS
    let cheks = document.getElementsByClassName('checkbox');
    for (let i = 0; i < cheks.length; i++) {
        cheks[i].checked = false;
    }
    $('#btnpreview').click();
});

$('#cdbtn_validar').click(function ()
{
    fncd_guardardatostabla();
    console.log("CD_arrayguias:", CD_arrayguias);
    
    const resultadoTransformado = fncd_guardardatostabla();
    console.log("detallestockactual:", resultadoTransformado);
    CG_fnCargarGuias();
    $('#btnnextviewdistribucion').click();
});



//EVENTOS DE BUSQUEDA DE PRODUCTO
CD_cmbclase.change(function () {

    var sClases = "";
    var obj = $('#CD_form-panel-busqueda-producto').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("Clase")) {
            if (i == 0)
                sClases += obj[i].value;
            else
                sClases += "," + obj[i].value;
        }
    }
    var arrayClases = sClases.split(",");

    //var cmb = document.getElementById('CD_cmbsubclase');
    //cmb.innerHTML = '';
    //var option = document.createElement('option');
    //option.value = '';
    //option.text = '[SELECCIONE]';
    //cmb.appendChild(option);

    var cmb = document.getElementById("CD_cmbsubclase");
    cmb.innerHTML = "";
    for (var j = 0; j < arrayClases.length; j++) {
        var tituloClase = document.createElement("h6");
        tituloClase.className = "dropdown-header text-primary";

        var objclase = arrayClasesGeneral.filter(x => x[0] == arrayClases[j]);

        tituloClase.innerText = objclase[0][1];
        cmb.appendChild(tituloClase);

        for (var i = 0; i < lListaSubClases.length; i++) {
            if (lListaSubClases[i].idclase == arrayClases[j]) {

                var a = document.createElement("a");
                a.className = "dropdown-item";

                var input = document.createElement("input");
                input.className = "form-check-input";
                input.type = "checkbox";
                input.id = lListaSubClases[i].idsubclase;
                input.value = lListaSubClases[i].idsubclase;
                input.name = "SubClas " + lListaSubClases[i].idsubclase;
                var label = document.createElement("label");
                label.className = "form-check-label";
                label.setAttribute("for", lListaSubClases[i].idsubclase);
                label.innerText = lListaSubClases[i].descripcion;

                a.appendChild(input);
                a.appendChild(label);

                cmb.appendChild(a);
            }
        }
    }

    CD_ListarProductos();
});
CD_cmbsubclase.change(function () {
    CD_ListarProductos();
});

CD_txtlaboratorio.on('keyup', function (e) {
    clearTimeout(CD_timerbusqueda);
    var $this = this;
    CD_timerbusqueda = setTimeout(function () {
        if (e.key != 'Enter') {
            CD_ListarProductos();
        }

    }, 1000);
});

CD_txtproducto.on('keyup', function (e) {
    clearTimeout(CD_timerbusqueda);
    var $this = this;
    CD_timerbusqueda = setTimeout(function () {
        if (e.key != 'Enter') {
            CD_ListarProductos();
        }

    }, 1000);

});
//eventos de tablas
//CLICK EN CUALQUIER COLUMNA SELECCIONA EL PRODUCTO
$("#CD_tblproductos tbody").on('click', 'tr', function () {
    $(this).addClass('selected').siblings().removeClass('selected');
    let idproducto = $(this).find('td').eq(0).html();
    let nombreproducto = $(this).find('td').eq(2).html();
    let laboratorio = $(this).find('td').eq(3).html();
    let stockactual = $(this).find('td').eq(4).html();
    let codigoproducto = $(this).find('td').eq(1).html();
    let idalmacensucursal = this.getAttribute("idalmacensucursal");
    let tabindex = parseInt(this.getAttribute("tabindex"), 10);
    filaselecionadaAtrasDelante = parseInt(tabindex, 10);
    CD_fncargaproductoseleccionado(idproducto, nombreproducto, laboratorio, stockactual, idalmacensucursal, codigoproducto);

});
//BAJAR Y SUBIR CON TECLADO
function MANEJAR_TABLA_PERSONALIZADO(tabla) {
    var event = window.event;
    var rows = document.getElementById(tabla).getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;
    $("#" + tabla + " tbody tr").removeClass('selected');
    if (event.keyCode == 40) { //down
        var idx = $("#" + tabla + " tbody tr:focus").attr("tabindex");
        idx++;
        //console.log(idx);
        if (idx >= rows - 1) {
            idx = rows - 1;
        }
        $("#" + tabla + " tbody tr[tabindex=" + idx + "]").focus();
    }
    else if (event.keyCode == 38) { //up
        var idx = $("#" + tabla + " tbody tr:focus").attr("tabindex");

        idx--;// console.log(idx);
        if (idx < 0) {
            idx = 0;
        }
        $("#" + tabla + " tbody tr[tabindex=" + idx + "]").focus();
    }
    else {
        var idx = $("#" + tabla + " tbody tr:focus").attr("tabindex");
        $("#" + tabla + " tbody tr[tabindex=" + idx + "]").focus();
    }
    $("#" + tabla + " tbody tr[tabindex=" + idx + "]").addClass('selected');
    let idproducto = $("#" + tabla + " tbody tr[tabindex=" + idx + "]").find('td').eq(0).html();
    let nombreproducto = $("#" + tabla + " tbody tr[tabindex=" + idx + "]").find('td').eq(2).html();
    let laboratorio = $("#" + tabla + " tbody tr[tabindex=" + idx + "]").find('td').eq(3).html();
    let stockactual = $("#" + tabla + " tbody tr[tabindex=" + idx + "]").find('td').eq(4).html();
    let codigoproducto = $("#" + tabla + " tbody tr[tabindex=" + idx + "]").find('td').eq(1).html();
    CD_fncargaproductoseleccionado(idproducto, nombreproducto, laboratorio, stockactual, codigoproducto);
}

function movertabla(idtr) {
    test(event, idtr);
}
function test(event, idtr) {
    //const value = event.target.value;
    //idtr = parseFloat(idtr);
    if (event.keyCode == '40') {
        //ArrowDown
        CD_tblproductos.$('tr.selected').removeClass('selected');
        var filas = document.querySelectorAll('#CD_tblproductos tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.attributes.getNamedItem('tabindex').nodeValue);
            rs = parseFloat(rs);
            if (rs == idtr) {
                rpt = rs + 1;
            }
            if (filas.length >= rpt) {
                if (rs == rpt) {
                    e.className = e.className + ' selected';
                    $("tr[tabindex=" + rpt + "]").focus();
                    //(e.attributes.getNamedItem('tabindex')).focus();
                } if (filas.length <= rpt) {
                    e.className = e.className + ' selected';
                    $("tr[tabindex=" + rpt + "]").focus();
                }
            } else {
                filas.forEach(function (e) {
                    var rs = parseFloat(e.attributes.getNamedItem('tabindex').nodeValue);
                    rs = parseFloat(rs);
                    if (rs == filas.length) {
                        e.className = e.className + ' selected';
                        $("tr[tabindex=" + rpt + "]").focus();
                        //(e.attributes.getNamedItem('tabindex')).focus();
                    }
                });
            }
        });
    }
    if (event.keyCode == '38') {
        //ArrowUp
        CD_tblproductos.$('tr.selected').removeClass('selected');
        var filas = document.querySelectorAll('#CD_tblproductos tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.attributes.getNamedItem('tabindex').nodeValue);
            rs = parseFloat(rs);
            if (rs == idtr) {
                rpt = rs - 1;
                if (rpt > 0) {
                    filas.forEach(function (e) {
                        var rs = parseFloat(e.attributes.getNamedItem('tabindex').nodeValue);
                        rs = parseFloat(rs);
                        if (rs == rpt) {
                            e.className = e.className + ' selected';
                            $("tr[tabindex=" + rpt + "]").focus();
                            //(e.attributes.getNamedItem('tabindex')).focus();
                        }
                    });
                } else {
                    filas.forEach(function (e) {
                        var rs = parseFloat(e.attributes.getNamedItem('tabindex').nodeValue);
                        rs = parseFloat(rs);
                         if(rs==0) {
                            e.className = e.className + ' selected';
                            $("tr[tabindex=0]").focus();
                        }
                    });
                }
            }
        });
    }
    if (event.keyCode == '13') {
        //F2
        var filas = document.querySelectorAll('#CD_tblproductos tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.attributes.getNamedItem('tabindex').nodeValue);
            rs = parseFloat(rs);
            if (rs == idtr) {
                $("tr[tabindex=" + rpt+"]").click();
                //e.getAttribute('btnanalisisproducto ')[0].click();
               
            }
        });
    }
    if (event.keyCode == '113') {
        //F2
        var filas = document.querySelectorAll('#CD_tblproductos tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.attributes.getNamedItem('tabindex').nodeValue);
            if (rs == idtr) {
                e.getElementsByClassName('btnanalisisproducto ')[0].click();
            }
        });
    }
}

// SE USA PARA DETECTAr SI EL MODAL SUGERIDO A ENVIAR YA HA SIDO ABIERTO O NO
let modalAbiertoPrimeraVez = true;

// FIN DE VALIDACION
var tbllistasugerido;
$(document).ready(function () {

    tbllistasugerido = $('#tbllistasugerido').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": true,
        info: false,
        paging: true,
        //pageLength: [15]
    });
  

    // Llama a la función para reiniciar las variables al inicio

    function limpiarTablas() {
        $('#tablaSucursales tbody').empty();
        $('#tablaDetalles tbody').empty();
    }

    // Llama a la función para limpiar las tablas al inicio
    limpiarTablas();
    //$('#miBoton').click(function () {
    //    // Asegurarse de que el checkbox esté deseleccionado
    //    $('#cbo_seleciontotal_sugerido').prop('checked', false);

    //    limpiararrayobjetsec();
    //    limpiarTablas();
    //    productosSeleccionados = {};
    //    detallesCargados = {};
    //    // Resto del código...
    //    tbllistasugerido.clear().draw();
    //    fnGetHistorial();
    //});


    // Variable para indicar si el modal ha sido abierto previamente
 

    $('#btnabrimodalsugeridoenviar').click(function () {
   

        if (modalAbiertoPrimeraVez) {
            // Código que se ejecuta solo la primera vez que se abre el modal
            // Asegurarse de que el checkbox esté deseleccionado
            $('#cbo_seleciontotal_sugerido').prop('checked', false);

            limpiararrayobjetsec();
            limpiarTablas();
            checkboxesSeleccionados = {};
            productosSeleccionados = {};
            detallesCargados = {};
            tbllistasugerido.clear().draw();
            fnGetHistorial();
            modalAbiertoPrimeraVez = false;  // Cambiar la bandera para las siguientes veces
        }
    });



});


function limpiararrayobjet() {
    detallestockactual = {};
    todosLosDatos.length = 0;
    productosSucursales.length = 0;
  
}

function limpiararrayobjetsec() {
 
    sucursalesAgregadas.length = 0;
    transformedData.length = 0;

}

// datossecundarios
var sucursalesAgregadas = [];
const transformedData = [];
//

var todosLosDatos = [];
const  productosSucursales = [];
var detallestockactual = {};
var detallestockactualgeneraleligir = {};
var productosSeleccionados = {};
var detallesCargados = {};
function fnGetHistorial() {

    tbllistasugerido.clear().draw();
 
    limpiararrayobjet();
    var contadorInterno = 0;
    var sSucursalAlmacen = "";
  

    // Limpiar el contador de registros
    $('#numRegistros').text('0');
    var cliente = $('#cmbbuscarcliente').text().split('-');
    var fechaActual = new Date().toISOString().split('T')[0];
    var fechaInicioDefault = "2023-10-01";

    var contadorInterno1 = 0;
    var sSucursalAlmacenessugerido = "";
    var sucalmacenes = $('#CC_form-registro').serializeArray();
    for (var i = 0; i < sucalmacenes.length; i++) {
        if (sucalmacenes[i].name.includes("Almacen")) {
            if (contadorInterno1 == 0)
                sSucursalAlmacenessugerido += sucalmacenes[i].value;
            else
                sSucursalAlmacenessugerido += "|" + sucalmacenes[i].value;

            contadorInterno1 += 1;
        }
    }


    var rango = CC_cmbrango.val();
    var rp = CD_sugerido.checked;

    // DECIDI PROBAR EL CODIGO TERNARIO PARA HACER EL CODIGO MAS CORTO
    var rps = rp ? 1 : 0;  // Optimizado aquí también
    var rangoMeses = rango == 'BIMESTRE' ? 2 :rango == 'TRIMESTRE' ? 3 :rango == 'CUATRIMESTRE' ? 4 :rango == 'SEMESTRE' ? 6 : 0;
    let obj = {
        rango: rangoMeses,
        sucursales: listasucursalesseleccionadas.join('|'),
        tipo: rps,
        almacenes: sSucursalAlmacenessugerido,
        laboratorio: CD_txtidlaboratorio.val()
    };
    var url = ORIGEN + "/Almacen/AGuiaSalida/GetHistorialVentaslistarArray";
  
    BLOQUEARCONTENIDO('cardreport', 'Buscando ..');

    $.post(url, obj).done(function (data) {
        if (data && data.rows && data.rows.length > 0) {
            todosLosDatos = data.rows;

            console.log("detallestockactual:", todosLosDatos);    
            data.rows.forEach(function (item)
            {
                var productoId = item[2];  // ID del producto

                var stockActual = item[11];
                // Si es la primera vez que encontramos este producto, inicializamos su estructura
                if (!productosSucursales[productoId]) {
                    productosSucursales[productoId] = {
                        ultimoItem11: parseFloat(item[11])  // Inicializar con el primer item11
                    };
                }

                var sucursalId = item[0];  // ID de la sucursal
                var item10 = parseFloat(item[10]);
                var item11 = parseFloat(item[11]);


                // Calcular los nuevos valores según las reglas
                var nuevoItem113 = Math.max(0, productosSucursales[productoId].ultimoItem11 - item10);
                var nuevoItem11 = item11;


                var nuevoCampo = item10 - nuevoItem113;
                // Actualizar el último item11 para este producto
                productosSucursales[productoId].ultimoItem11 = nuevoItem11;

                // Actualizar los valores para esta sucursal y producto
                if (!productosSucursales[productoId][sucursalId]) {
  
                        // Si item11 es mayor o igual que item10
                        productosSucursales[productoId][sucursalId] = {
                            item10: item10,
                            item11: nuevoItem11,
                            nuevoCampo: item10
                        }
     
                }
                else {                  
                        // Si ya existía esta sucursal, actualizar solo los valores
                        productosSucursales[productoId][sucursalId].item10 = item10;
                        productosSucursales[productoId][sucursalId].item11 = nuevoItem11;
                        productosSucursales[productoId][sucursalId].nuevoCampo = item10;            
                }
            });



            console.log("detallestockactual:", productosSucursales);
        
        } else {
            mensaje('I', 'No hay datos en la consulta');
        }
        $("#btnbusqueda").prop("disabled", false);
        DESBLOQUEARCONTENIDO('cardreport');
         todosLosDatoscont = data.rows;
        const resultadoTransformado = transformarDatosEnUnaLinea();
        const todosLosDatos1 = [...todosLosDatoscont];  // Copia los datos

        console.log(resultadoTransformado);
        console.log(todosLosDatos1);

        for (let i = 0; i < todosLosDatos.length; i++) {
            const idSucursalTodosLosDatos = todosLosDatos[i][0];
            const idProductoTodosLosDatos = todosLosDatos[i][2];

            for (let j = 0; j < resultadoTransformado.length; j++) {
                const idSucursalResultado = resultadoTransformado[j][0];
                const idProductoResultado = resultadoTransformado[j][1];

                if (idSucursalTodosLosDatos === idSucursalResultado && idProductoTodosLosDatos === idProductoResultado) {
                    // Agrega [2], [3] y [4] de resultadoTransformado a todosLosDatos
                    todosLosDatos[i].push(...resultadoTransformado[j].slice(2));
                }
            }
        }


        //se usara para cuando se elija el boton general
        // Iterar sobre todosLosDatos
        for (var i = 0; i < todosLosDatos.length; i++) {
            // Verificar si las posiciones 17 y 18 son diferentes
            if (todosLosDatos[i][17] > todosLosDatos[i][18]) {
                // Asignar el valor de la posición 17 al elemento en la posición 18
                todosLosDatos[i][19] = todosLosDatos[i][18];
            }
        }

        // Imprime los datos actualizados
        console.log(todosLosDatos);

  


        var rango = CC_cmbrango.val();
        var rangoMeses = rango == 'BIMESTRE' ? 2 : rango == 'TRIMESTRE' ? 3 : rango == 'CUATRIMESTRE' ? 4 : rango == 'SEMESTRE' ? 6 : 0;

        // Limpiar detallestockactual al inicio de cada búsqueda
        detallestockactual = {};

        // Iterar sobre los datos
        todosLosDatos.forEach(function (item) {
            var sucursalId = item[0];
            var productoId = item[2];
            var nombresucursal = item[1];
            var codigoproducto = item[5];
            if (rangoMeses === 2) {
                var stockdescontado = item[17];
                var stockaenviar = item[18];

            } else if (rangoMeses ===  3) {
                var stockdescontado = item[18];
                var stockaenviar = item[19];

            } else if (rangoMeses ===  4) {
                var stockdescontado = item[19];
                var stockaenviar = item[20];

            } else if (rangoMeses ===  6) {
            var stockdescontado = item[21];
            var stockaenviar = item[22];

            }
            var stockActual = item[11];
            var canstockagreporsuc = 0;

            // Verificar si el productoId ya está en detallestockactual
            if (!detallestockactual[productoId]) {
                detallestockactual[productoId] = {
                    sucursales: {}
                };
            }

            // Verificar si la sucursalId no existe para este producto
            if (!detallestockactual[productoId].sucursales[sucursalId]) {
                // Si la sucursalId no existe, inicializamos con el stockActual
                detallestockactual[productoId].sucursales[sucursalId] = {
                    idsucursal: sucursalId,
                    nombresucursal: nombresucursal,
                    codigoproducto: codigoproducto,
                    cantidadstockactual: stockActual,
                    cantidadstockinicial: stockActual,
                    stockdescontadototal: stockdescontado,
                    canstockagreporsuc: stockaenviar,
                    canstockagrecontrol: stockaenviar
                };
            } else {
                // Si la sucursalId ya existe, actualizamos solo si el stockActual es mayor
                if (stockActual > detallestockactual[productoId].sucursales[sucursalId].cantidadstockactual) {
                    detallestockactual[productoId].sucursales[sucursalId].cantidadstockactual = stockActual;
                    detallestockactual[productoId].sucursales[sucursalId].cantidadstockinicial = stockActual;
                }
            }
        });
        console.log(detallestockactual);
        console.log(todosLosDatos);

        // Objeto para almacenar datos organizados por el valor en la posición [2]
        var datosOrganizados = {};

        // Iterar sobre todosLosDatos
        for (var i = 0; i < todosLosDatos.length; i++) {
            var producto = todosLosDatos[i][2];

            // Verificar si la sucursal ya está en datosOrganizados
            if (datosOrganizados[producto] === undefined) {
                // Si no existe, agregar una nueva entrada
                datosOrganizados[producto] = [todosLosDatos[i][2], todosLosDatos[i][0], todosLosDatos[i][5], todosLosDatos[i][6], todosLosDatos[i][7], todosLosDatos[i][11]];
            } else {
                // Si ya existe, puedes actualizar o acumular la información necesaria

            }
        }

        // Convertir el objeto en un array de arrays
        var nuevoArrayOrganizado = Object.values(datosOrganizados);

        // El nuevo array ahora está organizado por el valor en la posición [2]
        console.log(nuevoArrayOrganizado);
      
        // Imprime los datos actualizados
        agregarCabeceras(nuevoArrayOrganizado);






    }).fail(function () {
        // ... (tu código existente para manejar fallos)
    });


}

function transformarDatosEnUnaLinea() {
 

    for (const productoId in productosSucursales) {
        if (productoId !== 'ultimoItem11') {
            const sucursalData = productosSucursales[productoId];

            // Iterate over the sucursal data
            for (const sucursalId in sucursalData) {
                if (sucursalId !== 'ultimoItem11') {
                    const item = [
                        parseInt(sucursalId), // Sucursal ID
                        parseInt(productoId), // Producto ID
                        sucursalData[sucursalId].item10,
                        sucursalData[sucursalId].item11,
                        sucursalData[sucursalId].nuevoCampo
                    ];

                    transformedData.push(item);
                }
            }
        }
    }

    console.log(transformedData);
    return transformedData;
}



function agregarCabeceras(data) {

    for (var i = 0; i < data.length; i++) {
        if (!sucursalesAgregadas.includes(data[i][0])) {  // Cambio aquí para usar el ID de la sucursal
            var detallesSucursal = filtrarDetallesPorSucursal(data[i][0]);  // Cambio aquí para usar el ID de la sucursal
            console.log(detallestockactual);
            var idproducton = data[i][0];
            var idsucursaln = data[i][1];
            var canstockagreporsuc = detallestockactual[idproducton].sucursales[idsucursaln].canstockagreporsuc || 0;
            var cantidadStockActual = detallestockactual[idproducton].sucursales[idsucursaln].stockdescontadototal  || 0;
            $('#tablaSucursales tbody').append(`<tr class="fila-sucursal" data-productoprin="${data[i][0]}" data-sucursalprin="${data[i][1]}">
                        <td>${data[i][2]}</td>
                        <td>${data[i][3]}</td>                 
                        <td>${data[i][4]}</td>
                       
                        <td>${data[i][5]}</td>
                  
                         <td  class="stock-actual" data-producto-id="${data[i][0]}">${cantidadStockActual}</td>

                         <td>${detallesSucursal.length}</td>
                        <td style="width: 15%;" ><button class="btnDesplegar">Ver Sucucursales</button></td>
                        <td ><input type="checkbox" check_producto-id="${data[i][0]}" check-sucursal-id="${data[i][1]}" class="producto-checkbox"></td></tr>
                        </tr>
             `);





            sucursalesAgregadas.push(data[i][0]);  // Cambio aquí para usar el ID de la sucursal      
        }
    }
    $('.btnDesplegar').click(function () {

        var sucursalCheckbox = $(this).closest('tr').find('.producto-checkbox');
        var isChecked = sucursalCheckbox.prop('checked');

        var productoId = $(this).closest('tr').data('productoprin');  // Obtenemos el ID de la sucursal
        var sucursalId = $(this).closest('tr').data('sucursalprin');  // Obtenemos el ID de la sucursal
        var filaDetalle = $(this).closest('tr').next('.fila-detalle-insertada[data-sucursal="' + productoId + '"]');  // Seleccionamos la fila de detalles con el mismo ID de la sucursal

        if (filaDetalle.length > 0) {
            if (filaDetalle.is(":visible")) {
                $('.fila-detalle-insertada').hide();
                filaDetalle.hide();
            } else {
                $('.fila-detalle-insertada').hide();
                filaDetalle.show();

                //// Llama a la validación solo la primera vez que se abre "Ver detalles"
                //if (!filaDetalle.data('validationDone')) {
                //    validarEdicionPorCheckbox(sucursalCheckbox, sucursalId);
                //    filaDetalle.data('validationDone', true);
                //}
            }
            return;
        }
        $('.fila-detalle-insertada').hide();
        var detalles = filtrarDetallesPorSucursal(productoId);
        filaDetalle = $('<tr class="fila-detalle-insertada" data-sucursal="' + productoId + '"><td colspan="12"></td></tr>');  // Creamos la fila de detalles para esa sucursal
        filaDetalle.find('td').append(crearTablaDetalles(detalles));

        // Insertamos la fila de detalles después de la fila de sucursal
        $(this).closest('tr').after(filaDetalle);

        // Si el checkbox de sucursal está marcado, marcamos los checkboxes de detalles.
        if (isChecked) {
            filaDetalle.find('.producto-checkbox').prop('checked', true);
        }
        validarEdicionPorCheckbox(sucursalCheckbox, sucursalId,productoId);
    });
}

function filtrarDetallesPorSucursal(sucursal) {
    return todosLosDatos.filter(function (item) {
        return item[2] === sucursal;
    });
}

function crearTablaDetalles(detalles) {
    var tabla = $('<table class="table table-bordered table-striped"></table>');
    var ventasLabels = [];

    var rango = CC_cmbrango.val();
    var rangoMeses = rango == 'BIMESTRE' ? 2 : rango == 'TRIMESTRE' ? 3 : rango == 'CUATRIMESTRE' ? 4 : rango == 'SEMESTRE' ? 6 : 0;


    // Generar etiquetas de ventas basadas en el rango de meses
    for (var i = rangoMeses; i >= 0; i--) {
        var today = new Date();
        var saleDate = new Date(today.getFullYear(), today.getMonth() - i);
        var formattedSaleDate = ("0" + (saleDate.getMonth() + 1)).slice(-2) + '/' + saleDate.getFullYear();
        ventasLabels.push(`VENTA ${formattedSaleDate}`);
    }

    // Crear el encabezado del thead
    var thead = $('<thead></thead>').html(`
    <tr style="background-color:rgb(91, 229, 245); color: black; border: 1px solid white;">
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">SUCURSAL</th>
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">CODIGO PRODUCTO</th>
        ${ventasLabels.map(label => `<th style="border: 1px solid white; text-align: center; vertical-align: middle;">${label}</th>`).join('')}
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">STOCK ACTUAL</th>
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">STOCK EN TRANSITO</th>
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">SUGERIDO A ENVIAR</th>
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">STOCK DISPONIBLE PARA ENVIO</th>
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">ABC</th>
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">STOCK RESTANTE PARA ENVIO</th>
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;">STOCK A ENVIAR</th>
        <th style="border: 1px solid white; text-align: center; vertical-align: middle;"></th>
    </tr>`
    );
    tabla.append(thead);



    var tbody = $('<tbody></tbody>');


    detalles.forEach(function (item) {



        var fila = `<tr data-sucursal-id="${item[0]}" data-producto-id="${item[2]}">
                <td style="text-align: center; width: 10%; vertical-align: middle;">${item[1]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[5]}</td>`;


        // Rellenar datos de ventas




        if (rangoMeses === 2) {

            fila += `<td style="text-align: center; vertical-align: middle;">${item[13]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[14]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[15]}</td>
                <td style="text-align: center; vertical-align: middle;" >${item[8]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[9]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[10]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[11]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[12]}</td>`;
            var cantidadStockActual = detallestockactual[item[2]] && detallestockactual[item[2]].sucursales[item[0]]
                ? detallestockactual[item[2]].sucursales[item[0]].stockdescontadototal
                : '';



            // Agregar la clase "stock-actual" y el atributo "data-producto-id"
            fila += `<td style="text-align: center; vertical-align: middle;" class="stock-actual" data-producto-id="${item[2]}">${cantidadStockActual}</td>`;

        } else if (rangoMeses === 3) {
            fila += `<td style="text-align: center; vertical-align: middle;">${item[13]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[14]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[15]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[16]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[8]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[9]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[10]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[11]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[12]}</td>`;


            var cantidadStockActual = detallestockactual[item[2]] && detallestockactual[item[2]].sucursales[item[0]]
                ? detallestockactual[item[2]].sucursales[item[0]].stockdescontadototal
                : '';

            // Agregar la clase "stock-actual" y el atributo "data-producto-id"
            fila += `<td style="text-align: center; vertical-align: middle;" class="stock-actual" data-producto-id="${item[2]}">${cantidadStockActual}</td>`;


        } else if (rangoMeses === 4) {
            fila += `<td style="text-align: center; vertical-align: middle;">${item[13]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[14]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[15]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[16]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[17]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[8]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[9]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[10]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[11]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[12]}</td>`;




            var cantidadStockActual = detallestockactual[item[2]] && detallestockactual[item[2]].sucursales[item[0]]
                ? detallestockactual[item[2]].sucursales[item[0]].stockdescontadototal
                : '';

            // Agregar la clase "stock-actual" y el atributo "data-producto-id"
            fila += `<td style="text-align: center; vertical-align: middle;" class="stock-actual" data-producto-id="${item[2]}">${cantidadStockActual}</td>`;



        } else if (rangoMeses === 6) {
            fila += `<td style="text-align: center; vertical-align: middle;">${item[13]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[14]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[15]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[16]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[17]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[18]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[19]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[8]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[9]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[10]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[11]}</td>
                <td style="text-align: center; vertical-align: middle;">${item[12]}</td>`;

            var cantidadStockActual = detallestockactual[item[2]] && detallestockactual[item[2]].sucursales[item[0]]
                ? detallestockactual[item[2]].sucursales[item[0]].stockdescontadototal
                : '';

            // Agregar la clase "stock-actual" y el atributo "data-producto-id"
            fila += `<td style="text-align: center; vertical-align: middle;" class="stock-actual" data-producto-id="${item[2]}">${cantidadStockActual}</td>`;

        }

        var canstockagreporsuc = detallestockactual[item[2]] && detallestockactual[item[2]].sucursales[item[0]]
            ? detallestockactual[item[2]].sucursales[item[0]].canstockagreporsuc
            : '';
        fila += `<td style="text-align: center;  width: 20%; vertical-align:  middle;" class="editable-cell editable" contenteditable="true" editable-producto-id="${item[2]}" editable-sucursal-id="${item[0]}"
                        oninput="validarEdicion(this, ${item[0]}, ${item[2]})" onblur="validarSalidaEdicion(this, ${item[0]}, ${item[2]})" onkeydown="return permiteSoloNumeros(event)">${canstockagreporsuc}</td>`;


        fila += `<td style="text-align: center; vertical-align: middle; "><input type="checkbox" checksecu-producto-id="${item[2]}" checksecu-sucursal-id="${item[0]}" class="detalle-checkbox"></td></tr>`;
        tbody.append(fila);
    });
    tabla.append(tbody);
    return tabla;

}


function validarSalidaEdicion(elemento, sucursalIdpara, idproductopara) {
    // Obtener el contenido actual del elemento editable
    var contenido = elemento.innerText || elemento.textContent;
    var sucursales = detallestockactual[idproductopara].sucursales;

    // Comprobar si el contenido está vacío
    if (!contenido.trim()) {
        // Si está vacío, asignarle el valor 0
    
        // O puedes realizar otra acción adicional aquí
        console.log(detallestockactual);
        var productosfaltanteunitario = [];




        //ALERTA DE CONFIRMACION
        var codigoproducto = detallestockactual[idproductopara].sucursales[sucursalIdpara].codigoproducto || "";
        var nombresucursal = detallestockactual[idproductopara].sucursales[sucursalIdpara].nombresucursal || "";
        var concatenado = nombresucursal + " - " + codigoproducto;
        productosfaltanteunitario.push(concatenado);












        for (var prodId in detallestockactual) {
            if (prodId == idproductopara) {
                for (var suc in sucursales) {


                    if (suc == sucursalIdpara) {
                        var stockdescontadototal = detallestockactual[idproductopara].sucursales[sucursalIdpara].stockdescontadototal || 0;
                        var canstockagrecontrol = detallestockactual[idproductopara].sucursales[sucursalIdpara].canstockagrecontrol || 0;

                        if (stockdescontadototal > 0) {
                            detallestockactual[idproductopara].sucursales[sucursalIdpara].canstockagreporsuc = canstockagrecontrol;
                            elemento.innerText = canstockagrecontrol;  // Puedes usar innerText o textContent según tus necesidades
                        } else {

                            elemento.innerText = "0";  // Puedes usar innerText o textContent según tus necesidades
                        }
                    }
                
                }

            }
        }

        if (productosSeleccionados.hasOwnProperty(idproductopara)) {
            const productosDeSucursal = productosSeleccionados[idproductopara];
            const index = productosDeSucursal.indexOf(parseInt(sucursalIdpara, 10)); // Convierte productoId a número
            if (index !== -1) {
                // Elimina el producto de la lista de productos de esa sucursal
                productosDeSucursal.splice(index, 1);
                // Si no quedan más productos en la sucursal, elimina la sucursal
                if (productosDeSucursal.length === 0) {
                    delete productosSeleccionados[idproductopara];
                }
            }
        }

        $(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucursalIdpara}"]`).prop('checked', false);

        var elementoEditable = $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucursalIdpara}"]`);
        elementoEditable.attr("contenteditable", "false");



        //ENVIAR ALERTA SI SE DEJO EN BLANCO
        var productosTexto = productosfaltanteunitario.join(', ');

        // Muestra los productos en un mensaje
        if (productosfaltanteunitario.length > 0) {
            // Muestra los productos en un mensaje
            alertaSwall('W', `Se quito el envio a la siguiente sucursal : ${productosTexto} porque se dejo vacio`, '');
        }
        console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);


        console.log(detallestockactual);










        console.log(productosSeleccionados);
        console.log(`El contenido estaba vacío para sucursal ${sucursalIdpara} y producto ${idproductopara}. Se ha establecido a 0.`);
    } else {
        // El contenido no está vacío, puedes realizar otras acciones si es necesario
        console.log(`El contenido no está vacío para sucursal ${sucursalIdpara} y producto ${idproductopara}. Contenido: ${contenido}`);
    }
}


function validarEdicionPorCheckboxprueba(checkbox, sucursalId, detalles) {
    var isChecked = checkbox.prop('checked');
    var filaDetalle = checkbox.closest('tr').next('.fila-detalle-insertada[data-sucursal="' + sucursalId + '"]');
    var productos = todosLosDatos.filter(function (item) {
        return item[0] === sucursalId;
    });

    productos.forEach(function (producto) {
        var productoId = producto[2]; // Obtener el ID del producto
        var valorASumar = detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;
        var cantidainicialstockyex = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucursalId]
            ? detallestockactual[productoId].sucursales[sucursalId].cantidadstockinicial
            : 0;

        var primeraSucursalConValorNegativo = false;
        // Sumar valorASumar a stockdescontadototal para todas las sucursales del producto
        for (var sucId in detallestockactual[productoId].sucursales) {

            var fila = filaDetalle.find(`.editable-cell[data-producto-id="${productoId}"]`);
            detallestockactual[productoId].sucursales[sucId].stockdescontadototal -= valorASumar;
            var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                : 0;
            var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
            if (0 < cantidadstockactualGlobal) {
                $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

            } else {
                if (primeraSucursalConValorNegativo == false) {


                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                    /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                    primeraSucursalConValorNegativo = true;
                    //fila.find('.editable-cell').prop('contenteditable', false);
                    //fila.find('.editable-cell').text("122");
                    //checkbox.prop('checked', false);
                    //alert("hola llega aqui priemro", productoId, sucId);


                } else {

                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                    detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                    fila.find('.editable-cell').prop('contenteditable', true);
                    fila.find('.editable-cell').text(canstockagreporsuc);



                    /*                            checkbox.prop('checked', false);*/


                    /*   var diferenciaaumentada = sumaTotalCanstockagreporsuc - cantidainicialstockyex*/

                }

            }
        }
    });

    console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);
    if (isChecked) {
        // Realiza la operación adecuada si el checkbox está marcado
        detalles.forEach(function (item) {
            var productoId = item[2]; // Obtener el ID del producto
            var canstockagreporsuc = detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;


            var filaEditableCell = filaDetalle.find(`.editable-cell[editable-sucursal-id="${sucursalId}"][editable-producto-id="${productoId}"]`);

            // Cambiar el valor de la celda a "12"
            filaEditableCell.text("12");
        });

        // Habilitar la edición de las celdas
        filaDetalle.find('.editable-cell').prop('contenteditable', true);
        filaDetalle.find('.detalle-checkbox').prop('checked', false);
       
    } else {
        // Realiza la operación adecuada si el checkbox no está marcado
        detalles.forEach(function (item) {
            var productoId = item[2]; // Obtener el ID del producto

            // Aquí puedes restaurar el valor original desde los detalles
            var valorOriginal = item[18];
            var filaEditableCell = filaDetalle.find(`.editable-cell[data-producto-id="${productoId}"]`);
            filaEditableCell.text(valorOriginal);
        });

        // Deshabilitar la edición de las celdas
        filaDetalle.find('.editable-cell').prop('contenteditable', false);
    }

    console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);

}


function validarEdicionPorCheckbox(checkbox, sucursalId, idproductopara) {
    var isChecked = checkbox.prop('checked');
    var filaDetalle = checkbox.closest('tr').next('.fila-detalle-insertada');

    // Obtener todos los productos asociados a la sucursal
    var productos = todosLosDatos.filter(function (item) {
        return item[0] === sucursalId;
    });
    var checkboxsugerido = $('#cbo_seleciontotal_sugerido');

    // Check if it's checked
    var ischeckboxsugerido = checkboxsugerido.prop('checked');
    console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);
    if (checkboxesSeleccionados.hasOwnProperty(sucursalId)) {


        if (isChecked) {


            for (var prodId in detallestockactual) {
                if (prodId == idproductopara) {
                    var sucursales = detallestockactual[idproductopara].sucursales;
                    for (var sucIdtexto in sucursales) {
                        var canstockagreporsucsec = detallestockactual[idproductopara].sucursales[sucIdtexto].canstockagreporsuc || 0;
                        var stockdescontadototalsec = detallestockactual[idproductopara].sucursales[sucIdtexto].stockdescontadototal || 0;
                        var checkboxProductosec = filaDetalle.find(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdtexto}"]`);
                        var filaEditableCell = filaDetalle.find(`.editable-cell[editable-sucursal-id="${sucIdtexto}"][editable-producto-id="${idproductopara}"]`);
                        if (canstockagreporsucsec <= 0) {
                            checkboxProductosec.prop('checked', false);
                            filaEditableCell.prop('contenteditable', false);  // Habilitar la edición
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);

                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);

                        } else {
                            checkboxProductosec.prop('checked', true);
                            filaEditableCell.prop('contenteditable', true);  // Habilitar la edición
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);

                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                        }
                    }
 
                }
            }

        } else {


            for (var prodId in detallestockactual) {
                if (prodId == idproductopara) {
                    var sucursales = detallestockactual[idproductopara].sucursales;
                    for (var sucIdtexto in sucursales) {
                        var canstockagreporsucsec = detallestockactual[idproductopara].sucursales[sucIdtexto].canstockagreporsuc || 0;
                        var stockdescontadototalsec = detallestockactual[idproductopara].sucursales[sucIdtexto].stockdescontadototal || 0;
                        var checkboxProductosec = filaDetalle.find(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdtexto}"]`);
                        var filaEditableCell = filaDetalle.find(`.editable-cell[editable-sucursal-id="${sucIdtexto}"][editable-producto-id="${idproductopara}"]`);
                        if (canstockagreporsucsec <= 0) {
                            checkboxProductosec.prop('checked', false);
                            filaEditableCell.prop('contenteditable', false);  // Habilitar la edición
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);

                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);

                        } else {
                            checkboxProductosec.prop('checked', false);
                            filaEditableCell.prop('contenteditable', false);  // Habilitar la edición
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);

                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                        }
                    }

                }
            }
        }

    } else {
    
 
    // Comparar con el checkbox que se hizo clic
 
    if (ischeckboxsugerido) {

        // Realiza la operación adecuada según el estado del checkbox
        if (!isChecked) {
            // Si no está marcado, suma el valor de canstockagreporsuc a stockdescontadototal para cada producto
            productos.forEach(function (producto) {
                var productoId = producto[2]; // Obtener el ID del producto
                var valorASumar = detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;
                var cantidainicialstockyex = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucursalId]
                    ? detallestockactual[productoId].sucursales[sucursalId].cantidadstockinicial
                    : 0;

                // Sumar valorASumar a stockdescontadototal para todas las sucursales del producto
                for (var sucId in detallestockactual[productoId].sucursales) {
                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal += valorASumar;
                    var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                        ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                        : 0;
                    if (cantidainicialstockyex >= cantidadstockactualGlobal) {

                        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

                    } else {

                        detallestockactual[productoId].sucursales[sucId].stockdescontadototal = cantidainicialstockyex;
                        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidainicialstockyex);
                    }
                }
            });

            // Deshabilitar la edición de las celdas
            filaDetalle.find('.editable-cell').prop('contenteditable', false);
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);
        } else {

            // Si no está marcado, suma el valor de canstockagreporsuc a stockdescontadototal para cada producto
            productos.forEach(function (producto) {
                var productoId = producto[2]; // Obtener el ID del producto
                var valorASumar = detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;
                var cantidainicialstockyex = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucursalId]
                    ? detallestockactual[productoId].sucursales[sucursalId].cantidadstockinicial
                    : 0;
                var sucursales = detallestockactual[productoId].sucursales;
                var primeraSucursalConValorNegativo = false;


                //// Verificar si la sucursal pasada como parámetro existe
                //if (sucursales[sucursalId]) {
                //    var fila = filaDetalle.find(`.editable-cell[data-producto-id="${productoId}"]`);
                //    detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal -= valorASumar;
                //    var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucursalId]
                //        ? detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal
                //        : 0;
                //    var canstockagreporsuc = detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;
                //    if (0 < cantidadstockactualGlobal) {
                //        checkbox.prop('checked', false);
                //        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

                //    } else {
                //        if (primeraSucursalConValorNegativo == false) {

                //            if (canstockagreporsuc <= 0) {
                //                detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal = 0;
                //                /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                //                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                //                primeraSucursalConValorNegativo = true;

                //                /*          checkbox.prop('checked', false);*/
                //            } else {


                //                detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal = 0;
                //                /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                //                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                //                primeraSucursalConValorNegativo = true;
                //                //fila.find('.editable-cell').prop('contenteditable', false);
                //                //fila.find('.editable-cell').text("122");
                //                //checkbox.prop('checked', false);
                //                //alert("hola llega aqui priemro", productoId, sucId);
                //            }

                //        } else {

                //            if (canstockagreporsuc <= 0) {
                //                detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal = 0;
                //                detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc = 0;
                //                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                //                fila.text("0");

                //            } else {
                //                detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal = 0;
                //                detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc = 0;
                //                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");

                //                fila.find('.editable-cell').text(canstockagreporsuc);
                //            }

                //        }

                //    }
                //}
                //// Sumar valorASumar a stockdescontadototal para todas las sucursales del producto
                //for (var sucId in sucursales) {
                //    if (parseInt(sucId) !== sucursalId) {
                //        var fila = filaDetalle.find(`.editable-cell[data-producto-id="${productoId}"]`);
                //        detallestockactual[productoId].sucursales[sucId].stockdescontadototal -= valorASumar;
                //        var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                //            ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                //            : 0;
                //        var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                //        if (0 < cantidadstockactualGlobal) {
                //            checkbox.prop('checked', false);
                //            $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

                //        } else {
                //            if (primeraSucursalConValorNegativo == false) {

                //                if (canstockagreporsuc <= 0) {
                //                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                //                    /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                //                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                //                    primeraSucursalConValorNegativo = true;

                //                    /*          checkbox.prop('checked', false);*/
                //                } else {


                //                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                //                    /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                //                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                //                    primeraSucursalConValorNegativo = true;
                //                    //fila.find('.editable-cell').prop('contenteditable', false);
                //                    //fila.find('.editable-cell').text("122");
                //                    //checkbox.prop('checked', false);
                //                    //alert("hola llega aqui priemro", productoId, sucId);
                //                }

                //            } else {

                //                if (canstockagreporsuc <= 0) {
                //                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                //                    detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                //                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                //                    fila.text("0");

                //                } else {
                //                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                //                    detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                //                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");

                //                    fila.find('.editable-cell').text(canstockagreporsuc);
                //                }

                //            }

                //        }
                //    }
                //}




                for (var sucId in detallestockactual[productoId].sucursales) {
                    var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                    var checkboxProducto = filaDetalle.find(`.detalle-checkbox[checksecu-producto-id="${productoId}"][checksecu-sucursal-id="${sucId}"]`);
                    var filaEditableCell = filaDetalle.find(`.editable-cell[editable-sucursal-id="${sucId}"][editable-producto-id="${productoId}"]`);

                    if (canstockagreporsuc <= 0) {
                        checkboxProducto.prop('checked', false);
                        filaEditableCell.text(canstockagreporsuc);
                        filaEditableCell.prop('contenteditable', false);  // Habilitar la edición
                    } else {
                        checkboxProducto.prop('checked', true);
                        filaEditableCell.text(canstockagreporsuc);
                        filaEditableCell.prop('contenteditable', true);  // Deshabilitar la edición
                    }

                }
            });

            // Deshabilitar la edición de las celda
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);



        }
    } else {
        // Realiza la operación adecuada según el estado del checkbox
        if (!isChecked) {


            console.log("Stock ", detallestockactual);
            // Si no está marcado, suma el valor de canstockagreporsuc a stockdescontadototal para cada producto
            productos.forEach(function (producto) {
                var productoId = producto[2]; // Obtener el ID del producto
                var valorTotalASumar = 0;

                var cantidainicialstockyex = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucursalId]
                    ? detallestockactual[productoId].sucursales[sucursalId].cantidadstockinicial
                    : 0;

                var valorASumarresta = 0;

                // Iterar sobre las filas con el mismo productoId
                $('tr[data-producto-id="' + productoId + '"]').each(function () {
                    var isChecked = $(this).find('.detalle-checkbox').prop('checked');
                    var sucursalId = $(this).data('sucursal-id');



                    // Verificar si el checkbox no está marcado
                    if (isChecked) {
                        valorASumarresta += detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;
                    }
                });




                for (var sucId in detallestockactual[productoId].sucursales) {
                    valorTotalASumar += detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                }

                for (var sucId in detallestockactual[productoId].sucursales) {

                    var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                    var cantidadstockinicial = detallestockactual[productoId].sucursales[sucId].cantidadstockinicial || 0;

                    if (canstockagreporsuc > cantidadstockinicial) {

                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = cantidadstockinicial;
                        var canstockagreporsucnuevo = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                        $(`.editable-cell[editable-producto-id="${productoId}"][editable-sucursal-id="${sucId}"]`).text(canstockagreporsucnuevo);
                    } 

                  }

                var total = valorTotalASumar - valorASumarresta
                // Sumar valorASumar a stockdescontadototal para todas las sucursales del producto
                for (var sucId in detallestockactual[productoId].sucursales) {
                    if (Object.keys(checkboxesSeleccionados).length === 0) {

                        detallestockactual[productoId].sucursales[sucId].stockdescontadototal += total;
                    } else {

                    }
               
                    var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                        ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                        : 0;
                    if (cantidainicialstockyex >= cantidadstockactualGlobal) {

                        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

                    } else {

                        detallestockactual[productoId].sucursales[sucId].stockdescontadototal = cantidainicialstockyex;
                        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidainicialstockyex);
                    }

                }
            });

            // Deshabilitar la edición de las celdas
            filaDetalle.find('.editable-cell').prop('contenteditable', false);
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);
        } else {

            // Si no está marcado, suma el valor de canstockagreporsuc a stockdescontadototal para cada producto
            productos.forEach(function (producto) {
                var productoId = producto[2]; // Obtener el ID del producto
                var valorASumar = detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;
                var cantidainicialstockyex = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucursalId]
                    ? detallestockactual[productoId].sucursales[sucursalId].cantidadstockinicial
                    : 0;
                var sucursales = detallestockactual[productoId].sucursales;
                var primeraSucursalConValorNegativo = false;


                // Verificar si la sucursal pasada como parámetro existe
                if (sucursales[sucursalId]) {
                    var fila = filaDetalle.find(`.editable-cell[data-producto-id="${productoId}"]`);
                    detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal -= valorASumar;
                    var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucursalId]
                        ? detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal
                        : 0;
                    var canstockagreporsuc = detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;
                    if (0 < cantidadstockactualGlobal) {
                        checkbox.prop('checked', false);
                        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

                    } else {
                        if (primeraSucursalConValorNegativo == false) {

                            if (canstockagreporsuc <= 0) {
                                detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal = 0;
                                /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                                primeraSucursalConValorNegativo = false;

                                /*          checkbox.prop('checked', false);*/
                            } else {


                                detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal = 0;
                                /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                                primeraSucursalConValorNegativo = true;
                                //fila.find('.editable-cell').prop('contenteditable', false);
                                //fila.find('.editable-cell').text("122");
                                //checkbox.prop('checked', false);
                                //alert("hola llega aqui priemro", productoId, sucId);
                            }

                        } else {

                            if (canstockagreporsuc <= 0) {
                                detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal = 0;
                                detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc = 0;
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");

                            } else {
                                detallestockactual[productoId].sucursales[sucursalId].stockdescontadototal = 0;
                                detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc = 0;
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");

 
                            }

                        }

                    }
                }
                // Sumar valorASumar a stockdescontadototal para todas las sucursales del producto
                for (var sucId in sucursales) {
                  if (parseInt(sucId) !== sucursalId) {
                    var fila = filaDetalle.find(`.editable-cell[data-producto-id="${productoId}"]`);
                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal -= valorASumar;
                    var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                        ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                        : 0;
                    var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                    if (0 < cantidadstockactualGlobal) {
                        checkbox.prop('checked', false);
                        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

                    } else {
                        if (primeraSucursalConValorNegativo == false) {

                            if (canstockagreporsuc <= 0) {
                                detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                                primeraSucursalConValorNegativo = false;

                                /*          checkbox.prop('checked', false);*/
                            } else {


                                detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                                primeraSucursalConValorNegativo = true;
                                //fila.find('.editable-cell').prop('contenteditable', false);
                                //fila.find('.editable-cell').text("122");
                                //checkbox.prop('checked', false);
                                //alert("hola llega aqui priemro", productoId, sucId);
                            }

                        } else {

                            if (canstockagreporsuc <= 0) {
                                detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");


                            } else {
                                detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                            }

                        }

                    }
                }
                }




                for (var sucId in detallestockactual[productoId].sucursales) {
                    var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                    var checkboxProducto = filaDetalle.find(`.detalle-checkbox[checksecu-producto-id="${productoId}"][checksecu-sucursal-id="${sucId}"]`);
                    var filaEditableCell = filaDetalle.find(`.editable-cell[editable-sucursal-id="${sucId}"][editable-producto-id="${productoId}"]`);

                    if (canstockagreporsuc <= 0) {
                        checkboxProducto.prop('checked', false);
                        filaEditableCell.text(canstockagreporsuc);
                        filaEditableCell.prop('contenteditable', false);  // Habilitar la edición
                    } else {
                        checkboxProducto.prop('checked', true);
                        filaEditableCell.text(canstockagreporsuc);
                        filaEditableCell.prop('contenteditable', true);  // Deshabilitar la edición
                    }

                }
            });

            // Deshabilitar la edición de las celda
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);

        }

    }
    }
    console.log("Stock ", detallestockactual);
}



function validarEdicionPorCheckbox1(checkbox, sucursalId, idproductopara) {
    var isChecked = checkbox.prop('checked');
    var filaDetalle = checkbox.closest('tr').next('.fila-detalle-insertada');
    var sucursalparametroentrada = sucursalId;
    // Obtener todos los productos asociados a la sucursal
    var productos = todosLosDatos.filter(function (item) {
        return item[0] === sucursalId;
    });
    var checkboxsugerido = $('#cbo_seleciontotal_sugerido');


    console.log(detallestockactual);
    // Check if it's checked
    var ischeckboxsugerido = checkboxsugerido.prop('checked');

    if (ischeckboxsugerido) {

        // Realiza la operación adecuada según el estado del checkbox
        if (!isChecked) {

            for (var prodId in detallestockactual) {
                if (prodId == idproductopara) {



                    var sucursales = detallestockactual[idproductopara].sucursales;
                    var primeraSucursalConValorNegativo = false;

                    console.log(checkboxesSeleccionados);
                    var valorTotalASumartotal = 0;



                    for (var sucIdsnu in sucursales) {


                        valorTotalASumartotal += detallestockactual[idproductopara].sucursales[sucIdsnu].canstockagreporsuc || 0;
                    }


                    // Iteras sobre los productos seleccionados


                    for (var sucIds in sucursales) {

                        var canstockagrecontrol = detallestockactual[idproductopara].sucursales[sucIds].canstockagrecontrol || 0;
                        var cantidadstockactualGlobal = detallestockactual[idproductopara].sucursales[sucIds].stockdescontadototal || 0;

                        var canstockagreporsuc = detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc || 0;
                        var cantidadstockinicial = detallestockactual[idproductopara].sucursales[sucIds].cantidadstockinicial || 0;

                        if (valorTotalASumartotal > 0) {

                            if (canstockagreporsuc <= 0) {
                                if (canstockagrecontrol <= cantidadstockinicial) {
                                    detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc = canstockagrecontrol;
                                } else {
                                    detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc = cantidadstockinicial;
                                }
                                detallestockactual[idproductopara].sucursales[sucIds].stockdescontadototal += valorTotalASumartotal;
                            } else {
                                detallestockactual[idproductopara].sucursales[sucIds].stockdescontadototal += valorTotalASumartotal;
                                detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc = canstockagreporsuc;
                            }

                        }


                    }


                    for (var sucIdse in sucursales) {

                        var cantidadstockactualGlobal = detallestockactual[idproductopara].sucursales[sucIdse].stockdescontadototal || 0;
                        var cantidadstockinicialvalor = detallestockactual[idproductopara].sucursales[sucIdse].cantidadstockinicial || 0;
                        var canstockagreporsucdeta = detallestockactual[prodId].sucursales[sucIdse].canstockagreporsuc || 0;
                        if (cantidadstockinicialvalor >= cantidadstockactualGlobal) {

                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(cantidadstockactualGlobal);

                        } else {

                            detallestockactual[idproductopara].sucursales[sucIdse].stockdescontadototal = cantidadstockinicialvalor;
                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(cantidadstockinicialvalor);
                        }

                        if (canstockagreporsucdeta > 0) {
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdse}"]`).text(canstockagreporsucdeta);
                            $(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdse}"]`).prop('checked', false);
                        } else {
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdse}"]`).text(0);
                            $(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdse}"]`).prop('checked', false);
                        }

                    }






                }
            }

            // Deshabilitar la edición de las celdas
            filaDetalle.find('.editable-cell').prop('contenteditable', false);
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);
        } else {

            var productosfaltantesec = [];
            var sucursales = detallestockactual[idproductopara].sucursales;
            for (var prodId in detallestockactual) {
                if (prodId == idproductopara) {

                    for (var sucIds in sucursales) {


                        var valorARestar = detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc || 0;

                        var cantidadstockactualGlobal = detallestockactual[idproductopara].sucursales[sucIds].stockdescontadototal || 0;

                        if (valorARestar > 0) {
                            detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc = valorARestar;

                            for (var sucIdve in sucursales) {
                                detallestockactual[idproductopara].sucursales[sucIdve].stockdescontadototal -= valorARestar;
                            }

                        }

                        var cantidadstockactualGlobaldat = detallestockactual[idproductopara].sucursales[sucIds].stockdescontadototal || 0;
                        var canstockagreporsuc = detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc || 0;

                        if (0 >= cantidadstockactualGlobal) {
                            detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc = 0;
                            for (var sucId in sucursales) {
                                detallestockactual[idproductopara].sucursales[sucId].stockdescontadototal = 0;
                            }


                        } else {

                            for (var sucId in sucursales) {
                                detallestockactual[idproductopara].sucursales[sucId].stockdescontadototal = cantidadstockactualGlobaldat;
                            }
                        }

                    }


                    console.log(productosfaltantesec);
                    for (var sucIdtexto in sucursales) {
                        var canstockagreporsucsec = detallestockactual[idproductopara].sucursales[sucIdtexto].canstockagreporsuc || 0;
                        var stockdescontadototalsec = detallestockactual[idproductopara].sucursales[sucIdtexto].stockdescontadototal || 0;
                        var checkboxProductosec = filaDetalle.find(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdtexto}"]`);
                        var filaEditableCell = filaDetalle.find(`.editable-cell[editable-sucursal-id="${sucIdtexto}"][editable-producto-id="${idproductopara}"]`);
                        var codigoproducto = detallestockactual[idproductopara].sucursales[sucIdtexto].codigoproducto || "";
                        var nombresucursal = detallestockactual[idproductopara].sucursales[sucIdtexto].nombresucursal || "";
                        if (canstockagreporsucsec <= 0) {
                            checkboxProductosec.prop('checked', false);
                            filaEditableCell.prop('contenteditable', false);  // Habilitar la edición
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);

                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                            if (productosSeleccionados.hasOwnProperty(idproductopara)) {
                                const productosDeSucursal = productosSeleccionados[idproductopara];
                                const index = productosDeSucursal.indexOf(parseInt(sucIdtexto, 10)); // Convierte productoId a número
                                if (index !== -1) {
                                    // Elimina el producto de la lista de productos de esa sucursal
                                    productosDeSucursal.splice(index, 1);
                                    // Si no quedan más productos en la sucursal, elimina la sucursal
                                    if (productosDeSucursal.length === 0) {
                                        delete productosSeleccionados[idproductopara];
                                    }
                                }
                            }
                            var concatenado = nombresucursal + " - " + codigoproducto;
                            productosfaltantesec.push(concatenado);
                        } else {
                            checkboxProductosec.prop('checked', true);
                            filaEditableCell.prop('contenteditable', true);  // Habilitar la edición
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdse}"]`).text(canstockagreporsucsec);
                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                        }
                    }


                }

            }
            // Si no está marcado, suma el valor de canstockagreporsuc a stockdescontadototal para cada producto


            // Deshabilitar la edición de las celdas
            var productosTexto = productosfaltantesec.join(', ');

            // Muestra los productos en un mensaje
            if (productosfaltantesec.length > 0) {
                // Muestra los productos en un mensaje
                alertaSwall('W', `Stock insuficiente para enviar a los siguiente locales: ${productosTexto}`, '');
            }
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);

        }
    } else {
        // Realiza la operación adecuada según el estado del checkbox
        if (!isChecked) {



            // Si no está marcado, suma el valor de canstockagreporsuc a stockdescontadototal para cada producto
            productos.forEach(function (producto) {
                var productoId = producto[2]; // Obtener el ID del producto
                var valorASumar = detallestockactual[productoId].sucursales[sucursalId].canstockagreporsuc || 0;
                var cantidainicialstockyex = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucursalId]
                    ? detallestockactual[productoId].sucursales[sucursalId].cantidadstockinicial
                    : 0;

                // Sumar valorASumar a stockdescontadototal para todas las sucursales del producto
                for (var sucId in detallestockactual[productoId].sucursales) {

                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal += valorASumar;
                    var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                        ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                        : 0;
                    var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;


                    if (canstockagreporsuc <= 0) {
                        var cantidasuma = detallestockactual[productoId].sucursales[sucId].canstockagrecontrol || 0;
                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = cantidasuma;
                        $(`.editable-cell[editable-producto-id="${productoId}"][editable-sucursal-id="${sucId}"]`).text(cantidasuma);
                    }



                    if (cantidainicialstockyex >= cantidadstockactualGlobal) {

                        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

                    } else {

                        detallestockactual[productoId].sucursales[sucId].stockdescontadototal = cantidainicialstockyex;
                        $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidainicialstockyex);
                    }
                }
            });

            // Deshabilitar la edición de las celdas
            filaDetalle.find('.editable-cell').prop('contenteditable', false);
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);
        } else {


            var productosfaltantesec = [];
            var sucursales = detallestockactual[idproductopara].sucursales;
            for (var prodId in detallestockactual) {
                if (prodId == idproductopara) {

                    for (var sucIds in sucursales) {


                        var valorARestar = detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc || 0;

                        var cantidadstockactualGlobal = detallestockactual[idproductopara].sucursales[sucIds].stockdescontadototal || 0;

                        if (valorARestar > 0) {
                            detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc = valorARestar;

                            for (var sucIdve in sucursales) {
                                detallestockactual[idproductopara].sucursales[sucIdve].stockdescontadototal -= valorARestar;
                            }

                        }

                        var cantidadstockactualGlobaldat = detallestockactual[idproductopara].sucursales[sucIds].stockdescontadototal || 0;
                        var canstockagreporsuc = detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc || 0;

                        if (0 >= cantidadstockactualGlobal) {
                            detallestockactual[idproductopara].sucursales[sucIds].canstockagreporsuc = 0;
                            for (var sucId in sucursales) {
                                detallestockactual[idproductopara].sucursales[sucId].stockdescontadototal = 0;
                            }


                        } else {

                            for (var sucId in sucursales) {
                                detallestockactual[idproductopara].sucursales[sucId].stockdescontadototal = cantidadstockactualGlobaldat;
                            }
                        }

                    }

                }

                for (var sucIdtexto in sucursales) {
                    var canstockagreporsucsec = detallestockactual[idproductopara].sucursales[sucIdtexto].canstockagreporsuc || 0;
                    var stockdescontadototalsec = detallestockactual[idproductopara].sucursales[sucIdtexto].stockdescontadototal || 0;
                    var checkboxProductosec = filaDetalle.find(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdtexto}"]`);
                    var filaEditableCell = filaDetalle.find(`.editable-cell[editable-sucursal-id="${sucIdtexto}"][editable-producto-id="${idproductopara}"]`);
                    var codigoproducto = detallestockactual[idproductopara].sucursales[sucIdtexto].codigoproducto || "";
                    var nombresucursal = detallestockactual[idproductopara].sucursales[sucIdtexto].nombresucursal || "";
                    if (canstockagreporsucsec <= 0) {
                        checkboxProductosec.prop('checked', false);
                        filaEditableCell.prop('contenteditable', false);  // Habilitar la edición
                        $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);

                        $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                        if (productosSeleccionados.hasOwnProperty(idproductopara)) {
                            const productosDeSucursal = productosSeleccionados[idproductopara];
                            const index = productosDeSucursal.indexOf(parseInt(sucIdtexto, 10)); // Convierte productoId a número
                            if (index !== -1) {
                                // Elimina el producto de la lista de productos de esa sucursal
                                productosDeSucursal.splice(index, 1);
                                // Si no quedan más productos en la sucursal, elimina la sucursal
                                if (productosDeSucursal.length === 0) {
                                    delete productosSeleccionados[idproductopara];
                                }
                            }
                        }
                        var concatenado = nombresucursal + " - " + codigoproducto;
                        productosfaltantesec.push(concatenado);
                    } else {
                        checkboxProductosec.prop('checked', true);
                        filaEditableCell.prop('contenteditable', true);  // Habilitar la edición
                        $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);
                        $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                    }
                }




            }

            console.log(detallestockactual);
            // Si no está marcado, suma el valor de canstockagreporsuc a stockdescontadototal para cada producto


            // Deshabilitar la edición de las celdas
            var productosTexto = productosfaltantesec.join(', ');

            // Muestra los productos en un mensaje
            if (productosfaltantesec.length > 0) {
                // Muestra los productos en un mensaje
                alertaSwall('W', `Stock insuficiente para enviar a los siguiente locales: ${productosTexto}`, '');
            }
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);

        }

    }

    console.log(productosSeleccionados);
    console.log("Stock ", detallestockactual);
}


function validarEdicion(cell, sucursalId, idproductopara) {
    var editedValue = parseFloat(cell.innerText.replace(/[^\d.]/g, '')) || 0;

    var sucursalIdpara = sucursalId;    // Obtener el valor previo de canstockagreporsuc en esta sucursal
    var canstockagreporsucPrevio = detallestockactual[idproductopara] && detallestockactual[idproductopara].sucursales[sucursalId]
        ? detallestockactual[idproductopara].sucursales[sucursalId].canstockagreporsuc : 0;

    //------
    var cantidainicialstockyex = detallestockactual[idproductopara] && detallestockactual[idproductopara].sucursales[sucursalId]
        ? detallestockactual[idproductopara].sucursales[sucursalId].cantidadstockinicial : 0;
    // Actualizar canstockagreporsuc en la sucursal correspondiente

    var valorTotalASumar = 0;
    detallestockactual[idproductopara].sucursales[sucursalId].canstockagreporsuc = editedValue;
    // Iteras sobre los productos seleccionados



    console.log(productosSeleccionados);
    var sucursales = detallestockactual[idproductopara].sucursales;
    var primeraSucursalConValorNegativo = false;

    console.log(checkboxesSeleccionados);
    var valorTotalASumartotal = 0;

    var productosfaltanteindividuales = [];
    for (var prodId in detallestockactual) {
        if (prodId == idproductopara) {

            if (productosSeleccionados[idproductopara]) {
                var sucursalesSeleccionadas = productosSeleccionados[idproductopara];

                for (var i = 0; i < sucursalesSeleccionadas.length; i++) {
                    var sucursalId = sucursalesSeleccionadas[i];

                    if (detallestockactual[idproductopara] && detallestockactual[idproductopara].sucursales[sucursalId]) {
                        valorTotalASumartotal += detallestockactual[idproductopara].sucursales[sucursalId].canstockagreporsuc || 0;
                    }
                }
            }

            console.log("Valor total a sumar: " + valorTotalASumartotal);


            // Calcular la suma total de canstockagreporsuc solo para los detalles cuyos checkboxes están marcados
            var sumaTotalCanstockagreporsuc = 0;


            // Calcular la cantidadstockactual global
            var cantidadstockactualGlobal = cantidainicialstockyex - valorTotalASumartotal;
            var primeraSucursalConValorNegativo = false;


            for (var sucursalIdsec in sucursales) {

                if (sucursalIdsec == sucursalIdpara) {

                    detallestockactual[idproductopara].sucursales[sucursalIdsec].stockdescontadototal = cantidadstockactualGlobal;
                } else {
                    detallestockactual[idproductopara].sucursales[sucursalIdsec].stockdescontadototal = cantidadstockactualGlobal;
                    var cantidadstockactualGlobalsec = detallestockactual[idproductopara].sucursales[sucursalIdsec].stockdescontadototal || 0;
                    var canstockagreporsec = detallestockactual[idproductopara].sucursales[sucursalIdsec].canstockagreporsuc || 0;
                    if (cantidadstockactualGlobalsec < canstockagreporsec) {

                        if (productosSeleccionados[idproductopara]) {
                            var sucursalesSeleccionadas = productosSeleccionados[idproductopara];

                            for (var idsucursaln in detallestockactual[idproductopara].sucursales) {
                                if (!sucursalesSeleccionadas.includes(parseInt(sucursalIdsec))) {
                                    detallestockactual[idproductopara].sucursales[sucursalIdsec].canstockagreporsuc = cantidadstockactualGlobalsec;

                                }
                            }
                        }

                    }

                    if (cantidadstockactualGlobalsec > 0 && canstockagreporsec >= 0) {

                        if (productosSeleccionados[idproductopara]) {
                            var sucursalesSeleccionadas = productosSeleccionados[idproductopara];

                            for (var idsucursaln in detallestockactual[idproductopara].sucursales) {
                                var canstockagrecontrol = detallestockactual[idproductopara].sucursales[idsucursaln].canstockagrecontrol || 0;
                                if (!sucursalesSeleccionadas.includes(parseInt(idsucursaln))) {

                                    if (canstockagrecontrol < cantidadstockactualGlobalsec) {
                                        detallestockactual[idproductopara].sucursales[idsucursaln].canstockagreporsuc = canstockagrecontrol;
                                    } else {
                                        detallestockactual[idproductopara].sucursales[idsucursaln].canstockagreporsuc = cantidadstockactualGlobalsec;
                                    }


                                }
                            }
                        }
                    }

                }


            }


            stockdescontadototalvaLor = detallestockactual[idproductopara].sucursales[sucursalId].stockdescontadototal || 0;
            console.log(detallestockactual);

            if (stockdescontadototalvaLor <= cantidainicialstockyex && stockdescontadototalvaLor >= 0) {




                for (var sucIdValor in sucursales) {
                    var canstockagreporsuc = detallestockactual[idproductopara].sucursales[sucIdValor].canstockagreporsuc || 0;
                    var stockdescontadototal = detallestockactual[idproductopara].sucursales[sucIdValor].stockdescontadototal || 0;

                    $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototal);
                }
                var stockdescontadototalpro = detallestockactual[idproductopara].sucursales[sucursalId].stockdescontadototal || 0;
                if (stockdescontadototalpro <= 0) {
                    if (productosSeleccionados[idproductopara]) {
                        var sucursalesSeleccionadas = productosSeleccionados[idproductopara];

                        for (var idsucursaln in detallestockactual[idproductopara].sucursales) {
                            if (!sucursalesSeleccionadas.includes(parseInt(idsucursaln))) {
                                detallestockactual[idproductopara].sucursales[idsucursaln].canstockagreporsuc = 0;
                                var codigoproducto = detallestockactual[idproductopara].sucursales[idsucursaln].codigoproducto || "";
                                var nombresucursal = detallestockactual[idproductopara].sucursales[idsucursaln].nombresucursal || "";
                                var concatenado = nombresucursal + " - " + codigoproducto;
                                productosfaltanteindividuales.push(concatenado);

                            }
                        }
                    }
                }

                for (var idsucursalfinalval in sucursales) {
                    var canstockagreporsucindividual = detallestockactual[idproductopara].sucursales[idsucursalfinalval].canstockagreporsuc || 0;

                    var editableCell = $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${idsucursalfinalval}"]`);


                    if (sucursalIdpara == idsucursalfinalval) {
                        editableCell.val(canstockagreporsucindividual).focus(); // Establece el valor y pone el foco en el elemento
                    } else {
                        editableCell.text(canstockagreporsucindividual); // Establece el valor y pone el foco en el elemento

                    }

                }
            } else {

                mensaje('W', 'La suma de los valores a enviar sobrepasa la cantidadstockactual global');
                stockdescontadototalvaLorerror = detallestockactual[idproductopara].sucursales[sucursalIdpara].stockdescontadototal || 0;

                var diferenciaaumentada = valorTotalASumartotal - cantidainicialstockyex
                var datosceldafinalpersonal = editedValue - diferenciaaumentada;  // Restaurar el valor original
                detallestockactual[idproductopara].sucursales[sucursalIdpara].canstockagreporsuc = datosceldafinalpersonal;

                if (productosSeleccionados[idproductopara]) {
                    var sucursalesSeleccionadas = productosSeleccionados[idproductopara];

                    for (var idsucursaln in detallestockactual[idproductopara].sucursales) {
                        if (!sucursalesSeleccionadas.includes(parseInt(idsucursaln))) {
                            detallestockactual[idproductopara].sucursales[idsucursaln].canstockagreporsuc = 0;
                            var codigoproducto = detallestockactual[idproductopara].sucursales[idsucursaln].codigoproducto || "";
                            var nombresucursal = detallestockactual[idproductopara].sucursales[idsucursaln].nombresucursal || "";
                            var concatenado = nombresucursal + " - " + codigoproducto;
                            productosfaltanteindividuales.push(concatenado);
                        }
                    }
                }


                for (var suc in sucursales) {
                    detallestockactual[idproductopara].sucursales[suc].stockdescontadototal = 0;

                }


                for (var idsucursalfinalval in sucursales) {
                    var canstockagreporsuc = detallestockactual[idproductopara].sucursales[idsucursalfinalval].canstockagreporsuc || 0;
                    if (canstockagreporsuc > 0) {
                        $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${idsucursalfinalval}"]`).text(canstockagreporsuc);
                    } else {
                        $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${idsucursalfinalval}"]`).text(canstockagreporsuc);
                    }
                }

                var cantidad = 0;
                console.log("Datos actualizados:", detallestockactual);
                $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(cantidad);
            }


        }
    }


    // Deshabilitar la edición de las celdas
    var productosTexto = productosfaltanteindividuales.join(', ');

    // Muestra los productos en un mensaje
    if (productosfaltanteindividuales.length > 0) {
        // Muestra los productos en un mensaje
        alertaSwall('W', `Stock insuficiente para enviar a los siguiente locales: ${productosTexto}`, '');
    }
    console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);


    console.log(detallestockactual);




    console.log("Datos actualizados:", detallestockactual);


}


function permiteSoloNumeros(event) {
    var input = event.target;
    var charCode = (event.which) ? event.which : event.keyCode;

    // Permite solo números y las teclas de control como 'Backspace', 'Tab', 'Enter'
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 8 && charCode !== 9 && charCode !== 13) {
        event.preventDefault();
        return false;
    }

    var inputValue = input.value;

    if (inputValue === '0' && charCode !== 8) {
        // Si el campo comienza con '0' y no es una tecla Backspace, posiciona el cursor al principio
        input.setSelectionRange(0, 0);
    }

    return true;
}


function validarEdicionPorCheckboxIndividual(checkbox, sucursalIdProducto, idproductopara) {
    var isChecked = checkbox.prop('checked');
    var productoId = checkbox.closest('tr').data('producto-id');
    var fila = checkbox.closest('tr');
    var valorARestarOSumar = parseFloat(fila.find('.editable-cell').text()) || 0;
    var filaDetalle = checkbox.closest('tr').next('.fila-detalle-insertada');

    console.log(productosSeleccionados);
    console.log(detallestockactual);
    if (isChecked) {

        var primeraSucursalConValorNegativo = false;
        var validarstockglobal = false;
        var valorTotalASumartotal = 0;
        var productosfaltantesindividual = [];
        for (var prodId in detallestockactual) {

            if (prodId == idproductopara) {
                var producto = detallestockactual[prodId];
                var sucursales = detallestockactual[idproductopara].sucursales;

                if (productosSeleccionados[idproductopara]) {
                    var sucursalesSeleccionadas = productosSeleccionados[idproductopara];

                    for (var i = 0; i < sucursalesSeleccionadas.length; i++) {
                        var sucursalId = sucursalesSeleccionadas[i];

                        if (detallestockactual[idproductopara] && detallestockactual[idproductopara].sucursales[sucursalId]) {
                            valorTotalASumartotal += detallestockactual[idproductopara].sucursales[sucursalId].canstockagreporsuc || 0;
                        }
                    }
                }
                console.log(detallestockactual);
                for (var sucursalId in sucursales) {
                    var cantidadstockactualGlobalif = detallestockactual[idproductopara].sucursales[sucursalId].stockdescontadototal || 0;
                    var cantidadstockinicialel = detallestockactual[idproductopara].sucursales[sucursalId].cantidadstockinicial || 0;
                    var canstockagreporsucsecprin = detallestockactual[idproductopara].sucursales[sucursalId].canstockagreporsuc || 0;
                    var cantidadstockiniciasecudnario = detallestockactual[idproductopara].sucursales[sucursalIdProducto].cantidadstockinicial || 0;
                    var canstockagreporsucsecundario = detallestockactual[idproductopara].sucursales[sucursalIdProducto].canstockagreporsuc || 0;


                    if (valorTotalASumartotal > cantidadstockiniciasecudnario && sucursalId == sucursalIdProducto) {

                        var sumatotalfin = valorTotalASumartotal - cantidadstockiniciasecudnario;
                        var sumafintodo = canstockagreporsucsecundario - sumatotalfin;
                        detallestockactual[idproductopara].sucursales[sucursalIdProducto].canstockagreporsuc = sumafintodo;
                        valorTotalASumartotal = valorTotalASumartotal - sumatotalfin;
                    }


                    if (parseInt(sucursalId, 10) == sucursalIdProducto) {
                        if (cantidadstockactualGlobalif > 0) {

                            if (cantidadstockinicialel > cantidadstockactualGlobalif) {
                                var valorfinal = cantidadstockinicialel - valorTotalASumartotal;
                                detallestockactual[idproductopara].sucursales[sucursalId].stockdescontadototal = valorfinal;
                            } else {
                                detallestockactual[idproductopara].sucursales[sucursalId].stockdescontadototal -= valorTotalASumartotal;
                            }



                            var cantidadstockactualGlobalrevisar = detallestockactual[idproductopara].sucursales[sucursalId].stockdescontadototal || 0;
                            for (var sucursalIdcol in sucursales) {

                                detallestockactual[idproductopara].sucursales[sucursalIdcol].stockdescontadototal = cantidadstockactualGlobalrevisar;
                            }

                        } else {
                            if (canstockagreporsucsecprin <= 0) {

                                for (var sucursalIdcol in sucursales) {

                                    if (productosSeleccionados[idproductopara]) {
                                        var sucursalesSeleccionadas = productosSeleccionados[idproductopara];

                                        for (var idsucursaln in detallestockactual[idproductopara].sucursales) {
                                            if (!sucursalesSeleccionadas.includes(parseInt(idsucursaln))) {
                                                detallestockactual[idproductopara].sucursales[idsucursaln].canstockagreporsuc = 0;

                                                detallestockactual[idproductopara].sucursales[idsucursaln].stockdescontadototal = 0;
                                                //var codigoproducto = detallestockactual[idproductopara].sucursales[idsucursaln].codigoproducto || "";
                                                //var nombresucursal = detallestockactual[idproductopara].sucursales[idsucursaln].nombresucursal || "";
                                                //var concatenado = nombresucursal + " - " + codigoproducto;
                                                //productosfaltanteindividuales.push(concatenado);

                                            }
                                        }
                                    }
                                }
                            } else {
                                for (var sucursalIdcol in sucursales) {
                                    detallestockactual[idproductopara].sucursales[sucursalIdcol].stockdescontadototal = 0;
                                }
                            }
                        }
                    }

                }

                console.log(detallestockactual);
                for (var sucursalIdsec in sucursales) {
                    var cantidadstockactualGlobalsec = detallestockactual[idproductopara].sucursales[sucursalIdsec].stockdescontadototal || 0;
                    var canstockagreporsec = detallestockactual[idproductopara].sucursales[sucursalIdsec].canstockagreporsuc || 0;
                    if (parseInt(sucursalIdsec, 10) !== sucursalIdProducto) {
                        if (cantidadstockactualGlobalif > 0) {
                            if (cantidadstockactualGlobalsec < canstockagreporsec) {


                                if (productosSeleccionados[idproductopara]) {
                                    var sucursalesSeleccionadas = productosSeleccionados[idproductopara];
                                    if (!sucursalesSeleccionadas.includes(parseInt(sucursalIdsec))) {
                                        detallestockactual[idproductopara].sucursales[sucursalIdsec].canstockagreporsuc = cantidadstockactualGlobalsec;
                                    }
                                }

                            }
                            detallestockactual[idproductopara].sucursales[sucursalIdsec].stockdescontadototal = cantidadstockactualGlobalsec;
                        } else {

                            if (productosSeleccionados[idproductopara]) {
                                var sucursalesSeleccionadas = productosSeleccionados[idproductopara];

                                for (var idsucursalnf in detallestockactual[idproductopara].sucursales) {
                                    if (!sucursalesSeleccionadas.includes(parseInt(sucursalIdsec))) {
                                        detallestockactual[idproductopara].sucursales[sucursalIdsec].canstockagreporsuc = 0;
                                    }
                                }
                            }
                            detallestockactual[idproductopara].sucursales[sucursalIdsec].stockdescontadototal = 0;

                        }

                    }

                }
                console.log(detallestockactual);
                for (var sucIdtexto in sucursales) {
                    var canstockagreporsucsec = detallestockactual[idproductopara].sucursales[sucIdtexto].canstockagreporsuc || 0;
                    var stockdescontadototalsec = detallestockactual[idproductopara].sucursales[sucIdtexto].stockdescontadototal || 0;
                    var checkboxProductosec = filaDetalle.find(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdtexto}"]`);
                    var elementoEditable = $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`);
                    var codigoproducto = detallestockactual[idproductopara].sucursales[sucIdtexto].codigoproducto || "";
                    var nombresucursal = detallestockactual[idproductopara].sucursales[sucIdtexto].nombresucursal || "";


                    if (sucIdtexto == sucursalIdProducto) {

                        if (canstockagreporsucsec <= 0) {

                            elementoEditable.attr("contenteditable", "false");  // Habilitar la edición
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);

                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                            if (productosSeleccionados.hasOwnProperty(idproductopara)) {
                                const productosDeSucursal = productosSeleccionados[idproductopara];
                                const index = productosDeSucursal.indexOf(parseInt(sucIdtexto, 10)); // Convierte productoId a número
                                if (index !== -1) {
                                    // Elimina el producto de la lista de productos de esa sucursal
                                    productosDeSucursal.splice(index, 1);
                                    // Si no quedan más productos en la sucursal, elimina la sucursal
                                    if (productosDeSucursal.length === 0) {
                                        delete productosSeleccionados[idproductopara];
                                    }
                                }
                            }
                            var concatenado = nombresucursal + " - " + codigoproducto;
                            productosfaltantesindividual.push(concatenado);
                            $(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdtexto}"]`).prop('checked', false);

                        } else {
                            $(`.detalle-checkbox[checksecu-producto-id="${idproductopara}"][checksecu-sucursal-id="${sucIdtexto}"]`).prop('checked', true);
                            elementoEditable.attr("contenteditable", "true");  // Habilitar la edición
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);
                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                        }

                    } else {
                        if (canstockagreporsucsec <= 0) {
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);
                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                            if (productosSeleccionados.hasOwnProperty(idproductopara)) {
                                const productosDeSucursal = productosSeleccionados[idproductopara];
                                const index = productosDeSucursal.indexOf(parseInt(sucIdtexto, 10)); // Convierte productoId a número
                                if (index !== -1) {
                                    // Elimina el producto de la lista de productos de esa sucursal
                                    productosDeSucursal.splice(index, 1);
                                    // Si no quedan más productos en la sucursal, elimina la sucursal
                                    if (productosDeSucursal.length === 0) {
                                        delete productosSeleccionados[idproductopara];
                                    }
                                }
                            }
                            var concatenado = nombresucursal + " - " + codigoproducto;
                            productosfaltantesindividual.push(concatenado);
                        } else {
                            $(`.editable-cell[editable-producto-id="${idproductopara}"][editable-sucursal-id="${sucIdtexto}"]`).text(canstockagreporsucsec);
                            $(`.stock-actual[data-producto-id="${idproductopara}"]`).text(stockdescontadototalsec);
                        }
                    }



                }
                console.log(detallestockactual);

            }
        }



        var productosTexto = productosfaltantesindividual.join(', ');

        // Muestra los productos en un mensaje
        if (productosfaltantesindividual.length > 0) {
            // Muestra los productos en un mensaje
            alertaSwall('W', `Se quedo sin stock para enviar a los siguiente locales: ${productosTexto}`, '');
        }
        console.log(detallestockactual);
        console.log(productosSeleccionados);

    }
    else {
        for (var prodId in detallestockactual) {
            if (prodId == idproductopara) {
                var producto = detallestockactual[prodId];

                // Iterar sobre todas las sucursales de cada producto


                for (var sucursalId in producto.sucursales) {
                    var stockDescontadoTotal = producto.sucursales[sucursalId].stockdescontadototal || 0;
                    var canstockagreporsuc = detallestockactual[prodId].sucursales[sucursalId].canstockagreporsuc || 0;
                    // Realizar la operación adecuada según el estado del checkbox
                    stockDescontadoTotal += valorARestarOSumar;


                    // Actualizar stockdescontadototal para la sucursal actual
                    producto.sucursales[sucursalId].stockdescontadototal = stockDescontadoTotal;

                    // También actualiza la celda de stock actual en la tabla para esta sucursal
                    var cantidadstockactualGlobal = producto.sucursales[sucursalId].stockdescontadototal;
                    $(`.stock-actual[data-producto-id="${prodId}"]`).text(cantidadstockactualGlobal);

                }



                for (var sucursalId in producto.sucursales) {

                    var canstockagreporsuc2 = detallestockactual[prodId].sucursales[sucursalId].canstockagreporsuc || 0;
                    var elementoEditable = $(`.editable-cell[editable-producto-id="${prodId}"][editable-sucursal-id="${sucursalId}"]`);

                    if (sucursalId == sucursalIdProducto && prodId == idproductopara) {

                        if (canstockagreporsuc2 <= 0) {
                            var cantidasuma = detallestockactual[prodId].sucursales[sucursalId].canstockagrecontrol || 0;
                            detallestockactual[prodId].sucursales[sucursalId].canstockagreporsuc = cantidasuma;
                            $(`.editable-cell[editable-producto-id="${prodId}"][editable-sucursal-id="${sucursalId}"]`).text(cantidasuma);
                        }

                        if (productosSeleccionados.hasOwnProperty(idproductopara)) {
                            const productosDeSucursal = productosSeleccionados[idproductopara];
                            const index = productosDeSucursal.indexOf(parseInt(sucursalId, 10)); // Convierte productoId a número
                            if (index !== -1) {
                                // Elimina el producto de la lista de productos de esa sucursal
                                productosDeSucursal.splice(index, 1);
                                // Si no quedan más productos en la sucursal, elimina la sucursal
                                if (productosDeSucursal.length === 0) {
                                    delete productosSeleccionados[idproductopara];
                                }
                            }
                        }
                        elementoEditable.attr("contenteditable", "false");  // Habilitar la edición
                        $(`.detalle-checkbox[checksecu-producto-id="${prodId}"][checksecu-sucursal-id="${sucursalId}"]`).prop('checked', false);

                    } else {
                        if (canstockagreporsuc2 <= 0) {
                            var cantidasuma = detallestockactual[prodId].sucursales[sucursalId].canstockagrecontrol || 0;
                            detallestockactual[prodId].sucursales[sucursalId].canstockagreporsuc = cantidasuma;
                            $(`.editable-cell[editable-producto-id="${prodId}"][editable-sucursal-id="${sucursalId}"]`).text(cantidasuma);
                        }
                    }

                }
            }
        }
    }

    console.log(detallestockactual);

    console.log(productosSeleccionados);
}



$(document).on('change', '.detalle-checkbox', function () {
 
    var sucursalId = $(this).closest('tr').data('sucursal-id');
    var productoId = $(this).closest('tr').data('producto-id');
    var isChecked = $(this).prop('checked');

    if (!productosSeleccionados[productoId]) {
        productosSeleccionados[productoId] = [];
    }

    if (isChecked) {
        if (!productosSeleccionados[productoId].includes(sucursalId)) {
            productosSeleccionados[productoId].push(sucursalId);
        }
    } else {
        var index = productosSeleccionados[productoId].indexOf(sucursalId);
        if (index > -1) {
            productosSeleccionados[productoId].splice(index, 1);
        }
        if (productosSeleccionados[productoId].length == 0) {
            delete productosSeleccionados[productoId];
        }
    }
    // y selecciona los checkboxes de detalles si es necesario.
    var detallesSeleccionados = $('.fila-detalle-insertada[data-sucursal="' + productoId + '"] .detalle-checkbox:checked');
    if (detallesSeleccionados.length > 0) {
        // Si al menos un detalle está seleccionado, seleccionar el checkbox de la sucursal
        $('.fila-sucursal[data-productoprin="' + productoId + '"] .producto-checkbox').prop('checked', true);
    } else {
        // Si ningún detalle está seleccionado, deseleccionar el checkbox de la sucursal
        $('.fila-sucursal[data-productoprin="' + productoId + '"] .producto-checkbox').prop('checked', false);
    }
    // Ahora, también verificarás el estado del checkbox principal de la sucursal en función de si todos los productos están seleccionados.
    var allChecked = $(this).closest('tbody').find('.detalle-checkbox').length === $(this).closest('tbody').find('.detalle-checkbox:checked').length;
    $(this).closest('tbody').prev('.fila-sucursal').find('.producto-checkbox').prop('checked', allChecked);
    var checkbox = $(this);
    validarEdicionPorCheckboxIndividual(checkbox, sucursalId, productoId);
    console.log(productosSeleccionados);
    verificaralguncheckactivoprobando();
});


var checkboxesSeleccionados = {};
$(document).on('change', '.producto-checkbox', function () {
    var isChecked = $(this).prop('checked');
    var productoId = $(this).closest('tr').data('productoprin');  // Obtenemos el ID de la sucursal
    var sucursalId = $(this).closest('tr').data('sucursalprin');  // Obtenemos el ID de la sucursal
    var checkboxsugerido = $('#cbo_seleciontotal_sugerido');

    // Check if it's checked
    var ischeckboxsugerido = checkboxsugerido.prop('checked');
    // sumar o restar




    // Si la fila de detalles está visible, actualizar los checkboxes.
    var filaDetalle = $(this).closest('tr').next('.fila-detalle-insertada[data-sucursal="' + sucursalId + '"]');

    // Actualizar el objeto de productosSeleccionados si la sucursal está seleccionada.
    if (isChecked) {
        var detalles = filtrarDetallesPorSucursal(productoId);
        productosSeleccionados[productoId] = detalles.map(detalle => detalle[0]);
    } else {
        // Si la sucursal se deselecciona, eliminar todos los productos de esa sucursal del array.
        delete productosSeleccionados[productoId];
    }

    if (filaDetalle.length > 0) {
        filaDetalle.find('.detalle-checkbox').prop('checked', isChecked);
    }

    console.log(productosSeleccionados);
    validarEdicionPorCheckbox1($(this), sucursalId, productoId);

    checkboxesSeleccionados[sucursalId] = isChecked;
    
    console.log(detallestockactual);
    console.log(checkboxesSeleccionados);
    verificaralguncheckactivoprobando();
});




var checkprincipalselecionado = false;


$(document).ready(function () {
 

    $('#cbo_seleciontotal_sugerido').change(function () {
        var isChecked = $(this).prop('checked');

        console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);
        if (isChecked) {
            todosLosDatos.forEach(function (item) {
                var sucursalId = item[0];
                var productoId = item[2];
                if (!productosSeleccionados[productoId]) {
                    productosSeleccionados[productoId] = [];
                }
                if (!productosSeleccionados[productoId].includes(sucursalId)) {
                    productosSeleccionados[productoId].push(sucursalId);
                }
            });



            console.log(productosSeleccionados);


            var productosfaltantesgenral = [];
            for (var productoId in detallestockactual) {
                if (detallestockactual.hasOwnProperty(productoId)) {
                    var sucursales = detallestockactual[productoId].sucursales;
                    var totalStockProducto = 0;





                    var primeraSucursalConValorNegativo = false;
                    // Sumar valorASumar a stockdescontadototal para todas las sucursales del producto
                    for (var sucId in sucursales) {           

                        var cantidadstockactualGlobalinicial = detallestockactual[productoId].sucursales[sucId].stockdescontadototal || 0;
                        var canstockagreporsucinicio = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;

                        if (canstockagreporsucinicio > cantidadstockactualGlobalinicial) {
                            detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = cantidadstockactualGlobalinicial;
                        }
                        if (0 >= cantidadstockactualGlobalinicial) {
                            detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                        }
                        if (0 >= cantidadstockactualGlobalinicial) {
                            detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                        }
                        var valorASumar = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                        for (var sucId in sucursales) {
                            detallestockactual[productoId].sucursales[sucId].stockdescontadototal -= valorASumar;
                        }
                        
                        var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                            ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                            : 0;
                  

                        if (0  >=cantidadstockactualGlobal) {

                            for (var sucId in sucursales) {
                                detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                            }


                        }

                        var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                        if (0 < cantidadstockactualGlobal) {
                     /*       checkbox.prop('checked', false);*/
                            $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);

                        } else {
                            if (primeraSucursalConValorNegativo == false) {



                                if (canstockagreporsuc <= 0) {
                                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                    /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                                    primeraSucursalConValorNegativo = true;

                                    /*          checkbox.prop('checked', false);*/
                                } else {


                                    var sumnumero = canstockagreporsuc - Math.abs(cantidadstockactualGlobal);

                                    if (sumnumero <= 0) {
                                        detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                        /*                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;*/
                                        $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                                        primeraSucursalConValorNegativo = true;


                                    } else {
                                        detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                        detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = sumnumero;
                                        $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");
                                        primeraSucursalConValorNegativo = true;


                                    }
               
                                }

                            } else {


                                if (canstockagreporsuc <= 0) {
                                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                    detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");


                                } else {
                                    detallestockactual[productoId].sucursales[sucId].stockdescontadototal = 0;
                                    detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = 0;
                                    $(`.stock-actual[data-producto-id="${productoId}"]`).text("0");

                                }

                            }

                        }
                    }



                    console.log(detallestockactual);





                    // Itera a través de las sucursales de cada producto y suma el canstockagreporsuc
                    for (var sucId in sucursales) {
                        if (sucursales.hasOwnProperty(sucId)) {
                            var stockDescontadoTotal = sucursales[sucId].canstockagreporsuc;
                            totalStockProducto += stockDescontadoTotal;
                        }
                    }

                  
                    // Actualiza el stockdescontadototal del producto con la suma
                    for (var sucId in sucursales) {





                        if (sucursales.hasOwnProperty(sucId)) {
                 
                            var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                            var cantidainicialstockyex = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                                ? detallestockactual[productoId].sucursales[sucId].cantidadstockinicial
                                : 0;
                            var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                                ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                                : 0;

                            var totneuvo = cantidainicialstockyex - totalStockProducto;
                            detallestockactual[productoId].sucursales[sucId].stockdescontadototal = totneuvo;
                            var cantidadstockactualnuevogol = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                                ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                                : 0;
                            var codigoproducto = detallestockactual[productoId].sucursales[sucId].codigoproducto || "";
                            var nombresucursal = detallestockactual[productoId].sucursales[sucId].nombresucursal || "";
                        

                            if (cantidainicialstockyex >= cantidadstockactualnuevogol) {

                                $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualnuevogol);
                                $(`.editable-cell[editable-producto-id="${productoId}"][editable-sucursal-id="${sucId}"]`).text(canstockagreporsuc);
                            } else {

                                detallestockactual[productoId].sucursales[sucId].stockdescontadototal = cantidainicialstockyex;
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidainicialstockyex);

                             
                             

                                $(`.editable-cell[editable-producto-id="${productoId}"][editable-sucursal-id="${sucId}"]`).text(canstockagreporsuc);
                            }

                            if (canstockagreporsuc <= 0) {


                                // Busca si la sucursal existe en productosSeleccionados
                                if (productosSeleccionados.hasOwnProperty(productoId)) {
                                    const productosDeSucursal = productosSeleccionados[productoId];
                                    const index = productosDeSucursal.indexOf(parseInt(sucId, 10)); // Convierte productoId a número
                                    if (index !== -1) {
                                        // Elimina el producto de la lista de productos de esa sucursal
                                        productosDeSucursal.splice(index, 1);
                                        // Si no quedan más productos en la sucursal, elimina la sucursal
                                        if (productosDeSucursal.length === 0) {
                                            delete productosSeleccionados[productoId];
                                        }
                                    }
                                }


                                var concatenado = nombresucursal + " - " + codigoproducto;


                     
                                productosfaltantesgenral.push(concatenado);
                                $(`.editable-cell[editable-producto-id="${productoId}"][editable-sucursal-id="${sucId}"]`).prop('contenteditable', false);


                                $(`.detalle-checkbox[checksecu-producto-id="${productoId}"][checksecu-sucursal-id="${sucId}"]`).prop('checked', false);
                            } else {
                                $(`.editable-cell[editable-producto-id="${productoId}"][editable-sucursal-id="${sucId}"]`).prop('contenteditable', true);

                                $(`.detalle-checkbox[checksecu-producto-id="${productoId}"][checksecu-sucursal-id="${sucId}"]`).prop('checked', true);
                            }
                        }
                    }
                }
            }
            // Deshabilitar la edición de las celdas

            var productosTexto = productosfaltantesgenral.join(', ');

            // Muestra los productos en un mensaje
            if (productosfaltantesgenral.length > 0) {
                // Muestra los productos en un mensaje
                alertaSwall('W', `Stock insuficiente para enviar a los siguiente locales: ${productosTexto}`, '');
            }
            console.log("Stock descontado total para la sucursal actual actualizado:", detallestockactual);
            console.log("Stock descontado total para la sucursal actual actualizado:", productosSeleccionados);
        } else {


           /* canstockagrecontrol = 1*/

            for (var productoId in detallestockactual) {
                if (detallestockactual.hasOwnProperty(productoId)) {
                    var sucursales = detallestockactual[productoId].sucursales;
                    var totalStockProducto = 0;

                    // Itera a través de las sucursales de cada producto y suma el canstockagreporsuc
                    for (var sucId in sucursales) {
                        if (sucursales.hasOwnProperty(sucId)) {
                            var stockDescontadoTotal = sucursales[sucId].canstockagreporsuc;
                            totalStockProducto += stockDescontadoTotal;
                        }
                    }

                    // Actualiza el stockdescontadototal del producto con la suma
                    for (var sucId in sucursales) {
                        if (sucursales.hasOwnProperty(sucId)) {
                            detallestockactual[productoId].sucursales[sucId].stockdescontadototal += totalStockProducto;


                            var cantidainicialstockyex = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                                ? detallestockactual[productoId].sucursales[sucId].cantidadstockinicial
                                : 0;
                          




                            var cantidadstockactualGlobal = detallestockactual[productoId] && detallestockactual[productoId].sucursales[sucId]
                                ? detallestockactual[productoId].sucursales[sucId].stockdescontadototal
                                : 0;

                            var canstockagreporsuc = detallestockactual[productoId].sucursales[sucId].canstockagreporsuc || 0;
                            var datoinicialsuc = detallestockactual[productoId].sucursales[sucId].canstockagrecontrol || 0;
                            if (canstockagreporsuc<=0) {

                                detallestockactual[productoId].sucursales[sucId].canstockagreporsuc = datoinicialsuc;
                                $(`.editable-cell[editable-producto-id="${productoId}"][editable-sucursal-id="${sucId}"]`).text(datoinicialsuc);
                            }

                            if (cantidainicialstockyex >= cantidadstockactualGlobal) {

                                $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidadstockactualGlobal);                          
                                $(`.detalle-checkbox[checksecu-producto-id="${productoId}"][checksecu-sucursal-id="${sucId}"]`).prop('checked', false);
                            } else {

                                detallestockactual[productoId].sucursales[sucId].stockdescontadototal = cantidainicialstockyex;
                                $(`.stock-actual[data-producto-id="${productoId}"]`).text(cantidainicialstockyex);
                                $(`.detalle-checkbox[checksecu-producto-id="${productoId}"][checksecu-sucursal-id="${sucId}"]`).prop('checked', false);
                            }
                        }
                    }
                }
            }

            // Deshabilitar la edición de las celdas
            $('.editable-cell').prop('contenteditable', false);


            productosSeleccionados = {};
        }

        $('.producto-checkbox').prop('checked', isChecked);
        //$('.fila-detalle-insertada .detalle-checkbox').prop('checked', isChecked);

       

        console.log("Detalle de stock descontado actualizado:");
        console.log(productosSeleccionados);
        checkprincipalselecionado = true;
        verificaralguncheckactivoprobando();
        console.log(detallestockactual);
     
    });

  

});


function verificaralguncheckactivoprobando() {
    // Crear una copia independiente de detallestockactual mediante serialización y deserialización
    const nuevoDetalleStock = JSON.parse(JSON.stringify(detallestockactual));

    for (const productoId of Object.keys(nuevoDetalleStock)) {
        const detalleProducto = nuevoDetalleStock[productoId];
        for (const sucursalId of Object.keys(detalleProducto.sucursales)) {
            const sucursal = detalleProducto.sucursales[sucursalId];
            if (sucursal.canstockagreporsuc <= 0) {
                delete detalleProducto.sucursales[sucursalId];
            }
        }
        if (Object.keys(detalleProducto.sucursales).length === 0) {
            delete nuevoDetalleStock[productoId];
        }
    }

    console.log(nuevoDetalleStock);

    // Crear un conjunto de sucursales disponibles en nuevoDetalleStock
    const sucursalesDisponibles = new Set();
    for (const productoId in nuevoDetalleStock) {
        const detalleProducto = nuevoDetalleStock[productoId];
        for (const sucursalId in detalleProducto.sucursales) {
            // Convierte sucursalId a número
            const sucursalNumero = parseInt(sucursalId, 10);
            sucursalesDisponibles.add(sucursalNumero);
        }
    }

    // Recorre todas las sucursales en productosSeleccionados

    // Itera a través de las sucursales en detallestockactual
    for (const idProducto in detallestockactual) {
        const sucursales = detallestockactual[idProducto].sucursales;

        for (const idSucursal in sucursales) {
            if (productosSeleccionados.hasOwnProperty(parseInt(idSucursal))) {
                // Activa la casilla de verificación    
                $('.fila-sucursal[data-sucursal="' + idSucursal + '"] .sucursal-checkbox').prop('checked', true);
            } else {
                // Desactiva la casilla de verificación
                $('.fila-sucursal[data-sucursal="' + idSucursal + '"] .sucursal-checkbox').prop('checked', false);
            }
        }
    }


    //// Verifica si productosSeleccionados está vacío
    if (Object.keys(productosSeleccionados).length === 0) {
        // Desactiva el checkbox
        $('#cbo_seleciontotal_sugerido').prop('checked', false);
    } else {

        $('#cbo_seleciontotal_sugerido').prop('checked', true);
    }
    

    console.log(nuevoDetalleStock);
    console.log(detallestockactual);
}


function actualizarCheckboxSucursal(sucursalId) {
    var checkboxesSecundarios = $('.fila-detalle-insertada[data-sucursal="' + sucursalId + '"]').find('.detalle-checkbox');
    var alMenosUnoMarcado = checkboxesSecundarios.is(':checked');

    // Actualizar el estado del checkbox de la sucursal principal
    var checkboxPrincipal = $('.fila-sucursal[data-sucursal="' + sucursalId + '"]').find('.sucursal-checkbox');
    checkboxPrincipal.prop('checked', alMenosUnoMarcado);
}


// BOTON PARA ENVIAR AL SUGERIDO 
$(document).ready(function () {
    $('#btnvalidarsugeridoenviar12').on('click', function () {
        fncd_guardardatostabla();
        const arraydatos = encontrarSimilitudes();
        console.log(arraydatos);
        // Encuentra el índice del producto en todosLosDatos basado en el ID del producto en arraydatos

        const datosCombinados = [];

        for (let i = 0; i < arraydatos.length; i++) {
            const subarrayArrayDatos = arraydatos[i];

            for (let j = 0; j < todosLosDatos.length; j++) {
                const subarrayTodosLosDatos = todosLosDatos[j];

                // Verificar si los IDs de producto y sucursal coinciden
                if (subarrayArrayDatos[1] === subarrayTodosLosDatos[0] && subarrayArrayDatos[0] === subarrayTodosLosDatos[2]) {
                    const combinado = [...subarrayArrayDatos, ...subarrayTodosLosDatos.slice(1)];
                    datosCombinados.push(combinado);
                }
            }
        }


        const datosAgrupadosPorSucursal = {};

        datosCombinados.forEach(dato => {
            const sucursal = dato[1]; // Suponiendo que el nombre de la sucursal está en el índice 1
            if (!datosAgrupadosPorSucursal[sucursal]) {
                datosAgrupadosPorSucursal[sucursal] = [];
            }
            datosAgrupadosPorSucursal[sucursal].push(dato);
        });

        console.log(datosAgrupadosPorSucursal);



        console.log(CD_arrayguias);



     
        for (const sucursalId in datosAgrupadosPorSucursal) {
            const guiaExistente = CD_arrayguias.find(guia => guia.idsucursaldestino === sucursalId);

            const detalles = [];
            for (let i = 0; i < datosAgrupadosPorSucursal[sucursalId].length; i++) {
                const datos = datosAgrupadosPorSucursal[sucursalId][i];
                const detalle = new ADetalleGuiaSalida();
                detalle.idsucursaldestino = sucursalId;
                detalle.idproducto = datos[0];
                detalle.laboratorio = datos[12];
                detalle.producto = datos[11];
                detalle.cantidadgenerada = datos[5];
                detalle.idalmacensucursalorigen = datos[8];
                detalles.push(detalle);
            }
            if (guiaExistente) {
                try {
                    let existingDetails = [];
                    if (guiaExistente.jsondetalle && guiaExistente.jsondetalle !== "") {
                        // Si jsondetalle no está vacío, intenta analizarlo
                        existingDetails = JSON.parse(guiaExistente.jsondetalle);

                        // Obtén solamente los idproducto de los detalles existentes
                        const existingProductIds = existingDetails.map(detail => detail.idproducto);

                        // Obtén los idproducto de los detalles a agregar
                        const newProductIds = detalles.map(detail => detail.idproducto.toString());

                        // Verifica si cada idproducto de los detalles nuevos existe en existingProductIds
                        for (const productId of newProductIds) {
                            if (existingProductIds.includes(productId)) {
                                // El producto ya existe, utiliza la cantidad generada de la segunda guía
                                const existingProductIndex = existingProductIds.indexOf(productId);
                                existingDetails[existingProductIndex].cantidadgenerada = detalles.find(detail => detail.idproducto.toString() === productId).cantidadgenerada;
                            } else {
                                // El producto no existe, agrégalo a la lista
                                existingDetails.push(detalles.find(detail => detail.idproducto.toString() === productId));
                            }
                        }

                        // Convierte el array a JSON nuevamente
                        guiaExistente.jsondetalle = JSON.stringify(existingDetails);
                    } else {
                        // Si jsondetalle está vacío, simplemente agrega los nuevos detalles
                        guiaExistente.jsondetalle = JSON.stringify(detalles);
                    }
                } catch (error) {
                    console.error("Error al parsear jsondetalle existente:", error);
                    // Puedes manejar el error aquí según tu lógica de aplicación
                }
            } else {
                const guia = new AGuiaSalida();
                guia.idempresa = IDEMPRESA;
                guia.idsucursal = IDSUCURSAL;
                guia.idcorrelativo = $('#CC_cmbserie option:selected').attr('idcorrelativo');
                guia.idcaja = $('#CC_cmbserie option:selected').attr('idcaja');
                guia.encargado = NOMBREUSUARIO;
                guia.idalmacensucursalorigen = CD_txtidalmacensucursal.val();
                guia.seriedoc = $('#CC_cmbserie').val();
                guia.fechatraslado = CC_fechatraslado.val();
                guia.idsucursaldestino = sucursalId;
                guia.sucursaldestino = datosAgrupadosPorSucursal[sucursalId][0][6]; // Suponiendo que la sucursal está en el índice 6
                guia.jsondetalle = JSON.stringify(detalles);
                CD_arrayguias.push(guia);
            }
        }






        console.log(CD_arrayguias);
        CG_fnCargarGuias();
        $('#btnnextviewdistribucion').click();
    });
});
function encontrarSimilitudes() {

    for (const productoId of Object.keys(detallestockactual)) {
        const detalleProducto = detallestockactual[productoId];
        for (const sucursalId of Object.keys(detalleProducto.sucursales)) {
            const sucursal = detalleProducto.sucursales[sucursalId];
            if (sucursal.canstockagreporsuc <= 0) {
                delete detalleProducto.sucursales[sucursalId];
            }
        }
        // Si no quedan sucursales para este producto, eliminar el producto también
        if (Object.keys(detalleProducto.sucursales).length === 0) {
            delete detallestockactual[productoId];
        }
    }
    console.log(detallestockactual);
    const similitudes = [];

    for (const productoIdnu of Object.keys(productosSeleccionados)) {
        const productos = productosSeleccionados[productoIdnu];

        for (const sucursalid of productos) {
            const detalleSucursales = detallestockactual[productoIdnu].sucursales;

            if (detalleSucursales[sucursalid]) {
                const item = [
                    parseInt(productoIdnu),
                    parseInt(sucursalid),
                    detalleSucursales[sucursalid].cantidadstockactual,
                    detalleSucursales[sucursalid].cantidadstockinicial,
                    detalleSucursales[sucursalid].stockdescontadototal,
                    detalleSucursales[sucursalid].canstockagreporsuc
                ];

                similitudes.push(item);
            }
        }
    }

    console.log(similitudes);
    return similitudes;
}

var dropdownMenuAlmacen = document.getElementById("dropdownMenuAlmacen");
var labeldropdownMenuAlmacen = "";
var idAlmacenarrayfiltrado = [];
$(document).on('change', '.chkAlmacen', function (e) {
    var itemCheck = e.currentTarget;
    var numero = 0;
    if (itemCheck.checked) {
        if (labeldropdownMenuAlmacen == "Seleccionar Almacenes") {
            labeldropdownMenuAlmacen = "";
        }
        labeldropdownMenuAlmacen += itemCheck.labels[0].innerText + ", ";
        dropdownMenuAlmacen.innerText = labeldropdownMenuAlmacen;

        idAlmacenarrayfiltrado.push(itemCheck.value);
        var encontradoAprobado = false;
        for (var i = 0; i < idAlmacenarrayfiltrado.length; i++) {
            if (idAlmacenarrayfiltrado[i] === "10106" || idAlmacenarrayfiltrado[i] === "10107") {
                encontradoAprobado = true;
            } else {
                numero = 3;
            }
        }
        if (encontradoAprobado && numero === 0) {
            numero = 1; // Si encuentra "APROBADO IS" o "APROBADO Im" y no hay otro dato diferente, asigna 1
        }

        if (encontradoAprobado && numero === 3) {
            numero = 2; // Si encuentra "APROBADO IS" o "APROBADO Im" y no hay otro dato diferente, asigna 1
        }


        if (!encontradoAprobado && numero === 3) {

            numero = 3;
        }

        if (idAlmacenarrayfiltrado.length === 0) {
            numero = 3;
        }

    } else {
        var labelSeparado = labeldropdownMenuAlmacen.split(", ");
        labelSeparado = labelSeparado.filter(x => x != itemCheck.labels[0].innerText);
        labeldropdownMenuAlmacen = labelSeparado.join(", ");
        if (labeldropdownMenuAlmacen.length == 0) {
            labeldropdownMenuAlmacen = "Seleccionar Almacenes";
        }
        dropdownMenuAlmacen.innerText = labeldropdownMenuAlmacen;

        var index = idAlmacenarrayfiltrado.indexOf(itemCheck.value);
        if (index !== -1) {
            idAlmacenarrayfiltrado.splice(index, 1);
        }


        var encontradoretirado = false;

        for (var i = 0; i < idAlmacenarrayfiltrado.length; i++) {
            if (idAlmacenarrayfiltrado[i] === "10106" || idAlmacenarrayfiltrado[i] === "10107") {
                encontradoretirado = true;
            } else {
                numero = 3; // Si encuentra otro dato diferente, asigna 2
            }
        }

        if (encontradoretirado && numero === 0) { numero = 1; }
        if (encontradoretirado && numero === 3) { numero = 2; }
        if (!encontradoretirado && numero === 3) { numero = 3; }
        if (idAlmacenarrayfiltrado.length === 0) { numero = 3; }
    }
    fn_listarSucursalesperzonalizado(numero);
});

var dropdownMenuClase = document.getElementById("dropdownMenuClase");
var labeldropdownMenuClase = "";
$(document).on('change', '.chkClase', function (e) {
    var itemCheck = e.currentTarget;
    if (itemCheck.checked) {
        if (labeldropdownMenuClase == "Seleccionar Clases") {
            labeldropdownMenuClase = "";
        }
        labeldropdownMenuClase += itemCheck.labels[0].innerText + ", ";
        dropdownMenuClase.innerText = labeldropdownMenuClase;
    } else {
        var labelSeparado = labeldropdownMenuClase.split(", ");
        labelSeparado = labelSeparado.filter(x => x != itemCheck.labels[0].innerText);
        labeldropdownMenuClase = labelSeparado.join(", ");
        if (labeldropdownMenuClase.length == 0) {
            labeldropdownMenuClase = "Seleccionar Clases";
        }
        dropdownMenuClase.innerText = labeldropdownMenuClase;
    }
});

CD_ChkProductosNuevos.addEventListener("change", function (e) {
    var valor = this.value;
    if (valor == "true") {
        CD_ProductosNuevosDistribucion();
    } else {
        CD_ListarProductos();
    }
});

function procesarCheckbox() {
    var isChecked = $('#CD_sugerido').prop('checked');
    BLOQUEARCONTENIDO('contenedortblproductos', 'CARGANDO ...');
    var dropdownBtn = document.getElementById('dropdownMenuClase');
    var txtProducto = document.getElementById('CD_txtproducto');
    var chkProductosNuevos = document.getElementById('CD_ChkProductosNuevos');
    // Actualizar el objeto de productosSeleccionados si la sucursal está seleccionada.
    if (isChecked) {

        CD_tblproductos.clear().draw(false);
        let totalRegistros = 0; // Variable para almacenar la cantidad de registros

        var contadorInterno1 = 0;
        var sSucursalAlmacenessugerido = "";
        var sucalmacenes = $('#CC_form-registro').serializeArray();
        for (var i = 0; i < sucalmacenes.length; i++) {
            if (sucalmacenes[i].name.includes("Almacen")) {
                if (contadorInterno1 == 0)
                    sSucursalAlmacenessugerido += sucalmacenes[i].value;
                else
                    sSucursalAlmacenessugerido += "|" + sucalmacenes[i].value;

                contadorInterno1 += 1;
            }
        }


        var rango = CC_cmbrango.val();
        var rp = CD_sugerido.checked;
        var datosobtenidos = [];
        // DECIDI PROBAR EL CODIGO TERNARIO PARA HACER EL CODIGO MAS CORTO
        var rps = rp ? 1 : 0;  // Optimizado aquí también
        var rangoMeses = rango == 'BIMESTRE' ? 2 : rango == 'TRIMESTRE' ? 3 : rango == 'CUATRIMESTRE' ? 4 : rango == 'SEMESTRE' ? 6 : 0;
        let obj = {
            rango: rangoMeses,
            sucursales: listasucursalesseleccionadas.join('|'),
            tipo: rps,
            almacenes: sSucursalAlmacenessugerido,
            laboratorio: CD_txtidlaboratorio.val()
        };
        var url = ORIGEN + "/Almacen/AGuiaSalida/GetHistorialVentaslistarArray";
      
        $.post(url, obj).done(function (data) {
            if (data && data.rows && data.rows.length > 0) {
                datosobtenidos = data.rows;
                // Ordenar datosobtenidos por el valor en la posición [7]
                datosobtenidos.sort(function (a, b) {
                    // Comparar los valores en la posición [7]
                    const comparisonBy7 = a[7].localeCompare(b[7]);

                    // agregado luis velasquez
                    return comparisonBy7 !== 0 ? comparisonBy7 : a[6].localeCompare(b[6]);
                });

                // Utilizar un objeto para hacer un seguimiento de elementos únicos
                let elementosUnicos = {};

                for (let i = 0; i < datosobtenidos.length; i++) {
                    let datos = datosobtenidos[i];
                  
                    // Crear una clave única basada en los datos que quieres que sean únicos
                    let claveUnica = datos[2] + '-' + datos[3];

                    // Verificar si la clave ya existe en el objeto
                    if (!elementosUnicos[claveUnica]) {
                        totalRegistros += 1;
                        let fila = CD_tblproductos.row.add([
                            datos[2],
                            datos[5],
                            datos[6],
                            datos[7],
                            datos[11],
                            datos[11],
                            datos[12],
                            '<button class="btn btn-xs btn-success CD_btnpasarproducto"><i class="fas fa-check fa-1x"></i></button>' +
                            '<button class="btnanalisisproducto" codigo="' + datos[5] + '" producto="' + datos[6] + '" laboratorio="' + datos[7] + '" idproducto="' + datos[2] + '"><i class="fas fa-cash-register"></i></button>'
                        ]).draw(false).nodes();

                        $(fila).attr('tabindex', i);
                        $(fila).attr('onkeydown', 'movertabla(' + i + ')');
                        $(fila).attr('idalmacensucursal', datos[3]);

                        // Marcar la clave como ya existente en el objeto
                        elementosUnicos[claveUnica] = true;
                    }
                }

      

            }
          
            $("#numRegistros").text(totalRegistros);
            DESBLOQUEARCONTENIDO('contenedortblproductos');
        });
        dropdownBtn.disabled = true;
        txtProducto.disabled = true;
        chkProductosNuevos.disabled = true;


    } else {
        // Si la sucursal se deselecciona, eliminar todos los productos de esa sucursal del array.
        CD_ListarProductos();
 

        dropdownBtn.disabled = false;
        txtProducto.disabled = false;
        chkProductosNuevos.disabled = false;
    }
}

// CAMBIOS EN EL CHECK BOX PARA EL LISTADO DE SUGERIDO A ENVIAR SEGUN EL CHECK BOX
$(document).ready(function () {

    $('#CD_sugerido').on('click', procesarCheckbox);
});


function validarbusqueda(){
    var checkbox = document.getElementById('CD_sugerido');
    // Verifica si el checkbox está marcado
    if (checkbox.checked) {
        procesarCheckbox();
        // Aquí puedes realizar acciones adicionales si el checkbox está marcado
    } else {

        CD_ListarProductos();
    }
}

// CAMBIOS PARA ELEGIR EL SIGUIENTE ARCHIVO
function elegirProdAnt() {
    var numerotabindex = filaselecionadaAtrasDelante;

    if (filaselecionadaAtrasDelante==0) {
        mensaje('W', "Se encuentra en la primera fila.");
        return;
    }
    if (numerotabindex == null) {
        numerotabindex = 0;
    } else {
        numerotabindex -= 1;
    }
    console.log(numerotabindex);
    var fila = document.querySelector('tr[tabindex="' + numerotabindex + '"]');

    if (fila) {
        // Hacer clic en la fila
        fila.click();
    } else {
        console.log("No se encontró ninguna fila con el índice tabindex: " + numerotabindex);
    }
}

function elegirProdSig() {
    var numerotabindex = filaselecionadaAtrasDelante;
    var numeroultimafiladato = ultimafiladato - 1;

    if (filaselecionadaAtrasDelante == numeroultimafiladato) {
        mensaje('W', "Ya se encuentra en la utima fila.");
        return;
    }
    if (numerotabindex == null) {
        numerotabindex = 0;
    } else {
        numerotabindex += 1;
    }

    console.log(ultimafiladato);
    console.log(numerotabindex);
 
    // Seleccionar la fila correspondiente al índice tabindex
    var fila = document.querySelector('tr[tabindex="' + numerotabindex + '"]');

    if (fila) {
        // Hacer clic en la fila
        fila.click();
    } else {
        console.log("No se encontró ninguna fila con el índice tabindex: " + numerotabindex);
    }
}
//