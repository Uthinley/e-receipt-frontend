import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseManagerComponent } from './course-manager/course-manager.component';
import { HomeComponent } from './home/home.component';
import { BranchComponent } from './master/branch/branch.component';
import { CourseMasterComponent } from './master/course-master/course-master.component';
import { DepartmentComponent } from './master/department/department.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { StudentComponent } from './studentManager/student/student.component';
import { TracerStudyComponent } from './studentManager/tracer-study/tracer-study.component';
import { TrainerManagerComponent } from './trainer-manager/trainer-manager.component';
import { AccessPermissionComponent } from './userManager/access-permission/access-permission.component';
import { ChangePasswordComponent } from './userManager/change-password/change-password.component';
import { UserGroupComponent } from './userManager/user-group/user-group.component';
import { UserSetupComponent } from './userManager/user-setup/user-setup.component';
import { AdminGuard } from './_helper/admin.guard';
import { AuthGuard } from './_helper/auth.guard';


const routes: Routes = [
 {
  path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
 },
 {
   path: 'home', component: HomeComponent, canActivate: [AuthGuard],
 },
 {
  path: 'receipt-history', component: ReceiptComponent,
},
 {
  path: 'add-student', component:StudentComponent , canActivate: [AdminGuard],
},{
  path: 'add-trainer', component:TrainerManagerComponent , canActivate: [AdminGuard],
},
{
  path: 'course', component:CourseManagerComponent , canActivate: [AdminGuard],
},
{
  path: 'tracer-study', component:TracerStudyComponent , canActivate: [AdminGuard],
},
{
  path: 'user-setup', component: UserSetupComponent, canActivate: [AdminGuard],
},
{
  path: 'user-group', component: UserGroupComponent, canActivate: [AdminGuard],
},
{
  path: 'change-password', component: ChangePasswordComponent
},
{
  path: 'access-permission', component: AccessPermissionComponent, canActivate: [AdminGuard],
},
{
  path: 'department', component: DepartmentComponent, canActivate: [AdminGuard],
},
{
  path: 'branch', component: BranchComponent, canActivate: [AdminGuard],
},
{
  path: 'courseMaster', component: CourseMasterComponent, canActivate: [AdminGuard],
},
// {
//   path: '',  loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
// },
  {
    path: '**', redirectTo : 'login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
