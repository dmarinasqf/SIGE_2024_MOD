﻿using Erp.Persistencia.Repositorios.Common;
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
    public class ReportePedidosConAdelanto
    {
        public class Ejecutar : IRequest<object>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string perfil { get; set; } 
            public string sucursal { get; set; } 
            public string laboratorio { get; set; } 
            public string supervisor { get; set; }
            public string consulta { get; set; }
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
                var stroreprocedure = "SP_REPORTECONADELANTO";
                var parametros = new Dictionary<string, object>();

                parametros.Add("FECHAINICIO", e.fechainicio ?? "");
                parametros.Add("FECHAFIN", e.fechafin ?? "");
                parametros.Add("SUCURSAL", e.sucursal ?? "");
                parametros.Add("PERFIL", e.perfil ?? "ADMINISTRADOR");
                parametros.Add("LABORATORIO", e.laboratorio ?? "");
                parametros.Add("EMPCONSULTA", e.supervisor ?? "");

                if (e.consulta == "EXPORTACION")
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "PedidosConAdelanto");
                    return await guardarExcel(e.path, tabla);
                }
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;

            }
            public async Task<mensajeJson> guardarExcel(string path, DataTable tabla)
            {
                try
                {
                    var data = await Task.Run(() =>
                    {

                        GuardarElementos save = new GuardarElementos();
                        var nombre = "reportepedidosconadelanto" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                        string direccion = "/archivos/reportes/pedidos/";
                        string ruta = Path.Combine(path + direccion, "");
                        string res = save.GenerateExcel(ruta, nombre, tabla);
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
