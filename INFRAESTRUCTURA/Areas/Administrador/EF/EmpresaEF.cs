using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using INFRAESTRUCTURA.Areas.Administrador.ViewModels;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.EF
{
    public class EmpresaEF : IEmpresaEF
    {
        private readonly Modelo db;
        public EmpresaEF(Modelo context)
        {
            db = context;

        }


        public async Task<List<Empresa>> ListarAsync()
        {

            var data = await db.EMPRESA.ToListAsync();
            return (data);
        }
        public async Task<mensajeJson> RegistrarEditarAsync(Empresa obj)
        {
            try
            {
                var aux = db.EMPRESA.Where(x => x.idempresa == obj.idempresa).FirstOrDefault();
                if ((aux is null))
                {
                    db.Add(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));
                }
                else
                {
                    if (aux.idempresa == obj.idempresa)
                    {

                        obj.imagen = obj.imagen ?? aux.imagen;
                        obj.logofacturacion = obj.logofacturacion ?? aux.logofacturacion;
                        db.Update(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                        return (new mensajeJson("El registro ya existe", null));
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }

        public mensajeJson guardarImagen(IFormFile[] file, string[] tipo, int id, string path)
        {
            var aux = db.EMPRESA.Find(id);
            for (int i = 0; i < file.Length; i++)
            {
                if (file[i] != null)
                {
                    var extension = System.IO.Path.GetExtension(file[i].FileName);
                    var nombreimagen = $"{aux.correlativo}{extension}";
                    string respuesta = "";
                    GuardarElementos elemento = new GuardarElementos();
                    respuesta = elemento.SaveFile(file[i], path + "/imagenes/empresas/", nombreimagen);
                    if (respuesta == "ok")
                    {
                        if (tipo[i] == "logo")
                            aux.imagen = nombreimagen;
                        else if (tipo[i] == "facturacion")
                            aux.logofacturacion = nombreimagen;
                    }
                }
            }
            db.Update(aux);
            db.SaveChanges();
            return (new mensajeJson("ok", aux));
        }
        public Empresa BuscarEmpresa(int id)
        {
            var data = db.EMPRESA.Find(id);
            return (data);
        }
    }
}
