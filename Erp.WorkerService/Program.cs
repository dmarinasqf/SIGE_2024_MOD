using Erp.WorkerService.Areas.Digemid;
using Erp.WorkerService.Areas.Digemid.interface_;
using Erp.WorkerService.Areas.Digemid.logic;
using Erp.WorkerService.Areas.Finanzas;
using Erp.WorkerService.Areas.Finanzas._interface;
using Erp.WorkerService.Areas.Finanzas.logic;
using Erp.WorkerService.Areas.Ventas;
using Erp.WorkerService.Areas.Ventas.interface_;
using Erp.WorkerService.Areas.Ventas.logic;
using Erp.WorkerService.Utils;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Erp.WorkerService.Areas.Pedidos.interface_;
using Erp.WorkerService.Areas.Pedidos.logic;
using Erp.Persistencia.DapperConection;
using Erp.Persistencia.Repositorios.Common;
using Erp.WorkerService.Areas.Pedidos;

namespace Erp.WorkerService
{
    public class Program
    {


        static SettingsJson jsonsettings;

        public static void Main(string[] args)
        {

            jsonsettings = new SettingsJson();
            CreateHostBuilder(args).UseContentRoot(Directory.GetCurrentDirectory()).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
          Host.CreateDefaultBuilder(args)
              .ConfigureServices((hostContext, services) =>
              {

                    services.AddDbContext<WorkerContext>(options =>
                     options.UseSqlServer(
                     jsonsettings.GetConnectionString()).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));

                    services.Configure<DapperConection>(
                        options =>
                        {
                            options.Modelo = jsonsettings.GetConnectionString();
                        }
                    );
                    services.AddTransient<IFactoryConnection, FactoryConnection>();
                    services.AddTransient<IEjecutarProcedimiento, EjecutarProcedimiento>();

                    services.AddScoped<IMailToUserDigemid, MailToUserDigemid>();
                    services.AddScoped<IMailToCanfar, MailToCanfar>();
                    services.AddScoped<IGenerateTxt, GenerateTxt>();

                    services.AddScoped<IUpdateCoinValue, UpdateCoinValue>();
                    services.AddHostedService<MailToUserDigemidWorker>();
                    services.AddHostedService<GenerateTxtWorker>();
                    services.AddHostedService<UpdateCoinValueWorker>();
                    services.AddHostedService<MailToCannfarmWorker>();
                });
    }
}
