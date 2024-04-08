using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.comercial
{
    //EARTCOD1021
    public class PromoProductoObsequio
    {
        public int idpromoobsequio { get; set; }     
        public int idproveedor { get; set; }
        public int idlaboratorio { get; set; }
        public decimal montooferta { get; set; }
        public string nombrepromo { get; set; }
        public string productoscompra { get; set; }
        public string productosobsequio { get; set; }
        public DateTime fechainicio { get; set; }
        public DateTime fechatermino { get; set; }
        public string canalesventa { get; set; }
        public string sucursales { get; set; }
        public int usuariocrea { get; set; }
        public DateTime fechacrea { get; set; }
        public int? usuarioedita { get; set; }
        public DateTime? fechaedita { get; set; }
        public bool estado { get; set; }
    }
}
