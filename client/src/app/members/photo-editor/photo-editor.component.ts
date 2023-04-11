import { Component, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;

  constructor(private accountService: AccountService, private memberService: MembersService) {
    //populate user variable
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    })
  }

  ngOnInit(): void {
    this.initializeUploader(); //initialize uploader
  }

  //drop zone functionality
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  };

  //initialize file uploader
  initializeUploader() {
    //set up uploader with configurations
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo', //url to send image to 
      authToken: 'Bearer ' + this.user?.token, //since uploader sends http outside out auth ng interceptor
      isHTML5: true,
      allowedFileType: ['image'], //allow all image types
      removeAfterUpload: true,
      autoUpload: false, //upload only when upload button is clicked
      maxFileSize: 10 * 1024 * 1024 //comply with cloudinary's max 10mb file size
    });

    //configure events
    this.uploader.onAfterAddingFile = (file) => {
      //to keep using current cors config
      file.withCredentials = false;
    };

    //upon succesful file upload
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        //we have response, parse it
        const photo = JSON.parse(response);
        //push photo from api to display it in current list
        this.member?.photos.push(photo);
      };
    }
  };

  setMainPhoto(photo: Photo) {
    //set main photo in the api
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          //we have both user and member, update user photoUrl
          this.user.photoUrl = photo.url;
          //update currentUser$ components
          this.accountService.setCurrentUser(this.user);
          //to update main image in member detail page
          this.member.photoUrl = photo.url;
          //update member photos array
          this.member.photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id == photo.id) p.isMain = true;
          })
        }
      }
    })
  };

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: _ => {
        if (this.member) {
          //remove photo matching photo id from member photo array
          this.member.photos = this.member.photos.filter(p => p.id != photoId);
        };
      }
    })
  }

}
