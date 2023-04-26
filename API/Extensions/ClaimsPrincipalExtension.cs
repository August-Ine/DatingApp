using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtension
    {
        //extension methods to conveniently obtain user's username or id from their token
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }
        public static int GetUserId(this ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}