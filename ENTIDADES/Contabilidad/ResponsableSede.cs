using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Contabilidad
{
    public class ResponsableSede
    {
        public string idSucursalResp { get; set; }
        public decimal montoCaja { get; set; }
        public decimal montoUltRep { get; set; }
        public decimal montoReponer { get; set; }
        public decimal saldoCaja { get; set; }
        public string responsableCaja { get; set; }
        public string numeroCuenta { get; set; }
        public string entidadBancaria { get; set; }
        public string periodo { get; set; }
        public int idEmpresa { get; set; }
        public int idSucursal { get; set; }
        public string nombreSucursal { get; set; }
        public int emp_codigo { get; set; }
        public string areaTrabajo { get; set; }
        public string emp_descripcion { get; set; }
        public int usuario { get; set; }
        public int usuario_op { get; set; }
        public string fecha_modificacion { get; set; }
        public byte[] recursoImg { get; set; }

    }
}
