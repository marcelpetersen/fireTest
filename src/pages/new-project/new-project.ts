import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

import { ProjectData } from '../../providers/project-data';

/**
 * Generated class for the NewProject page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
  public placeholderImage: string = "https://placehold.it/800x450?text=Add+a+photo";
  private pictureTaken: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, private camera: Camera) {
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

  //close this modal
  closeModal() {
  	this.view.dismiss();
  }

  takePicture(){
    let options = {
      targetWidth: 800,
      targetHeight: 450,
      quality: 100,
      allowEdit: true,
      correctOrientation: false,
      saveToPhotoAlbum: true,
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

  addProject() {
    if (!this.newProjectForm.valid) {
      console.log(this.newProjectForm.value);
    } else {
      let projectTitle = this.newProjectForm.value.title;
      let projectDescription = this.newProjectForm.value.description;
      let pageCount = this.newProjectForm.value.pageCount;
      let pageEighths = this.newProjectForm.value.pageEighths;
      let projectImage = this.rawImage;
      this.projectData.createProject(projectImage ,projectTitle, projectDescription, pageCount, pageEighths);
      this.view.dismiss();
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave NewProjectModal');
  }

}
