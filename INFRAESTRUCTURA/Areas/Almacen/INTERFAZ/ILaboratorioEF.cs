using ENTIDADES.Almacen;
using ENTIDADES.compras;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface ILaboratorioEF
    {
        public  Task<List<ALaboratorio>> ListarAsync();
        public  Task<mensajeJson> ListarHabilitadasxDescripcionAsync(string descripcion);        
        public  Task<ALaboratorio> BuscarAsync(int id);
        public  Task<mensajeJson> RegistrarEditarAsync(ALaboratorio obj);
        public  Task<mensajeJson> EliminarAsync(int? id);     
        //REPRESENTANTE DE LABORATORIO           
        public  Task<List<CRepresentanteLaboratorio>> ListarRepresentantexLaboratorioAsync(int id);
        public  Task<mensajeJson> RegistrarEditarRepresentanteAsync(CRepresentanteLaboratorio obj);
        public  Task<mensajeJson> BuscarRepresentanteAsync(int? id);
        public  Task<mensajeJson> EliminarRepresentanteAsync(int? id);
        public  Task<List<CRepresentanteLaboratorio>> representanteLaboratoriosProveedorAsync(int proveedor);
        public Task<List<ALaboratorio>> BuscarLaboratorio(string laboratorio);
    }
}
