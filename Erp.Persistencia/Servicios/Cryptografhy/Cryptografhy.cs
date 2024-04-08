
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;


namespace Erp.Persistencia.Servicios
{
    public class Cryptografhy : ICryptografhy
    {
        public static IConfiguration Configuration { get; set; }
     
        private readonly IDataProtectionProvider _dataProtectionProvider;  
        private string  Key="XXASFXAWFXDBBGAWDQWIDQWHFIWFHKAJFKAWFJWIFJAKFASKFWBJFNWUFWEUFBEWSKJFHSAIFBSABFISABF";

        public Cryptografhy(IDataProtectionProvider dataProtectionProvider)
        {
            _dataProtectionProvider = dataProtectionProvider;          
        }
        public string Decrypt(string valor)
        {
            var protector = _dataProtectionProvider.CreateProtector(Key);
            return protector.Unprotect(valor);
        }
        public string Encryt(string valor)
        {
            var protector = _dataProtectionProvider.CreateProtector(Key);
            return protector.Protect(valor);
        }
    }
    
}
