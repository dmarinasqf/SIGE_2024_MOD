using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Erp.SeedWork
{
    public static  class Directorio
    {
        public static string CrearDirectorio(string path)
        {
            try
            {
                if (Directory.Exists(path))
                {
                    return path;
                }
                DirectoryInfo di = Directory.CreateDirectory(path);
                return path;
                //di.Delete();                    
            }
            catch (Exception)
            {
                return "x";
            }
        }
    }
}
