import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AlertController, ActionSheetController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';


//import { TitlePage } from '../title/title'

//import * as firebase from 'firebase/app'; // app and typings

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html'
})
export class ProjectsPage {

  public projectsList: FirebaseListObservable<any>;
  public userKey: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public projectData: ProjectData, public shotlistData: ShotlistData, public authService: AuthService, private modal: ModalController) {
    this.userKey = this.authService.currentUser.uid;
    this.projectsList = db.list('/projects/');
  }

  getProjectsList(): any {
  return this.projectsList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
  }

  //Open the New Project modal
  addProject() {
    const newProjectModal = this.modal.create('NewProject');
    newProjectModal.present();
  }
   
  projectTapped(projectKey) {
    this.projectData.setCurrentProject(projectKey);
    this.shotlistData.setCurrentProject(projectKey);
    this.navCtrl.push('TitlePage', {
      projectKey: projectKey
    });
  }

}
