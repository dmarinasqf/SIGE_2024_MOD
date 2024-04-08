using System;
using System.Collections.Generic;
using System.Data;

namespace Erp.SeedWork
{
    public class mensajeJson
    {
        public string mensaje { get; set; }
        public Object objeto { get; set; }
        public DataTable tabla { get; set; }
        public List<Object> lista { get; set; }
        public mensajeJson(string mensaje, Object data)
        {
            this.mensaje = mensaje;
            this.objeto = data;
        }
        public mensajeJson(string mensaje, DataTable tabla)
        {
            this.mensaje = mensaje;
            this.tabla = tabla;
        }
        //public mensajeJson(string mensaje, List<Object> lista)
        //{
        //    this.mensaje = mensaje;
        //    this.lista = lista;
        //}
        public mensajeJson() { }
    }
}