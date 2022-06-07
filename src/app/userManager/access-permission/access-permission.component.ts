import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { GlobalService } from 'src/app/_service/global.service';

@Component({
  selector: 'app-access-permission',
  templateUrl: './access-permission.component.html',
  styleUrls: ['./access-permission.component.css']
})
export class AccessPermissionComponent implements OnInit {

  baseUrl = '/permission';
  submitted = false;
  username: string;
  permissionForm: FormGroup;
  userGroupList = [];
  userGroupPermissionList = [];
  screenList = [];

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
    this.getUserGroupList();
    this.getScreenList();
    this.permissionForm = this.formBuilder.group({
      id: [],
      groupId: [''],
      screenId: [],
      isView: [''],
      isSave: [''],
      isEdit: [''],
      isDelete: ['']
    });
  }
  get getter() { return this.permissionForm.controls; }

  save(){
    this.submitted = true;
    if (this.permissionForm.invalid) {
      return;
    }
    this.globalService.postRequest(this.baseUrl + '/save', this.permissionForm.value)
      .subscribe(data => {
        if (data.status === 1) {
          this.toastr.success(data.text);
          this.permissionForm.reset();
          this.submitted = false;
          this.globalService.reloadPage();
        } else {
          this.toastr.warning(data.text);
        }
      });
  }

  getUserGroupList() {
    this.globalService.getRequest(this.baseUrl + '/findAllGroups')
      .subscribe(data => {
        this.userGroupList = data;
      });
  }

  getScreenList() {
    this.globalService.getRequest(this.baseUrl + '/findAllScreens')
      .subscribe(data => {
        this.screenList = data;
      });
  }

  findAllByUserGroupId(id: number){
    this.globalService.getByParamRequest(this.baseUrl + '/getPermission', id).subscribe(data => {
      this.userGroupPermissionList = data;
      this.rerender();
    });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
   }

}
