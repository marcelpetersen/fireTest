import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

//import { ScenesPage } from '../scenes/scenes';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-title',
  templateUrl: 'title.html'
})
export class TitlePage {
  public projectKey: any = this.navParams.get('projectKey');
  public shotlistKey: any = this.navParams.get('projectKey');

  public currentProject: FirebaseObjectObservable<any>;
  public scenesList: FirebaseListObservable<any>;

  private projectRef: any;
  private shotlistRef: any;
  private scenesRef: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public viewCtrl: ViewController, public toastCtrl: ToastController, public projectData: ProjectData, public shotlistData: ShotlistData, private modal: ModalController) {
        
        this.currentProject = db.object('/projects/' + this.projectKey);
        this.scenesList = db.list('/shotlists/' +this.projectKey + '/scenes/');

        this.projectRef = firebase.database().ref('projects').child(this.projectKey);
        this.shotlistRef = firebase.database().ref('shotlists').child(this.shotlistKey);
        this.scenesRef = firebase.database().ref('shotlists').child(this.shotlistKey).child('scenes');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TitlePage');
  }

  //Open the Edit Project modal
  editProject() {
    const editProjectModal = this.modal.create('EditProject');
    editProjectModal.present();
  }
 
  //Open the New Scene modal
  addScene() {
    const newSceneModal = this.modal.create('NewScene');
    newSceneModal.present();
  }

  // Go To Scene
  sceneTapped(sceneKey: string) {
    this.projectData.setSceneKey(sceneKey);
    this.shotlistData.setSceneKey(sceneKey);
    this.navCtrl.push('ScenesPage', {
      sceneKey: sceneKey
    });
  }
  
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });
    toast.present(toast);
  }

}
