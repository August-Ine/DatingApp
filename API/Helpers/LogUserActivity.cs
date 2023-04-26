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

            //get instance of UserRepository cs
            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();

            //get user
            var user = await repo.GetUserByIdAsync(userId);

            //set last seen
            user.LastActive = DateTime.UtcNow;
            await repo.SaveAllAsync();


        }
    }
}