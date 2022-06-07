import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { GlobalService } from 'src/app/_service/global.service';

@Component({
  selector: 'app-tracer-study',
  templateUrl: './tracer-study.component.html',
  styleUrls: ['./tracer-study.component.css']
})
export class TracerStudyComponent implements OnInit {
  isValidCID : boolean =  false;
  cid : any ;
  studentId;
  student: any;
  searchForm : FormGroup;
  tracerForm : FormGroup;
  baseUrl = "/student";
  submitted = false;
  tracerSubmitted = false;
  errorCidMessage = "";
  tracerList = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private globalService: GlobalService,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      cid:['', [Validators.required, Validators.minLength(11)]],

    })
    this.tracerForm= this.formBuilder.group({
      employmentStatus: ['', Validators.required],
      organizationType : ['', Validators.required],
      salary : ['', Validators.required],
      organizationName: ['', Validators.required],
      placeOfWork : ['', Validators.required],
      workDuration : ['', Validators.required],
      remainingWorkDuration : ['', Validators.required],
      jobSatisfaction : ['', Validators.required],
      futureDspPlan : ['', Validators.required],
      dspCurrentWorkRelation :['', Validators.required]
    })
  }
  // convenience getter for easy access to form fields
  get getter() { return this.searchForm.controls; }

  get getterTracer(){return this.tracerForm.controls}

  saveTracer(){
    this.tracerSubmitted = true;
    if (this.tracerForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('tracerDetails', JSON.stringify(this.tracerForm.value));
    formData.append('studentId', this.studentId);
    formData.append('cid', this.cid);
    this.globalService.postRequest(this.baseUrl + '/saveTracer', formData)
    .subscribe(data => {
      if (data.status === 1) {
        // this.toastr.success(data.text + ' Your registration will be confirmed via email address you\'ve provided.', 'Registration Successful', {
        this.toastr.success(data.text);
        this.tracerForm.reset();
        this.tracerSubmitted = false;
        this.getTracerStudy(this.studentId);
        // this.router.navigateByUrl('home');
      } else {
        this.toastr.warning(data.text);
      }
    });

  }
  searchDessunp(){
    this.submitted = true;
     // stop here if form is invalid
     if (this.searchForm.invalid) {
      return;
    }
    this.cid = this.searchForm.value.cid;
    this.globalService.getByParamRequest(this.baseUrl + '/findStudentBycid', this.cid).subscribe(data => {
      this.student = data;
      if (this.student !== 'undefined' && this.student !== null){
        this.isValidCID = true;
        this.studentId = this.student.studentId;
        this.getTracerStudy(this.student.studentId);
      }else{
        this.isValidCID =false;
        this.errorCidMessage ="Invalid CID or Details not found";
      }
    });
  }

  getTracerStudy(studentId){
    this.globalService.getByParamRequest(this.baseUrl + '/findTracerByid', studentId).subscribe(data => {
      this.tracerList = data;
    
    });
  }

}
