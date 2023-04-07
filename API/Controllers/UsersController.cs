using System.Security.Claims;
using API.data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.Execution;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await _userRepository.GetMembersAsync());
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            //get username from token
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //fetch user from repository
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            //user is found, update properties
            _mapper.Map(memberUpdateDto, user);

            //save changes
            if (await _userRepository.SaveAllAsync()) return NoContent(); //status 204

            //no changes made
            return BadRequest("Failed to update user");
        }
    }
}