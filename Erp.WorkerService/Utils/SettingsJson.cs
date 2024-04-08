using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.WorkerService.Utils
{
    class SettingsJson
    {
        public static IConfiguration Configuration { get; set; }

        public string LeerDataJson(string variable)
        {
            var builder = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json");
           
            Configuration = builder.Build();
            return Configuration[variable];

        }
        public string GetConnectionString()
        {
            var builder=new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json");
            
     

            Configuration = builder.Build();
            return Configuration.GetConnectionString("Modelo");

        }
    }
}
