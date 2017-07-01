import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

/**
 * Generated class for the NewScene page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
  public placeholderImage: string = "https://placehold.it/800x450?text=Add+a+photo";
  private pictureTaken: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData, private camera: Camera) {
    this.newSceneForm = formBuilder.group({
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewScene');
  }
  //close this modal
  closeModal() {
  	this.view.dismiss();
  }

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
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      let cameraImageSelector = document.getElementById('camera-image');
      cameraImageSelector.setAttribute('src', this.base64Image);
      }, (err) => {
        console.log(err);
    });
  }

  cancelPicture() {
    this.pictureTaken = false;
    this.rawImage = null;
    this.base64Image = null;
  }

  addScene() {
    if (!this.newSceneForm.valid) {
      console.log(this.newSceneForm.value);
    } else {
      let sceneImage = this.rawImage;
      let sceneNumber = this.newSceneForm.value.sceneNumber;
      let sceneSub = this.newSceneForm.value.sceneSub;
      let sceneTitle = this.newSceneForm.value.title;
      let sceneDescription = this.newSceneForm.value.description;
      let sceneLoc = this.newSceneForm.value.sceneLoc;
      let sceneTime = this.newSceneForm.value.sceneTime;
      // let startPage = this.newSceneForm.value.startPage;
      let pageCount = this.newSceneForm.value.pageCount;
      let pageEighths = this.newSceneForm.value.pageEighths;
      this.shotlistData.createScene(sceneImage, sceneNumber, sceneSub, sceneTitle, sceneDescription, sceneLoc, sceneTime, pageCount, pageEighths);
      this.view.dismiss();
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave NewSceneModal');
  }

}
