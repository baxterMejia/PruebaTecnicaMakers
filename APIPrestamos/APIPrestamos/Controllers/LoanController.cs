using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Net;

namespace APIPrestamos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Protege todo el controlador
    public class LoanController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public LoanController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        [Authorize(Roles = "Client")]
        [HttpPost]
        public async Task<IActionResult> RequestLoan([FromBody] LoanRequest request)
        {
            try
            {
                await _loanService.RequestLoanAsync(request);
                return Ok("Préstamo solicitado correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new Dictionary<string, object>
                {
                    { "status", 500 },
                    { "error", "Error al solicitar el préstamo." },
                    { "details", ex.Message }
                });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(
              int userId,
              [FromQuery] int page = 1,
              [FromQuery] int pageSize = 10,
              [FromQuery] string? status = null)
        {
            try
            {
                var result = await _loanService.GetByUserIdAsync(userId, page, pageSize, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new Dictionary<string, object>
                {
                    { "status", 500 },
                    { "error", "Error al obtener los préstamos del usuario." },
                    { "details", ex.Message }
                });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{loanId}/status")]
        public async Task<IActionResult> UpdateStatus(int loanId, [FromBody] string newStatus)
        {
            try
            {
                await _loanService.UpdateStatusAsync(loanId, newStatus);
                return Ok("Estado actualizado.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new Dictionary<string, object>
                {
                    { "status", 500 },
                    { "error", "Error al actualizar el estado del préstamo." },
                    { "details", ex.Message }
                });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingLoans([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var loans = await _loanService.GetPendingLoansPagedAsync(page, pageSize);
                return Ok(loans);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new Dictionary<string, object>
                {
                    { "status", 500 },
                    { "error", "Error al obtener préstamos pendientes." },
                    { "details", ex.Message }
                });
            }
        }
    }
}
