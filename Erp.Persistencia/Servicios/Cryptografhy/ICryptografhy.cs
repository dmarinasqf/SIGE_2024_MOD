using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.Persistencia.Servicios
{
    public interface ICryptografhy
    {
        public string Decrypt(string valor);
        public string Encryt(string valor);
    }
}
