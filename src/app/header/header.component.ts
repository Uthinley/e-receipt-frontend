import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_service/auth.service';
import { GlobalService } from '../_service/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  username: string;
  isFirstLoginValue: any;
  isPasswordExpiredValue: any;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.authService.username.subscribe((data: string) => this.username = data);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUserName();
    // this.isPasswordExpiredValue = this.isPasswordExpired(this.username);
    // this.isFirstLoginValue = this.isFirstLogin(this.username);
  }
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login');
  }
  isFirstLogin(userCode: string){
    this.globalService.getByParamRequest('/isFirstLogin', this.username).subscribe(
      data => {
        this.isFirstLoginValue = data;
        if (this.isFirstLoginValue === true) {
          this.router.navigateByUrl('change-password');
        }
      }
    );
  }
  isPasswordExpired(userCode: string){
    this.globalService.getByParamRequest('/user/passExpiry', this.username).subscribe(
      data => {
        this.isPasswordExpiredValue = data;
        if (this.isPasswordExpiredValue === true) {
          this.toastr.warning('Your Password has expired. ');
          this.authService.logout();
        }
      }
    );
  }
  toggle(): void {
    const portalBody = $('#portalBody');
    if ( portalBody.hasClass( 'sidebar-collapse' )) {
      portalBody.removeClass('sidebar-collapse');
      portalBody.addClass('sidebar-open'); }
    else {
      portalBody.addClass('sidebar-collapse');

    }
  }

}
