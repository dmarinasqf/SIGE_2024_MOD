using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.Maestros.Medico.command
{
    public class AgregarImagen
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public IFormFile fileMedico { get; set; }
            public IFormFile filefirma { get; set; }
            public int id { get; set; }
            public string ruta { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo db)
            {
                this.db = db;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    string direccion = "/imagenes/medicos/";
                    string ruta = Path.Combine(e.ruta + direccion, "");
                    var aux = db.MEDICO.Find(e.id);
                    if (e.fileMedico != null && e.filefirma != null)
                    {
                        var extension = System.IO.Path.GetExtension(e.fileMedico.FileName);
                        var extension2 = System.IO.Path.GetExtension(e.filefirma.FileName);
                        var nombreimagen = "medico_" + e.id.ToString() + "_" + extension;
                        var nombreimagen2 = "firma_" + e.id.ToString() + "_" + extension;
                        string respuesta = "";
                        string respuesta2 = "";
                        GuardarElementos elemento = new GuardarElementos();
                        respuesta = elemento.SaveFile(e.fileMedico, ruta, nombreimagen);
                        respuesta2 = elemento.SaveFile(e.filefirma, ruta, nombreimagen2);
                        if (respuesta == "ok" || respuesta2 == "ok")
                        {
                            if (respuesta == "ok")
                            {
                                aux.fotomedico = nombreimagen;
                            }
                            if (respuesta2 == "ok")
                            {
                                aux.fotofirma = nombreimagen2;
                            }
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", null));
                        }
                        else
                        {
                            return (new mensajeJson("error", null));
                        }
                    }
                    else
                    {
                        aux.fotomedico = "medico.jpg";
                        db.Update(aux);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", null));
                    }
                }
                catch (Exception error)
                {

                    return (new mensajeJson(error.Message, null));
                }
                throw new NotImplementedException();
            }
        }
    }
}
