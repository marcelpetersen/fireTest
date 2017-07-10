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
  private pictureTaken: boolean;
  private hasImage: boolean;

  public rawGallery: string;
  public base64Gallery: string;
  private pictureChosen: boolean;

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

  // Upload Image
  updatePicture() {
      if (this.pictureTaken == true) {
        let projectImage = this.rawImage;
        this.projectData.updateImage(projectImage);
      };
      if (this.pictureChosen == true) {
        let galleryImage = this.rawGallery;
        this.projectData.updateImage(galleryImage);
      };
    this.showToast('top', 'Picture Updated');
    this.pictureTaken = false;
    this.pictureChosen = false;
  }

  //  Cancel Camera Picture
  cancelPicture() {
    this.pictureTaken = false;
    this.rawImage = null;
    this.base64Image = null;
  }

  //  Remove Project Image
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
            this.projectData.removeImage(this.projectKey);
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

 //   Update Project Form
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

  //  Delete Project + Image
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
              this.projectData.removeImage(this.projectKey);
            };
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
