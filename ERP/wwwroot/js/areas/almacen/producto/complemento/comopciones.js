var btnregresar = document.getElementById('btnregresar');
var btnvalidar = document.getElementById('btnvalidar');
var CC_cmbserie = document.getElementById('CC_cmbserie');
var CC_fechatraslado = document.getElementById('CC_fechatraslado');
var cmblaboratorio = document.getElementById('cmblaboratorio');
var btnagregar = document.getElementById('btnagregar');
//var btnpreviewdistribucion = document.getElementById('btnpreviewdistribucion');
var CD_tbldistribucion;
var CD_items;
var CD_timerbusqueda;
//ARRAYS
var CD_arrayguias = [];
var CD_arraydetaleproductos = [];
//lista de objetos
var CD_DetalleDistribucion = [];
//tabla items
var asucdestino = [];
var adetalle = [];
var lug = 0;
var nlug = 0;

var poscab = 0;0
var acab = [];
var adet = [];

function limpiar() {
    CD_arrayguias = [];
    CD_arraydetaleproductos = [];
    CD_DetalleDistribucion = [];
    asucdestino = [];
    adetalle = [];
    lug = 0;
    nlug = 0;
    limpiartable();
    acab=[];
}

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
    iniciartabladet();
    
    fncc_listarseriescajaxsucursal(IDSUCURSAL, 'GUIA');
});

