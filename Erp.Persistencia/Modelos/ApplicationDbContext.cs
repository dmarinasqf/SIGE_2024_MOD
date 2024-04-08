using System;
using System.Collections.Generic;
using System.Text;
using ENTIDADES.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Erp.Persistencia.Modelos
{
    public class ApplicationDbContext : IdentityDbContext<AppUser, AppRol, string>
    {
        public DbSet<AppUser> APPUSER { get; set; }
        public DbSet<AppRol> APPROL { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
