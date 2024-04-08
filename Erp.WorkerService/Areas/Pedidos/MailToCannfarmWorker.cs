using ENTIDADES.facturacionHorizont.Utils;
using Erp.WorkerService.Areas.Pedidos.interface_;
using Erp.WorkerService.Utils;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.WorkerService.Areas.Pedidos
{
    class MailToCannfarmWorker : BackgroundService
    {
        private readonly ILogger<MailToCannfarmWorker> _logger;
        private readonly IMailToCanfar worker;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public MailToCannfarmWorker(ILogger<MailToCannfarmWorker> logger, IServiceScopeFactory serviceScopeFactory)
        {
            _logger = logger;
            _serviceScopeFactory = serviceScopeFactory;
            var scope = _serviceScopeFactory.CreateScope();
            worker = scope.ServiceProvider.GetRequiredService<IMailToCanfar>();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            SettingsJson settings = new SettingsJson();

            while (!stoppingToken.IsCancellationRequested)
            {
                string mensaje = "";
                var crearlog = settings.LeerDataJson("ReportCanfar:crearlog");
                var time = settings.LeerDataJson("ReportCanfar:tiempoejecucion");
                if (time == "" || time is null) time = "3600000";
                var ciclo = int.Parse(time);
                try
                {
                  
                        var resp = await worker.SendMessageEmailAsync();
                        mensaje = $"{resp} running at: {DateTimeOffset.Now}";
                        _logger.LogInformation(mensaje);
                   
                }
                catch (Exception e)
                {

                    mensaje = e.Message;
                }
                if (bool.Parse(crearlog))
                {
                    var pathlog = settings.LeerDataJson("config:pathlogs") + "\\SendEmailCannfarm\\";
                    Writetxt.creartxtAsync(pathlog, mensaje, $"SendEmailCannfarm_{DateTime.Now.ToString("yyyyMMddHHmmss")}.txt");
                }


                await Task.Delay(ciclo, stoppingToken);
            }
        }
    }
}
