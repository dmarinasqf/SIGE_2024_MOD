using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
    public class MigracionDocumentosAutorizados
    {
        public string tipodocumento_agenteventas { get; set; }
        public string numruc_agenteventas { get; set; }
        public string mediopago { get; set; }
        public string numautorizaciontransaccion { get; set; }

        public MigracionDocumentosAutorizados()
        {
            tipodocumento_agenteventas = "";
            numruc_agenteventas = "";
            mediopago = "";
            numautorizaciontransaccion = "";
        }

    }
}
