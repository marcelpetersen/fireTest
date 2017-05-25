import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AlertController, ActionSheetController } from 'ionic-angular';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

import * as firebase from 'firebase';

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
  // addTake() {
  //   console.log('addTake')
  //   var i:number = this.shotlistData.takeCount;
  //   console.log('i:', i);
  //   i++;
  //   console.log('i++:', i);
  //   var newCount: number = i;
  //   console.log('newCount:', newCount)
  // }

  //Add new Take
  addTake() {
    console.log('addTake');
    this.shotlistData.createTake();
  }

  deleteTake(takeKey: string) {
    console.log('addTake');
    this.shotlistData.removeTake(takeKey);
  }

  // showOptions(shotKey: string, shotTitle: string, shotDescription: string) {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Shot Options:',
  //     buttons: [
  //       {
  //         text: 'Delete Shot',
  //         role: 'destructive',
  //         handler: () => {
  //           this.removeShot(shotKey);
  //           this.navCtrl.pop();
  //         }
  //       },{
  //         text: 'Update Shot Details',
  //         handler: () => {
  //           this.updateShot(shotKey, shotTitle, shotDescription);
  //         }
  //       },{
  //         text: 'Add Shot Photo',
  //         handler: () => {
  //           console.log('Add Photo clicked');          
  //         }
  //       },{
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }

//   removeShot(shotKey: string): firebase.Promise<any> {
//     // get shotKey as variable
//     var shotKey: string = shotKey;
//     // get projectKey and sceneKey as variable
//     //var projectKey: string = this.projectKey;
//     //var sceneKey: string = this.sceneKey;
//     // remove shotKey at /shotlists/projectKey/scenes/sceneKey/shots/shotKey
//     return firebase.database().ref().child('shotlists/' + this.projectKey).child('scenes/' + this.sceneKey).child('shots/' + shotKey).remove();
//   };

//   updateShot(shotKey: string, shotTitle: string, shotDescription: string) {
//     let prompt = this.alertCtrl.create({
//       title: 'Shot Details',
// //      message: "Update the Details for this Shot",
//       inputs: [
//         {
//           name: 'title',
//           placeholder: 'Title',
//           value: shotTitle
//         },
//         {
//           name: 'description',
//           placeholder: 'Description',
//           value: shotDescription
//         },
//       ],
//       buttons: [
//         {
//           text: 'Cancel',
//           handler: data => {
//             console.log('Cancel clicked');
//           }
//         },
//         {
//           text: 'Save',
//           handler: data => {
//             // TODO: update this ref
//             this.shotlistsRef.child(this.projectKey).child('scenes').child(this.sceneKey).child('shots').child(shotKey).update({
//               title: data.title,
//               description: data.description            
//             });
//             console.log('shot updated by shotsPage')
//           }
//         }
//       ]
//     });
//     prompt.present();
//   }

  // takeTapped(event, takeKey) {
  //   this.projectData.setTakeKey(takeKey);
  //   this.shotlistData.setTakeKey(takeKey);
  //   this.navCtrl.push(TakesPage, {
  //     takeKey: takeKey
  //   });
  // }

}
