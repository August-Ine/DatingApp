namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IMessageRepository MessageRepository {get;}
        ILikesRepository LikesRepository {get;}
        Task<bool> Complete(); // save changes
        bool HasChanges(); // is ef tracking any changes
    }
}