import { Injectable } from '@angular/core';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { CanDeactivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard {

  canDeactivate(component: MemberEditComponent): boolean {
    if (component.editForm?.dirty) {
      return confirm('Are you sure to leave? any unsaved changes will be lost');
    }
    return true;
  }

}
