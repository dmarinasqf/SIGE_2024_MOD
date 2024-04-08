using ENTIDADES.Generales;
using Erp.SeedWork;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.INTERFAZ
{
   public interface IEmpresaEF
    {

        public  Task<List<Empresa>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(Empresa obj);
        public mensajeJson guardarImagen(IFormFile[] file, string[] tipo, int id, string path);
        public Empresa BuscarEmpresa(int id);

    }
}
