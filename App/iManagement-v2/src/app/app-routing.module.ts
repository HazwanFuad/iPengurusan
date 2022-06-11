import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'userdashboard',
    loadChildren: () => import('./userdashboard/userdashboard.module').then( m => m.UserdashboardPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'attendace',
    loadChildren: () => import('./attendace/attendace.module').then( m => m.AttendacePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'reasons',
    loadChildren: () => import('./reasons/reasons.module').then( m => m.ReasonsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'leave',
    loadChildren: () => import('./leave/leave.module').then( m => m.LeavePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'course',
    loadChildren: () => import('./course/course.module').then( m => m.CoursePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'reader',
    loadChildren: () => import('./reader/reader.module').then( m => m.ReaderPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'courseapproval',
    loadChildren: () => import('./courseapproval/courseapproval.module').then( m => m.CourseapprovalPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'attendaceapproval',
    loadChildren: () => import('./attendaceapproval/attendaceapproval.module').then( m => m.AttendaceapprovalPageModule),
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
