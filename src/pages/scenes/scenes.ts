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

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController, public projectData: ProjectData, public shotlistData: ShotlistData, private modal: ModalController) {
    
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

//   showOptions(sceneKey: string, sceneTitle: string, sceneDescription: string) {
//     let actionSheet = this.actionSheetCtrl.create({
//       title: 'Scene Options:',
//       buttons: [
//         {
//           text: 'Delete Scene',
//           role: 'destructive',
//           handler: () => {
//             this.shotlistData.removeScene(sceneKey);
//             this.navCtrl.pop();
//           }
//         },{
//           text: 'Update Scene Details',
//           handler: () => {
//             this.updateScene(sceneKey, sceneTitle, sceneDescription);
//           }
//         },{
//           text: 'Add Scene Photo',
//           handler: () => {
//             console.log('Add Photo clicked');          
//           }
//         },{
//           text: 'Cancel',
//           role: 'cancel',
//           handler: () => {
//             console.log('Cancel clicked');
//           }
//         }
//       ]
//     });
//     actionSheet.present();
//   }

//   removeScene(sceneKey: string): firebase.Promise<any> {
//     // get sceneKey as variable
//     var sceneKey: string = sceneKey;
//     // get projectKey as variable
//     //var projectKey: string = this.projectKey;
//     // remove sceneKey at /shotlists/projectKey/scenes/sceneKey/
//     return firebase.database().ref().child('shotlists/' + this.projectKey).child('scenes/' + this.sceneKey).remove();
//   };

//   updateScene(sceneKey: string, sceneTitle: string, sceneDescription: string) {
//     let prompt = this.alertCtrl.create({
//       title: 'Scene Details',
// //      message: "Update the Details for this Scene",
//       inputs: [
//         {
//           name: 'title',
//           placeholder: 'Title',
//           value: sceneTitle
//         },
//         {
//           name: 'description',
//           placeholder: 'Description',
//           value: sceneDescription
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
//             this.shotlistsRef.child(this.projectKey).child('scenes').child(sceneKey).update({
//               title: data.title,
//               description: data.description            
//             });
//             console.log('project updated by projectsProvider')
//           }
//         }
//       ]
//     });
//     prompt.present();
//   }

/*
  //Open the New Shot modal
  addShot() {
    const newShotModal = this.modal.create('NewShot');
    newShotModal.present();
  }
*/

//   addShot(){
//     let prompt = this.alertCtrl.create({
//       title: 'New Shot',
// //      message: "Enter Shot Details",
//       inputs: [
//         {
//           name: 'title',
//           placeholder: 'Title'
//         },
//         {
//           name: 'description',
//           placeholder: 'Description'
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
//             console.log('Save clicked'); 
//             this.createShot(data.title, data.description);
//           }
//         }
//       ]
//     });
//     prompt.present();
//   }

  // createShot(shotTitle: string, shotDescription: string): firebase.Promise<any> {
  //   // get newShotRef
  //   var newShotRef = this.shotsRef.push();
  //   // assign newKey to variable
  //   //var newKey: string  = newShotRef.key;
  //   var sceneCount: number = 0;
  //   var shotCount: number = 0;
  //   var pageCount: number = 0;
  //   // push shot details to newShotRef
  //   return newShotRef.set({
  //     title: shotTitle,
  //     description: shotDescription,
  //     sceneCount: sceneCount,
  //     shotCount: shotCount,
  //     pageCount: pageCount
  //   });
  // }

  shotTapped(event, shotKey) {
    this.projectData.setShotKey(shotKey);
    this.shotlistData.setShotKey(shotKey);
    this.navCtrl.push(ShotsPage, {
      shotKey: shotKey
    });
  }

}