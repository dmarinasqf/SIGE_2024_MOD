
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros.cliente.command
{
    public class RegistrarImagen
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public IFormFile imagen { get; set; }
            public int idcliente { get; set; }
            public string ruta { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            

            public Manejador(Modelo db_)
            {
                db = db_;
            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var obj = db.CLIENTE.Find(e.idcliente);
                string respuesta = "";
                GuardarElementos elemento = new GuardarElementos();
                var path = (e.ruta + "/imagenes/clientes/");
                if (e.imagen.Length > 0)
                {
                    var nombreimagen = obj.idcliente + "_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".png";
                    respuesta =  elemento.SaveFile(e.imagen, path, nombreimagen);
                    if (respuesta is "ok")
                    {
                        obj.logo = nombreimagen;
                        db.CLIENTE.Update(obj);
                        db.SaveChanges();
                        return (new mensajeJson("ok", obj));
                    }
                    return (new mensajeJson(respuesta, null));

                }
                return (new mensajeJson("ok", null));

            }
        }
    }
}
