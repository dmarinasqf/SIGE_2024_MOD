var cant_filas = 0;
var notificacion;//para generar la notificacion en el modal


function cajaRendicionListarUser() {
    var fechaInicial = $("#date_fechaInicial").val();
    var fechaFinal = $("#date_fechaFinal").val();
    var origen = $("#origen").val();
    var url = '/Contabilidad/ReporteCajaChica/cajaRendicionListarUser';
    var data = { fechaInicial: fechaInicial, fechaFinal: fechaFinal, origen: origen};

    $.post(url, data).done(function (data) {
        //console.log(data);
        var json = $.parseJSON(data);
        
        // Generar la tabla directamente sin paginación


        if (origen === 'COMPRAS') {
            var html = GenerarTablaCajaRendicionListarUser(json);
            $('#contenedor_detalle').html(html);
        } else if (origen === 'MOVILIDAD') {
            var html = GenerarTablaCajaRendicionListarUserTabla2(json);
            $('#contenedor_detalle').html(html);
        }


        else if  (origen === 'RXH') {
            var html = GenerarTablaCajaRendicionListarUserTabla3(json);
            $('#contenedor_detalle').html(html);
        }


        
    }).fail(function (data) {
        console.log(data);
    });
}


function GenerarTablaCajaRendicionListarUser(data) {
    var tablaHTML = `<table class="table mt-2 text-center" id="tabla_caja_chica">
        <thead class="table bg-info text-light">
            <tr class="group-font-sm">
                <th>CTA CONTABLE</th>
                <th>AÑO Y MES PROCESO</th>
                <th>SUBDIARIO</th>
<th>COMPROBANTE</th>
<th>FECHA DOCUMENTO</th>
<th>TIPO ANEXO</th>
<th>CODIGO PROVEEDOR</th>
<th>TIPO DOCUMENTO</th>
<th>NRO DOCUMENTO</th>
<th>FECHA VENCIMIENTO</th>
<th>IGV</th>
<th>TASA IGV</th>
<th>IMPORTE</th>
<th>CONV</th>
<th>FECHA REGISTRO</th>
<th>TIPO CAMBIO</th>
<th>GLOSA</th>
<th>DESTINO</th>
<th>PORC OPE MIXTA</th>
<th>VALOR CIF</th>
<th>TIPO DOC REF</th>
<th>NRO DOC REF</th>
<th>CENTRO DE COSTOS</th>
<th>DETRACCION</th>
<th>NRO DOC DETRACCION</th>
<th>FECHA DETRACCION</th>
<th>FECHA DOC REF</th>
<th>GLOSA MOVIMIENTO</th>
<th>DOCUMENTO ANULADO</th>
<th>IGV POR APLICAR</th>
<th>CODIGO DETRACCION</th>
<th>IMPORTACION</th>
<th>DEBE / HABER</th>
<th>TASA DETRACCION</th>
<th>IMPORTE DETRACCION</th>
<th>NRO FILE</th>
<th>OTROS TRIBUTOS</th>
<th>IMP BOLSA</th>

            </tr>
        </thead>
        <tbody>`;

    $.each(data, function (index, item) {
        tablaHTML += "<tr>"
            + "<td style='vertical-align: middle;'>" + item.CTACONTABLE + "</td>"
            + "<td style='vertical-align: middle;'>" + item.ANIOMESPROCESO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.SUBDIARIO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.COMPROBANTE + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_DOCUMENTO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPO_ANEXO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CODIGO_PROV + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPODOCUMENTO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.NUMDOC + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_VENCIMIENTO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.IGV + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TASAIGV + "</td>"
            + "<td style='vertical-align: middle;'>" + item.IMPORTE + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CONV + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_REGISTRO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPO_CAMBIO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.GLOSA + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DESTINO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.PORCE_OPE_MIXTA + "</td>"
            + "<td style='vertical-align: middle;'>" + item.VALOR_CIF + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPO_DOC_REF + "</td>"
            + "<td style='vertical-align: middle;'>" + item.NRO_DOC_REF + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CENTRO_DE_COSTOS + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DETRACCION + "</td>"
            + "<td style='vertical-align: middle;'>" + item.NRO_DOC_DETRACCION + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_DETRACCION + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_DOC_REF + "</td>"
            + "<td style='vertical-align: middle;'>" + item.GLOSA_MOVIMIENTO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DOCUMENTO_ANULADO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.IGV_POR_APLICAR + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CODIGO_DETRACCION + "</td>"
            + "<td style='vertical-align: middle;'>" + item.IMPORTACION + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DEBE_HABER + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TASA_DETRACCION + "</td>"
            + "<td style='vertical-align: middle;'>" + item.IMPORTE_DETRACCION + "</td>"
            + "<td style='vertical-align: middle;'>" + item.NRO_FILE + "</td>"
            + "<td style='vertical-align: middle;'>" + item.OTROS_ATRIBUTOS + "</td>"
            + "<td style='vertical-align: middle;'>" + item.IMP_BOLSA + "</td>"



     
 
            + "</tr>";
    });

    tablaHTML += "</tbody></table>";

    // Limpiar contenedor
    $('#contenedor_detalle').html('');

    // Agregar tabla al contenedor
    $('#contenedor_detalle').html(tablaHTML);

    // Inicializar DataTable
    $(document).ready(function () {
        $('#tabla_caja_chica').DataTable({
            paging: true,
            searching: true,
            info: true,
            scrollX: true,
            scrollY: '300px',
            scrollCollapse: true,
            pageLength: 10, // Mostrar todos los registros en una sola página
            dom: 'Bfrtip',
            buttons: [
            
                'excelHtml5'
             
            ]
        });
    });
}
   





