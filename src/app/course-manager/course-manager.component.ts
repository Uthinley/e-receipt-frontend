import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../_service/global.service';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-course-manager',
  templateUrl: './course-manager.component.html',
  styleUrls: ['./course-manager.component.css']
})
export class CourseManagerComponent implements OnInit {
  courseList = [];
  courseMasterList = [];
  courseDetail;
  editTrainerId = [];
  baseUrl = "/course";
  departmentList = [];
  dspCentreList = [];
  trainerList=[];
  student =[];
  courseDuration;
  selectedCourse;
  studentExist = false;
  dessungProfile ;
  globalApiUrl = `${environment.apiUrl}`;
  courseForm: FormGroup;
  addStudentForm : FormGroup;
  studentUploadForm : FormGroup;
  submitted = false;
  isUpdate = false;
  selectedCourseId;
  isHidden = true;
  isShown: boolean = false ;
  isShownUpload : boolean = false;
  studentSubmitted = false;
  isPreview : boolean = false;
  courseSelected;
  selectedFile;
  // for modal
  display = 'none';
  displayAddstd = 'none';
  displayViewStd = 'none';
  id;
  studentId;
  courseName;
  courseId;
  courseStatus;
  industrailSector;
  courseLevel;
  course_duration;
  startDate;
  startDates :any;
  endDates: any;
  endDate;
  noOfApplicants;
  noOfStdCertified;
  batchNo;
  trainingLocation;
  trainers;
  trainingID;
  @ViewChild('myModal') myModal;
    private modalRef;

  @ViewChild('modalAddStd') modalAddStd;
  private modalAddStdref;

  @ViewChild('modalViewStd') modalViewStd;
  private modalViewStdref;
  
  @ViewChild('myModalDelete') myModalDelete;
  private myModalDeleteref;

   // for datatable
   @ViewChildren(DataTableDirective)
   dtElements: QueryList<DataTableDirective>;
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   dtTrigger1: Subject<any> = new Subject();
   isDtInitialized:boolean = false;
   isDtInitialized1:boolean = false;
   dtElement: DataTableDirective;

  constructor(private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,
    private modalService: ModalManager) { }

  ngOnInit(): void {
    this.courseForm = this.formBuilder.group({
      // courseName: ['', Validators.required],
      courseStatus: ['', Validators.required],
      // industrailSector: ['', Validators.required],
      // courseLevel: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      course_duration: ['',],
      cohortSize: ['', Validators.required],
      batchNo: ['', Validators.required],
      trainingLocationId: ['', Validators.required],
      trainerId: ['',],
      courseId: ['', Validators.required],
      id: [''],

    });
    this.addStudentForm = this.formBuilder.group({
      courseSelected: [],
      studentList: this.formBuilder.array([], [Validators.required]),
    })
    this.studentUploadForm = this.formBuilder.group({
      file : ['', Validators.required]
    })
    this.onAddRow();
    this.getCourseList();
    this.getCourseMasterList();
    this.getDepartmentList();
    this.getDspCentre();
    this.getTrainerList();
  }

  studentList(): FormArray {
    return this.addStudentForm.get('studentList') as FormArray;
  }

  onAddRow(){
    // this.rows.push(this.createItemFormGroup());
    this.studentList().push(this.newStudent());
    return true;
  }
  onRemoveRow(rowIndex:number){
    // this.rows.removeAt(rowIndex);
    this.studentList().removeAt(rowIndex);
  }

  newStudent(): FormGroup {
    return this.formBuilder.group({
      cid: ['', [Validators.required]],
      name:[''],
      did :[''],
      gender : [''],
      mobileNo : [''],
      avatar: [''],
      batchNo: [''],
      bloodGroup: [''],
      dob: [''],
      email: [''],
      maritalStatus: [''],
      trainingCentreId: [''],
      trainingYear: ['']

    });
  }

  
  isUnique: boolean = true;
  onKeyDessungDetail(e, item, index: number) {
    const cid = e.target.value;
    let count: number = 0;

    this.studentList().controls.forEach(i => {
      if (i.get('cid').value == cid && index != count) {
        this.isUnique = false;
        item.studentList = "";
        return false;
      } else {
        this.isUnique = true;
      }
      count++;
    })
    if (!this.isUnique) {
      this.studentList().removeAt(index);
      this.toastr.warning("Please select another cid.");
      return;
    }
    //check if student exist for the same course
    let queryParams = new HttpParams();
    queryParams = queryParams.append("cid",cid);
    queryParams = queryParams.append("courseId",this.selectedCourse);
    this.getByParamRequestMany('/student/isStudentExist', cid, this.selectedCourse).subscribe(data=>{
      this.studentExist = data.setStatus;
      if (data.status == 0) 
        {
          this.studentList().removeAt(index);
          this.toastr.warning("This student have already enrolled in this course.");
        }    
    });
    this.globalService.getByParamRequest('/student/findDessungBycid', cid).subscribe(data => {
      this.dessungProfile = data;
        if (!data){
          this.toastr.warning("Details not found");
          item.name = "";
          item.gender = "";
          item.did = "";
          item.mobileNo = "";
          item.avatar = "";
          item.batchNo = "";
          item.bloodGroup = "";
          item.dob = "";
          item.email = "";
          item.maritalStatus = "";
          item.trainingCentreId = "";
          item.trainingYear = "";
        }
        // if (data != null || data != "") 
        else{
          item.name = data.name;
          item.gender = data.gender;
          item.did = data.did;
          item.mobileNo = data.mobileNo;
          item.avatar = data.avatar;
          item.batchNo = data.batchNo;
          item.bloodGroup = data.bloodGroup;
          item.dob = data.dob;
          item.email = data.email;
          item.maritalStatus = data.maritalStatus;
          item.trainingCentreId = data.trainingCentreId;
          item.trainingYear = data.trainingYear;
        }
    });
  }
  getByParamRequestMany(url: string, params: any, params2: any): Observable<any> {
    return this.http.get(this.globalApiUrl + url + '/' + params+ '/'+params2);
  }

