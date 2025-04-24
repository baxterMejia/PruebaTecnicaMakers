using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class LoanRequestDTO
    {
        public decimal Amount { get; set; }
        public int TermMonths { get; set; }
        public int UserId { get; set; }
    }
}
