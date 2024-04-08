using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface ISubClaseEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(ASubClase obj);      
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<List<ASubClase>> listarSubclasesAsync();
        public  Task<List<ASubClase>> listarSubclasesHabilitadasAsync(int? id);
        public  Task<SubClaseModel> listarViewModelAsync();
    }
}
