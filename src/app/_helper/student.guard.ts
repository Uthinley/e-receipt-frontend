import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {
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
        // const backOfficeRole = '2';
        const studentRole = '3';
        if (role === adminRole || role === studentRole){
          return true;
        }
      }
      return false;
  }
}
