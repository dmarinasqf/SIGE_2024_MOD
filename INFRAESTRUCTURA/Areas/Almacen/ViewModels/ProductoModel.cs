using ENTIDADES.Almacen;
using ENTIDADES.compras;
using ENTIDADES.finanzas;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Almacen.ViewModels
{
    public class ProductoModel
    {
        public List<AProductoPresentacion> productopresentaciones { get; set; }
        public List<AClase> clases { get; set; }
        public List<CProveedor> proveedor { get; set; }
        public List<ALaboratorio> laboratorio { get; set; }
        public List<AUnidadMedida> unidadmedidas { get; set; }
        public List<ATemperatura> temperatura { get; set; }
        public List<ATipoProducto> tipoproductos { get; set; }
        public List<FTipoTributo> tipotributos { get; set; }
        public List<AFormaFarmaceutica> formafarmaceutica { get; set; }
    }
}
