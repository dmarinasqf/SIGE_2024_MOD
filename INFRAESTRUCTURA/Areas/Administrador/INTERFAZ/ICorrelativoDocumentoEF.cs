using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.INTERFAZ
{
    public interface ICorrelativoDocumentoEF
    {


        public Task<object> ListarCorrelativosPorCajaAsync(int idcajasucursal);
        public Task<mensajeJson> RegistrarEditarAsync(CorrelativoDocumento obj);
        public Task<mensajeJson> EliminarAsync(int? id);
        public Task<mensajeJson> HabilitarAsync(int? id);
        public FDocumentoTributario BuscarDocumento(string id);
        public Task<mensajeJson> BuscarAsync(int id);
        //public Task<FCorrelativoDocumentoSucursal> BuscarDocumentoyCorrelativoAsync(FCorrelativoDocumentoSucursal obj);
    }
}
