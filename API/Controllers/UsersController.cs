using System.IO.Pipes;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _uow;

        public UsersController(IUnitOfWork uow, IMapper mapper, IPhotoService photoService)
        {
            _uow = uow;
            _photoService = photoService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var gender = await _uow.UserRepository.GetUserGender(User.GetUsername());

            //set current user's username in userParams
            userParams.CurrentUsername = User.GetUsername();

            //if no gender is specified in userParams, default is opposite of logged in user
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = gender == "male" ? "female" : "male";
            }
            var users = await _uow.UserRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _uow.UserRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            //get username from token using extension method
            var username = User.GetUsername();

            //fetch user from repository
            var user = await _uow.UserRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            //user is found, update properties
            _mapper.Map(memberUpdateDto, user);

            //save changes
            if (await _uow.Complete()) return NoContent(); //status 204

            //no changes made
            return BadRequest("Failed to update user");
        }

        //photo upload
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            //get user from repository using token's username
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            //user found, upload using photoService
            var result = await _photoService.AddPhotoAsync(file);

            //check result if there is an error
            if (result.Error != null) return BadRequest(result.Error.Message);

            //no error, create photo entity
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            //check if it is user's first photo, if it is, set to main
            if (user.Photos.Count == 0) photo.IsMain = true;

            //add photo to user entity photos collection
            user.Photos.Add(photo);

            //save
            if (await _uow.Complete())
            {
                //return status201 created response with the location headers
                return CreatedAtAction(nameof(GetUser),
                new { username = user.UserName },
                _mapper.Map<PhotoDto>(photo));
            };

            //problem saving to db
            return BadRequest("Problem adding photo");
        }

        //set main photo
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            //fetch user from repository using token's username
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            //we have user, get photo matching photoId
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();

            //we have photo, check if it is main
            if (photo.IsMain) return BadRequest("This is already your main photo");

            //get the current main photo
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            //if there is a main photo, set isMain to false
            if (currentMain != null) currentMain.IsMain = false;

            //set the new photo to main
            photo.IsMain = true;

            //save changes to db
            if (await _uow.Complete()) return NoContent();

            //failed to save, bad request
            return BadRequest("Problem setting the main photo");
        }

        //delete photo
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            //get photo matching photoId
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound(); //no photo matching photoId

            //check if photo is main
            if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                //photo has public id, also delete on cloudinary
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                //check if error occurred
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            //remove from db
            user.Photos.Remove(photo);

            //save changes
            if (await _uow.Complete()) return Ok();

            //changes not saved
            return BadRequest("Problem deleting photo");
        }
    }
}