using Erp.Entidades.visitadormedico;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.RelacionMedRepMedico.command
{
    public class DeshabilitarMedicoRepMedico
    {
        public class Ejecutar : IRequest<object>
        {
            public int idmedico { get; set; }
            public int idrepresentante { get; set; }
            public string idcanalventa { get; set; }
            //public int[] array_final { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    //for (int i = 0; i < e.array_final.Length; i += 2)
                    //{
                    //    var auxlista = db.REPMEDICOMEDASIGNADOS.Where(x => x.idmedico == e.array_final[i]
                    //    && x.idrepresentante == e.array_final[i + 1]).ToList();
                    //    if (auxlista.Count > 0)
                    //    {
                    //        foreach (var item in auxlista)
                    //        {
                    //            item.estado = "DESHABILITADO";
                    //        }
                    //        db.REPMEDICOMEDASIGNADOS.UpdateRange(auxlista);
                    //        await db.SaveChangesAsync();
                    //    }
                    //}
                    var objVerificacion = db.REPMEDICOMEDASIGNADOS.Where(x => x.idmedico == e.idmedico &&
                    x.idrepresentante == e.idrepresentante && x.idcanalventa == e.idcanalventa).FirstOrDefault();
                    if (objVerificacion != null)
                    {
                        objVerificacion.estado = "DESHABILITADO";
                        db.REPMEDICOMEDASIGNADOS.Update(objVerificacion);
                        await db.SaveChangesAsync();
                    }
                    return new mensajeJson("ok", null);
                }
                catch (Exception err)
                {
                    return (new mensajeJson(err.Message, null));
                }
            }
        }
    }
}
