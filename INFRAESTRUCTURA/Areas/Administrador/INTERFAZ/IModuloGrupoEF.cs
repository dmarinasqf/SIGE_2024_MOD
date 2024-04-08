using ENTIDADES.usuarios;
using ENTIDADES.Identity;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.INTERFAZ
{
    public interface IModuloGrupoEF
    {

        public  Task<List<Grupo>> ListarGruposAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(Grupo obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<List<AppRol>> ListarRolesAsync();
        public  Task<List<ModulosGrupo>> RolesDeGrupoAsync(int grupo);
        public  Task<mensajeJson> AgregarRemoverPermisoAsync(int grupo, string permiso);
    }
}
