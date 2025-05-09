﻿using Microsoft.AspNetCore.Identity.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    // Models/User.cs
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; 
        public string Role { get; set; } = "Client"; 
        public ICollection<LoanRequest> LoanRequests { get; set; }
    }

}
