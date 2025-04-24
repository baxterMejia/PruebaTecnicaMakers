using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services;
using Domain.DTOs;
using System.Net;

namespace APIPrestamos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly JwtTokenService _jwt;

        public AuthController(IAuthService authService, JwtTokenService jwt)
        {
            _authService = authService;
            _jwt = jwt;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO login)
        {
            try
            {
                var user = await _authService.ValidateUserAsync(login.Username, login.Password);

                if (user == null)
                    return Unauthorized(new { error = "Credenciales inválidas." });

                var token = _jwt.GenerateToken(user);

                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.Id,
                        user.Name,
                        user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                var errorResponse = new Dictionary<string, object>
                {
                    { "status", (int)HttpStatusCode.InternalServerError },
                    { "error", "Error inesperado al procesar la solicitud." },
                    { "details", ex.Message }
                };

                return StatusCode((int)HttpStatusCode.InternalServerError, errorResponse);
            }
        }
    }
}
