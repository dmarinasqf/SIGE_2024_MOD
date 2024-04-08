using ENTIDADES.Almacen;
using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
    public class ProductoProveedorEF:IProductoProveedorEF
    {
        private readonly Modelo db;        
        public ProductoProveedorEF(Modelo context)
        {
            db = context;            
        }
        
       
        public async Task<mensajeJson> RegistrarEditarAsync(CProductoProveedor obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                if (obj.idproductoproveedor == 0)
                {
                    db.CPRODUCTOPROVEEDOR.Add(obj);
                    await db.SaveChangesAsync();
                }
                else
                {
                    db.Update(obj);
                    await db.SaveChangesAsync();
                }
                if (obj.idproducto != null)
                    obj.producto = await db.APRODUCTO.FindAsync(obj.idproducto);
                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
    
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var obj = await db.CPRODUCTOPROVEEDOR.FirstOrDefaultAsync(m => m.idproductoproveedor == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }        
        public async Task<mensajeJson> BuscarAsync(int? id)
        {
            try
            {
                var obj = await db.CPRODUCTOPROVEEDOR.FirstOrDefaultAsync(m => m.idproductoproveedor == id);
                AProducto producto = new AProducto();
                if (obj.idproducto != null)
                    producto = db.APRODUCTO.Find(obj.idproducto);
                obj.producto = producto;
                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }


        }           
    }
}
