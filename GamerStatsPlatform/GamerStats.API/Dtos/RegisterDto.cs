using System.ComponentModel.DataAnnotations;

namespace GamerStats.API.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "Пароль должен содержать минимум 8 символов.")]
        public string Password { get; set; } = string.Empty;
    }
}
