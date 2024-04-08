using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Erp.SeedWork
{
    public static class ConvertDatatableToList
    {
        public static List<dynamic> ConvertTo(DataTable datatable) 
        {
            //List<I> lstRecord = new List<I>();
            try
            {
                //List<string> columnsNames = new List<string>();
                //List<object> data = new List<object>();
                //foreach (DataColumn DataColumn in datatable.Columns)
                //{
                //    columnsNames.Add(DataColumn.ColumnName);

                //}

                //lstRecord = datatable.AsEnumerable().ToList().ConvertAll<I>(row => GetObject<I>(row, columnsNames));
                //return lstRecord;
                var dns = new List<dynamic>();

                foreach (var item in datatable.AsEnumerable())
                {
                    // Expando objects are IDictionary<string, object>
                    IDictionary<string, object> dn = new ExpandoObject();

                    foreach (var column in datatable.Columns.Cast<DataColumn>())
                    {
                        dn[column.ColumnName] = item[column];
                    }

                    dns.Add(dn);
                }
                return dns;
            }
            catch
            {
                return new List<dynamic>(); 
            }

        }

        //private static I GetObject<I>(DataRow row, List<string> columnsName) where I : class
        //{
        //    I obj = (I)Activator.CreateInstance(typeof(I));
        //    try
        //    {
        //        PropertyInfo[] Properties = typeof(I).GetProperties();
        //        foreach (PropertyInfo objProperty in Properties)
        //        {
        //            string columnname = columnsName.Find(name => name.ToLower() == objProperty.Name.ToLower());
        //            if (!string.IsNullOrEmpty(columnname))
        //            {
        //                object dbValue = row[columnname];
        //                if (dbValue != DBNull.Value)
        //                {
        //                    if (Nullable.GetUnderlyingType(objProperty.PropertyType) != null)
        //                    {
        //                        objProperty.SetValue(obj, Convert.ChangeType(dbValue, Type.GetType(Nullable.GetUnderlyingType(objProperty.PropertyType).ToString())), null);
        //                    }
        //                    else
        //                    {
        //                        objProperty.SetValue(obj, Convert.ChangeType(dbValue, Type.GetType(objProperty.PropertyType.ToString())), null);
        //                    }
        //                }
        //            }
        //        }
        //        return obj;
        //    }
        //    catch (Exception ex)
        //    {
        //        return obj;
        //    }
        //}
    }
}
