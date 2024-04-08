using ENTIDADES.usuarios;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;

namespace ERP.Areas.Usuarios.Models.Datos
{
    public class GrupoDAO
    {
        private readonly Modelo db;
        
        public GrupoDAO(Modelo context)
        {
            db = context;
         
        }
        //public async Task<List<Grupo>> getGrupos()
        //{
        //    var data =await db.GRUPO.Where(x => x.estado != "ELIMINADO").ToListAsync();
        //    return data;
        //} 
        //public async Task<mensajeJson> getGrupoRol(int grupo)
        //{
        //    try
        //    {
        //        var aux = await db.MODULOGRUPO.Where(x => x.idgrupo == grupo).ToListAsync();
        //        List<ModulosGrupo> datos = new List<ModulosGrupo>();
        //        ModulosGrupo modulos;
        //        foreach (var item in aux)
        //        {
        //            modulos = new ModulosGrupo
        //            {
        //                idgrupo = item.idgrupo,
        //                roleid = item.roleid,
        //                rol = db.APPROL.Find(item.roleid).Name
        //            };
        //            datos.Add(modulos);
        //        }
               
        //        return new mensajeJson("ok",datos);
        //    }
        //    catch (Exception e)
        //    {
        //        return new mensajeJson(e.Message,null);                
        //    }
            
            
        //}
        //public async Task<mensajeJson> setModuloGrupo(ModulosGrupo obj)
        //{
        //    try
        //    {
        //        await db.MODULOGRUPO.AddAsync(obj);
        //        await db.SaveChangesAsync();
        //        return new mensajeJson("ok",obj);
        //    }
        //    catch (Exception e)
        //    {
        //        return new mensajeJson(e.Message,null);
        //    }
        //}
        //public async Task<mensajeJson> deleteModuloGrupo(ModulosGrupo obj)
        //{
        //    try
        //    {
        //        db.MODULOGRUPO.Remove(obj);
        //        await db.SaveChangesAsync();
        //        return new mensajeJson("ok",null);
        //    }
        //    catch (Exception e)
        //    {
        //        return new mensajeJson(e.Message,null);
        //    }
        //}
        

    }
}
