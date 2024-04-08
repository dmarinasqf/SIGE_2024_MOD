var tbodyfinal = document.getElementById('tbodyfinal');
var formvalidarusuario = document.getElementById('form-validarusuario');
function fnstep3cargarcambios() {
    var fila = '';
    var data = fnstep3getdata();
    for (var i = 0; i < data.length; i++) {
        fila += '<tr>';
        fila += '<td>' + data[i].tipo + '</td>';
        fila += '<td>' + data[i].nombreproducto + '</td>';
        fila += '<td>' + data[i].preciocompra + '</td>';
        var descuentos = JSON.parse(data[i].jsondetalle);

        if (descuentos.length > 0) {
            var listas = '<table border="1" width="100%"><tr><th>Lista</th><th>Pv</th><th>DesSucursal</th><th>DesProveedor</th><th>Total</th></tr>';
            for (var j = 0; j < descuentos.length; j++) {
                listas += '<tr>';
                listas += '<td>' + (descuentos[j].nombrelista ?? '') + '</td>';
                listas += '<td>' + ((parseFloat(descuentos[j].pventa) ?? 0).toFixed(2) ?? '') + '</td>';
                listas += '<td>' + (descuentos[j].dessucursal ?? '') + '</td>';
                listas += '<td>' + (descuentos[j].desproveedor ?? '') + '</td>';
                if (descuentos[j].tipodescuento == 'afecto')
                    listas += '<td class="text-danger">' + ((parseFloat(descuentos[j].preciofinal) ?? 0).toFixed(2) ?? '') + '</td>';
                else
                    listas += '<td>' + ((parseFloat(descuentos[j].preciofinal) ?? 0).toFixed(2) ?? '') + '</td>';

                listas += '</tr>';
            }
            listas += '</table>';
            fila += '<td>' + listas + '</td>';
        } else
            fila += '<td></td>';

        fila += '</tr>';
    }
    tbodyfinal.innerHTML = fila;
}
function fnstep3getdata() {
    var filas = document.querySelectorAll('#tbodyproductos tr');
    var array = [];
    filas.forEach(function (e) {
        var obj = new DescuentoDetalle();
        obj.idproducto = e.getAttribute('idproducto');
        obj.tipo = e.getElementsByClassName('cmbtipoitem')[0].value;
        obj.cantidad = e.getElementsByClassName('cantidad')[0].value;
        obj.preciocompra = e.getElementsByClassName('preciocompra')[0].innerText;
        obj.nombreproducto = e.getElementsByClassName('nombrepro')[0].innerText;

        //console.log("idproducto "+e.getAttribute('idproducto'));
        //console.log("cmbtipoitem "+e.getElementsByClassName('cmbtipoitem')[0].value);
        //console.log("cantidad " +e.getElementsByClassName('cantidad')[0].value);
        //console.log("preciocompra " +e.getElementsByClassName('preciocompra')[0].innerText);
        //console.log("nombrepro " +e.getElementsByClassName('nombrepro')[0].innerText);
        //console.log("index " +e.getAttribute('index'));


        var index = e.getAttribute('index');
        var pos = fngetposarraydescuentos(index);
        if (pos != -1) {
            var arraylistas = _descuentos[pos].data;
            var newarray = [];
            for (var i = 0; i < arraylistas.length; i++) {
                if ((arraylistas[i].dessucursal ?? 0) != 0 || (arraylistas[i].desproveedor ?? 0) != 0)
                    newarray.push(arraylistas[i]);
            }
            obj.jsondetalle = JSON.stringify(newarray);
            //console.log(obj.jsondetalle);
        } else
            obj.jsondetalle = JSON.stringify([]);
        array.push(obj);
        
    });
    //console.log(array);
    return array;
}
function fnstep3verificarsihayvalidacionusuario() {
    var array = [];
    var filas = document.querySelectorAll('#tbodyfinal tr');
    for (var i = 0; i < filas.length; i++) {
        if (filas[i].getElementsByClassName('text-danger')[0])
            array.push(filas[i].getElementsByClassName('text-danger')[0]);
    }
    return array;
}
function fnstep3guardardescuento() {
    let controller = new DescuentoController();
    var descuento = {
        descripcion: txtdescripcion.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        tipodescuento: cmbtipodescuento.value,
        estado: 'HABILITADO'
    };
    var obj = {
        descuento: descuento,
        detalle: JSON.stringify(fnstep3getdata()),//EARTCOD1022
        canalVentas: listaCanalesPrecios//CAMPO AGREGADO
    };

    controller.Registrar(obj, function (data) {
        setTimeout(function () {
            location.reload();
        }, 2000);
    });
}
$(document).on('click', '#btnfinalizar2wizard', function () {
    var descuentopara = $('input:radio[name=tiporadio]:checked').val();   
    if (descuentopara == undefined) {
        mensaje('I', 'Seleccionar para quien aplica el descuento');
        return;
    }
    if (descuentopara == 'proveedor' && cmbproveedor.value=='')
    {
        mensaje('I', 'Seleccionar el proveedor');
        return;
    }
    if (descuentopara == 'laboratorio' && cmblaboratorio.value == '')
    {
        mensaje('I', 'Seleccionar el laboratorio');
        return;
    }
  
    if (!(txtfechainicio.value.length == 16 && txtfechafin.value.length == 16)) {
        mensaje('I', 'Ingrese el rango de fecha del descuento');
        return;
    }
    if (txtdescripcion.value.trim() == '') {
        mensaje('I', 'Ingrese la descripción del descuento');
        return;
    }
    if (fnstep3getdata() == 0)
        return;
    swal({
        title: '¿Desea guardar descuentos?',
        text: 'Verifique que los datos sean correctos',
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
            if (fnstep3verificarsihayvalidacionusuario().length > 0) {
                $('#modalvalidarusuario').modal('show');
            }
            else {
                fnstep3guardardescuento();
                //alert("HOLA  MUNDO");
                //console.log("HELLO WORLD");
            }

        }
        else
            swal.close();
    });

});

formvalidarusuario.addEventListener('submit', function (e) {
    e.preventDefault();
    let controller = new DescuentoController();
    var descuentopara = $('input:radio[name=tiporadio]:checked').val();
    var idprolab = '';
    if (descuentopara == 'laboratorio')
        idprolab = cmblaboratorio.value;
    if (descuentopara == 'proveedor')
        idprolab = cmbproveedor.value;
    var descuento = {
        descripcion: txtdescripcion.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        tipodescuento: cmbtipodescuento.value,
        estado: 'HABILITADO',
        descuentopara: $('input:radio[name=tiporadio]:checked').val(),
        idprolab: idprolab
    };
    var obj = {
        usuario: document.getElementById('txtusuario').value,
        clave: document.getElementById('txtclave').value,
        descuento: descuento,
        detalle: fnstep3getdata(),
        canalVentas: listaCanalesPrecios
    };
    controller.RegistrarValidacionUsuario(obj, function (data) {
        setTimeout(function () {
            location.reload();
        }, 2000);
    });
});

