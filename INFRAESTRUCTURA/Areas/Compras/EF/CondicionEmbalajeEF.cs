using ENTIDADES.preingreso;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using Erp.Persistencia.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
    public class CondicionEmbalajeEF: ICondicionEmbalajeEF
    {
        private readonly Modelo db;
       
        public CondicionEmbalajeEF(Modelo context)
        {
            db = context;           
        }
        public List<PIItemCondicionEmbalaje> ListarItemsEmbalaje()
        {
            return db.PIITEMEMBALAJE.Where(x => x.estado == "HABILITADO").OrderBy(x => x.input).ToList();
                
        }
    }
}
