import { Injectable } from '@angular/core';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { CanDeactivate } from '@angular/router';
import { ConfirmService } from '../_services/confirm.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard {
  constructor(private confirmService: ConfirmService) { }

  canDeactivate(component: MemberEditComponent): Observable<boolean> {
    if (component.editForm?.dirty) {
      const message = 'Are you sure to leave? any unsaved changes will be lost';
      return this.confirmService.confirm(message);
    }
    return of(true);
  }

}
