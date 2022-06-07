import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StudentComponent } from './studentManager/student/student.component';
import { TrainerManagerComponent } from './trainer-manager/trainer-manager.component';
import { DepartmentComponent } from './master/department/department.component';
import { BranchComponent } from './master/branch/branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseManagerComponent } from './course-manager/course-manager.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngb-modal';
import { TracerStudyComponent } from './studentManager/tracer-study/tracer-study.component';
import { JwtInterceptor } from './_helper/jwt-interceptor';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { UserSetupComponent } from './userManager/user-setup/user-setup.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UserGroupComponent } from './userManager/user-group/user-group.component';
import { ChangePasswordComponent } from './userManager/change-password/change-password.component';
import { AccessPermissionComponent } from './userManager/access-permission/access-permission.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CourseMasterComponent } from './master/course-master/course-master.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ReceiptComponent } from './receipt/receipt.component';
// import { NgChartsModule } from 'ng2-charts/lib/ng-charts.module';
// import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SidebarComponent,
    StudentComponent,
    TrainerManagerComponent,
    DepartmentComponent,
    BranchComponent,
    CourseManagerComponent,
    TracerStudyComponent,
    UserSetupComponent,
    UserGroupComponent,
    ChangePasswordComponent,
    AccessPermissionComponent,
    CourseMasterComponent,
    ReceiptComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    ModalModule,
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot(),
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
    SweetAlert2Module,
    NgSelectModule,
    LoadingBarHttpClientModule,
    // NgChartsModule 
    // NgbAccordionModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
