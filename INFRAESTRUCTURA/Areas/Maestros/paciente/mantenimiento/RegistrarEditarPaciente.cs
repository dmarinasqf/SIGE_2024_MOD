using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Maestros.paciente.mantenimiento
{
    public class RegistrarEditarPaciente
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public Paciente paciente { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo db_)
            {
                db = db_;

            }

            public async Task<mensajeJson> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var paciente = request.paciente;
                if (paciente.tipopaciente == "MASCOTA")
                    return await RegistrarMascotaAsync(paciente);
                else
                    return await RegistrarPacienteAsync(paciente);

            }
            private async Task<mensajeJson> RegistrarPacienteAsync(Paciente paciente)
            {
                var oPacienteValidar = db.PACIENTE.Where(x => x.numdocumento == paciente.numdocumento).FirstOrDefault();
                if (oPacienteValidar is null || oPacienteValidar == null)
                {
                    paciente.idpaciente = 0;
                    paciente.estado = "HABILITADO";
                    await db.AddAsync(paciente);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", paciente);
                }
                else
                {
                    paciente.idpaciente = oPacienteValidar.idpaciente;
                    paciente.estado = "HABILITADO";
                    db.Update(paciente);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", paciente);
                }

                //var auxpaciente = db.PACIENTE.Where(x => x.numdocumento == paciente.numdocumento).ToList().LastOrDefault();
                //if (paciente.idpaciente is 0)
                //{
                //    if (auxpaciente is null)
                //    {
                //        paciente.estado = "HABILITADO";
                //        await db.AddAsync(paciente);
                //        await db.SaveChangesAsync();
                //        return new mensajeJson("ok", paciente);
                //    }
                //    else
                //        return new mensajeJson("El número de documento ya ha sido registrado", null);
                //}
                //else
                //{
                //    if (auxpaciente is null)
                //    {
                //        paciente.idpaciente = 0;
                //        paciente.estado = "HABILITADO";
                //        await db.AddAsync(paciente);
                //        await db.SaveChangesAsync();
                //        return new mensajeJson("ok", paciente);
                //    }
                //    else
                //    {
                //        if (auxpaciente.idpaciente == paciente.idpaciente)
                //        {
                //            paciente.estado = "HABILITADO";
                //            db.Update(paciente);
                //            await db.SaveChangesAsync();
                //            return new mensajeJson("ok", paciente);
                //        }
                //        else

                //            return new mensajeJson("El paciente ya se encuentra registrado", null);
                //    }
                //}
            }

            private async Task<mensajeJson> RegistrarMascotaAsync(Paciente paciente)
            {
                var mascota = db.PACIENTE.Where(x => x.nombres == paciente.nombres && x.tipopaciente == paciente.tipopaciente && x.idtutor == paciente.idtutor && x.idtipomascota == paciente.idtipomascota).FirstOrDefault();
                if (paciente.idpaciente is 0)
                {
                    if (mascota is null)
                    {
                        paciente.numdocumento = "00000000";
                        paciente.estado = "HABILITADO";
                        await db.AddAsync(paciente);
                        await db.SaveChangesAsync();
                        paciente.apepaterno = (paciente.apepaterno ?? "");
                        paciente.apematerno = (paciente.apematerno ?? "");
                        paciente.numdocumento = "M" + paciente.idpaciente.ToString();
                        db.Update(paciente);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", paciente);
                    }
                    else
                        return new mensajeJson("Existe una mascota registrada con los mismos nombres", null);
                }
                else
                {
                    var mascotaaux = db.PACIENTE.Find(paciente.idpaciente);
                    mascotaaux.apepaterno = (paciente.apepaterno ?? "");
                    mascotaaux.apematerno = (paciente.apematerno ?? "");
                    mascotaaux.nombres = paciente.nombres;
                    mascotaaux.idtipomascota = paciente.idtipomascota;
                    mascotaaux.idpatologiamascota = paciente.idpatologiamascota;
                    mascotaaux.idraza = paciente.idraza;
                    mascotaaux.peso = paciente.peso;
                    db.Update(mascotaaux);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", mascotaaux);

                }

            }
        }
    }
}
