import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'src/app/_helper/must-match';
import { AuthService } from 'src/app/_service/auth.service';
import { GlobalService } from 'src/app/_service/global.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  baseUrl = '/user';
  submitted = false;
  username: string;
  passwordForm: FormGroup;
  errorMessage = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.username.subscribe((data: string) => this.username = data);
    this.username = this.authService.getUserName();
    this.passwordForm = this.formBuilder.group({
      username: [this.username],
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmpassword')
      });
  }
  get getter() { return this.passwordForm.controls; }

  changePassword(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }
    this.globalService.postRequest(this.baseUrl + '/changePassword', this.passwordForm.value)
    .subscribe(
      data => {
        this.toastr.success('Successfully changed your password.');
      },
      (error) => {
        console.log('error caught in component');
        this.errorMessage = error.error;
        throw error;
      }
    );
  }

}


