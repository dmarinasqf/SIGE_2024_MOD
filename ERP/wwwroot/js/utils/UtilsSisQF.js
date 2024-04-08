class UtilsSisqf {

    Sonar(tipo) {
        if (tipo.toUpperCase() === 'S')
            tipo = 'success.mp3';
        else if (tipo.toUpperCase() === 'W')
            tipo = 'warning.mp3';
        else if (tipo.toUpperCase() === 'D')
            tipo = 'error.mp3';
        else if (tipo.toUpperCase() === 'I')
            tipo = 'info.mp3';
        else
            return;

        var audio = new Audio(URLAUDIO + tipo);
        audio.play();

    }
    Datatable(tabla, btnnuevo, objdatatable, formatofecha) {
        if (formatofecha == null || formatofecha == undefined || formatofecha == '')
            formatofecha = 'DD/MM/YYYY hh:mm A';
        $.fn.dataTable.moment(formatofecha); 
        objdatatable = objdatatable ?? new DataTable();
        var tableId = '#' + tabla;

        //var tableHead = document.querySelector('.sticky-nav')
        //tableHead.addEventListener('sticky-change', function (e) {
        //    // when  thead becomes sticky, add is-stuck class to it (which adds a border-bottom to it)
        //    this.classList.toggle('is-stuck', e.detail.isSticky)
        //})



        $.extend(true, $.fn.dataTable.defaults, {
            dom:
                "<'row'<'col-lg-6 col-md-12 col-sm-12'l><'col-lg-6 col-md-12 col-sm-12 text-right table-tools-col'f>>" +
                "<'row'<'col-12'tr>>" +
                "<'row'<'col-12 col-md-5'i><'col-12 col-md-7'p>>",
            renderer: 'bootstrap'
        })

        var $_table = $(tableId).DataTable({
            "searching": objdatatable.searching ?? false,
            lengthChange: objdatatable.lengthChange ?? false,
            "ordering": objdatatable.ordering ?? false,
            "paging": objdatatable.paging ?? false,
            "lengthMenu": objdatatable.lengthMenu ?? [],
            responsive: objdatatable.responsive,
            "scrollX": objdatatable.scrollX,
            columnDefs: objdatatable.columnDefs ?? [],
            colReorder: {
                //disable column reordering for first and last columns
                fixedColumnsLeft: 1,
                fixedColumnsRight: 1
            },
            order: objdatatable.order,
            // sDom: 'BRfrtlip',
            //classes: {
            //    sLength: "dataTables_length text-left w-auto",
            //},
            buttons: objdatatable.buttons ?? [],
            //// multiple row selection
            //select: {
            //    style: 'multis'
            //},
            // no specific initial ordering       
            language: {
                search: '<i class="fa fa-search pos-abs mt-2 pt-3px ml-25 text-blue-m2"></i>',
                searchPlaceholder: " Buscar registros",
                "lengthMenu": "Mostrar _MENU_ entradas",
                "zeroRecords": "No hay registros",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "No hay información",
                "infoFiltered": "(filtered from _MAX_ total records)",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
            }
        });


        if (btnnuevo) {
            $('.table-tools-col')
                .append($_table.buttons().container())
                // move searchbox into table header
                .find('.dataTables_filter').appendTo('.page-tools').find('input').addClass('pl-45 radius-round').removeClass('form-control-sm')
                // and add a "+" button
                .end().append('<button data-rel="tooltip" type="button" id="btndatatablenuevo" class="btn radius-round btn-outline-primary border-2 btn-sm ml-2" title="Nuevo registro"><i class="fa fa-plus"></i></button>');

        } else {
            //$('.table-tools-col')
            //    .append($_table.buttons().container())
            //    .find('.dataTables_filter').appendTo('.page-tools').find('input').addClass('pl-45 radius-round').removeClass('form-control-sm');
        }




        // helper methods to add/remove bgc-h-* class when selecting/deselecting rows
        var _highlightSelectedRow = function (row) {
            row.querySelector('input[type=checkbox]').checked = true
            row.classList.add('bgc-success-l3')
            row.classList.remove('bgc-h-default-l4')
        }
        var _unhighlightDeselectedRow = function (row) {
            row.querySelector('input[type=checkbox]').checked = false
            row.classList.remove('bgc-success-l3')
            row.classList.add('bgc-h-default-l4')
        }

        // listen to select/deselect event to highlight rows
        $_table
            .on('select', function (e, dt, type, index) {
                if (type == 'row') {
                    var row = $_table.row(index).node()
                    _highlightSelectedRow(row)
                }
            })
            .on('deselect', function (e, dt, type, index) {
                if (type == 'row') {
                    var row = $_table.row(index).node()
                    _unhighlightDeselectedRow(row)
                }
            })

        // when clicking the checkbox in table header, select/deselect all rows
        $(tableId)
            .on('click', 'th input[type=checkbox]', function () {
                if (this.checked) {
                    $_table.rows().select().every(function () {
                        _highlightSelectedRow(this.node())
                    });
                }
                else {
                    $_table.rows().deselect().every(function () {
                        _unhighlightDeselectedRow(this.node())
                    })
                }
            })

        // don't select row if we click on the "show details" `plus` sign (td)
        //$(tableId).on('click', 'td.dtr-control', function (e) {
        //    e.stopPropagation()
        //})


        // add/remove bgc-h-* class to TH when soring columns
        var previousTh = null
        var toggleTH_highlight = function (th) {
            th.classList.toggle('bgc-yellow-l2')
            th.classList.toggle('bgc-h-yellow-l3')
            th.classList.toggle('text-blue-d2')
        }

        $(tableId)
            .on('click', 'th:not(.sorting_disabled)', function () {
                if (previousTh != null) toggleTH_highlight(previousTh)// unhighlight previous TH
                toggleTH_highlight(this)
                previousTh = this
            })

        // don't select row when clicking on the edit icon
        //$('a[data-action=edit').on('click', function (e) {
        //    e.preventDefault()
        //    e.stopPropagation()// don't select
        //})

        // add a dark border
        $('.dataTables_wrapper')
            .addClass('border-b-1 border-x-1 brc-default-l2')

            // highlight DataTable header
            // also already done in CSS, but you can use custom colors here
            .find('.row:first-of-type')
            .addClass('border-b-1 brc-default-l3 bgc-blue-l4')
            .next().addClass('mt-n1px')// move the next `.row` up by 1px to go below header's border

        // highlight DataTable footer
        $('.dataTables_wrapper')
            .find('.row:last-of-type')
            .addClass('border-t-1 brc-default-l3 mt-n1px bgc-default-l4')


        // if the table has scrollbars, add ace styling to it
        $('.dataTables_scrollBody').aceScroll({ color: "grey" })


        //enable tooltips
        setTimeout(function () {
            $('.dt-buttons button')
                .each(function () {
                    var div = $(this).find('span').first()
                    if (div.length == 1) $(this).tooltip({ container: 'body', title: div.parent().text() })
                    else $(this).tooltip({ container: 'body', title: $(this).text() })
                })
            $('[data-rel=tooltip').tooltip({ container: 'body' })
        }, 0);
        return $_table;

    }     
 PaggingTemplate(totalPage, currentPage, namepagelink, namedivpaginate) {
    var template = "";
    var TotalPages = totalPage;
    var CurrentPage = currentPage;
    var PageNumberArray = Array();


    var countIncr = 1;
    for (var i = currentPage; i <= totalPage; i++) {
        PageNumberArray[0] = currentPage;
        if (totalPage != currentPage && PageNumberArray[countIncr - 1] != totalPage) {
            PageNumberArray[countIncr] = i + 1;
        }
        countIncr++;
    };
    PageNumberArray = PageNumberArray.slice(0, 5);
    var FirstPage = 1;
    var LastPage = totalPage;
    if (totalPage != currentPage) {
        var ForwardOne = currentPage + 1;
    }
    var BackwardOne = 1;
    if (currentPage > 1) {
        BackwardOne = currentPage - 1;
    }
     template = '<div class="row"> <div class="col-xl-3 col-md-12 col-sm-12 text-center">' + '<p class="mt-2">' + CurrentPage + " de " + TotalPages + " paginas</p></div>";
     template += '<div class="col-xl-9 col-md-12 col-sm-12">';
   
    template = template + '<ul class="pager">' +
        '<li class=""><a href="#" class="' + namepagelink + '" numpagina="' + FirstPage + '"><i class="mr-2 ml-2 fa fa-fast-backward fa-1x"></i></a></li>' +
        '<li><a href="#" class="' + namepagelink + '" numpagina="' + BackwardOne + '"><i class="fa fa-caret-left fa-1x"></i></a>';

    var numberingLoop = "";
    for (var i = 0; i < PageNumberArray.length; i++) {
        if (i == 0)
            numberingLoop = numberingLoop + '<a class="page-number ' + namepagelink + ' activelink" numpagina="' + PageNumberArray[i] + '" href="#">' + PageNumberArray[i] + ' &nbsp;&nbsp;</a>'
        else
            numberingLoop = numberingLoop + '<a class="page-number ' + namepagelink + ' " numpagina="' + PageNumberArray[i] + '" href="#">' + PageNumberArray[i] + ' &nbsp;&nbsp;</a>'

    }
     template = template + numberingLoop + '<a href="#" class="' + namepagelink + '" numpagina="' + ForwardOne + '" ><i class="fa fa-caret-right fa-1x"></i></a></li>' +
         '<li class=""><a href="#" class="' + namepagelink + '" numpagina="' + LastPage + '"><i class="mr-2 ml-2 fa fa-fast-forward fa-1x"></i></a></li></ul>';

     template += '</div></div>';
    document.getElementById(namedivpaginate).innerHTML = template;
}
}
class DataTable {
    constructor() {
        this.searching = false;
        this.lengthChange = false;
        this.ordering = false;
        this.lengthMenu = [[15, 25, 50, -1], [15, 25, 50, 'All']];
        this.dom = 'Bfrtip';
        this.responsive = true;
        this.paging = true;
        this.destroy = false;
        this.scrollX = false;
        //this.buttons = BOTONESDATATABLE('LISTA DE REGISTROS ', 'V', false);
        //this.language = LENGUAJEDATATABLE();
        this.order = [[1, "asc"]];
        this.columnDefs = [];
        this.buttons = {
            dom: {
                button: {
                    className: 'btn' //remove the default 'btn-secondary'
                },
                container: {
                    className: 'dt-buttons btn-group bgc-white-tp2 text-right w-auto'
                }
            },

            buttons: [
                {
                    "extend": "colvis",
                    "text": "<i class='far fa-eye text-125 text-dark-m2'></i> <span class='d-none'>Show/hide columns</span>",
                    "className": "btn-light-default btn-bgc-white btn-h-outline-primary btn-a-outline-primary",
                    columns: ':not(:first)'
                },

                {
                    "extend": "copy",
                    "text": "<i class='far fa-copy text-125 text-purple'></i> <span class='d-none'>Copy to clipboard</span>",
                    "className": "btn-light-default btn-bgc-white btn-h-outline-primary btn-a-outline-primary"
                },

                {
                    "extend": "csv",
                    "text": "<i class='fa fa-database text-125 text-success-m1'></i> <span class='d-none'>Export to CSV</span>",
                    "className": "btn-light-default btn-bgc-white btn-h-outline-primary btn-a-outline-primary"
                },

                {
                    "extend": "print",
                    "text": "<i class='fa fa-print text-125 text-orange-d1'></i> <span class='d-none'>Print</span>",
                    "className": "btn-light-default btn-bgc-white  btn-h-outline-primary btn-a-outline-primary",
                    autoPrint: true,
                    message: ''
                }
            ]
        };
    }
}