using Erp.WorkerService.Areas.Digemid.interface_;
using Erp.WorkerService.Utils;
using INFRAESTRUCTURA.Areas.Digemid.dao;
using Erp.Persistencia.Modelos;

using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Erp.SeedWork;
using Erp.WorkerService.Areas.Pedidos.interface_;
using Erp.Persistencia.Repositorios.Common;

namespace Erp.WorkerService.Areas.Pedidos.logic
{
    
   public class MailToCanfar: IMailToCanfar
    {
        private readonly WorkerContext db;
        private readonly ReporteDigemidDAO digemidDAO;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IEjecutarProcedimiento procedimiento;
        public MailToCanfar(IServiceScopeFactory serviceScopeFactory, IEjecutarProcedimiento procedimiento_) {        
           
            _serviceScopeFactory = serviceScopeFactory;
            var scope = _serviceScopeFactory.CreateScope();
            db = scope.ServiceProvider.GetRequiredService<WorkerContext>();
            SettingsJson settings = new SettingsJson();
            digemidDAO = new ReporteDigemidDAO(settings.GetConnectionString());
            procedimiento = procedimiento_;
        }
            
        public async Task<string> SendMessageEmailAsync()
        {
            try
            {               
                var day = DateTime.Now.DayOfWeek.ToString().ToLower();
                var hora = DateTime.Now.Hour.ToString();
                if (hora.Length == 1)
                    hora = "0" + hora;
                SettingsJson settings = new SettingsJson();
                var fechainicio = DateTime.Now.Date.AddDays(-7);
                var fechafin = DateTime.Now.Date;
                if (settings.LeerDataJson("ReportCanfar:diaenvio").Contains(day))
                {
                 
                    var emailusuario = db.CCONSTANTE.Find("EMAILUSERKANFAR").valor;
                    if (emailusuario is "" || emailusuario is null)
                        return "No existe un email de usuario para enviar el correo";
                    var arrayemails = emailusuario.Split("|");
                    EmailHelper emailaux = new EmailHelper();
                    emailaux.emailsreceptores = new List<string>();
                    emailaux.user = db.CCONSTANTE.Find("NOMBRESISTEMA").valor;
                    emailaux.email = db.CCONSTANTE.Find("EMAILSISTEMA").valor;
                    emailaux.pass = db.CCONSTANTE.Find("CLAVEEMAILSISTEMA").valor;
                    emailaux.host = db.CCONSTANTE.Find("HOSTCORREO").valor;
                    emailaux.port = db.CCONSTANTE.Find("PORTCORREO").valor;
                    foreach (var item in arrayemails)       
                        emailaux.emailsreceptores.Add(item);                    
                    
                    Email email = new Email();                              
                    if (settings.LeerDataJson("ReportCanfar:horaenvio").Contains(hora))
                    {
                        emailaux.rutasarchivosenviar = await getexcelenvioslistasAsync(fechainicio,fechafin);
                        if(emailaux.rutasarchivosenviar.Count>0)
                        {
                            var resp = email.enviarCorreoArchivoAdjunto("REPORTE VENTAS CBD CONSOLIDADO - QF", $"Hola se le envía el reporte de ventas del {fechainicio.ToString("dd/MM/yyyy")} al {fechafin.ToString("dd/MM/yyyy")}", "", emailaux);
                            return resp;
                        }else
                        {
                            return "No se encontraron archivos";
                        }
                     
                    }                   
                    else
                        return "Paso la hora de envio del reporte de kanfar";

                }
                else
                    return $"Hoy no es el dia de envio {day}";
            }
            catch (Exception e)
            {

                return e.Message;
            }
        }

     
        private async Task<List<string>> getexcelenvioslistasAsync(DateTime fechainicio,DateTime fechafin)
        {
            var listaarchivos = new List<string>();
            var sucursales = db.SUCURSAL.Where(x => x.coddigemid != null && x.coddigemid != "" && x.estado == "HABILITADO").ToList();
            SettingsJson settings = new SettingsJson();

            var path = settings.LeerDataJson("config:pathreport");
            var stroreprocedure = "Pedidos.sp_reporte_canfar";
            var parametros = new Dictionary<string, object>();
            parametros.Add("fechainicio",fechainicio.ToString());
            parametros.Add("fechafin", fechafin.ToString());
            var reporte = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "ReporteCannfarm");
            try
            {
             
                if (reporte.Rows.Count>0)
                {
                   
                    GuardarElementos save = new GuardarElementos();
                    var nombre = $"reporte_qf_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "\\Cannfarm\\";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, reporte);
                    if (res == "ok")
                        listaarchivos.Add(ruta + nombre);
                }
            }
            catch (Exception)
            {
            }
            

            return listaarchivos;
        }
    }
}
