using Erp.WorkerService.Areas.Ventas.interface_;
using Erp.WorkerService.Utils;
using INFRAESTRUCTURA.Areas.Ventas.DAO;
using Erp.Persistencia.Modelos;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.WorkerService.Areas.Ventas.logic
{
    public class GenerateTxt: IGenerateTxt
    {
        private readonly WorkerContext db;
        private readonly VentaDAO ventadao;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public GenerateTxt(IServiceScopeFactory serviceScopeFactory)
        {

            _serviceScopeFactory = serviceScopeFactory;
            var scope = _serviceScopeFactory.CreateScope();
            db = scope.ServiceProvider.GetRequiredService<WorkerContext>();
            SettingsJson settings = new SettingsJson();
            ventadao = new VentaDAO(settings.GetConnectionString());
        }

        public async Task<string> GenerateTxt_Async()
        {
            try
            {
                var ventas = db.VENTA.Where(x => x.estado == "HABILITADO" && x.fecha.Value.Date >= DateTime.Now.AddDays(-6) && x.txtgenerado == false).ToList();
                var respuesta = "";
                foreach (var item in ventas)
                {
                    var venta = db.VENTA.Find(item.idventa);
                    try
                    {

                        var documento = db.FDOCUMENTOTRIBUTARIO.Find(venta.iddocumento);
                        if (!venta.txtgenerado.HasValue || !venta.txtgenerado.Value)

                            if (documento.codigosunat == "01" || documento.codigosunat == "03")
                            {
                                var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}{venta.idsucursal}\\TXT\\";
                                var res = await ventadao.generarTextTxtAsync(item.idventa, path);
                                if (res == "ok")
                                {
                                    venta.txtgenerado = true;
                                    venta.iseditable = false;
                                    db.Update(venta);
                                    db.SaveChanges();
                                }
                                else
                                {
                                    db.MENSAJESISTEMA.Add(new ENTIDADES.Generales.MensajeSistema
                                    {
                                        descripcion = $"error al generar txt de la venta -> {res}",
                                        fecha = DateTime.Now,
                                        modulo = "Ventas",
                                        tipo = "Error",
                                        visto = false
                                    });
                                    await db.SaveChangesAsync();
                                }
                                   
                                respuesta += $"{ venta.serie}{venta.numdocumento}-> {res}\n" ;
                            }
                    }
                    catch (Exception e)
                    {

                        db.MENSAJESISTEMA.Add(new ENTIDADES.Generales.MensajeSistema
                        {
                            descripcion = $"error al generar txt de la venta {venta.serie}{venta.numdocumento} sucursal {venta.idsucursal} -> {e.Message}",
                            fecha = DateTime.Now,
                            modulo = "Ventas",
                            tipo = "Error",
                            visto = false
                        });
                        await db.SaveChangesAsync();

                        respuesta += $"{venta.serie}{venta.numdocumento} ->"+ e.Message;
                    }

                }
                return respuesta;
            }

            catch (Exception e)
            {

                return e.Message;
            }
        }
    }
}

