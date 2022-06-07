import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { GlobalService } from 'src/app/_service/global.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  BranchForm : FormGroup;
  sectorlist : [];
  branchList : [];
  submitted = false;
  departmentId;
  branchId;

  @ViewChild('myModalDelete') myModal;
  private modalRef;

  display = 'none';

   // for datatable
   @ViewChildren(DataTableDirective)
   dtElements: QueryList<DataTableDirective>;
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   isDtInitialized:boolean = false;

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private modalService: ModalManager
  ) { }

  ngOnInit(): void {
    this.BranchForm = this.formBuilder.group({
      branchName : ['',Validators.required],
      departmentId : ['', Validators.required],
      id : ['']
    })
    this.getSectorlist();
    this.getBranchList();
  }

  getSectorlist(){
    this.globalService.getRequest('/master/getDepartments')
      .subscribe(data => {
        this.sectorlist = data;
      })
  }

  getBranchList(){
    this.globalService.getRequest('/master/getBranches')
      .subscribe(data => {
        this.branchList = data;
        this.dtTrigger.next();
      })
  }

  editByRow(object : any){
    this.BranchForm.setValue({
      id : object.id,
      branchName : object.branchName,
      departmentId : object.department.id
    })
  }

  saveBranch(){
    this.submitted = true;
    if (this.BranchForm.invalid){
      this.toastr.warning('Please fill up the required fields.');
      return;
    }
    const formData = new FormData();
    formData.append("branch",JSON.stringify(this.BranchForm.value));
    // formData.append("deptId",JSON.stringify(this.departmentId))
    this.globalService.postRequest('/master/saveBranch', formData)
    .subscribe(data=>{
      if (data.status === 1) {
        this.toastr.success(data.text);
        this.BranchForm.reset();
        this.submitted = false;
        this.globalService.reloadPage();
      } else {
        this.toastr.warning(data.text);
      }
    })
  }

  onDeleteBranch(){
    this.globalService.deleteRequest( '/master/deleteBranchById', this.branchId).subscribe(data => {
      this.toastr.success(data.text);
      this.getBranchList();
    });
    this.display = 'none';
    this.modalService.close(this.modalRef);
    this.branchId = "";
  }

  openModalDelete(object : any) {
    this.display = 'block';
    this.branchId = object.id;
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

}
