using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace ENTIDADES.facturacionHorizont.Utils
{
    public static class Writetxt
    {
        public static string creartxtAsync(string path, string valor, string nombre)
        {
            try
            {
                //var folder = path + "/horizonte/txt";
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                string filePath = Path.Combine(path, nombre);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
                var bytes = Encoding.UTF8.GetBytes(valor);
                FileStream stream = new FileStream(filePath, FileMode.CreateNew);
                BinaryWriter writer = new BinaryWriter(stream);
                writer.Write(bytes, 0, bytes.Length);
                writer.Close();
                return "ok";
            }catch (Exception e)
            {
                var x = e.Message;
                return e.Message;
            }

        }
    }
}
