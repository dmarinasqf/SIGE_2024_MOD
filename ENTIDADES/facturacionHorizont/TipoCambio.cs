using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
    public class TipoCambio
    {
        public string moneda_referencia_para_tipocambio { get; set; }
        public string moneda_objetivo_para_tipocambio { get; set; }
        public string factor_aplicado_a_monedaorigen_para_calcular_monedadestino { get; set; }
        public string fecha_tipocambio { get; set; }
        public TipoCambio()
        {
            moneda_objetivo_para_tipocambio = "";
            moneda_referencia_para_tipocambio = "";
            factor_aplicado_a_monedaorigen_para_calcular_monedadestino = "";
            fecha_tipocambio = "";
        }

    }
}
