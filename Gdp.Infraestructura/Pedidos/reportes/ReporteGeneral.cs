using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.reportes
{
    public class ReporteGeneral
    {
        public class Ejecutar : IRequest<object>
        {

            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string horainicio { get; set; }
            public string horafin { get; set; }
            public string sucursal { get; set; }
            public string laboratorio { get; set; }
            public string tipopedido { get; set; }
            public string perfil { get; set; }
            public string vendedor { get; set; }
            public string medico { get; set; }
            public string paciente { get; set; }
            public string cliente { get; set; }
            public string origenreceta { get; set; }
            public string estado { get; set; }
            public string empconsulta { get; set; }
            public string tipoempresa { get; set; }
            public string consulta { get; set; }
            public bool fechafacturacion { get; set; }
            public string tipoproducto { get; set; }
            public string tipoformulacion { get; set; }
            public string path { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {

            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento_)
            {

                procedimiento = procedimiento_;
            }
            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "SP_REPORTEGENERAL";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("cliente", e.cliente);
                parametros.Add("consulta", e.consulta);
                parametros.Add("empconsulta", e.empconsulta);
                parametros.Add("estado", e.estado);
                parametros.Add("fechafacturacion", e.fechafacturacion);
                parametros.Add("horafin", e.horafin);
                parametros.Add("horainicio", e.horainicio);
                parametros.Add("laboratorio", e.laboratorio);
                parametros.Add("medico", e.medico);
                parametros.Add("origenreceta", e.origenreceta);
                parametros.Add("paciente", e.paciente);
                parametros.Add("perfil", e.perfil);
                parametros.Add("sucursal", e.sucursal);
                parametros.Add("tipoempresa", e.tipoempresa);
                parametros.Add("tipoformulacion", e.tipoformulacion);
                parametros.Add("tipopedido", e.tipopedido);
                parametros.Add("tipoproducto", e.tipoproducto);
                parametros.Add("vendedor", e.vendedor);
                if(e.consulta=="EXPORTACION")
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros,"General");
                    return await guardarExcel(e.path, tabla);
                }
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);

                return data;

            }
            public async Task<mensajeJson> guardarExcel(string path, DataTable dt)
            {
                try
                {
           
                    var data = await Task.Run( () =>
                    {
                       
                        GuardarElementos save = new GuardarElementos();
                        var nombre = "reportegeneral" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                        string direccion = "/archivos/reportes/pedidos/";
                        string ruta = Path.Combine(path + direccion, "");
                        string res = save.GenerateExcel(ruta, nombre, dt);
                        if (res == "ok")
                            return new mensajeJson("ok", direccion + nombre);
                        else
                            return new mensajeJson(res, direccion + nombre);
                    });
                    return data;
                }
                catch (Exception e)
                {

                    return new mensajeJson(e.Message, null);
                }
            }
        }
    }
}
