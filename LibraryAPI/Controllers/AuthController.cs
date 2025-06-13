using Microsoft.AspNetCore.Mvc;
using LibraryAPI.Services;
using LibraryAPI.Models;
using LibraryAPI.Data;
using LibraryAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;


namespace LibraryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly TokenService _tokenService;

        public AuthController(LibraryContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(RegisterDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest("Username is already taken.");

            using var hmac = new HMACSHA512();

            var user = new User
            {
                Username = request.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            string token = _tokenService.CreateToken(user);

            return Ok(token);
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
                return Unauthorized("Invalid username.");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                    return Unauthorized("Invalid password.");
            }

            string token = _tokenService.CreateToken(user);

            return Ok(token);
        }

    }
}
