using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class ConsumoEconomatoEF : IConsumoEconomatoEF
    {
        private readonly Modelo db;
        private readonly IUser user;

        public ConsumoEconomatoEF(Modelo context, IUser _user)
        {
            db = context;
            user = _user;
        }
        public async Task<mensajeJson> RegistrarConsumoEconomatoAsync(AConsumoEconomato obj)
        {
            try
            {
                List<AConsumoEconomatoDetalle> detalleConsumo = new List<AConsumoEconomatoDetalle>();
                detalleConsumo = JsonConvert.DeserializeObject<List<AConsumoEconomatoDetalle>>(obj.jsondetalle);
                using (var transaccion = await db.Database.BeginTransactionAsync())
                {
                    try
                    {
                        obj.numdocumento = generarcodigo();
                        obj.estado = "HABILITADO";
                        obj.suc_codigo = Convert.ToInt32(user.getIdSucursalCookie());
                        await db.ACONSUMOECONOMATO.AddAsync(obj);
                        await db.SaveChangesAsync();
                        foreach (var item in detalleConsumo)
                        {
                            item.idconsumoeconomato = obj.idconsumoeconomato;
                        }
                        await db.ACONSUMOECONOMATODETALLE.AddRangeAsync(detalleConsumo);
                        await db.SaveChangesAsync();
                        await transaccion.CommitAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    catch (Exception e)
                    {
                        await transaccion.RollbackAsync();
                        return new mensajeJson(e.Message + '-' + e.InnerException.Message, null);
                    }
                }
            }
            catch(Exception e)
            {
                return new mensajeJson(e.Message + '-' + e.InnerException.Message, null);
            }
        }
        private string generarcodigo()
        {
            //int empresa = (user.getIdEmpresaCookie());
            //string correlativoempresa = db.EMPRESA.Find(empresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.ACONSUMOECONOMATO.Where(X => X.fechacreacion.Value.Year == ano).Count();
            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = "CQF" + año.Substring(2, 2) + auxcodigo;
            return codigo;
        }
    }
}
