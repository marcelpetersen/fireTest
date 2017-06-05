import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { HomePage } from '../pages/home/home';
import { ProjectsPage } from '../pages/projects/projects';
import { UserProjects } from '../pages/user-projects/user-projects';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { LoginPage } from '../pages/login/login';

import { AuthService } from '../providers/auth-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{title: string, icon: string, component: any}>;

  private authState: Observable<firebase.User>;
  private currentUser: firebase.User;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public afAuth: AngularFireAuth, public authService: AuthService) {
   
    this.initializeApp();
    
    this.pages = [
      { title: 'Home', icon: 'home', component: HomePage },
      { title: 'My Projects', icon: 'folder', component: UserProjects },
      { title: 'All Projects', icon: 'planet', component: ProjectsPage },
      { title: 'Profile', icon: 'contact', component: UserProfilePage }
    ];
    
    this.authState = afAuth.authState;
    //afAuth.subscribe((user: firebase.User) => {  does not work!
    afAuth.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
      console.log('app.component currentUser:', this.currentUser);
      if (user) {
        // user is logged in
        this.rootPage = ProjectsPage;
      } else {
        // no user logged in
        this.rootPage = LoginPage;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  goToProfile() {
    this.nav.setRoot(UserProfilePage)
  }

  logOut(){
    this.authService.logoutUser().then(() => {
    });
  }

}