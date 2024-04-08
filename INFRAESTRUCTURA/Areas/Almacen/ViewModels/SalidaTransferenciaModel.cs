using ENTIDADES.Almacen;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Almacen.ViewModels
{
    public class SalidaTransferenciaModel
    {
        public List<Empresa> empresa { get; set; }
        public List<AClase> clase { get; set; }
        public List<SUCURSAL> sucursal { get; set; }
        public List<AAlmacenSucursal> almacensucursal{ get; set; }        
        public List<ATipoMovimiento> movimiento{ get; set; }        
    }
}
