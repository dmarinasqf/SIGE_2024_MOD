using Erp.Entidades.Asistencia;
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
using DateTime = System.DateTime;

namespace Gdp.Infraestructura.Asistencia.control.command
{
    public class RegistrarEditarAsistencia
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public ARegistroEs obj { get; set; }
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
                    if (e.obj.fecha is "NUEVO")
                    {
                        e.obj.fechaIngreso= DateTime.Now;
                        e.obj.fecha= DateTime.Now.ToShortDateString();
                        await db.AddAsync(e.obj);
                        await db.SaveChangesAsync();
                    }
                    else
                    {
                        string fechas = System.DateTime.Now.ToShortDateString();
                        ARegistroEs registroEs;
                        registroEs = db.ASISREGISTROES.Where(x => x.documento == e.obj.documento && x.fecha == fechas).FirstOrDefault();

                        //var data = db.ASISREGISTROES.Find(e.obj.documento);
                        if (registroEs != null)
                        {
                            if (e.obj.fecha is "INICIO ALMUERZO")
                            {
                                registroEs.fechaIAlmuerzo = System.DateTime.Now;
                            }
                            else if (e.obj.fecha == "FIN ALMUERZO")
                            {
                                registroEs.fechaFAlmuerzo = System.DateTime.Now;
                            }
                            else if (e.obj.fecha == "SALIDA")
                            {
                                registroEs.fechaSalida = DateTime.Now;
                                registroEs.temperaturaf = e.obj.temperaturaf;
                                registroEs.observacionf = e.obj.observacionf;
                                if (registroEs.fechaIAlmuerzo == null)
                                {
                                    registroEs.fechaIAlmuerzo = DateTime.Now;
                                }
                                if (registroEs.fechaFAlmuerzo == null)
                                {
                                    registroEs.fechaFAlmuerzo = DateTime.Now;
                                }
                            }
                            else if (e.obj.fecha == "EMERGENCIA")
                            {
                                registroEs.fechaSalidaEmergencia = DateTime.Now;
                                registroEs.idEmpleadoA_JE = e.obj.idEmpleadoA_JE;
                                registroEs.justificacionE = e.obj.justificacionE;
                                registroEs.temperaturaf = e.obj.temperaturaf;
                                registroEs.observacionf = e.obj.observacionf;
                                if (registroEs.fechaIAlmuerzo == null)
                                {
                                    registroEs.fechaIAlmuerzo = DateTime.Now;
                                }
                                if (registroEs.fechaFAlmuerzo == null)
                                {
                                    registroEs.fechaFAlmuerzo = DateTime.Now;
                                }
                                if (registroEs.fechaSalida == null)
                                {
                                    registroEs.fechaSalida = DateTime.Now;
                                }
                            }
                            else if (e.obj.fecha == "INICIO HORA EXTRA")
                            {
                                registroEs.fechaIHoraExtra = DateTime.Now;
                                registroEs.idEmpleadoA_JEH = e.obj.idEmpleadoA_JEH;
                                registroEs.justificacionHE = e.obj.justificacionHE;
                            }
                            else if (e.obj.fecha == "FIN HORA EXTRA")
                            {
                                registroEs.fechaFHoraExtra = DateTime.Now;
                            }


                            db.Update(registroEs);
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            return new mensajeJson("no registrado", e.obj);
                        }
                    }
                    return new mensajeJson("registrado", e.obj);
                }
                catch (Exception ex)
                {

                    return new mensajeJson(ex.Message, null);
                }
            }
        }
    }
}
