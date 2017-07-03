import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';

import * as firebase from 'firebase';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

//import { TitlePage } from '../title/title'

/**
 * Generated class for the UserProjects page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-projects',
  templateUrl: 'user-projects.html',
})
export class UserProjects {

  private userKey: string;
  private rootRef = firebase.database().ref();
  private projectsRef = firebase.database().ref().child('projects');
  private projectsByUserRef: any;
  public userProjects = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService, db: AngularFireDatabase, private modal: ModalController, public projectData: ProjectData,  public shotlistData: ShotlistData) {
  	    this.userKey = this.authService.currentUser.uid;
  	    this.projectsByUserRef = this.rootRef.child('projectsByUser').child(this.userKey);
  	    this.getUserProjects();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProjects');
  }

  //Get all of the current user's projects from db/projectByUser and set to an array
  getUserProjects() {
    this.projectsByUserRef.once('value', snap => console.log('projectsByUserRef value', snap.val()));
    this.projectsByUserRef.on('child_added', snap => {
    	let projectRef = this.projectsRef.child(snap.key);
    	projectRef.once('value', snap => {
        console.log('projectRef value', snap.val());
        this.userProjects.push(snap.val());
      });
    });
  };

  //Open the New Project modal
  addProject() {
    const newProjectModal = this.modal.create('NewProject');
    newProjectModal.present();
  };

  projectTapped(projectKey) {
    this.projectData.setCurrentProject(projectKey);
    this.shotlistData.setCurrentProject(projectKey);
    this.navCtrl.push('TitlePage', {
      projectKey: projectKey
    });
  }

}
