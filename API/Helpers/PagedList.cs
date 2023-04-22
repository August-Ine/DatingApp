using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PagedList<T> : List<T> //class type is generic to accept any object we specify, extends the list class with a generic type
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();//total count of items in the query
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();//to skip pages (unless pageNumber is 1) and return list of continuous items length pageSize
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}