using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Services.Interfaces;

namespace Services
{
    public class LoanService : ILoanService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;

        public LoanService(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<List<LoanRequest>> GetByUserIdAsync(int userId, int page, int pageSize)
        {
            return await _context.LoanRequests
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }


        public async Task<List<LoanRequest>> GetPendingLoansPagedAsync(int page, int pageSize)
        {
            string cacheKey = $"pending_loans_page_{page}_size_{pageSize}";

            if (_cache.TryGetValue(cacheKey, out List<LoanRequest> cachedLoans))
            {
                return cachedLoans;
            }

            var loans = await _context.LoanRequests
                .Where(l => l.Status == "Pending")
                .Include(l => l.User)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Guarda en caché por 5 minutos
            _cache.Set(cacheKey, loans, TimeSpan.FromMinutes(5));

            return loans;
        }

        public async Task RequestLoanAsync(LoanRequest loan)
        {
            loan.Status = "Pending";
            _context.LoanRequests.Add(loan);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateStatusAsync(int loanId, string newStatus)
        {
            // Inicia una transacción manual
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var loan = await _context.LoanRequests.FindAsync(loanId);

                if (loan == null)
                    throw new Exception("Préstamo no encontrado");

                loan.Status = newStatus;

                // agregar lógica adicional crítica
               

                await _context.SaveChangesAsync();

                // Confirma todo
                await transaction.CommitAsync();
            }
            catch (Exception)
            {                
                await transaction.RollbackAsync();
                throw; 
            }
        }

    }
}