  saveCourse(){
    this.submitted = true;
    // alert(JSON.stringify(this.courseForm.value));
    if (this.courseForm.invalid){
      this.toastr.warning('Please fill up all the required fields.');
      return;
    }
    const formData = new FormData();
    formData.append("course",JSON.stringify(this.courseForm.value));
    this.globalService.postRequest(this.baseUrl + '/save', formData)
      .subscribe(data => {
        if (data.status === 1) {
          this.toastr.success(data.text);
          this.courseForm.reset();
          this.submitted = false;
          this.globalService.reloadPage();
          // this.getCourseList();
        } else {
          this.toastr.warning(data.text);
        }
      });
  }

  getCourseList(){
        this.globalService.getRequest(this.baseUrl +'/list')
      .subscribe(data => {
        this.courseList = data;
        this.dtTrigger.next();
      })
  }

  getCourseMasterList(){
    this.globalService.getRequest('/master/getCourses')
      .subscribe(data => {
        this.courseMasterList = data;
      })
  }
  getCourseDetail(val: string){
    if ( this.selectedCourseId === undefined) {
      // alert("ngModel is changed to " + this.selectedCourseId);
      this.isHidden = true;
    }else{
      this.globalService.getByParamRequest('/master/getSelectedCourse', val)
      .subscribe(data => {
        this.courseDetail = data;
        this.isHidden = false;
        // console.log(this.courseDetail);
      })
     }
    }
   
  onCloseHandled() {
    this.display = 'none';
    this.modalService.close(this.modalRef);
  }
  onCloseAdd(){
    this.displayAddstd = 'none';
    this.modalService.close(this.modalAddStdref);
  }

  onCloseStd(){
    this.displayViewStd = 'none';
    this.modalService.close(this.modalViewStdref);
  }

  onCloseDelete(){
    this.display = 'none';
    this.modalService.close(this.myModalDeleteref);
  }
  openModal(object: any) {
    this.display = 'block';
    //modal data
    this.courseName = object.courseName;
    this.id =  object.id;
    this.industrailSector = object.industrailSector;
    this.courseId =object.courseId
    this.courseLevel = object.courseLevel
    this.courseStatus =object.courseStatus
    this.endDate =object.endDate
    this.startDate = object.startDate
    this.startDates = new Date(object.startDate);
    this.endDates = new Date(object.endDate);
    this.trainingLocation =object.trainingLocation
    this.noOfApplicants = object.noOfApplicants
    this.noOfStdCertified = object.noOfStdCertified
    this.batchNo = object .batchNo
    this.trainers = object.trainers.trainerName

    this.modalRef = this.modalService.open(this.myModal, {

      //modal properties
      size: "lg",
      modalClass: 'mymodal',
      hideCloseButton: false,
      centered: true,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: true,
      backdropClass: "modal-backdrop"
  })
  }

  getDepartmentList(){
    this.globalService.getRequest('/master/getDepartments')
      .subscribe(data => {
        this.departmentList = data;
      })
  }
  getDspCentre(){
    this.globalService.getRequest('/master/getDspCentre')
      .subscribe(data => {
        this.dspCentreList = data;
      })
  }

  getTrainerList(){
    this.globalService.getRequest('/trainer/list')
      .subscribe(data => {
        this.trainerList = data;
      })
  }

