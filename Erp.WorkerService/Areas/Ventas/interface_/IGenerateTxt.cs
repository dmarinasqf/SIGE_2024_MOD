using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.WorkerService.Areas.Ventas.interface_
{
    public interface IGenerateTxt
    {
        public  Task<string> GenerateTxt_Async();
    }
}
