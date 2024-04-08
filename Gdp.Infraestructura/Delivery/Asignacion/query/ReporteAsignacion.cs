using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Delivery.Asignacion.query
{
   public class ReporteAsignacion
    {
        public class EjecutarData : IRequest<object>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }         
            public string sucursal { get; set; }
            public string tipoentrega { get; set; }
            public string estado { get; set; }     
    
        }
        public class EjecutarExcel :IRequest<byte[]>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }         
            public string sucursal { get; set; }
            public string tipoentrega { get; set; }
            public string estado { get; set; }     
    
        }
        public class Manejador : IRequestHandler<EjecutarData, object>, IRequestHandler<EjecutarExcel, byte[]>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento)
            {
                this.procedimiento = procedimiento;
            }

            public async Task<object> Handle(EjecutarData e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Delivery.sp_reporteentregadelivery";
                var parametros = new Dictionary<string, object>();
                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("tipoentrega", e.tipoentrega);
                parametros.Add("sucursal", e.sucursal);
                parametros.Add("estado", e.estado);                              
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }
           
            public async Task<byte[]> Handle(EjecutarExcel e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Delivery.sp_reporteentregadelivery";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("tipoentrega", e.tipoentrega);
                parametros.Add("sucursal", e.sucursal);
                parametros.Add("estado", e.estado);
              
                var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "Delivery");
                GuardarElementos save = new GuardarElementos();
                return save.GenerateExcelByte(tabla);

            }
        }
    }
}
