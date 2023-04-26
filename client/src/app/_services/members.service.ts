import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../_models/member';
import { environment } from 'src/environments/environment';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl: string = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams | undefined;
  user: User | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {
    //initialise user parameters from user object
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    });
  };

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    };
    return;
  }

  getMembers(userParams: UserParams) {
    //query cached?
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);


    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    )
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()] //unpack memberCache's values to an array
      .reduce((arr, elem) => arr.concat(elem.result), []) //reduce the array of values to the members in the result array
      .find((member: Member) => member.userName === username); //find user in the array whose username matches the passed in username

    if (member) return of(member);//we have the cached member return an observable of it, fetch from api otherwise

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(_ => {
        const index = this.members.indexOf(member); //get index of member in the array
        this.members[index] = { ...this.members[index], ...member }; //update member details in the array
      }));
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  };

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    //include predicate
    params = params.append('predicate', predicate);

    //return paginated result
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'likes', params);
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination)
          paginatedResult.pagination = JSON.parse(pagination);
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    //page and items pp specified
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }
}
