using ENTIDADES.compras;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Compras.ViewModels
{
    public class ProveedorProductoModel
    {
        public CProveedor proveedor { get; set; }
        public List<CProductoProveedor> productos { get; set; }
    }
}
