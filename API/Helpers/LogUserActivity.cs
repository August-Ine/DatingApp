using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //get actionExecutedContext after action has completed
            var resultContext = await next();

            //check if user is authenticated
            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            //getu user's username
            var userId = resultContext.HttpContext.User.GetUserId();

            //get instance of unit of work
            var uow = resultContext.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();

            //get user
            var user = await uow.UserRepository.GetUserByIdAsync(userId);

            //set last seen
            user.LastActive = DateTime.UtcNow;
            await uow.Complete();


        }
    }
}