import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

@IonicPage()
@Component({
  selector: 'page-new-scene',
  templateUrl: 'new-scene.html',
})
export class NewScene {

  public newSceneForm: any;
  public loading: any;
  public base64Image: string;
  public rawImage: string;
  public pictureTaken: boolean;

  public rawGallery: string;
  public base64Gallery: string;
  public pictureChosen: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData, private camera: Camera, public alert: AlertController) {
    this.newSceneForm = formBuilder.group({
      sceneNumber: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      sceneSub: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      title: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])],
      sceneLoc: ['', Validators.compose([Validators.required])],
      sceneTime: ['', Validators.compose([Validators.required])],
      pageCount: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageEighths: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewScene');
  }
  //  close this modal
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

  //  Create New Scene with/without Image
  addScene() {
    if (!this.newSceneForm.valid) {
      console.log(this.newSceneForm.value);
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
      let sceneNumber = this.newSceneForm.value.sceneNumber;
      let sceneSub = this.newSceneForm.value.sceneSub;
      let sceneTitle = this.newSceneForm.value.title;
      let sceneDescription = this.newSceneForm.value.description;
      let sceneLoc = this.newSceneForm.value.sceneLoc;
      let sceneTime = this.newSceneForm.value.sceneTime;
      let pageCount = this.newSceneForm.value.pageCount;
      let pageEighths = this.newSceneForm.value.pageEighths;
      this.shotlistData.createScene(sceneNumber, sceneSub, sceneTitle, sceneDescription, sceneLoc, sceneTime, pageCount, pageEighths);
      if (this.pictureTaken == true) {
        let sceneImage = this.rawImage;
        this.shotlistData.addSceneImage(sceneImage);
      };
      if (this.pictureChosen == true) {
        let galleryImage = this.rawGallery;
        this.shotlistData.addSceneImage(galleryImage);
      };
      this.view.dismiss();
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave NewSceneModal');
  }

}
