import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

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

  //  Open EditShot Modal
  editShot() {
    const editShotModal = this.modal.create('EditShot');
    editShotModal.present();
  }

  presentActionSheet1() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
       {
          text: 'Edit Shot',
          handler: () => {
            this.editShot();
            console.log('Edit Shot clicked');
          }
        }, {
          text: 'Delete Shot',
          role: 'destructive',
          handler: () => {
            // this.deleteShot();
            console.log('Delete Shot clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  //  Shot has takes?
  get hasTakes() {
    if (this.shotlistData.takeCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  //  Add new Take
  addTake() {
    console.log('addTake');
    this.shotlistData.createTake();
  }

  //  Delete Take
  deleteTake(takeKey: string) {
    console.log('deleteTake');
    this.shotlistData.removeTake(takeKey);
  }

  //  Add Take Note
  takeNote() {
    console.log('Take Note');
    // this.shotlistData.updateTake(takeNote);
  }

  //  Thumb Take
  thumbTake() {

  }

  //  Star Take
  starTake() {
    this.shotlistData.starTake();
  }

}
