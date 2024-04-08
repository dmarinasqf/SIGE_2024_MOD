using ENTIDADES.Almacen;
using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.ViewModels;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
    public class ProveedorEF:IProveedorEF
    {
        private readonly Modelo db;

        public ProveedorEF(Modelo context)
        {
            db = context;
        }
        public object ListarProveedor()
        {
            try
            {
                var data = (from PR in db.CPROVEEDOR
                            where  PR.estado == "HABILITADO"
                            select new
                            {
                                idproveedor = PR.idproveedor,
                                razonsocial = PR.razonsocial,
                            }
                            ).ToList();
                return (data);
            }
            catch (Exception)
            {
                return new List<CProveedor>();
            }
        }
        public async Task<ProveedorModel> ListarModelAsync()
        {
            ProveedorModel model = new ProveedorModel();
            model. monedas = await db.FMONEDA.Where(x => x.estado=="HABILITADO").OrderBy(x => x.nombre).ToListAsync();
            model.pais = await db.PAIS.Where(x => x.estado == "HABILITADO").OrderBy(x => x.nombre).ToListAsync();
            model.bancos = await db.FBANCO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.condicionpago = await db.CCONDICIONPAGO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();

            return model;
            
        }        
        public async Task<mensajeJson> RegistrarEditarAsync(CProveedor obj)
        {
            try
            {
                var aux = db.CPROVEEDOR.Where(x => x.ruc == obj.ruc && x.estado != "ELIMINADO").FirstOrDefault();
                if (obj.idproveedor == 0)
                {

                    db.CPROVEEDOR.Add(obj);
                    await db.SaveChangesAsync();
                    obj.contacto = new CContactosProveedor();
                   
                    return (new mensajeJson("ok", obj));

                }
                else
                {

                    db.CPROVEEDOR.Update(obj);
                    await db.SaveChangesAsync();
                    try
                    {
                        obj.contacto = new CContactosProveedor
                        { nombres = db.CCONTACTOPROVEEDOR.Where(x => x.idproveedor == obj.idproveedor && x.estado != "ELIMINADO").FirstOrDefault().nombres };
                    }
                    catch (Exception)
                    { obj.contacto = new CContactosProveedor(); }
                    obj.contacto = new CContactosProveedor();
                  
                    return (new mensajeJson("ok", obj));

                }
            }
            catch (Exception e)
            {
                var error = "";
                if (e.InnerException != null)
                    error = e.InnerException.Message;
                return (new mensajeJson(e.Message+"->"+error, null));
            }

        }        
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var obj = await db.CPROVEEDOR.FirstOrDefaultAsync(m => m.idproveedor == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }

        public async Task<mensajeJson> BuscarAsync(int? id)
        {
            try
            {
                var obj = await db.CPROVEEDOR.FirstOrDefaultAsync(m => m.idproveedor == id);
                if (obj.idmoneda != null || obj.idmoneda != 0)
                    obj.moneda = await db.FMONEDA.FindAsync(obj.idmoneda);
                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
     
        public async Task<List<CProveedor>> listarproveedoresHabilitadosAsync()
        {
            try
            {
                var data = await db.CPROVEEDOR.Where(x => x.estado == "HABILITADO" ).OrderBy(x => x.razonsocial).ToListAsync();
                return (data);
            }
            catch (Exception )
            {
                return new List<CProveedor>();
            }

        }
        public mensajeJson RegistrarCuenta(CuentaProveedor cuenta)
        {
            cuenta.estado = "HABILITADO";
            if (cuenta.id is 0)
                db.Add(cuenta);
            else
                db.Update(cuenta);
            
            db.SaveChanges();
            return new mensajeJson("ok", cuenta);
        }
        public mensajeJson BuscarCuenta(int id)
        {
            try
            {
                var data = db.CCUENTAPROVEEDOR.Find(id);
                return new mensajeJson("ok", data);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);

            }

        }
        public mensajeJson EliminarCuenta(int idcuenta)
        {
            var data = db.CCUENTAPROVEEDOR.Find(idcuenta);
            data.estado = "ELIMINADO";
            db.Update(data);
            db.SaveChanges();
            return new mensajeJson("ok", null);
        }
        public object ListarCuentas(int idproveedor)
        {
            var query = (from c in db.CCUENTAPROVEEDOR
                         join b in db.FBANCO on c.idbanco equals b.idbanco
                         join m in db.FMONEDA on c.idmoneda equals m.idmoneda
                         where c.estado == "HABILITADO"
                         select new { 
                         c.id,
                         c.numcuenta,
                         moneda=m.codigosunat,
                         banco=b.descripcion,
                        ubicacion= b.ubicacion??"",
                           c.swift,
                           c.aba,
                           c.bancointermedio,
                           c.iban
                         }
                       ).ToList();
            return query;
        }
        public object BuscarProveedores(string filtro)
        {
            if (filtro is null) filtro = "a";
            var data = db.CPROVEEDOR.Where(x => x.razonsocial.Contains(filtro) || x.nombrecomercial.Contains(filtro) || x.ruc.Contains(filtro)&& x.estado=="HABILITADO").Select(x=> new { x.razonsocial, x.ruc, x.idproveedor}).Take(10).ToList();
            return data;
        }
        //CONTACTO DE PROVEEDOR                     
        public async Task<mensajeJson> RegistrarEditarContactoAsync(CContactosProveedor obj)
        {
            try
            {
                if (obj.idproveedor == 0)
                {

                    db.CCONTACTOPROVEEDOR.Add(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));
                }
                else
                {
                    db.CCONTACTOPROVEEDOR.Update(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));

                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }      
        public async Task<mensajeJson> BuscarContactoAsync(int? id)
        {
            try
            {
                var obj = await db.CCONTACTOPROVEEDOR.FirstOrDefaultAsync(m => m.idcontacto == id);
                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }


        }      
        public async Task<mensajeJson> EliminarContactoAsync(int? id)
        {
            var obj = await db.CCONTACTOPROVEEDOR.FirstOrDefaultAsync(m => m.idcontacto == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
        public async Task<List<ALaboratorio>> listarLaboratorioProveedorAsync(string proveedor, string laboratorio)
        {
            try
            {
                if (laboratorio is null) laboratorio = "";
                laboratorio = laboratorio.ToUpper();
                if (proveedor is null || proveedor == "")
                {
                    var laboratorios = await db.ALABORATORIO.Where(x => x.estado != "ELIMINADO").OrderBy(X => X.descripcion).Take(10).ToListAsync();
                    return (laboratorios);
                }
                else
                {
                   
                        var query = await (from e in db.CPROVEEDORLABORATORIO
                                     join s in db.ALABORATORIO on e.idlaboratorio equals s.idlaboratorio
                                     where e.estado != "ELIMINADO"
                                     && e.idproveedor == int.Parse(proveedor)
                                     && s.descripcion.ToUpper().Contains(laboratorio)
                                     orderby s.descripcion
                                     select new ALaboratorio
                                     {
                                         descripcion = s.descripcion,
                                         estado = e.estado,
                                         idlaboratorio = s.idlaboratorio,

                                     }).Take(10).ToListAsync();
                        return query;                   
                }
            }
            catch (Exception)
            {
                return new List<ALaboratorio>();
            }
        }

        public async Task<List<CContactosProveedor>> listarContactosProveedorAsync(int proveedor)
        {
            try
            {
                var data = await db.CCONTACTOPROVEEDOR.Where(x => x.estado == "HABILITADO"
                                                             && x.idproveedor == proveedor)
                                                           .ToListAsync();
                return (data);
            }
            catch (Exception)
            {
                return (new List<CContactosProveedor>());
            }
        }      

        //ARCHIVO DE PROVEEDOR
        public mensajeJson RegistrarDatosArchivo(ArchivoProveedor obj, IFormFile file, string path)
        {
            try
            {
                db.Add(obj);
                db.SaveChanges();
                if (file != null)
                {
                    var extension = System.IO.Path.GetExtension(file.FileName);
                    var nombreimagen = $"{obj.idarchivo}{extension}";
                    string respuesta = "";
                    GuardarElementos elemento = new GuardarElementos();
                    respuesta = elemento.SaveFile(file, $"{path}/archivos/proveedor/{obj.idproveedor}/", nombreimagen);
                    if (respuesta == "ok")
                    {
                        obj.archivo = nombreimagen;
                        db.Update(obj);
                        db.SaveChanges();
                        return (new mensajeJson("ok", obj));
                    }
                }
                return new mensajeJson("ok", null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
            
        }
        public mensajeJson EliminarArchivo(int id)
        {
            var obj = db.ARCHIVOPROVEEDOR.Find(id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            db.SaveChanges();
            return new mensajeJson("ok", null);
        }       
        public List<ArchivoProveedor> ListarArchivos(int idproveedor)
        {
            try
            {
                var data = db.ARCHIVOPROVEEDOR.Where(x => x.idproveedor == idproveedor && x.estado=="HABILITADO").ToList();
                if (data.Count > 0)
                    data.ForEach(x => x.archivo = $"/archivos/proveedor/{x.idproveedor}/{x.archivo}");

                return data;
            }
            catch (Exception e)
            {
                return new List<ArchivoProveedor>();
            }
          
        }
    }
}
