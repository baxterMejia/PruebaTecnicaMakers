using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataAccess.Models
{   
    public class LoanRequest
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int TermMonths { get; set; }
        public string Status { get; set; } 
        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }
    }
}
