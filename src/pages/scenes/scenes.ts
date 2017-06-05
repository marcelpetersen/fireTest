import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AlertController, ActionSheetController } from 'ionic-angular';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

import { ShotsPage } from '../shots/shots';

import * as firebase from 'firebase';

@Component({
  selector: 'page-scenes',
  templateUrl: 'scenes.html'
})
export class ScenesPage {

  public projectKey: any;
  public shotlistKey: any;
  public sceneKey: any;

  public currentScene: FirebaseObjectObservable<any>;
  public shotsList: FirebaseListObservable<any>;
  private shotlistsRef: any;
  private shotsRef: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public projectData: ProjectData, public shotlistData: ShotlistData, private modal: ModalController) {
    
    this.sceneKey = navParams.get('sceneKey');
    this.projectKey = this.projectData.projectKey;
    this.shotlistKey = this.projectData.projectKey;
    this.currentScene = db.object('/shotlists/' + this.projectKey + '/scenes/' + this.sceneKey);
    this.shotlistsRef = firebase.database().ref('shotlists');
    this.shotsRef = firebase.database().ref('shotlists').child(this.shotlistKey).child('scenes').child(this.sceneKey).child('shots');
    this.shotsList = db.list('/shotlists/' + this.projectKey + '/scenes/' + this.sceneKey + '/shots/');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScenesPage');
  }

 // Open the Edit Scene modal
  editScene() {
    const editSceneModal = this.modal.create('EditScene');
    editSceneModal.present();
  }

  //Open the New Shot modal
  addShot() {
    const newShotModal = this.modal.create('NewShot');
    newShotModal.present();
  }

  shotTapped(event, shotKey) {
    this.projectData.setShotKey(shotKey);
    this.shotlistData.setShotKey(shotKey);
    this.navCtrl.push(ShotsPage, {
      shotKey: shotKey
    });
  }

}