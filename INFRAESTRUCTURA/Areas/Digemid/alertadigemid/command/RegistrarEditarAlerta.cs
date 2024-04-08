using ENTIDADES.digemid;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Digemid.alertadigemid.command
{
   public class RegistrarEditarAlerta
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public AlertaDigemid alerta { get; set; }
            public IFormFile archivo { get; set; }
            public string ruta { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                  
                    e.alerta.estado = "HABILITADO";                    
                    if(e.alerta.idalerta is 0)
                    {
                        if ( e.archivo is  null || e.archivo.Length == 0)
                            return new mensajeJson("No se cargo un archivo", null);

                        var resarchivo = guardararchivo(e.archivo, e.ruta);
                        if (resarchivo =="x")
                            return new mensajeJson("Error al guardar archivo", null);
                        e.alerta.archivo = resarchivo;
                        await db.AddAsync(e.alerta);
                        await db.SaveChangesAsync();

                    }
                    else
                    {
                        var objaux = await db.ALERTADIGEMID.FindAsync(e.alerta.idalerta);
                        if(e.archivo is null || e.archivo.Length==0)
                        {
                            e.alerta.archivo = objaux.archivo;
                            db.Update(e.alerta);
                            await db.SaveChangesAsync();
                            
                        }else
                        {
                            var resarchivo = guardararchivo(e.archivo, e.ruta);
                            if (resarchivo == "x")
                                return new mensajeJson("Error al guardar el archivo", null);
                            e.alerta.archivo = resarchivo;
                            db.Update(e.alerta);
                            await db.SaveChangesAsync();
                        }
                    }


                    return new mensajeJson("ok", null);
                }
                catch (System.Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
            }
            private string guardararchivo(IFormFile file,string path)
            {
                var extension = System.IO.Path.GetExtension(file.FileName);
                var nombre = DateTime.Now.ToString("ddMMyyyyhhmmss")+ extension;
                string respuesta = "";
                GuardarElementos elemento = new GuardarElementos();
                respuesta = elemento.SaveFile(file, path + "/archivos/digemid/alertas/", nombre);
                if (respuesta == "ok")
                    respuesta = nombre;
                else
                    respuesta = "x";
                return respuesta;
            }
        }
    }
}
