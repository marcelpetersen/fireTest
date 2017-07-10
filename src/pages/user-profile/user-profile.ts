import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app'; // app and typings

//import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {
  private usersRef: any;
  private userKey: string;
  private userProfileRef: any;
  private currentUser: firebase.User;

//  private authState: Observable<firebase.User>;

  private hasName: boolean;
  private hasImage: boolean;
  private emailVerified: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, public authService: AuthService, public modal: ModalController) {
    this.usersRef = firebase.database().ref().child('users');
    this.userKey = this.authService.currentUser.uid;
    this.userProfileRef = this.usersRef.child(this.userKey);
    this.currentUser = this.authService.currentUser;

    // this.authState = afAuth.authState;
    // this.authState.subscribe((user: firebase.User) => {
    //   this.currentUser = user;
      console.log('user-profile currentUser:', this.currentUser);
      if (this.currentUser !== null) {
        // user is logged in
        this.emailVerified = this.currentUser.emailVerified;
        if (this.currentUser.displayName !== null) {
          this.hasName = true;
        } else {
          this.hasName = false;
        }
        if (this.currentUser.photoURL !== null) {
          this.hasImage = true;
        } else {
          this.hasImage = false;
        }
        console.log('user.email:', this.currentUser.email);
        console.log('user.displayName:', this.currentUser.displayName);
        console.log('user.emailVerified:', this.currentUser.emailVerified);
        console.log('user.photoURL:', this.currentUser.photoURL);
      } else {
        // no user logged in
      }
      console.log('hasName:', this.hasName);
      console.log('hasImage:', this.hasImage);
    // });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
    console.log('emailVerified::', this.emailVerified);
  }

  //Open the Edit Project modal
  editProfile() {
    const editProfileModal = this.modal.create('UserProfileEditPage');
    editProfileModal.present();
  }

}
