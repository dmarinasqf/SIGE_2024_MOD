using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Maestros.EF
{
    public class PacienteEF
    {
        private readonly Modelo db;
        public PacienteEF(Modelo _db)
        {
            db = _db;
        }
        //para modal de registro 
        //public mensajeJson RegistrarEditar(Paciente paciente)
        //{
        //    if (paciente.tipopaciente == "MASCOTA")
        //        return RegistrarMascota(paciente);
        //    else
        //        return RegistrarPaciente(paciente);


        //}

      
        public Paciente BuscarPaciente(string numdocumento)
        {
            var paciente = db.PACIENTE.Where(x => x.numdocumento == numdocumento).FirstOrDefault();
            return paciente;
        }
    }
}
