using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ILoanService
    {
        Task<List<LoanRequest>> GetByUserIdAsync(int userId, int page, int pageSize, string status);
        Task RequestLoanAsync(LoanRequest loan);
        Task UpdateStatusAsync(int loanId, string newStatus);
        Task<List<LoanRequest>> GetPendingLoansPagedAsync(int page, int pageSize);
    }

}
