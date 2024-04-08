using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
   public class ProveedorLaboratorioEF: IProveedorLaboratorioEF
    {
        private readonly Modelo db;
        public ProveedorLaboratorioEF(Modelo context)
        {
            db = context;
        }
        public async Task<mensajeJson> RegistrarEliminarAsync(CProveedorLaboratorio obj)
        {
            try
            {
                var aux = db.CPROVEEDORLABORATORIO.Where(x => x.idlaboratorio == obj.idlaboratorio && x.idproveedor == obj.idproveedor).FirstOrDefault();
                if ((aux is null))
                {
                    db.Add(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok-registrado", obj));
                }
                else
                {
                    db.Remove(aux);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok-eliminado", aux));
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        //public async Task<mensajeJson> RegistrarAsync(CProveedorLaboratorio obj)
        //{
        //    try
        //    {
        //        var aux = db.CPROVEEDORLABORATORIO.Where(x => x.idlaboratorio == obj.idlaboratorio && x.idproveedor == obj.idproveedor).FirstOrDefault();
        //        if (obj.idproveedorlab == 0)
        //        {
        //            if ((aux is null))
        //            {
        //                db.Add(obj);
        //                await db.SaveChangesAsync();
        //                return (new mensajeJson("ok", obj));
        //            }
        //            else
        //            {
        //                if (aux.estado == "ELIMINADO")
        //                {
        //                    aux.estado = "HABILITADO";
        //                    db.Update(aux);
        //                    await db.SaveChangesAsync();
        //                    return (new mensajeJson("ok", aux));
        //                }
        //                else
        //                    return (new mensajeJson("El registro ya existe", null));

        //            }
        //        }
        //        else
        //        {
        //            if (aux is null)
        //            {
        //                db.Update(obj);
        //                await db.SaveChangesAsync();
        //                return (new mensajeJson("ok", obj));
        //            }
        //            else
        //            {
        //                if (aux.estado == "ELIMINADO")
        //                {
        //                    aux.estado = "HABILITADO";
        //                    db.Update(aux);
        //                    await db.SaveChangesAsync();
        //                    return (new mensajeJson("ok-habilitado", aux));
        //                }
        //                else if (aux.idproveedorlab == obj.idproveedorlab)
        //                {
        //                    db.Update(obj);
        //                    await db.SaveChangesAsync();
        //                    return (new mensajeJson("ok", obj));
        //                }
        //                else
        //                    return (new mensajeJson("El registro ya existe", null));
        //            }
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return (new mensajeJson(e.Message, null));
        //    }

        //}      
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            try
            {
                var obj = await db.CPROVEEDORLABORATORIO.FirstOrDefaultAsync(m => m.idproveedorlab == id);
                db.Remove(obj);
                await db.SaveChangesAsync();
                return (new mensajeJson("ok", obj));
            }catch(Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }                     
    }
}
