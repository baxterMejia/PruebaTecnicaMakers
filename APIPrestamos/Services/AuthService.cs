using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> ValidateUserAsync(string username, string password)
        {            
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Name == username && u.Password == password);

            // Aquí puedes inspeccionar el user (por ejemplo con breakpoint o log)
            return user;
        }

    }
}
