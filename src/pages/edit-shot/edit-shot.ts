import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, App } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-edit-shot',
  templateUrl: 'edit-shot.html',
})
export class EditShot {

  public editShotForm: any;
  public loading: any;

  public projectKey: string;
  public sceneKey: string;
  public shotKey: string;
  private shotRef: any;

  public currentImage: string;
  public currentShotNumber: number;
  public currentShotSub: string;
  public currentTitle: string;
  public currentDescription: string;
  public currentShotLoc: string;
  public currentShotTime: string;
  public currentShotType: string;
  public currentCameraMovement: string;
  public currentPageCount: number;
  public currentPageEighths: number;

  public base64Image: string;
  public rawImage: string;
  private pictureTaken: boolean;
  private hasImage: boolean;

  public rawGallery: string;
  public base64Gallery: string;
  private pictureChosen: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData, private alert: AlertController, public toastCtrl: ToastController, public appCtrl: App, private camera: Camera) {
    this.editShotForm = formBuilder.group({
      shotNumber: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      shotSub: ['', Validators.compose([Validators.maxLength(1)])],
      title: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])],
      shotLoc: ['', Validators.compose([Validators.required])],
      shotTime: ['', Validators.compose([Validators.required])],
      shotType: ['', Validators.compose([Validators.required])],
      cameraMovement: ['', Validators.compose([Validators.required])],
      pageCount: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageEighths: ['', Validators.compose([Validators.required])]
    });
    this.projectKey = this.projectData.projectKey;
    this.sceneKey = this.shotlistData.sceneKey;
    this.shotKey = this.shotlistData.shotKey;
    this.shotRef = firebase.database().ref('/shotlists/' + this.projectKey + '/scenes/' + this.sceneKey + '/shots/' + this.shotKey);
    this.getShot();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProject');
  }

  closeModal() {
  	this.view.dismiss();
  }

  //  Get Current Shot
  getShot() {
      this.shotRef.on('value', snap => {
      // console.log('shotRef value', snap.val());
      this.currentShotNumber = snap.val().shotNumber;
      this.currentShotSub = snap.val().shotSub;
      this.currentTitle = snap.val().title;
      this.currentDescription = snap.val().description;
      this.currentShotLoc = snap.val().shotLoc;
      this.currentShotTime = snap.val().shotTime;
      this.currentShotType = snap.val().shotType;
      this.currentCameraMovement = snap.val().cameraMovement;
      this.currentPageCount = snap.val().pageCount;
      this.currentPageEighths = snap.val().pageEighths;
      if (snap.child('imageURL').exists()) {
        this.currentImage = snap.val().imageURL;
        this.hasImage = true;
        console.log('this.hasImage', this.hasImage);
      } else {
        this.hasImage = false;
        console.log('this.hasImage', this.hasImage);
      };
    });
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


  //  Save Image
  updatePicture() {
      if (this.pictureTaken == true) {
        let shotImage = this.rawImage;
        this.shotlistData.addShotImage(shotImage);
      };
      if (this.pictureChosen == true) {
        let galleryImage = this.rawGallery;
        this.shotlistData.addShotImage(galleryImage);
      };
    this.showToast('top', 'Picture Updated');
    this.pictureTaken = false;
    this.pictureChosen = false;
  }

  //  Cancel Camera
  cancelPicture() {
    this.pictureTaken = false;
    this.rawImage = null;
    this.base64Image = null;
  }

  //  Delete Picture
  deletePicture() {
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
            this.shotlistData.removeShotImage(this.shotKey);
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

  //  Update Shot Form
  updateShot() {
    if (!this.editShotForm.valid) {
      console.log(this.editShotForm.value);
    } else {
      let shotNumber = this.editShotForm.value.shotNumber;
      let shotSub = this.editShotForm.value.shotSub;
      let shotTitle = this.editShotForm.value.title;
      let shotDescription = this.editShotForm.value.description;
      let shotLoc = this.editShotForm.value.shotLoc;
      let shotTime = this.editShotForm.value.shotTime;
      let shotType = this.editShotForm.value.shotType;
      let cameraMovement = this.editShotForm.value.cameraMovement;
      let pageCount = this.editShotForm.value.pageCount;
      let pageEighths = this.editShotForm.value.pageEighths
      this.shotlistData.updateShot(shotNumber, shotSub, shotTitle, shotDescription, shotLoc, shotTime, shotType, cameraMovement, pageCount, pageEighths);
      console.log('Shot Updated');
      this.showToast('bottom', 'Shot Updated');
      this.view.dismiss();
    }
  }

  //  Delete Shot + Image
  deleteShot() {
     let prompt = this.alert.create({
      title: 'Delete Shot',
      message: "Are you sure?",
      inputs: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          role: 'destructive',
          handler: () => {
             this.shotRef.off();
             // if (this.hasImage == true) {
             //  this.shotlistData.removeShotImage(this.shotKey);
             // };
            this.shotlistData.removeShot(this.shotKey);
            this.showToast('top', 'Shot Deleted');
            this.view.dismiss();
            this.appCtrl.getRootNav().pop();
            console.log('Shot Deleted');
          }
        }
      ]
    });
    prompt.present();
  }

  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });
    toast.present(toast);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave EditShotModal');
    this.shotRef.off();
  }
  
}
