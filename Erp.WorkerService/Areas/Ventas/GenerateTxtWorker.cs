using ENTIDADES.facturacionHorizont.Utils;
using Erp.WorkerService.Areas.Ventas.interface_;
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
namespace Erp.WorkerService.Areas.Ventas
{
    class GenerateTxtWorker : BackgroundService
    {
        private readonly ILogger<GenerateTxtWorker> _logger;
        private readonly IGenerateTxt worker;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public GenerateTxtWorker(ILogger<GenerateTxtWorker> logger, IServiceScopeFactory serviceScopeFactory)
        {
            _logger = logger;
            _serviceScopeFactory = serviceScopeFactory;
            var scope = _serviceScopeFactory.CreateScope();
            worker = scope.ServiceProvider.GetRequiredService<IGenerateTxt>();
        }      

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            SettingsJson settings = new SettingsJson();

            while (!stoppingToken.IsCancellationRequested)
            {
                string mensaje = "";
                var crearlog = settings.LeerDataJson("GenerateTxt:crearlog");
                var time = settings.LeerDataJson("GenerateTxt:tiempoejecucion");
                if (time == "" || time is null) time = "3600000";
                var ciclo = int.Parse(time);
                try
                {
                    var hora = DateTime.Now.Hour.ToString();
                    if (settings.LeerDataJson("GenerateTxt:horaejecucion").Contains(hora))
                    {
                        var resp = await worker.GenerateTxt_Async();
                        mensaje = $"{resp} running at: {DateTimeOffset.Now}";
                        _logger.LogInformation(mensaje);
                    }
                    else
                        mensaje = "No es la hora";


                }
                catch (Exception e)
                {

                    mensaje = e.Message;
                }
                if (bool.Parse(crearlog))
                {
                    var pathlog = settings.LeerDataJson("config:pathlogs")+"\\GenerateTxt\\";
                    Writetxt.creartxtAsync(pathlog, mensaje, $"GenerateTxt_{DateTime.Now.ToString("yyyyMMddHHmmss")}.txt");
                }


                await Task.Delay(ciclo, stoppingToken);
            }
        }
    }
}