using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
    public class Detracciones
    {
        public string codigo_bien_servicio { get; set; }
        public string numcuenta_banconacion_detraccion { get; set; }        
        public string mediopago { get; set; }
        public string montodetraccion { get; set; }
        public string porcentajedetraccion { get; set; }
        public string monedadetraccion { get; set; }
        public string condicionpago { get; set; }


        public Detracciones()
        {
            codigo_bien_servicio = "";
            numcuenta_banconacion_detraccion = "";
            mediopago = "";
            montodetraccion = "";
            porcentajedetraccion = "";
            monedadetraccion = "";
            condicionpago = "";
        }


    }
}
