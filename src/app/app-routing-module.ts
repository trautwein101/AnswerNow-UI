import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Home } from './pages/home/home';   
import { QuestionList } from './pages/question-list/question-list';
import { QuestionDetail } from './pages/question-detail/question-detail';
import { QuestionCreate } from './pages/question-create/question-create';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

import { adminGuard } from './guards/role.guard';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'questions', component: QuestionList },
  { path: 'questions/new', 
    component: QuestionCreate,
    canActivate: [authGuard] //Protected via login
  },
  { path: 'questions/:id', component: QuestionDetail },
  { path: 'admin',
    component: AdminDashboard,
    canActivate: [adminGuard] //Protected via admin role
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
