using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.ViewModels;
using Erp.SeedWork;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.INTERFAZ
{
   public interface IEmpleadoEF
    {
        public  Task<EmpleadoModel> ListarModelAsync();
        public  Task<List<EMPLEADO>> ListarEmpleadosAsync();
        public  Task<EmpleadoPermisoModel> PermisosAsync(int? id);
        public  Task<mensajeJson> AgregarRemoverPermisoAsync(int empleado, string permiso);
        public  Task<mensajeJson> CrearAsync(EMPLEADO obj);
        public EMPLEADO getEmpleado(int? id);
        public  Task<mensajeJson> DetalleAsync(int id);
        public  Task<mensajeJson> EliminarAsync(int id);
        public  Task<mensajeJson> EditarAsync(EMPLEADO obj);           
        //public  Task<mensajeJson> VerificarCredenciales_OrdenCompraAsync(string usuario, string clave);
        public  Task<List<AreaModel>> permisosEmpleadoAsync(string id);
       public Task<List<string>> ListarRolesEmpleadoSinAreaAsync(int idempleado);
        public mensajeJson GuardarImagen(IFormFile file, int id, string ruta);
    }
}
