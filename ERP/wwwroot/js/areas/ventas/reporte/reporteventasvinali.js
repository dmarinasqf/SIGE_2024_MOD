
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');

var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

$(document).ready(function () {

    init();


});
function init() {
  
   
}

function iniciarTabla() {
    var datatable = new DataTable();
    datatable.searching = false;
    datatable.lengthChange = false;
    datatable.ordering = false;
    datatable.destroy = true;
    datatable.scrollX = true;
    var util = new UtilsSisqf();
    tblreporte = util.Datatable('tblreporte', false, datatable);
}
function fngetreporte(numpagina, tamanopagina) {
  
    var obj = {
       top:2000,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        pagine: {
            numpagina: numpagina,
            tamanopagina: tamanopagina,
        }
    };
    let controller = new ReporteVentasController();
    controller.GetReporteVentasVinali(obj, function (response) {
        var data = response.data;
      
        //try { tblreporte.clear().draw(); } catch (e) { console.log("x.x"); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        //iniciarTabla();
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'linkpage', 'paged');
    });
}

txtfechainicio.addEventListener('change', function () {
    txtfechafin.setAttribute('min', moment(txtfechainicio.value).format('YYYY-MM-DD'));
});

btnexportar.addEventListener('click', function () {
  
    var obj = {
 
        top: 9999999,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
      
    };
    let controller = new ReporteVentasController();
    controller.GenerarExcelreporteVentasVinali(obj);
});
btnconsultar.addEventListener('click', function () {
    fngetreporte();
});

$(document).on('click', '.linkpage', function () {
    var numpagina = this.getAttribute('numpagina');
    fngetreporte(numpagina, 25);
    var pages = document.getElementsByClassName('linkpage');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});