namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateOnly dob)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var age = today.Year - dob.Year;
            //check if birthday has passed and subtract an year if it has not
            if (dob > today.AddYears(-age)) age--;

            return age;
        }
    }
}