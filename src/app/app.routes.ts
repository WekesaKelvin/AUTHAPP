import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { AuthGuard } from './permissions/auth.guard';
import { PublicGuard } from './permissions/public.guard';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard], // Protect Home Page
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PublicGuard], // Restrict if logged in
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [PublicGuard], // Restrict if logged in
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    canActivate: [PublicGuard], // Restrict if logged in
  },
  { path: 'reset-password', component: ResetPasswordComponent }

];
