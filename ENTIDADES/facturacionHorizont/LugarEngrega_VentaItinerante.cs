using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
   public class LugarEngrega_VentaItinerante
    {
        public string direccion { get; set; }
        public string codigoubigeo { get; set; }
        public string departamento { get; set; }
        public string provincia { get; set; }
        public string urbanizacion { get; set; }
        public string distrito { get; set; }
        public string codigopais { get; set; }
        public LugarEngrega_VentaItinerante()
        {
            direccion = "";
            codigopais = "";
            codigoubigeo = "";
            departamento = "";
            provincia = "";
            urbanizacion = "";
            distrito = "";
        }
    }
}
