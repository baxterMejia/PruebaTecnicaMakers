using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    public class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            if (context.Database.EnsureCreated()) // Crea la DB si no existe
            {
                if (!context.Users.Any())
                {
                    context.Users.AddRange(
                        new User { Name = "admin", Password = "admin123", Role = "Admin" },
                        new User { Name = "cliente", Password = "cliente123", Role = "Client" }
                    );

                    context.SaveChanges();
                }
            }
        }

    }
}
