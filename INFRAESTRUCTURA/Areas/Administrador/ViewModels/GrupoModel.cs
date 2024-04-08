using ENTIDADES.usuarios;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.ViewModels
{
    public class GrupoModel
    {
        public Grupo grupo { get; set; }
        public List< ModulosGrupo> modulos { get; set; }      
    }
}
