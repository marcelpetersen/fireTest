import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { config } from './app.firebaseconfig';

import * as firebase from "firebase";

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../providers/project-data';
import { AuthService } from '../providers/auth-service';
import { ShotlistData } from '../providers/shotlist-data';

// Initialize Firebase
// export const firebaseConfig = {
//   apiKey: "AIzaSyDpzfG9WuTE26MAkUTNfEVsr2nlbtXsuAY",
//   authDomain: "firetest-f8d9c.firebaseapp.com",
//   databaseURL: "https://firetest-f8d9c.firebaseio.com",
//   storageBucket: "firetest-f8d9c.appspot.com",
//   messagingSenderId: "287472207420"
// };

firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProjectData,
    AuthService,
    ShotlistData
  ]
})
export class AppModule {}
