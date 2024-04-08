using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IGuiaEntradaEF
    {
        public  Task<mensajeJson> ListarGuiasEntradaAsync();  
        public  Task<mensajeJson> RegistrarEditarAsync(AGuiaEntrada obj);
        public  Task<GuiaEntradaModel> datosinicioViewBagAsync();
        public  Task<mensajeJson> BuscarAsync(int? id);
        //public Task<mensajeJson> BuscarGuiaEntradaAsync(int? id, int idempresa, int idsucursal);

    }
}
