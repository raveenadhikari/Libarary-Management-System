using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]              
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Author { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
