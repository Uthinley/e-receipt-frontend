import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isTokenExpired = this.authService.isTokenExpired();
        const isAuthenticated = this.authService.isLoggedIn();
        if (isAuthenticated) {
            return true;
        } else if (isTokenExpired) {
            this.router.navigateByUrl('/login');
        } else {
            this.router.navigateByUrl('/login');
        }
        return true;
    }
}
