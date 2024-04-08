using ENTIDADES.Almacen;
using ENTIDADES.comercial;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
 public interface    IDetalleProductoGenericoEF
    {
        public  Task<mensajeJson> RegistrarDetalleGenericoAsync(ADetalleProductoGenerico obj);
        public  Task<mensajeJson> EditarDetalleGenericoAsync(ADetalleProductoGenerico obj);
        public  Task<mensajeJson> EliminarDetalleGenericoAsync(int? id);
        public  Task<mensajeJson> RegistrarDetalleAccionFarmacologicoAsync(ADetalleAccionFarmacologica obj);
        public  Task<mensajeJson> EliminarDetalleAccionFarmacologicoAsync(int? id);
        public  Task<mensajeJson> RegistrarEditarPrincipiosActivos(ADetallePrincipioActivo obj);
        public  Task<mensajeJson> EliminarPrincipioActivo(int? id);
        public mensajeJson AgregarEliminarProductoLista(List<PreciosProducto> precios);
    }
}
