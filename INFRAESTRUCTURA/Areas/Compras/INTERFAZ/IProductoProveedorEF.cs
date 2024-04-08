using ENTIDADES.compras;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.INTERFAZ
{
    public interface IProductoProveedorEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(CProductoProveedor obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<mensajeJson> BuscarAsync(int? id);
    }
}
