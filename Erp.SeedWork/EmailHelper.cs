using System;
using System.Collections.Generic;
using System.Text;

namespace Erp.SeedWork
{
    public class EmailHelper
    {
        public EmailHelper() => rutasarchivosenviar = new List<string>();
        public string respuesta { get; set; }
        public List<string> emailsreceptores { get; set; }
        public List<string> rutasarchivosenviar { get; set; }
        public string user { get; set; }
        public string email { get; set; }
        public string pass { get; set; }
        public string port { get; set; }
        public string host { get; set; }
    }
}
