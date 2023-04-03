import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',  //dummy path for authguard
    runGuardsAndResolvers: 'always',
    canActivate: [() => inject(AuthGuard).canActivate()],
    children: [
      { path: 'members', component: MemberListComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
      { path: 'members/:id', component: MemberListComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent }
    ]
  },
  { path: 'errors', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
