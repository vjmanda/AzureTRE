import { InjectionToken, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found.component';
import { WorkspaceCreateComponent } from './workspaceCreate/workspaceCreate.component';
const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'home', redirectTo: ''
  },
  {
    path: 'create-workspace',
    canActivate: [MsalGuard],
    component: WorkspaceCreateComponent

  },
  {
    path: 'externalRedirect',
    canActivate: [externalUrlProvider],
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        const externalUrl = route.paramMap.get('externalUrl');
        console.log('in the externalUrlProvider, externalUrl is: ', externalUrl);
        window.open(externalUrl, '_self');
      }
    }
  ]
})
export class AppRoutingModule { }
