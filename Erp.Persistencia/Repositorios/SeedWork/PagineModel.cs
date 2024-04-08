using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
namespace Erp.Persistencia.Repositorios.SeedWork
{
   public class PagineModel
    {
        public List<IDictionary<string,object>> data { get; set; }
        public object dataobject { get; set; }
        public int totalpaginas { get; set; }
        public int numregistros { get; set; }
        public int paginaactual { get; set; }
        
        public PagineModel()
        {
            totalpaginas = 0;
            numregistros = 0;
            paginaactual = 0;
            data =new  List<IDictionary<string, object>>();
            dataobject = new object();
        }
    }
    public class PagineParams
    {
        public int numpagina { get; set; }
        public int tamanopagina { get; set; }
        public PagineParams()
        {
            numpagina = 1;
            tamanopagina = 15;
        }
    }
}
