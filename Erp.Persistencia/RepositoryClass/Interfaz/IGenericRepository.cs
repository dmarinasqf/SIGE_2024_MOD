using ENTIDADES;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Repository.Interfaz
{
    public interface IGenericRepository<TEntity> where TEntity : AuditoriaColumna
    {
        Task<IEnumerable<TEntity>> GetAll();
        Task<TEntity> GetById(int id);
        Task<TEntity> Insert(TEntity entity);
        Task<TEntity> Update(TEntity entity);
        //Task Delete(int id);
    }
}
