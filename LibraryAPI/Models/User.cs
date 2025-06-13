using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public required byte[] PasswordHash { get; set; }

        [Required]
        public required byte[] PasswordSalt { get; set; }
    }
}
