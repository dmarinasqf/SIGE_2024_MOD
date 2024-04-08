using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Models.DAO
{
    public class EmpleadoOBJ
    {
        public int idempleado { get; set; }
        public string nombres { get; set; }
        public int idsucursal { get; set; }
        public string sucursal { get; set; }
        public int idempresa { get; set; }
        public string empresa { get; set; }
    }
}
