import { InjectionToken, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';


const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
    path: 'workspaces',
    loadChildren: () => import('../../projects/workspace-app/src/app/app.module').then(m => m.WorkspaceAppModule)
  },
  {
    path: '',
    loadChildren: () => import('../../projects/core-app/src/app/app.module').then(m => m.CoreAppModule)
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
