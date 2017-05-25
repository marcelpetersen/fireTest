import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import * as firebase from "firebase";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotPage } from '../pages/forgot/forgot';
import { ProjectsPage } from '../pages/projects/projects';
import { UserProjects } from '../pages/user-projects/user-projects';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { TitlePage } from '../pages/title/title';
import { ScenesPage } from '../pages/scenes/scenes';
import { ShotsPage } from '../pages/shots/shots'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProjectData } from '../providers/project-data';
import { AuthService } from '../providers/auth-service';
import { ShotlistData } from '../providers/shotlist-data';

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyDpzfG9WuTE26MAkUTNfEVsr2nlbtXsuAY",
  authDomain: "firetest-f8d9c.firebaseapp.com",
  databaseURL: "https://firetest-f8d9c.firebaseio.com",
  storageBucket: "firetest-f8d9c.appspot.com",
  messagingSenderId: "287472207420"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    ProjectsPage,
    UserProjects,
    UserProfilePage,
    TitlePage,
    ScenesPage,
    ShotsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    ProjectsPage,
    UserProjects,
    UserProfilePage,
    TitlePage,
    ScenesPage,
    ShotsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProjectData,
    AuthService,
    ShotlistData
  ]
})
export class AppModule {}
