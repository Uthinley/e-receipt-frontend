import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../_service/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const roles = this.authService.getUserRole();
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < roles.length; index++) {
        const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
        const adminRole = '1';
        if (role === adminRole){
          return true;
        }
      }
      return false;
  }
}
