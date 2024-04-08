using ENTIDADES.Generales;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.INTERFAZ
{
   public  interface ICajaEF
    {
        public List<Caja> ListarCajas();
        public object ListarCajasSucursal(int idsucursal);
        public CajaSucursal BuscarCajaSucursal(int idcajasucursal);
        public Task<object> ListarCorrelativosPorCajaAsync(int idcajasucursal);
        public mensajeJson RegistrarEditarCorrelativosPorCaja(CorrelativoDocumento obj);
        public mensajeJson ActualizarDatosCaja(CajaSucursal obj);
    }
}
