import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { GlobalService } from 'src/app/_service/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  searchForm : FormGroup;
  addStudentForm : FormGroup;
  rows: FormArray;
  submitted = false;
  studentSubmitted = false;
  courseList = [];
  courseListByid = [];
  baseUrl = "/student";
  globalApiUrl = `${environment.apiUrl}`;
  studentExist = false;
  selected;
  selectedCourse;
  cid;
  gender;
  mobileNo;
  did;
  avatar;
  batchNo;
  bloodGroup;
  email;
  maritalStatus;
  trainingCentreId;
  trainingYear;
  ciderror = false;
  dessungProfile ;
  name;
  @ViewChild('myModalDelete') myModal;
  private modalRef;

  display = 'none';
  deleteStd;
  isAdmin = false;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private globalService: GlobalService,
    private toastr: ToastrService,
    private modalService: ModalManager,
    private http: HttpClient
    ) { 
      // this.rows = this.formBuilder.array([]);
    }

  ngOnInit(): void {
    this.checkAdmin();
    this.getCourseList();
    this.searchForm = this.formBuilder.group({
      courseId:['courseId', Validators.required],

    })

    this.addStudentForm = this.formBuilder.group({
      courseSelected: ['', Validators.required],
      studentList: this.formBuilder.array([], [Validators.required]),
    })
    this.onAddRow();
    // this.addStudentForm.get("items_value").setValue("yes");

        // this.addStudentForm.addControl('rows', this.rows);
  }

  checkAdmin(){
    const roles = this.authService.getUserRole();
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
      const adminRole = '1';
      if (role === adminRole ){
        this.isAdmin = true;
      }
      // console.log(roles[index].authority.slice(0, roles[index].authority.indexOf('-')));
    }
  }

  // convenience getter for easy access to form fields
  get getter() { return this.searchForm.controls; } 

  get studentGetter(){ return this.addStudentForm.controls}

  studentList(): FormArray {
    return this.addStudentForm.get('studentList') as FormArray;
  }

  onAddRow(){
    // this.rows.push(this.createItemFormGroup());
    this.studentList().push(this.newStudent());
    return true;
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

  onRemoveRow(rowIndex:number){
    // this.rows.removeAt(rowIndex);
    this.studentList().removeAt(rowIndex);
  }

  getCourseList(){
    this.globalService.getRequest('/course/list').subscribe(data => {
      this.courseList = data;
    });
  }

  searchStudentByCourseId(){
    this.submitted = true;
    // if(this.selected ===""){
    //   this.toastr.warning("Please select the course");
    // }
     // stop here if form is invalid
     if (this.searchForm.invalid) {
      this.toastr.warning("Please select the course");
      return;
    }
    this.globalService.getByParamRequest('/student/findStudentById', this.selected).subscribe(data => {
      this.courseListByid = data;
      if(Object.keys(this.courseListByid).length === 0 && this.courseListByid !== null){
        this.toastr.warning("No student found in the course");
      }
      this.courseListByid.forEach(element=>{
          element['isEdit'] =  false;
        });
    },error=>{

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

  saveStudent(){
    this.studentSubmitted = true;
    if (this.addStudentForm.invalid){
      this.toastr.warning("Please enter all the fields.");
      return;
    }

    const formData = new FormData();
    formData.append('dessungProfile', JSON.stringify(this.addStudentForm.value));
    // formData.append('courseId', this.selectedCourse);
    // alert(JSON.stringify(this.addStudentForm.value));
    this.globalService.postRequest('/student/saveStudent', formData)
    .subscribe(data => {
      if (data.status === 1) {
        // this.toastr.success(data.text + ' Your registration will be confirmed via email address you\'ve provided.', 'Registration Successful', {
        this.toastr.success(data.text);
        this.addStudentForm.reset();
        this.studentSubmitted = false;
        this.searchStudentByCourseId();
        // this.router.navigateByUrl('home');
      } else {
        this.toastr.warning(data.text);
      }
    });
  }

  openModalDelete(object : any) {
    this.display = 'block';
    this.deleteStd = object.studentId;
    this.modalRef = this.modalService.open(this.myModal, {

      //modal properties
      size: "md",
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
  onCloseHandled() {
    this.display = 'none';
    this.modalService.close(this.modalRef);
  }

  onDeleteStudent(){
    this.globalService.deleteRequest(this.baseUrl + '/deleteById', this.deleteStd).subscribe(data => {
      this.toastr.success(data.text);
      this.searchStudentByCourseId();
    });
    this.display = 'none';
    this.modalService.close(this.modalRef);
    this.deleteStd = "";
  }

  getStudentById(data){
    data.isEdit = true;
  }
  closeEdit(data){
    data.isEdit = false;
  }
  updateStudentById(data){
    delete data.isEdit;
    const formData = new FormData();
    formData.append('student', JSON.stringify(data));
    this.globalService.postRequest(this.baseUrl + '/update', formData)
    .subscribe(data => {
      if (data.status === 1) {
        this.toastr.success(data.text);
        this.searchStudentByCourseId();
      } else {
        this.toastr.warning(data.text);
      }
    },
    (error) => {
      // this.errorMessage = error.error;
      throw error;
    });
  }

  getByParamRequestMany(url: string, params: any, params2: any): Observable<any> {
    return this.http.get(this.globalApiUrl + url + '/' + params+ '/'+params2);
  }


}
