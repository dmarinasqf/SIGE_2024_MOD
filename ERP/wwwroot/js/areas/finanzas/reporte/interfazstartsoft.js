var txtfechainico = document.getElementById('txtfechainico');
var txtfechafin = document.getElementById('txtfechafin');
var btndescargar = document.getElementById('btndescargar');

btndescargar.addEventListener('click', function () {
    if (txtfechainico.value.length!=10)
        return;
    if (txtfechafin.value.length!=10)
        return;
    let controller = new ReporteFinanzasController();
    btndescargar.disabled = true;
    var obj = {
        fechainicio: txtfechainico.value,
        fechafin:txtfechafin.value
    };
    controller.ExportarVentas(obj, () => {
        btndescargar.disabled=false
    }, () => { btndescargar.disabled = false });
});