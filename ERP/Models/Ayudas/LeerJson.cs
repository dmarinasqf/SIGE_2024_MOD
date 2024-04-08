using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Models.Ayudas
{
    public class LeerJson
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
            var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json");

            Configuration = builder.Build();
            return Configuration.GetConnectionString("Modelo");

        }
    }
}
