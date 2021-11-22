import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from 'src/app/home/home.component';
import { FailedComponent } from 'src/app/failed/failed.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'login-failed',
    component: FailedComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(){
    console.log("AppRoutingModule");
  }
 }
