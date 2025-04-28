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
        private readonly HashSet<string> _cacheKeys = new();
        private const string CacheKeysMasterKey = "AllCacheKeys";


        public LoanService(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<List<LoanRequest>> GetByUserIdAsync(int userId, int page, int pageSize, string? status = null)
        {
            string cacheKey = $"user_{userId}_page_{page}_size_{pageSize}_status_{status ?? "all"}";

            if (_cache.TryGetValue(cacheKey, out List<LoanRequest> cachedLoans))
            {
                return cachedLoans;
            }

            var query = _context.LoanRequests
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.Id)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(l => l.Status == status);
            }

            var loans = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            _cache.Set(cacheKey, loans, TimeSpan.FromMinutes(5));
            AddCacheKey(cacheKey);

            return loans;
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
            AddCacheKey(cacheKey);

            return loans;
        }

        public async Task RequestLoanAsync(LoanRequest loan)
        {
            loan.Status = "Pending";
            _context.LoanRequests.Add(loan);
            await _context.SaveChangesAsync();
            ClearLoanCache();
        }

        public async Task UpdateStatusAsync(int loanId, string newStatus)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var loan = await _context.LoanRequests.FindAsync(loanId);

                if (loan == null)
                    throw new Exception("Préstamo no encontrado");

                loan.Status = newStatus;

                await _context.SaveChangesAsync();              
             

                await transaction.CommitAsync();
                ClearLoanCache();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }       

        private void ClearLoanCache()
        {
            var allKeys = GetAllCacheKeys();

            foreach (var key in allKeys)
            {
                _cache.Remove(key);
            }
            
            _cache.Remove(CacheKeysMasterKey);
        }



        private void AddCacheKey(string key)
        {
            var keys = _cache.GetOrCreate(CacheKeysMasterKey, entry => new HashSet<string>());
            keys.Add(key);
            _cache.Set(CacheKeysMasterKey, keys);
        }

        private HashSet<string> GetAllCacheKeys()
        {
            return _cache.Get<HashSet<string>>(CacheKeysMasterKey) ?? new HashSet<string>();
        }

        private void RemoveCacheKey(string key)
        {
            var keys = GetAllCacheKeys();
            keys.Remove(key);
            _cache.Set(CacheKeysMasterKey, keys);
        }
    }
}