function CD_listaranalisis() {
    try {
        BLOQUEARCONTENIDO('CD_tabla-distribucion', 'CARGANDO ...');
        return new Promise(function (resolve, reject) {
            let url = ORIGEN + "/Almacen/AReporte/ReporteAnalisisStockasync/";
            let obj = {
                alerta: cmbalerta.value,
                sucursal: listasucursalesseleccionadas.join('|'),
                laboratorio: cmblaboratorio.value
            };
            $.post(url, obj).done(function (data) {
                DESBLOQUEARCONTENIDO('CD_tabla-distribucion');
                if (data.mensaje === "ok") {
                        let datos = JSON.parse(data.objeto);
                        limpiarTablasGeneradas('#CD_tabla-distribucion', 'CD_tbldistribucion', true, 'thead-dark');
                        CD_crearCabeceras(datos, "#CD_tbldistribucion", true);
                        CD_crearCuerpo(datos, '#CD_tbldistribucion');
                        //iniciarTablaDistribucion(getRango() + 6);            
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

    } catch (e) { console.log("x.x " + e); }
}

function CD_crearCabeceras(datos, tablename, sticky) {
    var stick = '';
    if (sticky)
        stick = 'class="header-sticky"';
    var cabeceras = GetHeaders(datos);
    var nuevaFila = "<tr>";
    for (var i = 0; i < cabeceras.length; i++) {
        nuevaFila += "<th " + stick + ">" + cabeceras[i] + "</th>";
    }
    nuevaFila += "<th " + stick + ">" + "STOCK A SOLICITAR" + "</th>";
    nuevaFila += "</tr>";
    $(tablename + ' thead').append(nuevaFila);
}

function CD_crearCuerpo(datos, tablename) {
    var fila = "";
        for (let h = 0; h < datos.length; h++) {
            fila += '<tr>';
            var valores = GetValores(datos[h]);
            var cabeceras = GetHeaders(datos);
            for (var j = 0; j < valores.length; j++) {

                if (cabeceras[j] == 'STOCKLOCAL')
                    fila += '<td class="text-right" style="font-size:15px;font-weight:bold">' + valores[j] + "</td>";
                else fila += '<td class="text-right">' + valores[j] + "</td>";
            }
            fila += '<td> <input type="number" class="text-center cd_txtcantidadindividual" style="width:100px;" value="0" min="0" max="'+ valores[15]+'"/> </td>';
            fila += '</tr>';
        }
    $(tablename + " tbody").append(fila);
}

btnregresar.addEventListener('click', function () {
    listasucursalesseleccionadas = [];
    CD_arrayguias = [];
    limpiar();
    //LIMPIAR PANEL DE BUSQUEDA
    $('#CD_form-panel-busqueda-producto').trigger('reset');
    let cheks = document.getElementsByClassName('checkbox');
    for (let i = 0; i < cheks.length; i++) {
        cheks[i].checked = false;
    }
    $('#btnpreview').click();
});

btnagregar.addEventListener('click', function () {
    CD_tbldistribucion = $('#CD_tbldistribucion').DataTable({
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
    //fncd_guardardatostabla();
    //CD_items.clear().draw(false);
    //limpiartable();
    //agregar_items(asucdestino, adetalle, '#CD_items');
    //generarguia();
    Genrar_preguias();
});

//$('#cdbtn_validar').click(function () {
//    //fncd_guardardatostabla();
//    //CG_fnCargarGuias();
//    //$('#btnnextviewdistribucion').click();
//    Generar_preguia();
//});

function fncd_guardardatostabla() {
    Genrar_preguias();
    /*if (CD_arrayguias.length == 0)
        Generar_guias_suc();
     Generar_preguia();*/
}


function Genrar_preguias() {

    let datatable = CD_tbldistribucion.rows().data();
    var c = 0;
    if (!(datatable.length > 0))
        null;
    var filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
    filas.forEach(function (e) {
        if ((document.getElementsByClassName("cd_txtcantidadindividual")[c].value) > 0 && datatable[c][15]>0) {
            let guia = new AGuiaSalida();
            guia.idempresa = IDEMPRESA;
            guia.idsucursal = IDSUCURSAL;
            guia.idsucursaldestino = (datatable[c][0] === '') ? '0' : datatable[c][0];
            guia.sucursaldestino = (datatable[c][1] === '') ? '' : datatable[c][1];
            guia.idcorrelativo = $('#CC_cmbserie option:selected').attr('idcorrelativo');
            guia.idcaja = $('#CC_cmbserie option:selected').attr('idcaja');
            guia.encargado = NOMBREUSUARIO;
            guia.idalmacensucursalorigen = '10005';
            guia.seriedoc = $('#CC_cmbserie').val();
            guia.fechatraslado = $('#CC_fechatraslado').val();

            var suc = datatable[c][0]
            let detalle = new ADetalleGuiaSalida();
            let posguia = CD_fnBuscarGuiaDistribucion(suc);
            detalle.idsucursaldestino = suc;
            detalle.idproducto = (datatable[c][8] === '') ? '0' : datatable[c][8];
            detalle.laboratorio = datatable[c][5];
            detalle.producto = datatable[c][6];
            sucdestino = datatable[c][1];
            detalle.cantidadgenerada = document.getElementsByClassName("cd_txtcantidadindividual")[c].value;
            cantidadenviar = parseFloat(detalle.cantidadgenerada);

            agregar_cabecera(guia, posguia, detalle);


            asucdestino[lug] = sucdestino;
            adetalle[lug] = detalle;
            lug++;

            agregar_items(asucdestino, adetalle, '#CD_items');
        }
        c++;
    });
    console.log(acab);
}

function agregar_cabecera(guiacab,pos,detalle) {
    if (acab.length == 0) {
        acab[poscab] = guiacab;
    } else {
        agregarsuc(guiacab);
    }
    agregar_detalle(pos,detalle);
}
function agregarsuc(guiacab) {
    var result = 1;
    for (var i = 0; acab.length > i; i++) {
        if (acab[i].idsucursaldestino.trim() == guiacab.idsucursaldestino.trim()) {
            result = 0;
        }
    }
    if (result == 1) {
        poscab++;
        acab[poscab] = guiacab;
    }
}

function agregar_detalle(pos,detalle) {
    var result = 1;
    var pos=0;
    for (var i = 0; acab.length > i; i++) {
        if (acab[i].idsucursaldestino.trim() == detalle.idsucursaldestino.trim()) {
            result = 0;
            pos = i;
        }
    }

    if (result == 0) {
        CD_fnGuardarDetalle(pos,detalle)
        //var det=[];
        //let stringdetalle = acab[pos].jsondetalle;
        //if (stringdetalle.length > 0)
        //    det = JSON.parse(stringdetalle);
        //else
        //    det = [];
        //det[det.length] = detalle;
        //acab[i].jsondetalle=JSON.stringify(det);
    } 
}


function Generar_preguia() {
    console.log('preguia')
    var c = 0;
    
    var cantidadenviar = 0;
    try {
        let datatable = CD_tbldistribucion.rows().data();
        if (!(datatable.length > 0))
            null;
        var filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
        filas.forEach(function (e) {
            if ((document.getElementsByClassName("cd_txtcantidadindividual")[c].value) > 0) {
                var suc=datatable[c][0]
                let posguia = CD_fnBuscarGuiaDistribucion(suc);
                let detalle = new ADetalleGuiaSalida();
                detalle.idsucursaldestino =  suc;
                detalle.idproducto = (datatable[c][8] === '') ? '0' : datatable[c][8];
                detalle.laboratorio = datatable[c][5];
                detalle.producto = datatable[c][6];
                sucdestino = datatable[c][1];
                detalle.cantidadgenerada = document.getElementsByClassName("cd_txtcantidadindividual")[c].value;
                cantidadenviar = parseFloat(detalle.cantidadgenerada);
                
                    asucdestino[lug] = sucdestino;
                    adetalle[lug] = detalle;
                    lug++;
                
                //agregar_items(asucdestino, adetalle, '#CD_items');
                //iniciartabladet(sucdestino,detalle,'#CD_items',6);
                CD_fnGuardarDetalle(posguia, detalle);
            } 
            c++;
        });
        /*if (total > 0) {
            let objdetalledistribucion = new detalledistribucion();
            objdetalledistribucion.idproducto = CD_txtidproducto.val();
            objdetalledistribucion.detalle = JSON.stringify(array);
            return objdetalledistribucion;
        } else
            return null;
          */  
    } catch (error) {
        console.log(error);
        return null
    }
}

function CD_fnBuscarGuiaDistribucion(idsucursaldestino) {
    for (let i = 0; i < CD_arrayguias.length; i++) {
        if (CD_arrayguias[i] != null) {
            if (CD_arrayguias[i].idsucursaldestino == idsucursaldestino) {
                return i;
            }
        }
    }
    return -1;
}

function Generar_guias_suc() {
    console.log('guiassuc')
    var c = 0;
    try {
        let datatable = CD_tbldistribucion.rows().data();
        if (!(datatable.length > 0))
            null;
        var filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
        //console.log(listasucursalesseleccionadas);
        //console.log(filas);
        filas.forEach(function (e) {
            if ((document.getElementsByClassName("cd_txtcantidadindividual")[c].value) > 0) {
                let guia = new AGuiaSalida();
                guia.idempresa = IDEMPRESA;
                guia.idsucursal = IDSUCURSAL;
                guia.idsucursaldestino = (datatable[c][0] === '') ? '0' : datatable[c][0];
                guia.sucursaldestino = (datatable[c][1] === '') ? '' : datatable[c][1];
                guia.idcorrelativo = $('#CC_cmbserie option:selected').attr('idcorrelativo');
                guia.idcaja = $('#CC_cmbserie option:selected').attr('idcaja');
                guia.encargado = NOMBREUSUARIO;
                guia.idalmacensucursalorigen = '10005';
                guia.seriedoc = $('#CC_cmbserie').val();
                guia.fechatraslado = $('#CC_fechatraslado').val();


                for (var i = 0; CD_arrayguias.length >=i; i++) {
                    if (CD_arrayguias.length == 0) {
                        CD_arrayguias[nlug] = guia;
                        nlug++;
                    }
                    else {
                        var x = i - 1;
                        console.log(x);
                        console.log(CD_arrayguias[x])
                        if (x >= 0) {
                            if (CD_arrayguias[x].idsucursaldestino != guia.idsucursaldestino) {
                                CD_arrayguias[nlug] = guia;
                                nlug++;
                            }
                        }
                    }
                }
            }
            c++;
        });
        
    } catch (error) {
        console.log(error);
        return null;
    }
}

function fncc_listarseriescajaxsucursal(idsucursal, nombredocumento) {
    let controller = new CajaController();
    let obj = { idsucursal: idsucursal, nombredocumento: nombredocumento };
    // console.log(obj);
    controller.ListarCorrelativosPorCajaPorDocumento('CC_cmbserie', obj, '', '');
}

function CD_fnGuardarDetalle(pos, obj) {
    //ACA
   
    let posdetalle = CD_fnBuscarDetalleGuiaDistribucion(pos, obj.idproducto);
    let detalle = [];
    let stringdetalle = acab[pos].jsondetalle;
    //let stringdetalle = CD_arrayguias[pos].jsondetalle;
    if (stringdetalle.length > 0)
        detalle = JSON.parse(stringdetalle);
    else
        detalle = [];

    if (posdetalle == -1) {
        detalle[detalle.length] = obj;
        acab[pos].jsondetalle = JSON.stringify(detalle);
    }
    else {
        detalle[posdetalle] = obj;
        acab[pos].jsondetalle = JSON.stringify(detalle);
    }
}

function CD_fnBuscarDetalleGuiaDistribucion(pos, idproducto) {
    if (acab[pos].jsondetalle.length > 0) {
        let detalle = JSON.parse(acab[pos].jsondetalle);
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

function generarguia() {
    let totaldetalle = CG_getTotalDetalles(CD_arrayguias)
    if (totaldetalle > 0) {
        var url = ORIGEN + "/Almacen/AGuiaSalida/GenerarGuiasLista";
        let obj = {
            listaguiajson: JSON.stringify(CD_arrayguias)
        };
        $('#cvbtn_generarguia').prop('disabled', true);
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                btnpreviewdistribucion.click();
                $('#btnpreview').click();
                mensaje('S', "LAS GUIAS DE SALIDA SE GENERARON CORRECTAMENTE.");
            }
            else
                mensaje('W', data.mensaje);
            $('#cvbtn_generarguia').prop('disabled', false);
        }).fail(function (data) {
            $('#cvbtn_generarguia').prop('disabled', false);
            mensajeError(data);
        });
    } else
        alertaSwall("W", "NO SE HA AGREGADO NINGÚN ITEM PARA DISTRIBUIR.", "")
}

function CG_getTotalDetalles(array) {
    let suma = 0;
    for (let i = 0; i < array.length; i++) {
        let detalle = [];
        if (array[i] != null) {
            let stringdetalle = array[i].jsondetalle;
            if (stringdetalle.length > 0)
                detalle = JSON.parse(stringdetalle);
            else detalle = [];
            suma += detalle.length;
        }
    }
    return suma;
}

function fnlistarlaboratorio() {
    let controller = new SucursalController();
    controller.ListarLaboratorio('cmblaboratorio');
}

cmblaboratorio.addEventListener('change', function () {
    CD_listaranalisis();
});

function agregar_items(sucdestino, datos, tablename) {
    //aca se pasaron los arrays falta
    limpiartable();
    var fila = '';
    for (var i = 0; i < datos.length; i++) {
        
        fila += '<tr>';
        //var valores = GetValores(datos[h]);
        //console.log(valores);
        fila += '<td class="text-right">' + sucdestino[i] + "</td>";
        fila += '<td class="text-right">' + datos[i]['laboratorio'] + "</td>";
        fila += '<td class="text-right">' + datos[i]['idproducto'] + "</td>";
        fila += '<td class="text-right">' + datos[i]['producto'] + "</td>";
        fila += '<td class="text-right">' + datos[i]['cantidadgenerada'] + "</td>";
        fila += '</tr>';
    }
    $(tablename + " tbody").append(fila);

}

function agregar_cab(tablename) {
    var stick = 'class="header-sticky"';
    var nuevaFila = "";
    nuevaFila += "<tr>";
    nuevaFila += "<th " + stick + " >" + 'SUCURSAL' + "</th>";
    nuevaFila += "<th " + stick + " >" + 'LABORATORIO' + "</th>";
    nuevaFila += "<th " + stick + " >" + 'ID PRODUCTO' + "</th>";
    nuevaFila += "<th " + stick + " >" + 'PRODUCTO' + "</th>";
    nuevaFila += "<th " + stick + " >" + 'CANTIDAD ENVIADA' + "</th>";
    nuevaFila += "<th " + stick + " ></th>";
    nuevaFila += "</tr>";
    $(tablename + ' thead').append(nuevaFila);
}

function iniciartabladet() {
    CD_items = $('#CD_items').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    });
    agregar_cab('#CD_items');
}

function limpiartable() {
    $("#CD_items tbody tr").remove();
}

btnvalidar.addEventListener('click', function () {
    fncd_guardardatostabla();
    CG_fnCargarGuias();
    $('#btnnextviewdistribucion').click();
});
