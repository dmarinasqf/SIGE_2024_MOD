using ENTIDADES.Almacen;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Almacen.ViewModels
{
   public class AlmacenSucursalModel
    {
        public List<SUCURSAL> sucursales { get; set; }
        public List<AAlmacen> almacenes { get; set; }
        public List<AAreaAlmacen> areaalmacenes { get; set; }
    }
}
