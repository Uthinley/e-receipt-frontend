import { DatePipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { GlobalService } from '../_service/global.service';

@Component({
  selector: 'app-trainer-manager',
  templateUrl: './trainer-manager.component.html',
  styleUrls: ['./trainer-manager.component.css']
})
export class TrainerManagerComponent implements OnInit {

  departmentList= [];
  branchList = [];
  dspCentreList = [];
  trainingProgrammeList = [];
  trainerList = [];
  trainerForm: FormGroup;
  submitted = false;
  baseUrl = '/master';
  trainerUrl = "/trainer";
  selected;
  pipe: any;
  display = 'none'
  trainerId : any;

  // for datatable
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtTrigger1: Subject<any> = new Subject();
  isDtInitialized:boolean = false;
  isDtInitialized1:boolean = false;

  @ViewChild('myModalDelete') myModal;
  private modalRef;
  
  constructor(private globalService: GlobalService,
    private modalService: ModalManager,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,) { }

  ngOnInit(): void {
    this.trainerForm = this.formBuilder.group({
      id : [''],
      trainerId: ['', Validators.required],
      trainerName: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      sex: ['', Validators.required],
      designation: ['', Validators.required],
      // department:['', Validators.required],
      // branchId: ['', Validators.required],
      // dspCentreId: ['', Validators.required],
      // trainingProgramme: ['', Validators.required],
      trainerAffiliation: ['', Validators.required],
      // trainer : this.formBuilder.array([])
    });

    this.getDepartmentList();
    // this.getBranchList();
    this.getDspCentre();
    // this.getTrainingProgramme();
    this.getTrainerList();
  }
  // trainer(): FormArray {
  //   return this.trainerForm.get('trainerList') as FormArray;
  // }

   // convenience getter for easy access to form fields
   get getter() { return this.trainerForm.controls; }

   getSelectedBranch(val: string){
    this.globalService.getByParamRequest(this.baseUrl +'/getSelectedBranches', val)
    .subscribe(data => {
      this.branchList = data;
      console.log(this.branchList);
    })
   }

  //  getSelectedTraining(val: string){
  //   this.globalService.getByParamRequest(this.baseUrl +'/getSelectedTraining', val)
  //   .subscribe(data => {
  //     this.trainingProgrammeList = data;
  //   })
  //  }

  saveTrainer(){
    this.submitted = true;
    if (this.trainerForm.invalid){
      this.toastr.warning('Please fill up all the required fields.');
      return;
    }
    const formData = new FormData();
    formData.append("trainerDetails",JSON.stringify(this.trainerForm.value));
    this.globalService.postRequest(this.trainerUrl + '/save', formData)
      .subscribe(data => {
        if (data.status === 1) {
          // this.toastr.success(data.text + ' Your registration will be confirmed via email address you\'ve provided.', 'Registration Successful', {
          this.toastr.success(data.text);
          this.trainerForm.reset();
          this.submitted = false;
          this.getTrainerList();
          // this.router.navigateByUrl('home');
        } else {
          this.toastr.warning(data.text);
        }
      });
  }

  getTrainerList(){
    this.globalService.getRequest('/trainer/list')
      .subscribe(data => {
        this.trainerList = data;
        this.dtTrigger.next();
      })
  }

  // getTrainingProgramme(){
  //   this.globalService.getRequest(this.baseUrl +'/getTrainingProgramme')
  //     .subscribe(data => {
  //       this.trainingProgrammeList = data;
  //     })
  // }

  getDepartmentList(){
    this.globalService.getRequest(this.baseUrl +'/getDepartments')
      .subscribe(data => {
        this.departmentList = data;
      })
  }

  // getBranchList(){
  //   this.globalService.getRequest(this.baseUrl +'/getBranches')
  //     .subscribe(data => {
  //       this.branchList = data;
  //     })
  // }
  getDspCentre(){
    this.globalService.getRequest(this.baseUrl +'/getDspCentre')
      .subscribe(data => {
        this.dspCentreList = data;
      })
  }

  editByRow(object: any){
    this.pipe = new DatePipe('en-US');
    // alert(this.pipe.transform(object.dateOfJoining, 'MM/dd/yyyy'))
    this.trainerForm.setValue({
      id : object.id,
      trainerId: object.trainerId,
      trainerName: object.trainerName,
      // dateOfJoining : object.dateOfJoining,
      dateOfJoining: this.pipe.transform(object.dateOfJoining, 'yyyy-MM-dd') ,
      sex: object.sex,
      designation: object.designation,
      // department:object.trainingProgramme.branch.department.id,
      // branchId: object.trainingProgramme.branch.id,
      // branchId:'',
      // dspCentreId: object.dspCentre.id,
      // trainingProgramme: '',
      // trainingProgramme: object.trainingProgramme.id,
      trainerAffiliation: object.trainerAffiliation,
    })
    // this.getSelectedBranch(object.trainingProgramme.branch.department.id)
    // this.getSelectedTraining(object.trainingProgramme.branch.id)
  }

  openModalDelete(object : any) {
    this.display = 'block';
    this.trainerId = object.id;
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

  onCloseHandled(){
    this.display = 'none';
    this.modalService.close(this.modalRef);
  }
  onDeleteTrainer(){
    this.globalService.deleteRequest(this.trainerUrl + '/deleteTrainerById', this.trainerId).subscribe(data => {
      this.toastr.success(data.text);
      this.getTrainerList();
    });
    this.display = 'none';
    this.modalService.close(this.modalRef);
    this.trainerId = "";
  }
}
