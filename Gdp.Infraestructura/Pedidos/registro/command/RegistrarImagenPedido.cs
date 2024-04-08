using ENTIDADES.pedidos;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.registro
{
    public class RegistrarImagenPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpedido { get; set; }
            public string tipo { get; set; }
            public string path { get; set; }
            public List<IFormFile> archivos { get; set; }
            public List<string> tipos { get; set; }
            public List<int> idimagen { get; set; }
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
                    var images = await db.IMAGENPEDIDO.Where(x => x.idpedido == e.idpedido).ToListAsync();

                    if (images.Count > 0)
                    {
                        for (int i = 0; i < images.Count; i++)
                        {
                            var _id = images[i].idimagen;
                            var estado = "BORRAR";

                            for(int x = 0; x < e.idimagen.Count; x++)
                            {
                                var _idimg = e.idimagen[x];
                                if (_id == _idimg)
                                {
                                    estado = "OK";
                                }
                            }
                            if (estado == "BORRAR")
                            {
                                var imgP = await db.IMAGENPEDIDO.FindAsync(_id);
                                db.Remove(imgP);
                                await db.SaveChangesAsync();
                            }

                        }
                        //for (int x = 0; x < e.idimagen.Count; x++)
                        //{
                        //    var _idimg = e.idimagen[x];
                        //    var estado = "BORRAR";
                        //    for (int i = 0; i < images.Count; i++)
                        //    {
                        //        var _id = images[i].idimagen;
                        //        if (_idimg == _id)
                        //        {
                        //            estado = "OK";
                        //        }
                        //    }
                        //    if (estado == "BORRAR")
                        //    {
                        //        var pedido = await db.IMAGENPEDIDO.FindAsync(e.idimagen[x]);
                        //        db.Remove(pedido);
                        //        await db.SaveChangesAsync();
                        //    }

                        //}
                    }
 
                    if (e.tipo == "file")
                    {
                        List<ImagenPedido> imagenes = new List<ImagenPedido>();
                        if(e.archivos != null)
                        {
                            for (int i = 0; i < e.archivos.Count; i++)
                            {
                                var file = e.archivos[i];
                                var categoria = e.tipos[i];
                                if (file != null)
                                {
                                    var extension = System.IO.Path.GetExtension(file.FileName);
                                    var nombre = $"sisqf_{e.idpedido}_{i}_{categoria}_{DateTime.Now.ToString("ddMMyyyyhhmm")}{extension}";
                                    string respuesta = "";
                                    GuardarElementos elemento = new GuardarElementos();
                                    respuesta = elemento.SaveFile(file, $"{e.path}/imagenes/pedido/{categoria}/", nombre);
                                    if (respuesta == "ok")
                                    {
                                        imagenes.Add(new ImagenPedido
                                        {
                                            idpedido = e.idpedido,
                                            imagen = nombre,
                                            tipo = categoria
                                        });
                                    }
                                }
                            }
                            await db.AddRangeAsync(imagenes);
                            await db.SaveChangesAsync();
                        }

                    }
                    return new mensajeJson("ok", null);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
               


            }
        }
    }
}
