import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, App } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

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

  public currentTitle: string;
  public currentDescription: string;
  public currentPageCount: number;
  public currentPageEighths: number;


  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, private alert: AlertController, public toastCtrl: ToastController, public appCtrl: App) {
    this.editProjectForm = formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])],
      pageCount: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageEighths: ['', Validators.compose([Validators.required])]
    });
    this.projectKey = this.projectData.projectKey;
    this.titleRef = firebase.database().ref('/projects/' + this.projectKey);
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
    this.titleRef.once('value', snap => {
      console.log('titleRef value', snap.val());
      this.currentTitle = snap.val().title;
      this.currentDescription = snap.val().description;
      this.currentPageCount = snap.val().pageCount;
      this.currentPageEighths = snap.val().pageEighths;
      console.log(this.currentTitle);
    });
  }

  updateProject() {
    if (!this.editProjectForm.valid) {
      console.log(this.editProjectForm.value);
    } else {
      let projectTitle = this.editProjectForm.value.title;
      let projectDescription = this.editProjectForm.value.description;
      let pageCount = this.editProjectForm.value.pageCount;
      let pageEighths = this.editProjectForm.value.pageEighths;
      console.log(projectTitle);
      console.log(projectDescription);
      console.log(pageCount);
      console.log(pageEighths);
      this.projectData.updateProject(projectTitle, projectDescription, pageCount, pageEighths);
      this.showToast('bottom', 'Project Updated');
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
            this.projectData.removeProject(this.projectKey);
            this.view.dismiss();
            this.appCtrl.getRootNav().pop();
            console.log('Project Deleted');
            this.showToast('bottom', 'Project Deleted');
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
    console.log('ionViewDidLeave EditProjectModal');
  }

}
