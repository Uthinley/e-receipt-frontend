import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { UserGroup } from 'src/app/_model/user_group';
import { AuthService } from 'src/app/_service/auth.service';
import { GlobalService } from 'src/app/_service/global.service';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit {
  baseUrl = '/userGroup';
  submitted = false;
  userGroupList = [];
  username: string;
  userGroupForm: FormGroup;
  usergroup = new UserGroup();

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
    this.userGroupForm = this.formBuilder.group({
      id: [],
      groupName: ['', Validators.required],
      status: ['', Validators.required]
    });
    this.getUserGroupList();
  }
    // convenience getter for easy access to form fields
    get getter() { return this.userGroupForm.controls; }

    /**
   * Save user group
   */
  saveUserGroup() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userGroupForm.invalid) {
      return;
    }
    this.globalService.postRequest(this.baseUrl + '/save', this.userGroupForm.value)
      .subscribe(data => {
        if (data.status === 1) {
          this.toastr.success(data.text);
          this.userGroupForm.reset();
          this.submitted = false;
          this.globalService.reloadPage();
        } else {
          this.toastr.warning(data.text);
        }
      });
  }
  getUserGroupList() {
    this.globalService.getRequest(this.baseUrl + '/findAll')
      .subscribe(data => {
        this.userGroupList = data;
        this.dtTrigger.next();
      });
  }
  /**
   * for databinding into the form
   * @param object any
   */
   editByRow(object: any){
    this.userGroupForm.setValue({
      id: object.id,
      groupName: object.groupName,
      status: object.status
    });
  }
    /**
   * delete by id of group name
   * @param index number
   */
     deleteByRow(index: number){
      this.globalService.deleteRequest(this.baseUrl + '/deleteById', index).subscribe(data => {
        this.toastr.success(data.text);
        this.getUserGroupList();
      });
    }

}
