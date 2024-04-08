using DocumentFormat.OpenXml.Drawing.Charts;
using ENTIDADES.Almacen;
using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class LaboratorioEF:ILaboratorioEF
    {
        private readonly Modelo db;

        public LaboratorioEF(Modelo context)
        {
            db = context;
        }        
        public async Task<List<ALaboratorio>> ListarAsync()
        {
            
            return (await db.ALABORATORIO.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }
        
        public async Task<mensajeJson> ListarHabilitadasxDescripcionAsync(string nombre)
        {
            if (nombre is null)
                nombre = "";
            try
            {
                var data= await db.ALABORATORIO.Where(x => x.estado == "HABILITADO" && x.descripcion.ToUpper().Contains(nombre.ToUpper())).OrderBy(x => x.descripcion).Take(20).ToListAsync();
                return new mensajeJson("ok",data);
            }catch(Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> RegistrarEditarAsync(ALaboratorio obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.ALABORATORIO.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idlaboratorio == 0)
                {
                    if ((aux is null))
                    {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "ELIMINADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", aux));
                        }
                        else
                            return (new mensajeJson("El registro ya existe", null));

                    }
                }
                else
                {
                    if (aux is null)
                    {
                        db.Update(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "ELIMINADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok-habilitado", aux));
                        }
                        else if (aux.idlaboratorio == obj.idlaboratorio)
                        {
                            db.Update(obj);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", obj));
                        }

                        else
                            return (new mensajeJson("El registro ya existe", null));
                    }
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        public async Task<ALaboratorio> BuscarAsync(int id)
        {
            var laboratorio = await db.ALABORATORIO.FindAsync(id);
            return laboratorio;
        }
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var obj = await db.ALABORATORIO.FirstOrDefaultAsync(m => m.idlaboratorio == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
        public async Task<List<ALaboratorio>> BuscarLaboratorio(string laboratorio)
        {

            if (laboratorio is null) laboratorio = "";
            laboratorio = laboratorio.ToUpper();
            var laboratorios = await db.ALABORATORIO.Where(x => x.descripcion.ToUpper().Contains(laboratorio) && x.estado == "HABILITADO").OrderBy(x=>x.descripcion.Trim()).ToListAsync();
            return laboratorios;
        }

        //REPRESENTANTE DE LABORATORIO           
        public async Task<List<CRepresentanteLaboratorio>> ListarRepresentantexLaboratorioAsync(int id)
        {
            var lab = db.ALABORATORIO.Find(id);
            if (lab is null)
                return null;
            return (await db.CREPRESENTANTELABORATORIO.Where(x => x.estado != "ELIMINADO" && x.idlaboratorio == id).ToListAsync());
        }
       
        public async Task<mensajeJson> RegistrarEditarRepresentanteAsync(CRepresentanteLaboratorio obj)
        {
            try
            {
                if (obj.idrepresentante == 0)
                {

                    db.CREPRESENTANTELABORATORIO.Add(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));

                }
                else
                {

                    db.CREPRESENTANTELABORATORIO.Update(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));

                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }

    
        public async Task<mensajeJson> BuscarRepresentanteAsync(int? id)
        {
            try
            {
                var obj = await db.CREPRESENTANTELABORATORIO.FirstOrDefaultAsync(m => m.idrepresentante == id);
                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }


        }
    
        public async Task<mensajeJson> EliminarRepresentanteAsync(int? id)
        {
            var obj = await db.CREPRESENTANTELABORATORIO.FirstOrDefaultAsync(m => m.idrepresentante == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
        public async Task<List<CRepresentanteLaboratorio>> representanteLaboratoriosProveedorAsync(int proveedor)
        {
            try
            {
                var query =await (from e in db.CREPRESENTANTELABORATORIO
                             join s in db.ALABORATORIO on e.idlaboratorio equals s.idlaboratorio
                             join p in db.CPROVEEDORLABORATORIO on s.idlaboratorio equals p.idlaboratorio
                             where e.estado != "ELIMINADO" && e.estado != "DESHABILITADO"
                             && p.idproveedor == proveedor
                             orderby e.nombres descending
                             select new CRepresentanteLaboratorio
                             {
                                 nombres = e.nombres,
                                 idrepresentante = e.idrepresentante,
                                 idlaboratorio = e.idlaboratorio,
                                 estado = e.estado,
                                 telefono = e.telefono,
                                 celular = e.celular,
                                 laboratorio = new ALaboratorio
                                 {
                                     idlaboratorio = s.idlaboratorio,
                                     descripcion = s.descripcion
                                 }
                             }).ToListAsync();
                return query;
            }
            catch (Exception )
            {

                return new List<CRepresentanteLaboratorio>();
            }
        }

     
    }
}
