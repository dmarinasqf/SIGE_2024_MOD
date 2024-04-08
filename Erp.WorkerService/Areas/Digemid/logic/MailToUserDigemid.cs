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

namespace Erp.WorkerService.Areas.Digemid.logic
{
    
   public class MailToUserDigemid : IMailToUserDigemid
    {
        private readonly WorkerContext db;
        private readonly ReporteDigemidDAO digemidDAO;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public MailToUserDigemid(IServiceScopeFactory serviceScopeFactory) {        
           
            _serviceScopeFactory = serviceScopeFactory;
            var scope = _serviceScopeFactory.CreateScope();
            db = scope.ServiceProvider.GetRequiredService<WorkerContext>();
            SettingsJson settings = new SettingsJson();
            digemidDAO = new ReporteDigemidDAO(settings.GetConnectionString());
        }
            
        public string SendMessageUserDigemid()
        {
            try
            {               
                var day = DateTime.Now.Day.ToString();
                SettingsJson settings = new SettingsJson();
                if (settings.LeerDataJson("MailToUserDigemid:diaenvio").Contains(day))
                {
                    var hora = DateTime.Now.Hour.ToString();
                    var emailusuario = db.CCONSTANTE.Find("EMAILUSERDIGEMID").valor;
                    if (emailusuario is "" || emailusuario is null)
                        return "No existe un email de usuario para enviar el correo";
                    EmailHelper emailaux = new EmailHelper();
                    emailaux.emailsreceptores = new List<string>();
                    emailaux.user = db.CCONSTANTE.Find("NOMBRESISTEMA").valor;
                    emailaux.email = db.CCONSTANTE.Find("EMAILSISTEMA").valor;
                    emailaux.pass = db.CCONSTANTE.Find("CLAVEEMAILSISTEMA").valor;
                    emailaux.host = db.CCONSTANTE.Find("HOSTCORREO").valor;
                    emailaux.port = db.CCONSTANTE.Find("PORTCORREO").valor;
                    emailaux.emailsreceptores.Add(emailusuario);
                    Email email = new Email();                              
                    if (settings.LeerDataJson("MailToUserDigemid:horaenvioemail").Contains(hora))
                    {
                        emailaux.rutasarchivosenviar = getexcelenvioslistas();
                        var resp = email.enviarCorreoArchivoAdjunto("Subir precios a digemid", "Hola hoy es " + DateTime.Now.ToShortDateString() + ", Suba los precios a la digemid", "", emailaux);
                        return resp;
                    }
                    else if (settings.LeerDataJson("MailToUserDigemid:horaenvioadvertenciaemail").Contains(hora))
                    {

                        var resp = email.enviarCorreoArchivoAdjunto("No se olvide de subir los precios a Digemid", "Buenas noches ya son " + DateTime.Now.ToShortTimeString() + ", Suba los precios a la digemid", "", emailaux);
                        return resp;

                    }
                    else
                        return "Paso la hora de envio de los excel de digemid al usuario de observatorio de precios";

                }
                else
                    return "Hoy no es 16";
            }
            catch (Exception e)
            {

                return e.Message;
            }
        }

        private List<string> getexcelenvioslistas()
        {
            var listaarchivos = new List<string>();
            var sucursales = db.SUCURSAL.Where(x => x.coddigemid != null && x.coddigemid != "" && x.estado == "HABILITADO").ToList();
            SettingsJson settings = new SettingsJson();

            var path = settings.LeerDataJson("config:pathreport");
            for (int i = 0; i < sucursales.Count; i++)
            {
                try
                {
                    var lista = db.PRECIOSSUCURSAL.Where(x => x.estado == "HABILITADO" && x.idsucursal == sucursales[i].suc_codigo).FirstOrDefault();
                    if (lista is not null)
                    {
                        var datatable = digemidDAO.GetPreciosMensual(sucursales[i].suc_codigo, lista.idlista.Value, "farmacias");
                        GuardarElementos save = new GuardarElementos();
                        var nombre = $"{sucursales[i].suc_codigo}_farmacias_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                        string direccion = "\\digemid\\";
                        string ruta = Path.Combine(path + direccion, "");
                        string res = save.GenerateExcel(ruta, nombre, datatable);
                        if (res == "ok")
                            listaarchivos.Add(ruta+nombre);
                    }
                }
                catch (Exception)
                {
                }
               
            }

            return listaarchivos;
        }
    }
}
