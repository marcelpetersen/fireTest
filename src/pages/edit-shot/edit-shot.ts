import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, App } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-edit-shot',
  templateUrl: 'edit-shot.html',
})
export class EditShot {

  public editShotForm: any;
  public loading: any;

  public projectKey: string;
  public sceneKey: string;
  public shotKey: string;
  private shotRef: any;

  public currentShotNumber: number;
  public currentShotSub: string;
  public currentTitle: string;
  public currentDescription: string;
  public currentShotLoc: string;
  public currentShotTime: string;
  public currentShotType: string;
  public currentCameraMovement: string;
  public currentStartPage: number;
  public currentPageCount: number;
  public currentPageEighths: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData, private alert: AlertController, public toastCtrl: ToastController, public appCtrl: App) {
    this.editShotForm = formBuilder.group({
      shotNumber: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      shotSub: ['', Validators.compose([Validators.maxLength(1)])],
      title: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])],
      shotLoc: ['', Validators.compose([Validators.required])],
      shotTime: ['', Validators.compose([Validators.required])],
      shotType: ['', Validators.compose([Validators.required])],
      cameraMovement: ['', Validators.compose([Validators.required])],
      startPage: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageCount: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageEighths: ['', Validators.compose([Validators.required])]
    });
    this.projectKey = this.projectData.projectKey;
    this.sceneKey = this.shotlistData.sceneKey;
    this.shotKey = this.shotlistData.shotKey;
    this.shotRef = firebase.database().ref('/shotlists/' + this.projectKey + '/scenes/' + this.sceneKey + '/shots/' + this.shotKey);
    this.getShot();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProject');
  }

  //close this modal
  closeModal() {
  	this.view.dismiss();
  }
 getShot() {
    this.shotRef.once('value', snap => {
      console.log('shotRef value', snap.val());
      this.currentShotNumber = snap.val().shotNumber;
      this.currentShotSub = snap.val().shotSub;
      this.currentTitle = snap.val().title;
      this.currentDescription = snap.val().description;
      this.currentShotLoc = snap.val().shotLoc;
      this.currentShotTime = snap.val().shotTime;
      this.currentShotType = snap.val().shotType;
      this.currentCameraMovement = snap.val().cameraMovement;
      this.currentStartPage = snap.val().startPage;
      this.currentPageCount = snap.val().pageCount;
      this.currentPageEighths = snap.val().pageEighths;
      console.log('test', this.currentPageEighths);
    });
  }

  updateShot() {
    if (!this.editShotForm.valid) {
      console.log(this.editShotForm.value);
    } else {
      let shotNumber = this.editShotForm.value.shotNumber;
      let shotSub = this.editShotForm.value.shotSub;
      let shotTitle = this.editShotForm.value.title;
      let shotDescription = this.editShotForm.value.description;
      let shotLoc = this.editShotForm.value.shotLoc;
      let shotTime = this.editShotForm.value.shotTime;
      let shotType = this.editShotForm.value.shotType;
      let cameraMovement = this.editShotForm.value.cameraMovement;
      let startPage = this.editShotForm.value.startPage;
      let pageCount = this.editShotForm.value.pageCount;
      let pageEighths = this.editShotForm.value.pageEighths
      this.shotlistData.updateShot(shotNumber, shotSub, shotTitle, shotDescription, shotLoc, shotTime, shotType, cameraMovement, startPage, pageCount, pageEighths);
      console.log('Shot Updated');
      this.showToast('bottom', 'Shot Updated');
      this.view.dismiss();
    }
  }

  deleteShot() {
     let prompt = this.alert.create({
      title: 'Delete Shot',
      message: "Are you sure?",
      inputs: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          role: 'destructive',
          handler: () => {
            console.log('Save clicked');
            this.shotlistData.removeShot(this.shotKey);
            this.view.dismiss();
            this.appCtrl.getRootNav().pop();
            console.log('Shot Deleted');
            this.showToast('bottom', 'Shot Deleted');
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
    console.log('ionViewDidLeave EditShotModal');
  }
  
}
