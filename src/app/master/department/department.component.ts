import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { GlobalService } from 'src/app/_service/global.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departmentList = [];
  baseUrl="/master";
  departmentForm : FormGroup;
  departmentUpload : FormGroup;
  submitted = false;
  errorMessage = '';
  deptId: any;
  selectedFile : File;
  fileName: string;

  @ViewChild('myModalDelete') myModal;
  private modalRef;

  display = 'none';

  // for datatable
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized:boolean = false;

  constructor(private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private modalService: ModalManager
    ) { }

  ngOnInit(): void {
    this.departmentForm = this.formBuilder.group({
      departmentName : ['', Validators.required],
      id: ['']
    })
    this.departmentUpload = this.formBuilder.group({
      file : ['', Validators.required],
    })
    this.getDepartmentList();
  }

  getDepartmentList(){
    this.globalService.getRequest(this.baseUrl +'/getDepartments')
      .subscribe(data => {
        this.departmentList = data;
        this.dtTrigger.next();
      })
  }
  editByRow(object : any){
    this.departmentForm.setValue({
      id : object.id,
      departmentName : object.departmentName
    })
  }

  uploadFileData(){
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    if(this.departmentUpload.invalid){
      this.toastr.warning('Please select a file.');
      return;
    }
    if (this.selectedFile === undefined) {
      this.toastr.warning('Please choose file.');
      return;
    }
    this.globalService.postRequest(this.baseUrl + '/uploadFile', formData)
    .subscribe(data => {
      if (data.status === 1) {
        this.toastr.success(data.text);
        this.departmentUpload.reset();
        this.submitted = false;
        this.globalService.reloadPage();
      } else {
        this.toastr.warning(data.text);
      }
    },
    (error) => {
      this.errorMessage = error.error;
      throw error;
    });
  }

  save(){
    this.submitted = true;
    if (this.departmentForm.invalid){
      this.toastr.warning('Please fill up the required fields.');
      return;
    }
    this.globalService.postRequest(this.baseUrl+'/saveDepartment', this.departmentForm.value)
    .subscribe(data=>{
      if (data.status === 1) {
        this.toastr.success(data.text);
        this.departmentForm.reset();
        this.submitted = false;
        this.globalService.reloadPage();
      } else {
        this.toastr.warning(data.text);
      }
    })
  }

  reset(){
    this.departmentForm.reset();
  }

  openModalDelete(object : any) {
    this.display = 'block';
    this.deptId = object.id;
    this.modalRef = this.modalService.open(this.myModal, {

      //modal properties
      size: "md",
      modalClass: 'myModalDelete',
      hideCloseButton: false,
      centered: true,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: true,
      backdropClass: "modal-backdrop"
  })
  }

  onCloseHandled() {
    this.display = 'none';
    this.modalService.close(this.modalRef);
  }
  onDeleteStudent(){
    this.globalService.deleteRequest(this.baseUrl + '/deleteDeptById', this.deptId).subscribe(data => {
      this.toastr.success(data.text);
      this.getDepartmentList();
    });
    this.display = 'none';
    this.modalService.close(this.modalRef);
    this.deptId = "";
  }

  onFileChange(e) {
    this.selectedFile = e.target.files[0];
    this.fileName = this.selectedFile.name;
  }

}
