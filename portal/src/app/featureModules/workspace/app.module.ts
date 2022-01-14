import { HttpClientModule, HttpParams, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import {
  MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor,
  MsalInterceptorConfiguration, MsalRedirectComponent, MsalService,
  MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG
} from "@azure/msal-angular";
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { Configuration } from 'src/app/models/configuration';
import { TREWorkspaceApiService } from './services/tre-workspace-api.service';
import { UserResourceCreateComponent } from './userResourceCreate/userResourceCreate.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceServiceComponent } from './workspaceService/workspaceService.component';
import { WorkspaceServiceCreateComponent } from './workspaceServiceCreate/workspaceServiceCreate.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { ResourceCreateComponent } from 'src/app/resourceCreate/resourceCreate.component';

const providers = [{
  provide: TREWorkspaceApiService, useClass: TREWorkspaceApiService
},
{
  provide: MAT_DIALOG_DEFAULT_OPTIONS,
  useValue: {
    hasBackdrop: true,
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  }
},
{
  provide: HTTP_INTERCEPTORS,
  useClass: MsalInterceptor,
  multi: true
},
{
  provide: MSAL_INSTANCE,
  useFactory: MSALInstanceFactory,
  deps: [Configuration]
},
{
  provide: MSAL_GUARD_CONFIG,
  useFactory: MSALGuardConfigFactory,
  deps: [Configuration]
},
{
  provide: MSAL_INTERCEPTOR_CONFIG,
  useFactory: MSALInterceptorConfigFactory,
  deps: [Configuration]
},
MsalGuard,
MsalBroadcastService,
MsalService]
const AUTH_CONFIG_URL_TOKEN = new InjectionToken<string>('AUTH_CONFIG_URL');


function getParamValueQueryString(paramName ) {
  const url = window.location.href;
  let paramValue;
  if (url.includes('?')) {
    const httpParams = new HttpParams({ fromString: url.split('?')[1] });
    paramValue = httpParams.get(paramName);
  }
  return paramValue;
}

export function MSALInstanceFactory(config: Configuration): IPublicClientApplication {
  const app_id = getParamValueQueryString('app_id');
  console.log('MSALInstanceFactory: ' + app_id);
  return new PublicClientApplication({
    auth: {
      clientId: config.oidc_client_id,
      authority: config.oidc_authority,
      redirectUri: config.base_uri
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  });
}

export function MSALInterceptorConfigFactory(config: Configuration): MsalInterceptorConfiguration {
  const app_id = getParamValueQueryString('app_id');
  console.log('MSALInterceptorConfigFactory: ' + app_id);
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(config.api_uri + '/workspaces/*', ['api://' + app_id + '/user_impersonation']);
  protectedResourceMap.set(config.api_uri + '/*', config.oidc_api_scope.split(' '));

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(config: Configuration): MsalGuardConfiguration {

  const app_id = getParamValueQueryString('app_id');
  console.log('MSALGuardConfigFactory: ' + app_id);
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ["api://" + app_id + "/user_impersonation",  config.oidc_api_scope]
    },
    loginFailedRoute: './login-failed'
  };
}

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    WorkspaceServiceComponent,
    WorkspaceServiceCreateComponent,
    UserResourceCreateComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatChipsModule,
    CommonModule,
    NgxSpinnerModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule
  ],
  exports: [
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatChipsModule,
    CommonModule,
    NgxSpinnerModule
  ],
  providers: providers,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class WorkspaceAppModule { }
