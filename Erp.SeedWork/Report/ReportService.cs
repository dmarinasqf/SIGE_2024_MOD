using AspNetCore.Reporting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Erp.SeedWork.Report
{
    public class ReportService : IReportService
    {
        public byte[] GenerateReportAsync(string reportName, Dictionary<string, object> datasource,string type="pdf")
        {
            string fileDirPath = Assembly.GetExecutingAssembly().Location.Replace("Erp.SeedWork.dll", string.Empty);
            string rdlcFilePath = string.Format("{0}\\{1}.rdlc", fileDirPath, reportName);
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            Encoding.GetEncoding("windows-1252");
            LocalReport report = new LocalReport(rdlcFilePath);

            foreach (var item in datasource)
                try
                {
                    report.AddDataSource(item.Key, item.Value);
                }
                catch (Exception e)
                {
                 
                }
               
           
            var result = report.Execute(GetRenderType(type), 1, parameters);
            return result.MainStream;
        }

        public RenderType GetRenderType(string reportType)
        {
            var renderType = RenderType.Pdf;
            switch (reportType.ToLower())
            {
                default:
                case "pdf":
                    renderType = RenderType.Pdf;
                    break;
                case "word":
                    renderType = RenderType.Word;
                    break;
                case "excel":
                    renderType = RenderType.Excel;
                    break;
            }

            return renderType;
        }
    }
}
