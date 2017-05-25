import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, App } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-edit-scene',
  templateUrl: 'edit-scene.html',
})
export class EditScene {

  public editSceneForm: any;
  public loading: any;

  public projectKey: string;
  public sceneKey: string;
  private sceneRef: any;

  public currentSceneNumber: number;
  public currentSceneSub: string;
  public currentTitle: string;
  public currentDescription: string;
  public currentSceneLoc: string;
  public currentSceneTime: string;
  public currentStartPage: number;
  public currentPageCount: number;
  public currentPageEighths: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData, private alert: AlertController, public toastCtrl: ToastController, public appCtrl: App) {
    this.editSceneForm = formBuilder.group({
      sceneNumber: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      sceneSub: ['', Validators.compose([Validators.maxLength(1)])],
      title: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.required])],
      sceneLoc: ['', Validators.compose([Validators.required])],
      sceneTime: ['', Validators.compose([Validators.required])],
      startPage: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageCount: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.required])],
      pageEighths: ['', Validators.compose([Validators.required])]
    });
    this.projectKey = this.projectData.projectKey;
    this.sceneKey = this.shotlistData.sceneKey;
    this.sceneRef = firebase.database().ref('/shotlists/' + this.projectKey + '/scenes/' + this.sceneKey);
    console.log('editScene projectKey:', this.projectKey);
    console.log('editScene sceneKey:', this.sceneKey);
    this.getScene();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProject');
  }

  //close this modal
  closeModal() {
  	this.view.dismiss();
  }

 getScene() {
//      this.sceneRef = firebase.database().ref('/projects/' + this.projectKey + '/scenes/' + this.sceneKey);

      this.sceneRef.once('value', snap => {
      console.log('sceneRef value', snap.val());
      this.currentSceneNumber = snap.val().sceneNumber;
      this.currentSceneSub = snap.val().sceneSub;
      this.currentTitle = snap.val().title;
      this.currentDescription = snap.val().description;
      this.currentSceneLoc = snap.val().sceneLoc;
      this.currentSceneTime = snap.val().sceneTime;
      this.currentStartPage = snap.val().startPage;
      this.currentPageCount = snap.val().pageCount;
      this.currentPageEighths = snap.val().pageEighths;
      console.log('test:', this.currentPageEighths);
    });
  }

  updateScene() {
    if (!this.editSceneForm.valid) {
      console.log(this.editSceneForm.value);
    } else {
      let sceneNumber = this.editSceneForm.value.sceneNumber;
      let sceneSub = this.editSceneForm.value.sceneSub;
      let sceneTitle = this.editSceneForm.value.title;
      let sceneDescription = this.editSceneForm.value.description;
      let sceneLoc = this.editSceneForm.value.sceneLoc;
      let sceneTime = this.editSceneForm.value.sceneTime;
      let startPage = this.editSceneForm.value.startPage;
      let pageCount = this.editSceneForm.value.pageCount;
      let pageEighths = this.editSceneForm.value.pageEighths
      console.log(sceneNumber);
      console.log(sceneSub);
      console.log(sceneTitle);
      console.log(sceneDescription);
      console.log(sceneLoc);
      console.log(sceneTime);
      console.log(startPage);
      console.log(pageCount);
      console.log(pageEighths);
      this.shotlistData.updateScene(sceneNumber, sceneSub, sceneTitle, sceneDescription, sceneLoc, sceneTime, startPage, pageCount, pageEighths);
      console.log('Scene Updated');
      this.showToast('bottom', 'Scene Updated');
      this.view.dismiss();
    }
  }

  deleteScene() {
     let prompt = this.alert.create({
      title: 'Delete Scene',
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
            this.shotlistData.removeScene(this.sceneKey);
            this.view.dismiss();
            this.appCtrl.getRootNav().pop();
            console.log('Scene Deleted');
            this.showToast('bottom', 'Scene Deleted');
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
    console.log('ionViewDidLeave EditSceneModal');
  }

}
