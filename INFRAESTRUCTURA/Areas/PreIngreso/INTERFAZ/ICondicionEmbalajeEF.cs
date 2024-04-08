using ENTIDADES.preingreso;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
    public interface ICondicionEmbalajeEF
    {
        public List<PIItemCondicionEmbalaje> ListarItemsEmbalaje();
    }
}
