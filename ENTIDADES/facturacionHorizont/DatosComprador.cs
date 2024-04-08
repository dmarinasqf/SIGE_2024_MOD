using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
    public class DatosComprador
    {
        public string tipodocumento { get; set; }
        public string numdocumento { get; set; }
        public DatosComprador()
        {
            tipodocumento = "";
            numdocumento = "";
        }
    }
}
