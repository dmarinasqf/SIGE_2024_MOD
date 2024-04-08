using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class RegistroSanitarioEF: IRegistroSanitarioEF
    {
        private readonly Modelo db;
        public RegistroSanitarioEF(Modelo context)
        {
            db = context;
        }

        public mensajeJson RegistrarEditar(ARegistroSanitario obj)
        {
            try
            {
                if (obj.id is 0) db.Add(obj);                 
                else db.Update(obj);            
                db.SaveChanges();
                return new mensajeJson("ok", obj);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public List<ARegistroSanitario> ListarxProducto( int idproducto)
        {
            var data = db.REGISTROSANITARIO.Where(x => x.estado != "ELIMINADO" && x.idproducto == idproducto).ToList();
            return data;
        }

        public mensajeJson Buscar(int id)
        {
            var obj = db.REGISTROSANITARIO.Find(id);
            if (obj is null)
                return new mensajeJson("No existe", null);
            return new mensajeJson("ok", obj);
        }

    }
}
