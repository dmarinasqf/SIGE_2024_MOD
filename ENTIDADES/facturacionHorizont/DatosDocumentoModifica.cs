using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
   public class DatosDocumentoModifica
    {
        public string tipodocumento { get; set; }
        public string serie_numdocumento { get; set; }
        public string codigomotivo_documentoreferencia { get; set; }
        public string descripcion_motivo_sustento { get; set; }
        public string fechaemision_documentomodifica { get; set; }
        public DatosDocumentoModifica()
        {
            tipodocumento = "";
            serie_numdocumento = "";
            codigomotivo_documentoreferencia = "";
            descripcion_motivo_sustento = "";
            fechaemision_documentomodifica = "";
        }

    }
}
