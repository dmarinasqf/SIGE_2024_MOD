var tbltbodyemail = document.getElementById('tbltbodyemail');
var mensajeeditor = document.getElementById('mensajeeditor');
var txtasuntoemail = document.getElementById('txtasuntoemail');
var btnenviaremail = document.getElementById('btnenviaremail');


var _IDTABLACORREO;
$(document).ready(function () {
    $.extend($.summernote.options.icons, {
        'align': 'fa fa-align',
        'alignCenter': 'fa fa-align-center',
        'alignJustify': 'fa fa-align-justify',
        'alignLeft': 'fa fa-align-left',
        'alignRight': 'fa fa-align-right',
        'indent': 'fa fa-indent',
        'outdent': 'fa fa-outdent',
        'arrowsAlt': 'fa fa-arrows-alt',
        'bold': 'fa fa-bold',
        'caret': 'fa fa-caret-down text-grey-m2 ml-1',
        'circle': 'fa fa-circle',
        'close': 'fa fa fa-close',
        'code': 'fa fa-code',
        'eraser': 'fa fa-eraser',
        'font': 'fa fa-font',
        'italic': 'fa fa-italic',
        'link': 'fa fa-link text-success-m1',
        'unlink': 'fas fa-unlink',
        'magic': 'fa fa-magic text-brown-m1',
        'menuCheck': 'fa fa-check',
        'minus': 'fa fa-minus',
        'orderedlist': 'fa fa-list-ol text-blue',
        'pencil': 'fa fa-pencil',
        'picture': 'far fa-image text-purple-d1',
        'question': 'fa fa-question',
        'redo': 'fa fa-repeat',
        'square': 'fa fa-square',
        'strikethrough': 'fa fa-strikethrough',
        'subscript': 'fa fa-subscript',
        'superscript': 'fa fa-superscript',
        'table': 'fa fa-table text-danger-m2',
        'textHeight': 'fa fa-text-height',
        'trash': 'fa fa-trash',
        'underline': 'fa fa-underline',
        'undo': 'fa fa-undo',
        'unorderedlist': 'fa fa-list-ul text-blue',
        'video': 'far fa-file-video text-pink-m1'
    });
    $('#mensajeeditor').summernote({
        height: 250,
        //minHeight: 150,
        //maxHeight: 400
    });
    //CKEDITOR.replace('mensajeeditor');
    //CKEDITOR.config.height = 300;
});
class ModalCorreo
{
    fnagregarcorreos(correos, mensaje) {
        $("#mensajeeditor").summernote("code", mensaje);
        //CKEDITOR.instances['mensajeeditor'].setData(mensaje);
        //mensajeeditor.value = mensaje;
        var tbody = document.getElementById('tbltbodyemail');

        var fila = '';  
        for (var i = 0; i < correos.length; i++) {
            var aux = correos[i].split("|");
           
          
            if (aux.length == 2) {
                fila += '<tr>';
                fila += '<td >' + aux[0]+'</td>';
                fila += '<td contenteditable="true">' + aux[1]+'</td>';
                fila += '<td><input type="checkbox" class="email"  checked/></td>';
                fila += '</tr>';              
               
            }           
            tbody.innerHTML = fila;
        }
    }
    fngetemails() {
        var array = [];
        var filas = document.querySelectorAll('#tbltbodyemail tr');
        for (var i = 0; i < filas.length; i++) {
            if (filas[i].getElementsByTagName('input')[0].checked)
                array.push(filas[i].getElementsByTagName('td')[1].innerText);
           
        }
        return array;
    }
}