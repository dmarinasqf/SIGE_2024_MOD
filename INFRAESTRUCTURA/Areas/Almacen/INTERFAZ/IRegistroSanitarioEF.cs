using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
  public  interface IRegistroSanitarioEF
    {
        public mensajeJson RegistrarEditar(ARegistroSanitario obj);
        public List<ARegistroSanitario> ListarxProducto(int idproducto);
        public mensajeJson Buscar(int id);
    }
}
