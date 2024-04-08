using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.SeedWork.Report
{
    public interface IReportService
    {
        byte[] GenerateReportAsync(string reportName, Dictionary<string, object> datasource, string type);
        
    }
}
