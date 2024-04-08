using ENTIDADES.facturacionHorizont.Utils;
using Erp.WorkerService.Areas.Finanzas._interface;
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

namespace Erp.WorkerService.Areas.Finanzas
{
    class UpdateCoinValueWorker : BackgroundService
    {
        private readonly ILogger<UpdateCoinValueWorker> _logger;
        private readonly IUpdateCoinValue worker;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public UpdateCoinValueWorker(ILogger<UpdateCoinValueWorker> logger, IServiceScopeFactory serviceScopeFactory)
        {
            _logger = logger;
            _serviceScopeFactory = serviceScopeFactory;
            var scope = _serviceScopeFactory.CreateScope();
            worker = scope.ServiceProvider.GetRequiredService<IUpdateCoinValue>();
        }
      
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            SettingsJson settings = new SettingsJson();

            while (!stoppingToken.IsCancellationRequested)
            {
                string mensaje = "";
                var crearlog = settings.LeerDataJson("UpdateCoinValue:crearlog");
                var time = settings.LeerDataJson("UpdateCoinValue:tiempoejecucion");
                if (time == "" || time is null) time = "3600000";
                var ciclo = int.Parse(time);
                try
                {

                    var resp = worker.UpdateCoin();
                    mensaje = $"{resp} running at: {DateTimeOffset.Now}";
                    _logger.LogInformation(mensaje);
                }
                catch (Exception e)
                {

                    mensaje = e.Message;
                }
                if (bool.Parse(crearlog))
                {
                    var pathlog = settings.LeerDataJson("config:pathlogs") + "\\UpdateCoinValueWorker\\";
                    Writetxt.creartxtAsync(pathlog, mensaje, $"UpdateCoinValueWorker{DateTime.Now.ToString("yyyyMMddHHmmss")}.txt");
                }


                await Task.Delay(ciclo, stoppingToken);
            }
        }
    }
}
