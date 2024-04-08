using ENTIDADES.comercial;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.Interfaz
{
    public interface IOfertaEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(Oferta oferta);
        public  List<Oferta> BuscarObsequios(string filtro, int top);
        public List<SucursalOferta> ListarOfertaSucursal(int idoferta);
        public mensajeJson AsignarOfertaSucursal(int idoferta, int idsucursal);
        public mensajeJson AsignarOfertaSucursalEnBloque(int idoferta, List<string> idsucursal);
    }
}
