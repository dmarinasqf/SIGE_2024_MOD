using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.WorkerService.Areas.Pedidos.interface_
{
    public interface IMailToCanfar
    {
        public Task<string> SendMessageEmailAsync();
    }

}
