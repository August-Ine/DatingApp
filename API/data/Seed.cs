using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            //check if we already have users in db
            if (await userManager.Users.AnyAsync()) return; //stop method execution

            //no users in db, read user seed data json file
            var userData = await File.ReadAllTextAsync("data/UserSeedData.json");
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            var roles = new List<AppRole> {
                new AppRole {Name = "Member"},
                new AppRole {Name = "Admin"},
                new AppRole {Name = "Moderator"}
            };

            //seed roles and users
            roles.ForEach(async role => await roleManager.CreateAsync(role));

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                await userManager.CreateAsync(user, "Pa$$w0rd"); //creates entry and saves changes
                await userManager.AddToRoleAsync(user, "Member"); // add member role
            };

            //admin appuser
            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }
    }
}