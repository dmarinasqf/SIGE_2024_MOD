using ENTIDADES.delivery;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.agenciaenvio.command
{
    public class RegistrarEditarAgencia
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            //public string descripcion { get; set; }
            //public string estado { get; set; }
            //public int idagencia { get; set; }
            public AgenciaEncomienda obj { get; set; }
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
                //var obj = new AgenciaEncomienda
                //{
                //    descripcion=e.descripcion,
                //    estado=e.estado,
                //    idagencia=e.idagencia
                //};
                try
                {
                    if(e.obj.idagencia is 0)
                    {
                        await db.AddAsync(e.obj);
                        await db.SaveChangesAsync();
                       
                    }else
                    {
                        db.Update(e.obj);
                        await db.SaveChangesAsync();
                    }
                    return new mensajeJson("ok",e.obj);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
               
            }
        }

    }
}
