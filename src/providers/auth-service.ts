import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  private authState: Observable<firebase.User>;
  public currentUser: firebase.User;

  constructor(public afAuth: AngularFireAuth) {
    console.log('Hello AuthService Provider');
    this.authState = afAuth.authState;
    this.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
      console.log('AuthService currentUser:', this.currentUser);
    });
  }

  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  //  Register User
  signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword)
    .then(function(newUser) {
      // signUp successful.
      var userKey: string = newUser.uid;
      console.log('Account created: ', userKey);
      // create user profile in /users
      firebase.database().ref('/users/'+ userKey).set({
        email: newEmail,
      });
    });
  }

  //  Login User
  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  //  Reset User Password
  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  //  Logout User
  logoutUser(): firebase.Promise<any> {
    return firebase.auth().signOut().then(function() {
    // Sign-out successful.
    })
    .catch(function(error) {
      var errorMessage = error.message;
      console.log('error:', error);
      console.log('error message:', errorMessage)
    });
  }

}
