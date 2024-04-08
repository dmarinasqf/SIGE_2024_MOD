using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.WorkerService.Areas.Finanzas._interface
{
    public interface IUpdateCoinValue
    {
        public Task<string> UpdateCoin();
    }
}
