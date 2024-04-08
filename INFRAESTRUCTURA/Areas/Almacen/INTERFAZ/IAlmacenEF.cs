using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IAlmacenEF
    {
        public  Task<List<AAlmacen>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AAlmacen obj);
        public  Task<mensajeJson> EliminarAsync(int? id);

        public  Task<mensajeJson> HabilitarAsync(int? id);      
        public  Task<AlmacenModel> ListarModelAsync();       
    }
}
