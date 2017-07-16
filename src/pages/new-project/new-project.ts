import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../../providers/project-data';

@IonicPage()
@Component({
  selector: 'page-new-project',
  templateUrl: 'new-project.html',
})
export class NewProject {

  public newProjectForm: any;
  public loading: any;
  public base64Image: string;
  public rawImage: string;
  private pictureTaken: boolean;

  public rawGallery: string;
  public base64Gallery: string;
  private pictureChosen: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, private camera: Camera, public alert: AlertController) {
    this.newProjectForm = formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])],
      pageCount: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageEighths: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewProjectModal');
  }

//  close this modal
  closeModal() {
  	this.view.dismiss();
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
      this.pictureChosen = false;
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

  //  Create New Project with/without Image
  addProject() {
    if (!this.newProjectForm.valid) {
      console.log(this.newProjectForm.value);
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
      let projectTitle = this.newProjectForm.value.title;
      let projectDescription = this.newProjectForm.value.description;
      let pageCount = this.newProjectForm.value.pageCount;
      let pageEighths = this.newProjectForm.value.pageEighths;
      this.projectData.createProject(projectTitle, projectDescription, pageCount, pageEighths);
      if (this.pictureTaken == true) {
        let projectImage = this.rawImage;
        this.projectData.updateImage(projectImage);
      };
      if (this.pictureChosen == true) {
        let galleryImage = this.rawGallery;
        this.projectData.updateImage(galleryImage);
      };
      this.view.dismiss();
      // this.navCtrl.push('TitlePage', {
      //   projectKey: this.projectData.projectKey
      // });
 
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave NewProjectModal');
  }

}
