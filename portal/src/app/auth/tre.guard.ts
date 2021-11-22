import { Inject, Injectable } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { InteractionType } from '@azure/msal-browser';

@Injectable()
export class TreGuard extends MsalGuard implements CanActivate {
  constructor(actRoute: ActivatedRoute, @Inject(MSAL_GUARD_CONFIG) msalGuardConfig: MsalGuardConfiguration, msalBroadcastService: MsalBroadcastService, authService: MsalService, location: Location, router: Router) {
    super(msalGuardConfig, msalBroadcastService, authService, location, router);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    console.log("TreGuard:" + route);
    return super.canActivate(route, state);
  }

}
