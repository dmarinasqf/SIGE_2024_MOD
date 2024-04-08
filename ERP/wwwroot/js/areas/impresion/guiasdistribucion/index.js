var agregarArrDerecha = document.getElementById("agregarArrDerecha");
var agregarArrIzquierda = document.getElementById("agregarArrIzquierda");
var cmbIzquierda = document.getElementById("cmbIzquierda");
var cmbDerecha = document.getElementById("cmbDerecha");
var txtbuscarizquierda = document.getElementById("txtbuscarizquierda");
var txtbuscarderecha = document.getElementById("txtbuscarderecha");

var txtfechainicio = document.getElementById("txtfechainicio");
var txtfechafin = document.getElementById("txtfechafin");
var txtestadoguia = document.getElementById("txtestadoguia");
var btnbusqueda = document.getElementById("btnbusqueda");

var arrayIzquierda = new Map();
var arrayDerecha = new Map();

$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    var obj = [];
    obj[obj.length] = { name: "fechainicio", value: txtfechainicio.value };
    obj[obj.length] = { name: "fechafin", value: txtfechafin.value };
    obj[obj.length] = { name: "estadoguia", value: txtestadoguia.value };
    let controller = new GuiaSalidaController();
    controller.BuscarCodigosGuiaDistribucion(obj, listarCodigosGuiasDistribucion);
});
function listarCodigosGuiasDistribucion(data) {
    if (arrayIzquierda.size > 0) {
        const iterador = arrayIzquierda[Symbol.iterator]();
        for (const item of iterador) {
            $('#cmbIzquierda option[value="' + item[0] + '"]').remove();
        }
    }

    let datos = JSON.parse(data);
    arrayIzquierda = new Map();
    var aCodigoFiltrado;
    for (let i = 0; i < datos.length; i++) {
        aCodigoFiltrado = arrayDerecha.get(datos[i].idguiasalida.toString());
        if (aCodigoFiltrado == undefined) {
            arrayIzquierda.set(datos[i].idguiasalida.toString(), datos[i].codigo);
            const option = document.createElement("option");
            option.value = datos[i].idguiasalida.toString();
            option.text = datos[i].codigo;
            cmbIzquierda.appendChild(option);
        }
    }
}

$(document).on('click', '.btnimprimir', function () {
    var href = ORIGEN + `/ImpresionMasiva/GuiasDistribucion/Imprimir?codigos=`;
    const iterador = arrayDerecha[Symbol.iterator]();
    let contador = 1;
    let tamanioArray = arrayDerecha.size;
    if (tamanioArray > 0) {
        for (const item of iterador) {
            if (contador != tamanioArray) {
                href += item[0] + "_";
            } else {
                href += item[0];
            }
            contador++;
        }
        ABRIR_MODALIMPRECION(href, 'GUIAS DISTRIBUCION');
    } else {
        mensaje("W", "Seleccion guías a imprimir.")
    }
});

agregarArrDerecha.addEventListener("click", function () {
    let idGuiasSeleccionadas = $('#cmbIzquierda').val();
    for (let i = 0; i < idGuiasSeleccionadas.length; i++) {
        let codigo = arrayIzquierda.get(idGuiasSeleccionadas[i]);
        arrayDerecha.set(idGuiasSeleccionadas[i], codigo);
        arrayIzquierda.delete(idGuiasSeleccionadas[i]);
        $('#cmbIzquierda option[value="' + idGuiasSeleccionadas[i] + '"]').remove();

        const option = document.createElement("option");
        option.value = idGuiasSeleccionadas[i];
        option.text = codigo;
        cmbDerecha.appendChild(option);
    }
});
agregarArrIzquierda.addEventListener("click", function () {
    let idGuiasSeleccionadas = $('#cmbDerecha').val();
    for (let i = 0; i < idGuiasSeleccionadas.length; i++) {
        let codigo = arrayDerecha.get(idGuiasSeleccionadas[i]);
        arrayIzquierda.set(idGuiasSeleccionadas[i], codigo);
        arrayDerecha.delete(idGuiasSeleccionadas[i]);
        $('#cmbDerecha option[value="' + idGuiasSeleccionadas[i] + '"]').remove();

        const option = document.createElement("option");
        option.value = idGuiasSeleccionadas[i];
        option.text = codigo;
        cmbIzquierda.appendChild(option);
    }
});

txtbuscarizquierda.addEventListener("keyup", function () {
    var numdoc = this.value;
    var arrFiltrado = new Map();
    const iterador = arrayIzquierda[Symbol.iterator]();
    for (const item of iterador) {
        if (item[1].includes(numdoc)) {
            arrFiltrado.set(item[0], item[1]);
        }
        $('#cmbIzquierda option[value="' + item[0] + '"]').remove();
    }

    const iteradorFiltro = arrFiltrado[Symbol.iterator]();
    for (const item of iteradorFiltro) {
        const option = document.createElement("option");
        option.value = item[0];
        option.text = item[1];
        cmbIzquierda.appendChild(option);
    }
});
txtbuscarderecha.addEventListener("keyup", function () {
    var numdoc = this.value;
    var arrFiltrado = new Map();
    const iterador = arrayDerecha[Symbol.iterator]();
    for (const item of iterador) {
        if (item[1].includes(numdoc)) {
            arrFiltrado.set(item[0], item[1]);
        }
        $('#cmbDerecha option[value="' + item[0] + '"]').remove();
    }

    const iteradorFiltro = arrFiltrado[Symbol.iterator]();
    for (const item of iteradorFiltro) {
        const option = document.createElement("option");
        option.value = item[0];
        option.text = item[1];
        cmbDerecha.appendChild(option);
    }
});