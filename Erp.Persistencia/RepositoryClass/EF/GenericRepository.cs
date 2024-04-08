using ENTIDADES;
using Erp.Persistencia.Modelos;
using INFRAESTRUCTURA.Repository.Interfaz;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Repository
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : AuditoriaColumna
    {
        private readonly Modelo db;
        //private readonly IUser user;
        public GenericRepository(Modelo context)
        {
            db = context;
        }        
        public async Task<IEnumerable<TEntity>> GetAll()
        {
            return await db.Set<TEntity>().ToListAsync();
        }

        public async Task<TEntity> GetById(int id)
        {
            return await db.Set<TEntity>().FindAsync(id);            
        }
        public async Task<TEntity> Insert(TEntity entity)
        {
            db.Set<TEntity>().Add(entity);
            await db.SaveChangesAsync();
            return entity;
        }

        public async Task<TEntity> Update(TEntity entity)
        {
            db.Entry(entity).State = EntityState.Modified;
            await db.SaveChangesAsync();
            return entity;
        }
    }
}
