using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros.cliente.command
{
    public class RegistrarEditarCliente
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public Cliente cliente { get; set; }         
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
                if (e.cliente.idcliente is 0)
                    return await crearAsync(e.cliente);
                else
                    return await editarAsync(e.cliente);


            }

            private async Task<mensajeJson> editarAsync(Cliente cliente)
            {
                try
                {

                    var auxcliente = db.CLIENTE.Where(x => x.nrodocumento == cliente.nrodocumento && x.iddocumento == cliente.iddocumento && x.estado == "HABILITADO").ToList().LastOrDefault();
                    var clientedb = db.CLIENTE.Find(cliente.idcliente);
                    if (cliente.estado is null) cliente.estado = "HABILITADO";
                    if (cliente.logo is null)
                        cliente.logo = clientedb.logo;
                    if (auxcliente is null)
                    {
                        cliente.apematerno = cliente.apematerno ?? "";
                        cliente.apepaterno = cliente.apepaterno ?? "";
                        
                        db.Update(cliente);
                        await db.SaveChangesAsync();
                     
                        return new mensajeJson("ok", cliente);
                    }
                    else
                    {
                        if (auxcliente.idcliente == cliente.idcliente)
                        {                                              
                            db.Update(cliente);
                            db.SaveChanges();
                            return new mensajeJson("ok", cliente);
                        }
                        else

                            return new mensajeJson("El cliente ya se encuentra registrado", null);
                    }

                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, null);
                }
            }

            private async Task<mensajeJson> crearAsync(Cliente cliente)
            {
                try
                {
                    var oClienteValidar = db.CLIENTE.Where(x => x.nrodocumento == cliente.nrodocumento).ToList().LastOrDefault();
                    if (oClienteValidar is null || oClienteValidar == null)
                    {
                        cliente.idcliente = 0;
                        cliente.estado = "HABILITADO";
                        await db.AddAsync(cliente);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", cliente);
                    }
                    else
                    {
                        cliente.idcliente = oClienteValidar.idcliente;
                        cliente.estado = "HABILITADO";
                        db.Update(cliente);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", cliente);
                    }


                    //var auxcliente = db.CLIENTE.Where(x => x.nrodocumento == cliente.nrodocumento && x.iddocumento == cliente.iddocumento).ToList().LastOrDefault();
                    //if (auxcliente is null)
                    //{
                    //    cliente.estado = "HABILITADO";
                    //    cliente.apematerno = cliente.apematerno ?? "";
                    //    cliente.apepaterno = cliente.apepaterno ?? "";

                    //    await db.AddAsync(cliente);
                    //    await db.SaveChangesAsync();

                    //    return new mensajeJson("ok", cliente);
                    //}
                    //else
                    //    return new mensajeJson("El cliente ya se encuentra registrado", null);

                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, null);
                }
            }
        }
    }
}
