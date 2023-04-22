using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    //implements ITokenService interface
    public class TokenService : ITokenService
    {
        //create key
        private readonly SymmetricSecurityKey _key;
        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public string createToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                //include the user id
                new Claim(JwtRegisteredClaimNames.NameId, user.ID.ToString()),
                //and username
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };
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