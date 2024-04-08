using ENTIDADES.comercial;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.Interfaz
{
   public interface IListaPreciosEF
    {
        public Task<mensajeJson> RegistrarEditarAsync(ListaPrecios obj);
        public List<ListaPrecios> ListarListas();
        public List<ListaPrecios> ListarListasHabilitadas();
        public  Task<mensajeJson> EditarPreciosProducto(List<PreciosProducto> lista);
        public object ListarPreciosSucursal(int idsucursal);
        public object ListarListaXProducto(int idproducto);
        public object ListarPreciosxListasyProducto(string listas, int idproducto);
    }
}
