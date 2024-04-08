
var txtexceldigemid = document.getElementById('txtexceldigemid');
var lblnumregistrosexcel = document.getElementById('lblnumregistrosexcel');
var tbltbodypartesexcel = document.getElementById('tbltbodypartesexcel');
var btnsubirlista = document.getElementById('btnsubirlista');
var _PRODUCTOSEXCEL = [];
txtexceldigemid.addEventListener('change', function () {
    var txt = txtexceldigemid.files[0];
    BLOQUEARCONTENIDO('carddigemid', 'Leyendo excel...');
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(txt);
});

var ExcelToJSON = function () {
    this.parseExcel = function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);               
                _PRODUCTOSEXCEL = (JSON.parse(json_object));     
                lblnumregistrosexcel.innerText = _PRODUCTOSEXCEL.length;
            })
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsBinaryString(file);
        DESBLOQUEARCONTENIDO('carddigemid');
    };
};
btnsubirlista.addEventListener('click', function () {
    $('#modalpartesexcel').modal('show');
    var fila = '';
    if (tbltbodypartesexcel.getElementsByTagName('tr').length == 0) {
        var numregistros = parseInt(_PRODUCTOSEXCEL.length / 1000);
        var residuo = (_PRODUCTOSEXCEL.length % 1000);
        for (var i = 0; i < numregistros; i++) {
            fila += '<tr>';
            fila += '<td>' + ((i * 1000) + 1) + ' - ' + ((i + 1) * 1000) + '</td>';
            fila += '<td>Pendiente</td>';
            fila += '<td><button class="btn btn-sm btn-success btnenviarlistaprecios"><i class="fas fa-paper-plane"></i></button></td>';
            fila += '</tr>';
        }
        if (residuo != 0) {
            fila += '<tr>';
            fila += '<td>' + ((numregistros * 1000) + 1) + ' - ' + (residuo + numregistros * 1000) + '</td>';
            fila += '<td>Pendiente</td>';
            fila += '<td><button class="btn btn-sm btn-success btnenviarlistaprecios"><i class="fas fa-paper-plane"></i></button></td>';
            fila += '</tr>';
        }
        tbltbodypartesexcel.innerHTML = fila;
    }
});
$(document).on('click', '.btnenviarlistaprecios', function () {
    var fila = this.parentNode.parentNode;
    
    var rango = fila.getElementsByTagName('td')[0].innerText;
    rango = rango.split('-');   
    var obj = {
        productos: JSON.stringify( fngetproductosexcel(parseInt(rango[0]), parseInt(rango[1])))
    };
    BLOQUEARCONTENIDO('modalpartesexcel', 'Guardando datos...');
    console.log(obj);
    let controller = new ObservatorioPrecioController();
    controller.ActualizarPreciosDigemid(obj, function (data) {
        fila.getElementsByTagName('td')[1].innerText = 'Enviado';
        fila.getElementsByTagName('td')[2].innerText = '';
        DESBLOQUEARCONTENIDO('modalpartesexcel');
    }, function () { DESBLOQUEARCONTENIDO('modalpartesexcel');   });
});

function fngetproductosexcel(position1, position2) {
    
    var array = [];
    for (var i = position1; i <= position2; i++) {
        var obj = new ProductoDigemid();
        var aux = _PRODUCTOSEXCEL[i];
        obj.codigodigemid = aux.Cod_Prod;
        obj.concentracion = aux.Concent;
        obj.fechavenregsanitario = aux.Fec_Vcto_Reg_Sanitario;
        obj.forma = aux.Nom_Form_Farm;
        obj.formasimplificada = aux.Nom_Form_Farm_Simplif;
        obj.fraccion = aux.Fracciones;
        obj.laboratorio = aux.Nom_Titular;
        obj.nombre = aux.Nom_Prod;
        obj.presentacion = aux.Presentac;
        obj.regsanitario = aux.Num_RegSan;
        obj.situacion = aux.Situacion;
        array.push(obj);
    }
    return array;
}