function GenerarTablaCajaRendicionListarUserTabla2(data) {
    var tablaHTML = `<table class="table mt-2 text-center" id="tabla_caja_chica2">
        <thead class="table bg-danger text-light">
            <tr class="group-font-sm">
                <th>CTA CONTABLE</th>
                <th>AÑO Y MES PROCESO</th>
   <th>SUBDIARIO</th>
   <th>COMPROBANTE</th>
   <th>FECHA DOCUMENTO</th>
   <th>TIPO ANEXO</th>
   <th>CODIGO DE ANEXO</th>
   <th>TIPO DOCUMENTO</th>
   <th>NRO DOCUMENTO</th>
   <th>FECHA VENCIMIENTO</th>
   <th>MONEDA</th>
   <th>IMPORTE</th>
   <th>CONV</th>
   <th>FECHA REGISTRO</th>
   <th>TIPO CAMBIO</th>
   <th>GLOSA</th>

<th>CENTRO DE COSTOS</th>
<th>GLOSA MOVIMIENTO</th>
<th>DOCUMENTO ANULADO</th>
<th>DEBE / HABER</th>
<th>MEDIO DE PAGO</th>
<th>NRO FILE</th>
<th>FLUJO DE EFECTIVO</th>


            </tr>
        </thead>
        <tbody>`;

    $.each(data, function (index, item) {
        tablaHTML += "<tr>"
           
            + "<td style='vertical-align: middle;'>" + item.CTA + "</td>"
            + "<td style='vertical-align: middle;'>" + item.ANIOM + "</td>"
            + "<td style='vertical-align: middle;'>" + item.SUBDIARIOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.COMPROBANTEE + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_DOCUMENTOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPO_ANEXOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CODIGO_DE_ANEXOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPO_DOCUMENTOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.NRO_DOCC + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_VENCIMIENTOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.MONEDAA + "</td>"
            + "<td style='vertical-align: middle;'>" + item.IMPORTEE + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CONVV + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_REGISTROO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPO_CAMBIOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.GLOSAA + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CENTRO_DE_COSTOSS + "</td>"
            + "<td style='vertical-align: middle;'>" + item.GLOSA_MOVIMIENTOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DOCUMENTO_ANULADOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DEBE_HABERR + "</td>"
            + "<td style='vertical-align: middle;'>" + item.MEDIO_DE_PAGOO + "</td>"
            + "<td style='vertical-align: middle;'>" + item.NRO_FILEE + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FLUJO_DE_EFECTIVOO + "</td>"
 



            + "</tr>";
    });

    tablaHTML += "</tbody></table>";


    // Limpiar contenedor
    $('#contenedor_detalle').html('');

    // Agregar tabla al contenedor
    $('#contenedor_detalle').html(tablaHTML);

    // Inicializar DataTable
    $(document).ready(function () {
        $('#tabla_caja_chica2').DataTable({
            paging: true,
            searching: true,
            info: true,
            scrollX: true,
            scrollY: '300px',
            scrollCollapse: true,
            pageLength: 10, // Mostrar todos los registros en una sola página
            dom: 'Bfrtip',
            buttons: [

                'excelHtml5'

            ]
        });
    });
}





function GenerarTablaCajaRendicionListarUserTabla3(data) {
    var tablaHTML = `<table class="table mt-2 text-center" id="tabla_caja_chica3">
        <thead class="table bg-success text-light">
            <tr class="group-font-sm">
                <th>CTA CONTABLE</th>
                <th>AÑO Y MES PROCESO</th>
   <th>SUBDIARIO</th>
   <th>COMPROBANTE</th>
   <th>FECHA DOCUMENTO</th>
   <th>TIPO ANEXO</th>
   <th>CODIGO DE ANEXO</th>
   <th>TIPO DOCUMENTO</th>
   <th>NRO DOCUMENTO</th>
   <th>FECHA VENCIMIENTO</th>

   <th>IMPORTE</th>
   <th>CONV</th>
   <th>FECHA REGISTRO</th>
   <th>TIPO CAMBIO</th>
   <th>GLOSA</th>
   <th>DESTINO DE COMPRA</th>
   <th>CENTRO DE COSTOS</th>
   <th>GLOSA MOVIMIENTO</th>
 <th>DOCUMENTO ANULADO</th>
 <th>DEBE / HABER</th>
 <th>NRO FILE</th>



            </tr>
        </thead>
        <tbody>`;

    $.each(data, function (index, item) {
        tablaHTML += "<tr>"

            + "<td style='vertical-align: middle;'>" + item.CTACONTABLE1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.ANIOMESPROCESO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.SUBDIARIO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.COMPROBANTE1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_DOCUMENTO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPO_ANEXO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CODIGO_ANEXO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPODOCUMENTO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.NUMDOC1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_VENCIMIENTO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.IMPORTE1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CONV1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.FECHA_REGISTRO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.TIPO_CAMBIO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.GLOSA1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DESTINO_DE_COMPRA1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.CENTRO_COSTOS1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.GLOSA_MOVIMIENTO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DOCUMENTO_ANULADO1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.DEBE_HABER1 + "</td>"
            + "<td style='vertical-align: middle;'>" + item.NRO_FILE1 + "</td>"



    





            + "</tr>";
    });

    tablaHTML += "</tbody></table>";


    // Limpiar contenedor
    $('#contenedor_detalle').html('');

    // Agregar tabla al contenedor
    $('#contenedor_detalle').html(tablaHTML);

    // Inicializar DataTable
    $(document).ready(function () {
        $('#tabla_caja_chica3').DataTable({
            paging: true,
            searching: true,
            info: true,
            scrollX: true,
            scrollY: '300px',
            scrollCollapse: true,
            pageLength: 10, // Mostrar todos los registros en una sola página
            dom: 'Bfrtip',
            buttons: [

                'excelHtml5'

            ]
        });
    });
}






















