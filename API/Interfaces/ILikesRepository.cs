using API.data;
using API.Entities;
using API.Helpers;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
    }
}