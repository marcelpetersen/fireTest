import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

@IonicPage()
@Component({
  selector: 'page-new-shot',
  templateUrl: 'new-shot.html',
})
export class NewShot {

  public newShotForm: any;
  public loading: any;
  public base64Image: string;
  public rawImage: string;
  public pictureTaken: boolean;

  public rawGallery: string;
  public base64Gallery: string;
  public pictureChosen: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData, private camera: Camera, public alert: AlertController) {
    this.newShotForm = formBuilder.group({
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewShotModal');
  }
  //close this modal
  closeModal() {
  	this.view.dismiss();
  }

  //  Open Camera
  takePicture(){
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
      this.pictureTaken = true;
      this.rawImage = imageData;
      this.base64Image = "data:image/jpeg;base64," + imageData;
      let cameraImageSelector = document.getElementById('camera-image');
      cameraImageSelector.setAttribute('src', this.base64Image);
      }, (err) => {
        console.log(err);
    });
  }

  //  Cancel Camera Image Selection
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

  //  Create New Shot with/without Image
  addShot() {
    if (!this.newShotForm.valid) {
      console.log(this.newShotForm.value);
      let alert = this.alert.create({
        message: 'Please fill out the entire form. <br/>Photos are optional.',
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();    
    } else {
      let shotNumber = this.newShotForm.value.shotNumber;
      let shotSub = this.newShotForm.value.shotSub;
      let shotTitle = this.newShotForm.value.title;
      let shotDescription = this.newShotForm.value.description;
      let shotLoc = this.newShotForm.value.shotLoc;
      let shotTime = this.newShotForm.value.shotTime;
      let shotType = this.newShotForm.value.shotType;
      let cameraMovement = this.newShotForm.value.cameraMovement;
      let pageCount = this.newShotForm.value.pageCount;
      let pageEighths = this.newShotForm.value.pageEighths
      this.shotlistData.createShot(shotNumber, shotSub, shotTitle, shotDescription, shotLoc, shotTime, shotType, cameraMovement, pageCount, pageEighths);
      if (this.pictureTaken == true) {
        let shotImage = this.rawImage;
        this.shotlistData.addShotImage(shotImage);
      };
      if (this.pictureChosen == true) {
        let galleryImage = this.rawGallery;
        this.shotlistData.addShotImage(galleryImage);
      };
      this.view.dismiss();    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave NewShotModal');
  }

}
