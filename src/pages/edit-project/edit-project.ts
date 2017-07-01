import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, App } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../../providers/project-data';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-edit-project',
  templateUrl: 'edit-project.html',
})
export class EditProject {

  public editProjectForm: any;
  public loading: any;

  public projectKey: string;
  private titleRef: any;
  private storageRef: any;

  public currentImage: string;
  public currentTitle: string;
  public currentDescription: string;
  public currentPageCount: number;
  public currentPageEighths: number;

  public base64Image: string;
  public rawImage: string;
  public placeholderImage: string = "https://placehold.it/1000x1000?text=Add+a+photo";
  private pictureTaken: boolean;
  private hasImage: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, private alert: AlertController, public toastCtrl: ToastController, public appCtrl: App, private camera: Camera) {
    this.editProjectForm = formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])],
      pageCount: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageEighths: ['', Validators.compose([Validators.required])]
    });
    this.projectKey = this.projectData.projectKey;
    this.titleRef = firebase.database().ref('/projects/' + this.projectKey);
    this.storageRef = firebase.storage().ref('/projects/' + this.projectKey);
    this.getProject();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProject');
  }

  //close this modal
  closeModal() {
  	this.view.dismiss();
  }

 getProject() {
    this.titleRef.on('value', snap => {
//      this.currentImage = snap.val().imageURL;
      this.currentTitle = snap.val().title;
      this.currentDescription = snap.val().description;
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
    this.projectData.updateImage(this.rawImage);
    this.pictureTaken = false;
  }

  cancelPicture() {
    this.pictureTaken = false;
    this.rawImage = null;
    this.base64Image = null;
  }

  deletePicture(): firebase.Promise<any>{
    return firebase.storage().ref().child('/projects/' + this.projectKey).child('projectImage.jpeg').delete().then(() => {
      return firebase.database().ref().child('/projects/' + this.projectKey).child('imageURL').set(null);
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


  updateProject() {
    if (!this.editProjectForm.valid) {
      console.log(this.editProjectForm.value);
    } else {
      let projectTitle = this.editProjectForm.value.title;
      let projectDescription = this.editProjectForm.value.description;
      let pageCount = this.editProjectForm.value.pageCount;
      let pageEighths = this.editProjectForm.value.pageEighths;
      this.projectData.updateProject(projectTitle, projectDescription, pageCount, pageEighths);
      this.showToast('top', 'Project Updated');
      this.view.dismiss();
      console.log('Project Updated');
    }
  }

  deleteProject() {
     let prompt = this.alert.create({
      title: 'Delete Project',
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
            this.titleRef.off();
            if (this.hasImage == true) {
//              this.projectData.removeImage(this.projectKey);
              this.deletePicture();
            };
//            this.titleRef.off();
            this.projectData.removeProject(this.projectKey);
            this.showToast('top', 'Project Deleted');
            this.view.dismiss();
            this.appCtrl.getRootNav().pop();
            console.log('Project Deleted');
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
    console.log('ionViewDidLeave EditProjectModal');
    this.titleRef.off();
  }

}
