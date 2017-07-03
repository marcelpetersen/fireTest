import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import * as firebase from 'firebase/app'; // app and typings

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
    this.usersRef = firebase.database().ref().child('users');
    this.userKey = this.authService.currentUser.uid;
    this.userProfileRef = this.usersRef.child(this.userKey);
    this.currentUser = this.authService.currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

}
