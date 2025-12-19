import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { authInterceptor } from './interceptors/auth.interceptor';  

//Components
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';     
import { Register } from './pages/register/register'; 
import { QuestionList } from './pages/question-list/question-list';
import { QuestionDetail } from './pages/question-detail/question-detail';
import { QuestionCreate } from './pages/question-create/question-create';


@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Header,
    Footer,
    Home,
    Login,
    Register,
    QuestionList,
    QuestionDetail,
    QuestionCreate
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [App]
})
export class AppModule { }
