﻿using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
//using ENTIDADES.veterinaria.PatologiaMascota;

namespace Gdp.Infraestructura.Maestros.PatologiaMascota.command
{
    public class RegistrarEditar
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public ENTIDADES.veterinaria.PatologiaMascota obj { get; set; }
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
                try
                {
                    if (e.obj.idpatologia is 0)
                    {
                        await db.AddAsync(e.obj);
                        await db.SaveChangesAsync();
                    }
                    else
                    {
                        db.Update(e.obj);
                        await db.SaveChangesAsync();
                    }
                    return new mensajeJson("ok", null);

                }
                catch (Exception error)
                {
                    return new mensajeJson(error.Message, null);
                }
            }
        }
    }
}