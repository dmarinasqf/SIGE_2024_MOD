using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

using System.Threading.Tasks;
using Erp.SeedWork;
using MailKit.Net.Smtp;
using MimeKit;

namespace Erp.SeedWork
{
    public class Email
    {
        public string enviarCorreoArchivoAdjunto(string asunto, string mensaje, string mensajehtml, EmailHelper emailHelper)
        {
            try
            {

                var mailMessage = new MimeMessage();
                mailMessage.From.Add(new MailboxAddress(emailHelper.user, emailHelper.email));
                //mailMessage.To.Add(new MailboxAddress("", "norvilguevaratorres@gmail.com"));
                List<MailboxAddress> correos = new List<MailboxAddress>();
                foreach (var item in emailHelper.emailsreceptores)
                    correos.Add(new MailboxAddress("", item));

                mailMessage.To.AddRange(correos);
                mailMessage.Subject = asunto;
                var Body = new BodyBuilder();

                if (mensaje is "" || mensaje is null)
                    Body = new BodyBuilder
                    {
                        HtmlBody = mensajehtml
                    };
                if (mensajehtml is "" || mensajehtml is null)
                    Body = new BodyBuilder
                    {
                        TextBody = mensaje                       
                    };

                foreach (var item in emailHelper.rutasarchivosenviar)
                    Body.Attachments.Add(item);
                mailMessage.Body = Body.ToMessageBody();

                using (var smtpClient = new SmtpClient())
                {
                    int puerto = int.Parse(emailHelper.port);
                    //smtpClient.Connect("mail.farmaciasqf.pe", 587,MailKit.Security.SecureSocketOptions.Auto);                   
                    smtpClient.Connect(emailHelper.host, puerto, MailKit.Security.SecureSocketOptions.Auto);
                    smtpClient.Authenticate(emailHelper.email, emailHelper.pass);
                    // smtpClient.Authenticate("soporte@farmaciasqf.pe", "S3gur0M41lqf");
                    smtpClient.Send(mailMessage);
                    smtpClient.Disconnect(true);
                }
                return "ok";
            }
            catch (Exception e)
            {

                return e.Message;
            }


        }

        public string enviarCorreoPreingreso(string asunto, string mensaje, string mensajehtml, EmailHelper emailHelper)
        {
            try
            {
                var mailMessage = new MimeMessage();
                mailMessage.From.Add(new MailboxAddress(emailHelper.user, emailHelper.email));

                List<MailboxAddress> correos = new List<MailboxAddress>();
                foreach (var item in emailHelper.emailsreceptores)
                    correos.Add(new MailboxAddress("", item));

                mailMessage.To.AddRange(correos);
                mailMessage.Subject = asunto;

                var body = new BodyBuilder();

                if (string.IsNullOrEmpty(mensaje))
                    body.HtmlBody = mensajehtml;
                if (string.IsNullOrEmpty(mensajehtml))
                    body.TextBody = mensaje;

                foreach (var item in emailHelper.rutasarchivosenviar)
                    body.Attachments.Add(item);

                mailMessage.Body = body.ToMessageBody();
                var direcionarchi = emailHelper.rutasarchivosenviar;
                using (var smtpClient = new SmtpClient())
                {
                    int puerto = int.Parse(emailHelper.port);
                    //smtpClient.Connect("mail.farmaciasqf.pe", 587,MailKit.Security.SecureSocketOptions.Auto);                   
                    smtpClient.Connect(emailHelper.host, puerto, MailKit.Security.SecureSocketOptions.Auto);
                    smtpClient.Authenticate(emailHelper.email, emailHelper.pass);
                    // smtpClient.Authenticate("soporte@farmaciasqf.pe", "S3gur0M41lqf");
                    smtpClient.Send(mailMessage);
                    smtpClient.Disconnect(true);
                }


                // OPCIONAL ELIMINA EL ARCHIVO DEL SISTEMA SI EN VIO FUE CORRECTO,SI NO DECEA ELIMINAR EL ARCHIVO DEL SISTEMA COMENTA
                foreach (var direccion in direcionarchi)
                {
                    try
                    {
                        File.Delete(direccion);
                        Console.WriteLine($"Archivo eliminado: {direccion}");
                    }
                    catch (FileNotFoundException)
                    {
                        Console.WriteLine($"El archivo no existe: {direccion}");
                    }
                  
                }

                // FIN DE LA ELIMINACION


                return "ok";

            }
            catch (Exception e)
            {

                return e.Message;
            }


        }
    }
}
