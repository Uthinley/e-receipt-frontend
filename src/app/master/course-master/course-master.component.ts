import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { GlobalService } from 'src/app/_service/global.service';

@Component({
  selector: 'app-course-master',
  templateUrl: './course-master.component.html',
  styleUrls: ['./course-master.component.css']
})
export class CourseMasterComponent implements OnInit {

  courseForm: FormGroup;
  submitted = false;
  sectorlist : [];
  courseLevel : [];
  branchList : [];
  courseList : [];
  id;
  
  @ViewChild('myModalDelete') myModal;
  private modalRef;

  display = 'none';

  // for datatable
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtTrigger1: Subject<any> = new Subject();
  isDtInitialized:boolean = false;
  isDtInitialized1:boolean = false;

  constructor(private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private modalService: ModalManager) { }

  ngOnInit(): void {
    this.courseForm = this.formBuilder.group({
      id : [],
      courseName : ['', Validators.required],
      courseId : ['', Validators.required],
      clevel : ['', Validators.required],
      sectorId: ['', Validators.required],
      // branchId : ['', Validators.required]
    })
    this.getSectorlist();
    this.getCourseLevel();
    this.getCourseList();
  }
  
  getCourseList(){
    this.globalService.getRequest('/master/getCourses')
      .subscribe(data => {
        this.courseList = data;
        this.dtTrigger.next();
      })
  }

  getSectorlist(){
    this.globalService.getRequest('/master/getDepartments')
      .subscribe(data => {
        this.sectorlist = data;
      })
  }
  saveCourse(){
    this.submitted = true;
    if(this.courseForm.invalid){
      this.toastr.warning('Please fill up the required fields.');
      return;
    }
    const formData = new FormData();
    // alert(JSON.stringify(this.courseForm.value));
    formData.append("courseMaster",JSON.stringify(this.courseForm.value));
    this.globalService.postRequest('/master/saveCourse', formData)
    .subscribe(data=>{
      if (data.status === 1) {
        this.toastr.success(data.text);
        this.courseForm.reset();
        this.submitted = false;
        this.globalService.reloadPage();
      } else {
        this.toastr.warning(data.text);
      }
    })
  }

  editByRow(object : any){
    this.courseForm.setValue({
      id : object.id,
      courseName : object.courseName,
      courseId : object.courseId,
      clevel : object.courseLevelMaster.id,
      // branchId :object.branch.id,
      sectorId: object.department.id,
      
    })
  this.getSelectedBranch(object.department.id) 

  }

  getSelectedBranch(val: string){
    this.globalService.getByParamRequest('/master/getSelectedBranches', val)
    .subscribe(data => {
      this.branchList = data;
      console.log(this.branchList);
    })
   }

  getCourseLevel(){
    this.globalService.getRequest('/master/getCourseLevel')
      .subscribe(data => {
        this.courseLevel = data;
      })
  }

  openModalDelete(object : any) {
    this.display = 'block';
    this.id = object.id;
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
  onDeleteCourse(){
    this.globalService.deleteRequest( '/master/deleteCourseById', this.id).subscribe(data => {
      this.toastr.success(data.text);
      this.getCourseList();
    });
    this.display = 'none';
    this.modalService.close(this.modalRef);
    this.id = "";
  }

}
