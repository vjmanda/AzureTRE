import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { DREApiCoreService } from 'src/app/services/dre-api-core.service';
import {
  MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor,
  MsalInterceptorConfiguration, MsalRedirectComponent, MsalService,
  MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG
} from "@azure/msal-angular";
import { InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from "@azure/msal-browser";

import { Configuration } from '../../../../src/app/models/configuration';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { WorkspaceCreateComponent } from './workspaceCreate/workspaceCreate.component';
import { WorkspaceDeleteComponent } from './workspaceDelete/workspaceDelete.component';
import { WorkspaceSelectComponent } from './workspaceSelect/workspaceSelect.component';
import { HomeComponent } from 'src/app/home/home.component';
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
import { FailedComponent } from 'src/app/failed/failed.component';

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

const providers =   [
    {
    provide: DREApiCoreService, useClass: DREApiCoreService
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

export function MSALInstanceFactory(config: Configuration): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: config.oidc_client_id,
      authority: config.oidc_authority,
      redirectUri: config.base_uri

    },
    cache: {
      cacheLocation: 'localStorage'
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Trace,
        piiLoggingEnabled: true
      }
    }
  });
}

export function MSALInterceptorConfigFactory(config: Configuration): MsalInterceptorConfiguration {
  console.log("Core: MSALInterceptorConfigFactory");
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(config.api_uri + '/*', [config.oidc_api_scope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(config: Configuration): MsalGuardConfiguration {
  console.log("Core: MSALGuardConfigFactory");

  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [config.oidc_api_scope]
    },
    loginFailedRoute: '/login-failed'
  };
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FailedComponent,
    WorkspaceCreateComponent,
    WorkspaceDeleteComponent,
    WorkspaceSelectComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
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
    HomeComponent,
    FailedComponent,
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
  bootstrap: [AppComponent]
})
export class CoreAppModule { }
