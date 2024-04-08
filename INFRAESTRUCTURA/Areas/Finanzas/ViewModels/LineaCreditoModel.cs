using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.ViewModels
{
    public class LineaCreditoModel
    {
        public List<FMoneda> monedas { get; set; }
        public List<FCondicionPago>  condicionpagos{ get; set; }
    }
}
