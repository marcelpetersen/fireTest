import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, App } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-edit-scene',
  templateUrl: 'edit-scene.html',
})
export class EditScene {

  public editSceneForm: any;
  public loading: any;

  public projectKey: string;
  public sceneKey: string;
  private sceneRef: any;

  public currentImage: string;
  public currentSceneNumber: number;
  public currentSceneSub: string;
  public currentTitle: string;
  public currentDescription: string;
  public currentSceneLoc: string;
  public currentSceneTime: string;
  // public currentStartPage: number;
  public currentPageCount: number;
  public currentPageEighths: number;

  public base64Image: string;
  public rawImage: string;
  public placeholderImage: string = "https://placehold.it/1000x1000?text=Add+a+photo";
  private pictureTaken: boolean;
  private hasImage: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData, private alert: AlertController, public toastCtrl: ToastController, public appCtrl: App, private camera: Camera) {
    this.editSceneForm = formBuilder.group({
      sceneNumber: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      sceneSub: ['', Validators.compose([Validators.maxLength(1)])],
      title: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])],
      sceneLoc: ['', Validators.compose([Validators.required])],
      sceneTime: ['', Validators.compose([Validators.required])],
      // startPage: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageCount: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageEighths: ['', Validators.compose([Validators.required])]
    });
    this.projectKey = this.projectData.projectKey;
    this.sceneKey = this.shotlistData.sceneKey;
    this.sceneRef = firebase.database().ref('/shotlists/' + this.projectKey + '/scenes/' + this.sceneKey);
    this.getScene();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProject');
  }

  //close this modal
  closeModal() {
  	this.view.dismiss();
  }

  getScene() {
      this.sceneRef.on('value', snap => {
      console.log('sceneRef value', snap.val());
      this.currentSceneNumber = snap.val().sceneNumber;
      this.currentSceneSub = snap.val().sceneSub;
      this.currentTitle = snap.val().title;
      this.currentDescription = snap.val().description;
      this.currentSceneLoc = snap.val().sceneLoc;
      this.currentSceneTime = snap.val().sceneTime;
      // this.currentStartPage = snap.val().startPage;
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
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      let cameraImageSelector = document.getElementById('camera-image');
      cameraImageSelector.setAttribute('src', this.base64Image);
      this.pictureTaken = true;
      }, (err) => {
        console.log(err);
    });
  }

  updatePicture() {
    this.showToast('top', 'Picture Updated');
    this.shotlistData.updateSceneImage(this.rawImage);
    this.pictureTaken = false;
  }

  cancelPicture() {
    this.pictureTaken = false;
    this.rawImage = null;
    this.base64Image = null;
  }

  deletePicture(): firebase.Promise<any>{
    return firebase.storage().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('sceneImage.jpeg').delete().then(() => {
      return firebase.database().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('imageURL').set(null);
    });
  }

///////TEST/////////

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
            this.deletePicture();
            this.hasImage = false;
            console.log('Picture Deleted');
            this.showToast('top', 'Picture Deleted');
          }
        }
      ]
    });
    prompt.present();
  }

///////TEST/////////


  updateScene() {
    if (!this.editSceneForm.valid) {
      console.log(this.editSceneForm.value);
    } else {
      let sceneNumber = this.editSceneForm.value.sceneNumber;
      let sceneSub = this.editSceneForm.value.sceneSub;
      let sceneTitle = this.editSceneForm.value.title;
      let sceneDescription = this.editSceneForm.value.description;
      let sceneLoc = this.editSceneForm.value.sceneLoc;
      let sceneTime = this.editSceneForm.value.sceneTime;
      // let startPage = this.editSceneForm.value.startPage;
      let pageCount = this.editSceneForm.value.pageCount;
      let pageEighths = this.editSceneForm.value.pageEighths
      this.shotlistData.updateScene(sceneNumber, sceneSub, sceneTitle, sceneDescription, sceneLoc, sceneTime, pageCount, pageEighths);
      console.log('Scene Updated');
      this.showToast('bottom', 'Scene Updated');
      this.view.dismiss();
    }
  }

  deleteScene() {
     let prompt = this.alert.create({
      title: 'Delete Scene',
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
             this.sceneRef.off();
            // if (this.hasImage == true) {
            //   this.shotlistData.removeSceneImage(this.projectKey);
            // };
            this.shotlistData.removeScene(this.sceneKey);
            this.view.dismiss();
            this.appCtrl.getRootNav().pop();
            console.log('Scene Deleted');
            this.showToast('bottom', 'Scene Deleted');
          }
        }
      ]
    });
    prompt.present();
  }
 
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });
    toast.present(toast);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave EditSceneModal');
    this.sceneRef.off();
  }

}
