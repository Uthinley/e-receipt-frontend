import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { UserSetup } from 'src/app/_model/user_setup';
import { AuthService } from 'src/app/_service/auth.service';
import { GlobalService } from 'src/app/_service/global.service';

@Component({
  selector: 'app-user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.css']
})
export class UserSetupComponent implements OnInit {

  baseUrl = '/user';
  submitted = false;
  userSetup = new UserSetup();
  userList = [];
  userGroupList = [];
  username: string;
  userSetupForm: FormGroup;

  // for datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.username.subscribe((data: string) => this.username = data);
    this.username = this.authService.getUserName();
    this.getUserList();
    this.getGroupList();
    this.userSetupForm = this.formBuilder.group({
      id: [],
      username: ['', Validators.required],
      // email: ['', Validators.email],
      // phoneNumber: ['', Validators.required],
      password: [],
      // cid: ['', Validators.required],
      status: [],
      userType: ['']
    });
  }

  saveUser(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.userSetupForm.invalid) {
      return;
    }
    this.globalService.postRequest(this.baseUrl + '/save', this.userSetupForm.value)
      .subscribe(data => {
        if (data.status === 1) {
          this.toastr.success(data.text);
          this.userSetupForm.reset();
          this.submitted = false;
          this.globalService.reloadPage();
        } else {
          this.toastr.warning(data.text);
        }
      });
  }

  getGroupList() {
    this.globalService.getRequest(this.baseUrl + '/getGroupList')
      .subscribe(data => {
        this.userGroupList = data;
      });
  }

  getUserList() {
    this.globalService.getRequest(this.baseUrl + '/getUserList')
      .subscribe(data => {
        this.userList = data;
        this.dtTrigger.next();
      });
  }

  editByRow(user: any){
    this.userSetupForm.setValue({
      id: user.id,
      username: user.username,
      // email: user.email,
      // phoneNumber: user.phoneNumber,
      status: user.status,
      // cid: user.cid,
      password: null,
      userType: user.userType
    });
  }
  deleteByRow(id: number){
    this.globalService.deleteRequest(this.baseUrl + '/deleteById', id).subscribe(data => {
      this.toastr.success(data.text);
      this.getUserList();
    });
  }


}
