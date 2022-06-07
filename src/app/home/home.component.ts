import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_service/auth.service';
import { GlobalService } from '../_service/global.service';
// import {Chart} from '';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // receipt 
  receiptForm : FormGroup;
  consolidatedForm : FormGroup;
  submitted = false;
  consolidatedFormSubmitted = false;
  reportList = [];
  viewReceipt = false;
  viewForm = true;
  generatedReportNo;
  dto;

  reportNumber;
  receiptDate;
  from;
  receivedAmt;
  debtorType;


  isStudent = false;
  isAdmin = false;
  labels = [];
  barLabels = [];
  data = [];
  barData=[];
  searchForm: FormGroup;
  isValid : boolean =  false;
  displayViewStd = 'none';
  coursesTakenList = [];
  recommendedCourse = [];
  courseIDTaken = [];
  errorMessage ;
  profileDetail;
  userDetail;
  cid;
  departmentList= [];
  studentDtls = [];
  // report : any;
  obj1 : any;
  obj2 : any;
  obj3: any;
  obj4: any;
  tracerPercentage;
  isSubAdmin = false;
  myChart;
  canvas;
   ctx;
   chart : any;
   
 


  @ViewChild('modalStdDtls') modalStdDtls;
  private modalStdDtlsref;
  // canvas: any;
  // ctx: any;

  
   
  constructor(private authService: AuthService,
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: ModalManager
    ) { }


  ngOnInit(): void {
    this.checkStudent();
    this.checkAdmin();
    this.checkSubAdmin();

    this.receiptForm = this.formBuilder.group({
      reportNumber : ['', Validators.required],
      // receivedBy : ['', Validators.required],
      receivedAmt: ['', Validators.required],
      debtorType : ['', Validators.required],
      // accountOf : ['', Validators.required],
      from: ['', Validators.required],
      receiptDate : new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      // receiptDate : [(new Date()).toISOString().substring(0,10), Validators.required],
    })

    this.consolidatedForm = this.formBuilder.group({
      receiptList: this.formBuilder.array([], [Validators.required]),
    })
   
  }
  onOptionSelected(value){
    if (value =="Individual"){
      this.receivedAmt = 100;
    }else if (value =="Institution"){
      this.receivedAmt = 200;
    }
  }

  receiptList(): FormArray {
    return this.consolidatedForm.get('receiptList') as FormArray;
  }

  onAddRow(){
    // this.rows.push(this.createItemFormGroup());
    this.receiptList().push(this.newList());
    return true;
  }
  onRemoveRow(rowIndex:number){
    // this.rows.removeAt(rowIndex);
    this.receiptList().removeAt(rowIndex);
  }
  newList(): FormGroup {
    return this.formBuilder.group({
      reportNumber : [this.reportNumber],
      receiptDate : [this.receiptDate],
      debtorType : [this.debtorType],
      receivedAmt : [this.receivedAmt],
      from : [this.from],
    });
  }

  get getter() { return this.receiptForm.controls; }

  back(){
    this.globalService.reloadPage();
    // this.viewReceipt = false;
    // this.viewForm = true;
  }

  save(){
    this.consolidatedFormSubmitted = true;
    if(this.consolidatedForm.invalid){
      return;
    }
    const formData = new FormData();
    formData.append('ReceiptListDTO', JSON.stringify(this.consolidatedForm.value));
     this.globalService.postRequest('/receipt/saveReceipt', formData)
      .subscribe(data => {
        if (data.status === 1) {
          this.toastr.success(data.text);
          this.reportList = data.receiptListDTOList;
          this.generatedReportNo = data.value;
          this.dto = data.dto;
          this.viewForm = false;
          this.receiptForm.reset();
          this.consolidatedFormSubmitted = false;
          this.viewReceipt = true;
          // this.globalService.reloadPage();
        } else {
          this.toastr.warning(data.text);
        }
      });

  }

  add(){
    this.submitted = true;
     // stop here if form is invalid
     if (this.receiptForm.invalid) {
        return;
    }
    this.onAddRow();
    this.receiptForm.reset();
  }
 
  checkSubAdmin(){
    const roles = this.authService.getUserRole();
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
      const subAdminRole = '2';
      if (role === subAdminRole ){
        this.isSubAdmin = true;
      }
      // console.log(roles[index].authority.slice(0, roles[index].authority.indexOf('-')));
    }
  }

  checkStudent(){
    const roles = this.authService.getUserRole();
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
      const userRole = '3';
      if (role === userRole){
        this.isStudent = true;
        // this.getUserCid(this.authService.getUserName());
      }
    }
  }
  checkAdmin() {
    const roles = this.authService.getUserRole();
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
      const adminRole = '1';
      if (role === adminRole ){
        this.isAdmin = true;
        // this.getReport();
      }
      // console.log(roles[index].authority.slice(0, roles[index].authority.indexOf('-')));
    }
  }

  getReport(){
    this.globalService.getRequest('/home/getReport').subscribe(data=>{
      this.obj1 = data.obj1;
      this.obj2 = data.obj2;
      this.obj3 = data.obj3;
      this.obj4 = data.obj4;
      this.tracerPercentage = data.obj5 + "%";
    });
  }



}
