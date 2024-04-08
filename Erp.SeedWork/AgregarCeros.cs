using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.SeedWork
{
    public class AgregarCeros
    {
        public string agregarCeros(int num)
        {
            string aux = num.ToString();
            if (num < 10)
                return "0000000" + aux;
            else if (num < 100)
                return "000000" + aux;
            else if (num < 1000)
                return "00000" + aux;
            else if (num < 10000)
                return "0000" + aux;
            else if (num < 100000)
                return "000" + aux;
            else if (num < 1000000)
                return "00" + aux;
            else
                return aux;
        }
    }
}
