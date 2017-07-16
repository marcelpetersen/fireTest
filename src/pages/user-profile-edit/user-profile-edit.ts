import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase/app'; // app and typings

import { Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-user-profile-edit',
  templateUrl: 'user-profile-edit.html',
})
export class UserProfileEditPage {

  public editProfileForm: any;

  private usersRef: any;
  private userKey: string;
  private userProfileRef: any;
  private currentUser: firebase.User;

  private hasName: boolean;
  private userDisplayName: string;
//  private hasPhoto: boolean;
  private userEmail : string;
  private emailVerified: boolean;

  private hasImage: boolean;
  private userImageURL: string;

  public base64Image: string;
  public rawImage: string;
  private pictureTaken: boolean;

  public rawGallery: string;
  public base64Gallery: string;
  private pictureChosen: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, private alert: AlertController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public formBuilder: FormBuilder, public afAuth: AngularFireAuth, public authService: AuthService, private camera: Camera) {
    this.usersRef = firebase.database().ref().child('users');
    this.userKey = this.authService.currentUser.uid;
    this.userProfileRef = this.usersRef.child(this.userKey);
    this.currentUser = this.authService.currentUser;
    if (this.currentUser !== null) {
      // user is logged in
      this.emailVerified = this.currentUser.emailVerified;
      this.userDisplayName =this.currentUser.displayName;
      this.userEmail =this.currentUser.email;
      this.userImageURL = this.currentUser.photoURL;
      if (this.currentUser.displayName !== null) {
        this.hasName = true;
        this.userDisplayName =this.currentUser.displayName;
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

    this.editProfileForm = formBuilder.group({
      userDisplayName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(20), Validators.required])],
      userEmail: [''],
//      userImageURL: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfileEditPage');
  }

  //close this modal
  closeModal() {
	  this.view.dismiss();
  }

  presentActionSheet1() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Edit Photo',
      buttons: [
       {
          text: 'Take a photo',
          handler: () => {
            this.takePicture();
            console.log('Camera clicked');
          }
        }, {
          text: 'Choose an image',
          handler: () => {
            this.openGallery();
            console.log('Gallery clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentActionSheet2() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
       {
          text: 'Take a photo',
          handler: () => {
            this.takePicture();
            console.log('Camera clicked');
          }
        }, {
          text: 'Choose an image',
          handler: () => {
            this.openGallery();
            console.log('Gallery clicked');
          }
        }, {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            this.deleteUserImage();
            console.log('Remove clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  //  Open Camera
  takePicture() {
    let options = {
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 50,
      allowEdit: true,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      this.rawImage = imageData;
      this.base64Image = "data:image/jpeg;base64," + imageData;
      let cameraImageSelector = document.getElementById('camera-image');
      cameraImageSelector.setAttribute('src', this.base64Image);
      this.pictureTaken = true;
      this.pictureChosen = false;
      }, (err) => {
        console.log(err);
    });
  }

  // Cancel Camera Image
  cancelPicture() {
    this.pictureTaken = false;
    this.rawImage = null;
    this.base64Image = null;
  }

  //  Open Photo Gallery
  openGallery () {
    let options = {
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 50,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,      
      encodingType: this.camera.EncodingType.JPEG     
    };
    this.camera.getPicture(options)
      .then((imageData) => {
        this.pictureTaken = false;
        this.pictureChosen = true;
        this.rawGallery = imageData;
        this.base64Gallery = "data:image/jpeg;base64," + imageData;
        let galleryImageSelector = document.getElementById('gallery-image');
        galleryImageSelector.setAttribute('src', this.base64Gallery);
      }, (err) => {
        console.log(err);
      });   
  }

  //  Cancel Photo Gallery Selection
  cancelGallery() {
    this.pictureChosen = false;
    this.rawGallery = null;
    this.base64Gallery = null;
  }

  //  Delete User Photo
  deleteUserImage(): firebase.Promise<any>{
    return firebase.storage().ref().child('/userPhotos/' + this.userKey).child('userPhoto.jpeg').delete().then(() => {
      return firebase.database().ref().child('/users/' + this.userKey).child('photoURL').set(null)
      .then(() => {
        this.userImageURL = null;
        return firebase.auth().currentUser.updateProfile({
          displayName: this.userDisplayName,
          photoURL: this.userImageURL
        });
      });
    });
  }

  updatePicture() {
      if (this.pictureTaken == true) {
        let userPhoto = this.rawImage;
        this.addUserImage(userPhoto);
      };
      if (this.pictureChosen == true) {
        let userPhoto = this.rawGallery;
        this.addUserImage(userPhoto);
      };
    this.showToast('top', 'Picture Updated');
    this.pictureTaken = false;
    this.pictureChosen = false;
  }

  addUserImage(userPhoto: string): firebase.Promise<any> {
    return firebase.storage().ref().child('/userPhotos/' + this.userKey).child('userPhoto.jpeg').putString(userPhoto, 'base64', {contentType: 'image/jpeg'}).then( savedImage => {
      let downloadURL: string = savedImage.downloadURL;
      this.userImageURL = downloadURL;
      return firebase.database().ref().child('/users/' + this.userKey).child('photoURL').set(downloadURL).then(() => {
        return firebase.auth().currentUser.updateProfile({
          displayName: this.userDisplayName,
          photoURL: downloadURL
        });
      });
    });
  }

  updateUserProfile() {
    if (!this.editProfileForm.valid) {
        console.log(this.editProfileForm.value);
      } else {


      // if (this.pictureTaken == true) {
      //   let userPhoto = this.rawImage;
      //   // this.projectData.updateImage(projectImage);
      // };
      // if (this.pictureChosen == true) {
      //   let userPhoto = this.rawGallery;
      //   // this.projectData.updateImage(galleryImage);
      // };


      var user = firebase.auth().currentUser;
      let displayName = this.editProfileForm.value.userDisplayName;
      let photoURL = this.userImageURL;
      user.updateProfile({
        displayName: displayName,
        photoURL: photoURL
      });

      this.showToast('top', 'Profile Updated');
      this.view.dismiss();
      console.log('Profile Updated');
    }
  }



  deletePicture2() {
     let prompt = this.alert.create({
      title: 'Delete Picture',
      message: "Are you sure?",
      inputs: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete Canceled');
          }
        },
        {
          text: 'Confirm',
          role: 'destructive',
          handler: () => {
//            this.deleteUserImage();
//            this.projectData.removeImage(this.projectKey);
            this.hasImage = false;
            this.pictureTaken = false;
            this.pictureChosen = false;
            console.log('Picture Deleted');
            this.showToast('top', 'Picture Deleted');
          }
        }
      ]
    });
    prompt.present();
  }

  verifyEmail() {
    this.authService.verifyEmail();
  }

  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });
    toast.present(toast);
  }


}
