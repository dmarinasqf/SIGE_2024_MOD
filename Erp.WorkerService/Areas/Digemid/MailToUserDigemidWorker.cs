using ENTIDADES.facturacionHorizont.Utils;
using Erp.WorkerService.Areas.Digemid.interface_;
using Erp.WorkerService.Utils;
using Erp.Persistencia.Modelos;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Erp.WorkerService.Areas.Pedidos.interface_;

namespace Erp.WorkerService.Areas.Digemid
{
    public class MailToUserDigemidWorker : BackgroundService
    {
        private readonly ILogger<MailToUserDigemidWorker> _logger;
        private readonly IMailToUserDigemid worker;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public MailToUserDigemidWorker(ILogger<MailToUserDigemidWorker> logger, IServiceScopeFactory serviceScopeFactory)
        {
            _logger = logger;
            _serviceScopeFactory = serviceScopeFactory;
            var scope = _serviceScopeFactory.CreateScope();
            worker = scope.ServiceProvider.GetRequiredService<IMailToUserDigemid>();
        }
        //public override async Task StartAsync(CancellationToken cancellationToken)
        //{
        //    _logger.LogInformation("Worker starts");
        //    await base.StartAsync(cancellationToken);
        //}

        //public override async Task StopAsync(CancellationToken cancellationToken)
        //{
        //    _logger.LogInformation("Worker stops");
        //    await base.StopAsync(cancellationToken);
        //}

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            SettingsJson settings = new SettingsJson();
          
            while (!stoppingToken.IsCancellationRequested)
            {
                string mensaje = "";
                var crearlog = settings.LeerDataJson("MailToUserDigemid:crearlog");
                var time = settings.LeerDataJson("MailToUserDigemid:tiempoejecucion");
                if (time == "" || time is null) time = "3600000";
                var ciclo = int.Parse(time);
                try
                {
                   
                    var resp = worker.SendMessageUserDigemid();
                    mensaje = $"{resp} running at: {DateTimeOffset.Now}";                  
                    _logger.LogInformation(mensaje);
                }
                catch (Exception e)
                {

                    mensaje=e.Message;
                }
                if (bool.Parse(crearlog))
                {
                    var pathlog = settings.LeerDataJson("config:pathlogs")+ "\\MailToUserDigemidWorker\\";
                    Writetxt.creartxtAsync(pathlog, mensaje, $"MailToUserDigemidWorker_{DateTime.Now.ToString("yyyyMMddHHmmss")}.txt");
                }
               

                await Task.Delay(ciclo, stoppingToken);
            }
        }
    }
}
