using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;


namespace Erp.SeedWork
{
    public class GenerarPDF
    {
        public HtmlToPdfDocument GenererarPDFVerticalA4(string url, IRequestCookieCollection _cookies, string titulo, string orientacion)
        {
            IRequestCookieCollection cookies = _cookies;
            var cookiesDic = new Dictionary<string, string>();
            foreach (var cookie in cookies)
            {
                cookiesDic.Add(cookie.Key, cookies[cookie.Key]);
            }
            var globalsettigns = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = (orientacion == "vertical" ? Orientation.Portrait : Orientation.Landscape),
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10, Left = 5, Right = 5 },
                DocumentTitle = titulo
                //Out= @"G:\Proyectos\reporte1.pdf"
            };
            var objectsettings = new ObjectSettings()
            {
                PagesCount = true,
                //HtmlContent="<p>hola</p>",
                Page = url,
                //HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Pagina [page] de [toPage]", Line = true ,Left="Farmacia Magistral QF"},
                //FooterSettings = { FontName = "Arial", FontSize = 9, Right=DateTime.Now.ToString(), Line = true },
                FooterSettings = { FontSize = 6, Right = "Página [page] de [toPage]" },
                LoadSettings = new LoadSettings
                {
                    Cookies = cookiesDic
                },
            };
            var document = new HtmlToPdfDocument
            {
                GlobalSettings = globalsettigns,
                Objects = { objectsettings }
            };

            return document;
        }
        public HtmlToPdfDocument GenererarPDFHorizontalA4(string url, IRequestCookieCollection _cookies, string titulo, string orientacion)
        {
            IRequestCookieCollection cookies = _cookies;
            var cookiesDic = new Dictionary<string, string>();
            foreach (var cookie in cookies)
            {
                cookiesDic.Add(cookie.Key, cookies[cookie.Key]);
            }
            var globalsettigns = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = (orientacion == "horizontal" ? Orientation.Landscape : Orientation.Portrait),
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10, Left = 5, Right = 5 },
                DocumentTitle = titulo
                //Out= @"G:\Proyectos\reporte1.pdf"
            };
            var objectsettings = new ObjectSettings
            {
                PagesCount = true,
                //HtmlContent="<p>hola</p>",
                Page = url,
                //HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Pagina [page] de [toPage]", Line = true ,Left="Farmacia Magistral QF"},
                //FooterSettings = { FontName = "Arial", FontSize = 9, Right=DateTime.Now.ToString(), Line = true },
                LoadSettings = new LoadSettings
                {
                    Cookies = cookiesDic
                }
            };
            var document = new HtmlToPdfDocument
            {
                GlobalSettings = globalsettigns,
                Objects = { objectsettings }
            };

            return document;
        }
        public HtmlToPdfDocument GenererarPDFHorizontalTicket(string url, IRequestCookieCollection _cookies, string titulo)
        {
            IRequestCookieCollection cookies = _cookies;
            var cookiesDic = new Dictionary<string, string>();
            foreach (var cookie in cookies)
            {
                cookiesDic.Add(cookie.Key, cookies[cookie.Key]);
            }
            var globalsettigns = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Landscape,
                PaperSize = PaperKind.ItalyEnvelope,
                Margins = new MarginSettings { Top = 10, Left = 20, Right = 5 },
                DocumentTitle = titulo,
                //Out= @"G:\Proyectos\reporte1.pdf"
            };
            var objectsettings = new ObjectSettings
            {
                PagesCount = true,
                //HtmlContent="<p>hola</p>",
                Page = url,

                //HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Pagina [page] de [toPage]", Line = true },
                //FooterSettings = { FontName = "Arial", FontSize = 9, Right = DateTime.Now.ToString(), Line = true },
                LoadSettings = new LoadSettings
                {
                    Cookies = cookiesDic
                }
            };
            var document = new HtmlToPdfDocument
            {
                GlobalSettings = globalsettigns,
                Objects = { objectsettings }
            };

            return document;
        }
        public HtmlToPdfDocument GenererarPDFVerticalTicket(string url, IRequestCookieCollection _cookies, string titulo)
        {
            IRequestCookieCollection cookies = _cookies;
            var cookiesDic = new Dictionary<string, string>();
            foreach (var cookie in cookies)
            {
                cookiesDic.Add(cookie.Key, cookies[cookie.Key]);
            }
            var globalsettigns = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.ItalyEnvelope,
                Margins = new MarginSettings { Top = 10, Left = 20, Right = 5 },
                DocumentTitle = titulo,
                //Out= @"G:\Proyectos\reporte1.pdf"
            };
            var objectsettings = new ObjectSettings
            {
                PagesCount = true,
                //HtmlContent="<p>hola</p>",
                Page = url,

                //HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Pagina [page] de [toPage]", Line = true },
                //FooterSettings = { FontName = "Arial", FontSize = 9, Right = DateTime.Now.ToString(), Line = true },
                LoadSettings = new LoadSettings
                {
                    Cookies = cookiesDic
                }
            };
            var document = new HtmlToPdfDocument
            {
                GlobalSettings = globalsettigns,
                Objects = { objectsettings }
            };

            return document;
        }
        public HtmlToPdfDocument GuardarPDFVerticalA4(string url, IRequestCookieCollection _cookies, string path, string nombrepdf)
        {
            path = Directorio.CrearDirectorio(path);
            if (path is "x")
                return null;
            IRequestCookieCollection cookies = _cookies;
            var cookiesDic = new Dictionary<string, string>();
            foreach (var cookie in cookies)
            {
                cookiesDic.Add(cookie.Key, cookies[cookie.Key]);
            }
            var globalsettigns = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10, Left = 5, Right = 5 },
                DocumentTitle = "REPORTE PDF",
                Out = path + "/" + nombrepdf
            };
            var objectsettings = new ObjectSettings
            {
                PagesCount = true,
                //HtmlContent="<p>hola</p>",
                Page = url,
                HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Pagina [page] de [toPage]", Line = true },
                FooterSettings = { FontName = "Arial", FontSize = 9, Line = true },
                LoadSettings = new LoadSettings
                {
                    Cookies = cookiesDic
                }
            };
            var document = new HtmlToPdfDocument
            {
                GlobalSettings = globalsettigns,
                Objects = { objectsettings }
            };

            return document;
        }

    }
}
