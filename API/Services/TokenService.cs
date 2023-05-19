using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    //implements ITokenService interface
    public class TokenService : ITokenService
    {
        //create key
        private readonly SymmetricSecurityKey _key;
        private readonly UserManager<AppUser> _userManager;
        public TokenService(IConfiguration config, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public async Task<string> createToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                //include the user id
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                //and username
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            //get user's role
            var roles = await _userManager.GetRolesAsync(user);

            //add role to claims list
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));


            //signing credentials
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            //descriptor
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };
            //create token handler
            var tokenHandler = new JwtSecurityTokenHandler();
            //create token
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}