using Erp.Persistencia.Repositorios.Common;
using Erp.Report.Dtos.Administrador;
using Erp.Report.Dtos.Ventas;
//using Erp.Report.Dtos.Administrador;
//using Erp.Report.Dtos.Ventas;
using Erp.SeedWork.Report;
using MediatR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Ventas.proforma.query
{
    public class GetProformaReport
    {
        public class Ejecutar : IRequest<byte[]>
        {
            public long id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, byte[]>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
            private readonly IReportService report;
            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_, IReportService report_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;
                report = report_;
            }

            public async Task<byte[]> Handle(Ejecutar e, CancellationToken cancellationToken) {
                try {
                    string proforma = "proforma1";
                    var stroreprocedure = "[Ventas].[sp_get_proforma_reporte]";
                    var parametros = new Dictionary<string, object>();
                    parametros.Add("idproforma", e.id);
                    var datos = await ejecutarProcedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);

                    Dictionary<string, object> datasource = new Dictionary<string, object>();
                    List<ProformaDetalleDto> detalle = new List<ProformaDetalleDto>();
                    foreach (var item in datos[0]) {
                        if (item.Key == "CABECERA") {
                            var data = JsonConvert.DeserializeObject<List<ProformaCabeceraDto>>(item.Value.ToString());
                            datasource.Add("Cabecera", data);
                        }
                        if (item.Key == "DETALLE") {
                            var data = JsonConvert.DeserializeObject<List<ProformaDetalleDto>>(item.Value.ToString());
                            datasource.Add("Detalle", data);
                        }
                        if (item.Key == "EMPRESA") {
                            var data = JsonConvert.DeserializeObject<List<EmpresaDto>>(item.Value.ToString());
                            datasource.Add("Empresa", data);
                            if(data[0].ruc == "20543542157") {
                                proforma = "proforma2";
                            }
                            else if(data[0].ruc == "20608009796")
                            {
                                proforma = "proforma3";
                            }
                            else if(data[0].ruc == "20601105226")
                            {
                                proforma = "proforma4";
                            }
                        }
                    }
                    var returnString = report.GenerateReportAsync("Reportes\\Ventas\\"+proforma, datasource, "pdf");
                    return returnString;
                } catch (Exception vex) {
                    return null;
                }
                
            }
        }
    }
}
