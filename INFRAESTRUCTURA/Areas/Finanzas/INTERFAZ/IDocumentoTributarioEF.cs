using ENTIDADES.Finanzas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ
{
    public interface IDocumentoTributarioEF
    {

        public  Task<List<FDocumentoTributario>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(FDocumentoTributario obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<mensajeJson> HabilitarAsync(int? id);
        public FDocumentoTributario BuscarDocumento(string id);
        public  Task<List<FDocumentoTributario>> ListarHabilitadosAsync();
        public mensajeJson ListarDocumentosxCajaSucursalParaVentas(int? idcajasucursal);
        public mensajeJson ListarDocumentosxCajaAperturada(int idcajaaperturada);
        public object ListarTipoDocumentoxDocumentoTributario(int iddocumento);
        public object ListarDocumentosXSucursal(int idsucursal);
    }
}
