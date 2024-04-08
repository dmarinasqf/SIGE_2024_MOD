using ENTIDADES.ventas;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Gdp.Infraestructura.Pedidos.ViewModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.registro
{
    public class DatosInicioRegistro
    {
        public class Ejecutar : IRequest<PedidoModel> { }
        public class Manejador : IRequestHandler<Ejecutar, PedidoModel>
        {
            private readonly Modelo db;
            private readonly IUser user;
            public Manejador(Modelo context, IUser user_)
            {
                db = context;
                user = user_;
            }

            public async Task<PedidoModel> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                PedidoModel data = new PedidoModel();
                data.tipoformulacion = await db.TIPOFORMULACION.Where(x => x.estado == "HABILITADO").ToListAsync();
                data.tipopedido = await db.TIPOPEDIDO.Where(x => x.estado == "HABILITADO").ToListAsync();
                data.tipoentrega = await db.TIPOENTREGA.Where(x => x.estado == "HABILITADO").ToListAsync();               
                data.tipopaciente = await db.TIPOPACIENTE.Where(x => x.estado == "HABILITADO").ToListAsync();
                data.sucursales = await db.SUCURSAL.Where(x => x.estado == "HABILITADO" && x.tipoSucursal=="LOCAL").ToListAsync();
                data.IGV = db.CCONSTANTE.Find("IGV").valor;
                data.canalventa = await ListarCanalVentaEmpleadoAsync();
                data.tipoVentas = await db.TipoVentas.ToListAsync();
                return data;

            }
            private async Task<List<CanalVenta>> ListarCanalVentaEmpleadoAsync()
            {
                var idemp = int.Parse(user.getIdUserSession());
                var canales = await (from T1 in db.EMPLEADOCANALVENTA
                               join T2 in db.CANALVENTA on T1.idcanalventa equals T2.idcanalventa
                               where T1.idempleado==idemp
                               select new CanalVenta
                               {
                                   idcanalventa=T1.idcanalventa,
                                   descripcion=T2.descripcion
                               }).ToListAsync();
                if (canales.Count == 0)
                    return await db.CANALVENTA.Where(x => x.estado == "HABILITADO").ToListAsync();
                else
                    return canales;
            }
        }
    }
}
