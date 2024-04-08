using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
   public class IncoteRMS
    {
        public string INCOTERMS { get; set; }
        public string descrion_puertollegada { get; set; }
        public IncoteRMS()
        {
            INCOTERMS = "";
            descrion_puertollegada = "";
        }
    }
}
