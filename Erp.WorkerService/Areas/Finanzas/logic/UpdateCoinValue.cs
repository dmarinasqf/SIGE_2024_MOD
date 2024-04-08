
using Erp.WorkerService.Areas.Finanzas._interface;
using Erp.WorkerService.Areas.Finanzas.Dto;
using Erp.WorkerService.Utils;
using Erp.Persistencia.Modelos;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Erp.WorkerService.Areas.Finanzas.logic
{
    public class UpdateCoinValue: IUpdateCoinValue
    {
        private readonly WorkerContext db;

        private readonly IServiceScopeFactory _serviceScopeFactory;
        public UpdateCoinValue(IServiceScopeFactory serviceScopeFactory)
        {

            _serviceScopeFactory = serviceScopeFactory;
            var scope = _serviceScopeFactory.CreateScope();
            db = scope.ServiceProvider.GetRequiredService<WorkerContext>();
        }

        public async Task<string> UpdateCoin()
        {
            try
            {
                SettingsJson settings = new SettingsJson();
                var hora = DateTime.Now.Hour.ToString();

                if (settings.LeerDataJson("UpdateCoinValue:horaejecucion").Contains(hora))
                {

                    var endpoint = "";                  
                    endpoint = settings.LeerDataJson("UpdateCoinValue:urlapi");                  
                    HttpWebRequest request = WebRequest.Create(endpoint) as HttpWebRequest;
                    request.Method = "GET";
                    request.ContentType = "application/json";

                    HttpWebResponse response = request.GetResponse() as HttpWebResponse;
                    StreamReader reader = new StreamReader(response.GetResponseStream());
                    string json = reader.ReadToEnd();
                    var data = JsonConvert.DeserializeObject<TipoCambio>(json);

                    var moneda = db.FMONEDA.Where(x => x.codigosunat == "USD").FirstOrDefault();
                    if (moneda is null)
                        return "No existe la moneda del dola.";
                    moneda.preciocompra = data.Cotizacion[0].Compra;
                    moneda.precioventa = data.Cotizacion[0].Venta;
                    moneda.tipodecambio = data.Cotizacion[0].Venta;
                    moneda.fechaedicion = DateTime.Now;
                    db.Update(moneda);
                    await db.SaveChangesAsync();
                    return json;
                }
                else
                    return "Paso la hora de actualizacion";
            }
            catch (Exception e)
            {

                return e.Message;
            }
        }
    }
}
