using API.Entities;

namespace API.Interfaces
{
    //useful when testing
    public interface ITokenService
    {
        //any class that implements this interface has to support this method
        string createToken(AppUser user);
    }
}