  calDuration(startDate, endDate){
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    this.courseDuration = Math.floor(
      (Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      ) -
        Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
  
  }
  editByRow(course: any){
    this.isUpdate = true;
    for (let t of course.trainers)
    {
      this.editTrainerId.push(t.id);
    }
    this.selectedCourseId = course.courseMaster.id;
    this.courseForm.setValue({
      id:course.id,
      // courseName: course.courseName,
      courseStatus: course.courseStatus,
      batchNo: course.batchNo,
      // industrailSector: course.industrailSector,
      // courseLevel: course.courseMaster.courseLevelMaster.id,
      startDate: course.startDate,
      endDate: course.endDate,
      course_duration: course.course_duration,
      cohortSize: course.cohortSize,
      trainingLocationId: course.dspCentre.id,
      trainerId: this.editTrainerId,
      courseId: course.courseMaster.id
    })
  }

  openModalDelete(object : any) {
    this.display = 'block';
    this.id = object.id;
    this.myModalDeleteref = this.modalService.open(this.myModalDelete, {

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

  openModalAddStd(object: any){
    this.trainingID = object.id;
    this.courseName = object.courseMaster.courseName;
    this.courseId =  object.courseMaster.courseId;
    this.courseLevel = object.courseMaster.courseLevelMaster.courseLvlName;
    this.trainingLocation = object.dspCentre.dspCentre;
    this.trainers = object.trainers.trainerName;
    this.courseSelected = object.id;
    this.displayAddstd = "block";
    this.modalAddStdref = this.modalService.open(this.modalAddStd, {
       //modal properties
       size: "xl", 
       modalClass: 'modalAddStd',
       hideCloseButton: false,
       centered: true,
       backdrop: true,
       animation: true,
       keyboard: false,
       closeOnOutsideClick: true,
       backdropClass: "modal-backdrop"
    })
  }
  //display student in training programe
  openModalStd(id){
    this.studentId = id;
    this.getAllStdByTrainingId(id);
    this.displayViewStd = "block";
    this.modalViewStdref = this.modalService.open(this.modalViewStd, {
       //modal properties
       size: "xl",
       modalClass: 'modalViewStd',
       hideCloseButton: false,
       centered: true,
       backdrop: true,
       animation: true,
       keyboard: false,
       closeOnOutsideClick: false,
       backdropClass: "modal-backdrop"
    })
  }

  getAllStdByTrainingId(id){
    this.globalService.getByParamRequest('/student/findStudentById', id)
      .subscribe(data => {
        this.student = data;
        this.student.forEach(element=>{
          element['isEdit'] =  false;
        });
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger1.next();
          });
        }else{
          this.isDtInitialized = true
          this.dtTrigger1.next();
        }
      })
  }

  getStudentById(data){
    data.isEdit = true;
  }
  closeEdit(data){
    data.isEdit = false;
  }

  onDeleteCourse(){
    this.globalService.deleteRequest(this.baseUrl + '/deleteById', this.id).subscribe(data => {
      this.toastr.success(data.text);
    });
    this.display = 'none';  
    this.modalService.close(this.myModalDeleteref);
    this.id = "";
    this.getCourseList();
    // this.globalService.reloadPage();
  }

  toggleShowAddStd() {
    this.isShown = ! this.isShown;
    }
  toggleUploadStd(){
    this.isShownUpload = ! this.isShownUpload;
  }

  saveStudent(){
    this.studentSubmitted = true;
    if (this.addStudentForm.invalid){
      this.toastr.warning("Please enter all the fields.");
      return;
    }

    const formData = new FormData();
    formData.append('dessungProfile', JSON.stringify(this.addStudentForm.value));
    formData.append('trainingID', this.trainingID);
    formData.append('courseId', this.selectedCourse);
    // alert(JSON.stringify(this.addStudentForm.value));
    this.globalService.postRequest('/student/saveStudent', formData)
    .subscribe(data => {
      if (data.status === 1) {
        // this.toastr.success(data.text + ' Your registration will be confirmed via email address you\'ve provided.', 'Registration Successful', {
        this.toastr.success(data.text);
        this.addStudentForm.reset();
        this.studentSubmitted = false;
        // this.searchStudentByCourseId();
        this.toastr.success("saved successfully");
        // this.router.navigateByUrl('home');
      } else {
        this.toastr.warning(data.text);
      }
    });
  }

  updateStudentById(data){
    delete data.isEdit;
    const formData = new FormData();
    formData.append('student', JSON.stringify(data));
    this.globalService.postRequest('/student/update', formData)
    .subscribe(data => {
      if (data.status === 1) {
        this.toastr.success(data.text);
        this.getAllStdByTrainingId(this.studentId);
        this.studentId = "";
      } else {
        this.toastr.warning(data.text);
      }
    },
    (error) => {
      // this.errorMessage = error.error;
      throw error;
    });
  }

  deleteStd(data){
    //this.studentId is training Id
    this.globalService.deleteRequestMultiple('/student/deleteStdById', data.studentId, this.studentId).subscribe(data => {
      this.toastr.success(data.text);
      this.getAllStdByTrainingId(this.studentId);
    });
  }

  //for xlxs file upload
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  onFileChange(evt: any) {
    this.isPreview = true;
    this.selectedFile = evt.target.files[0];
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  uploadStudentFile(){
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('trainingId', this.trainingID);
    if(this.studentUploadForm.invalid){
      this.toastr.warning('Please select a file.');
      return;
    }
    this.globalService.postRequest('/student/uploadStudentFile', formData)
    .subscribe(data => {
      if (data.status === 1) {
        this.toastr.success(data.text);
        // this.departmentUpload.reset();
        // this.submitted = false;
        // this.globalService.reloadPage();
      } else {
        this.toastr.warning(data.text);
      }
    },
    (error) => {
      throw error;
    });
  }

  onFileChangeStd(e) {
    this.selectedFile = e.target.files[0];
  }
}
