import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData) {
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

  addProject() {
    if (!this.newProjectForm.valid) {
      console.log(this.newProjectForm.value);
    } else {
      let projectTitle = this.newProjectForm.value.title;
      let projectDescription = this.newProjectForm.value.description;
      let pageCount = this.newProjectForm.value.pageCount;
      let pageEighths = this.newProjectForm.value.pageEighths;
      console.log(projectTitle);
      console.log(projectDescription);
      console.log(pageCount);
      console.log(pageEighths);
      this.projectData.createProject(projectTitle, projectDescription, pageCount, pageEighths);
      this.view.dismiss();
      console.log('New Project Created');
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave NewProjectModal');
  }

}
