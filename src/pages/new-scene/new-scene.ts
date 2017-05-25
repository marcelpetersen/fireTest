import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

/**
 * Generated class for the NewScene page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-new-scene',
  templateUrl: 'new-scene.html',
})
export class NewScene {

  public newSceneForm: any;
  public loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData) {
    this.newSceneForm = formBuilder.group({
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewScene');
  }
  //close this modal
  closeModal() {
  	this.view.dismiss();
  }

  addScene() {
    if (!this.newSceneForm.valid) {
      console.log(this.newSceneForm.value);
    } else {
      let sceneNumber = this.newSceneForm.value.sceneNumber;
      let sceneSub = this.newSceneForm.value.sceneSub;
      let sceneTitle = this.newSceneForm.value.title;
      let sceneDescription = this.newSceneForm.value.description;
      let sceneLoc = this.newSceneForm.value.sceneLoc;
      let sceneTime = this.newSceneForm.value.sceneTime;
      let startPage = this.newSceneForm.value.startPage;
      let pageCount = this.newSceneForm.value.pageCount;
      let pageEighths = this.newSceneForm.value.pageEighths
      console.log(sceneNumber);
      console.log(sceneSub);
      console.log(sceneTitle);
      console.log(sceneDescription);
      console.log(sceneLoc);
      console.log(sceneTime);
      console.log(startPage);
      console.log(pageCount);
      console.log(pageEighths);
      this.shotlistData.createScene(sceneNumber, sceneSub, sceneTitle, sceneDescription, sceneLoc, sceneTime, startPage, pageCount, pageEighths);
      this.view.dismiss();
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave NewSceneModal');
  }

}
