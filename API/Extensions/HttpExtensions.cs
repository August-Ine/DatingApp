using System.Text.Json;
using API.Helpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
        {
            //set json options to serialize header object to camelCase json 
            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            //add 'Pagination' header to response
            response.Headers.Add("Pagination", JsonSerializer.Serialize(header, jsonOptions));
            //explicitly allow CORs policy
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}