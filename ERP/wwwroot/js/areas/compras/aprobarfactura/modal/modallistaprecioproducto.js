var MLPP_tblpreciosproducto;
var MLPP_btnguardarlista = document.getElementById("MLPP_btnguardarlista");

$(document).ready(function () {
    MLPP_tblpreciosproducto = $('#MLPP_tblpreciosproducto').DataTable({
        paging: false,
        searching: false,
        lengthChange: false,
        "ordering": false,
        responsive: true,
        "language": LENGUAJEDATATABLE()      
    });
});

function MLPP_ListarProductosYPrecios() {
    MLPP_tblpreciosproducto.clear().draw(false);
    for (var i = 0; i < _TPRECIOS.length; i++) {
        if (_TPRECIOS[i][1] == "1001") {
            var oDetalle = _DETALLEINICIAL.filter(x => x.codigoproducto == _TPRECIOS[i][0]);
            MLPP_tblpreciosproducto.row.add([
                _TPRECIOS[i][0],
                oDetalle[0].producto,
                _TPRECIOS[i][4],
                '<input type="checkbox" class="checkprecioproducto" checked/>Confirmar',
            ]).draw(false);
        }
    }
}

$(document).on('change', '.checkprecioproducto', function () {
    if (this.checked) {
        this.setAttribute("checked", "");
    } else {
        this.removeAttribute("checked");
    }
});
MLPP_btnguardarlista.addEventListener("click", function () {
    var filas = document.querySelectorAll('#MLPP_tblpreciosproducto tbody tr');
    filas.forEach(function (e) {
        var textCheckbox = e.childNodes[3].innerHTML;
        var codigoproducto = e.childNodes[0].innerHTML;
        if (!textCheckbox.includes("checked")) {
            _TPRECIOS = _TPRECIOS.filter(x => x[0] != codigoproducto || x[1] != 1001);
        }
    });
    fnAprobarFactura();
});