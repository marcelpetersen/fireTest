import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AlertController, ActionSheetController } from 'ionic-angular';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-shots',
  templateUrl: 'shots.html'
})
export class ShotsPage {

  public projectKey: any;
  public shotlistKey: any;
  public sceneKey: any;
  public shotKey: any;

  public currentShot: FirebaseObjectObservable<any>;
  private shotlistsRef: any;

  public takesList: FirebaseListObservable<any>;


  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController, public projectData: ProjectData, public shotlistData: ShotlistData, private modal: ModalController) {

  	this.shotKey = navParams.get('shotKey');
    this.sceneKey = this.projectData.sceneKey;
    this.projectKey = this.projectData.projectKey;
    this.shotlistKey = this.projectData.projectKey;
    this.currentShot = db.object('/shotlists/' + this.projectKey + '/scenes/' + this.sceneKey + '/shots/' + this.shotKey);
    this.shotlistsRef = firebase.database().ref('shotlists');
    this.shotlistData.updateTakeCount();
    this.takesList = db.list('/shotlists/' + this.projectKey + '/scenes/' + this.sceneKey + '/shots/' + this.shotKey + '/takes/');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShotsPage');
    console.log('takeCount:', this.shotlistData.takeCount)
  }

  editShot() {
    const editShotModal = this.modal.create('EditShot');
    editShotModal.present();
  }

  //Add new Take
  addTake() {
    console.log('addTake');
    this.shotlistData.createTake();
  }

  deleteTake(takeKey: string) {
    console.log('addTake');
    this.shotlistData.removeTake(takeKey);
  }

}
