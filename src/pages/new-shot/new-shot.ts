import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { ProjectData } from '../../providers/project-data';
import { ShotlistData } from '../../providers/shotlist-data';

@IonicPage()
@Component({
  selector: 'page-new-shot',
  templateUrl: 'new-shot.html',
})
export class NewShot {

  public newShotForm: any;
  public loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public formBuilder: FormBuilder, public projectData: ProjectData, public shotlistData: ShotlistData) {
    this.newShotForm = formBuilder.group({
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewShotModal');
  }
  //close this modal
  closeModal() {
  	this.view.dismiss();
  }

  addShot() {
    if (!this.newShotForm.valid) {
      console.log(this.newShotForm.value);
    } else {
      let shotNumber = this.newShotForm.value.shotNumber;
      let shotSub = this.newShotForm.value.shotSub;
      let shotTitle = this.newShotForm.value.title;
      let shotDescription = this.newShotForm.value.description;
      let shotLoc = this.newShotForm.value.shotLoc;
      let shotTime = this.newShotForm.value.shotTime;
      let shotType = this.newShotForm.value.shotType;
      let cameraMovement = this.newShotForm.value.cameraMovement;
      let startPage = this.newShotForm.value.startPage;
      let pageCount = this.newShotForm.value.pageCount;
      let pageEighths = this.newShotForm.value.pageEighths
      this.shotlistData.createShot(shotNumber, shotSub, shotTitle, shotDescription, shotLoc, shotTime, shotType, cameraMovement, startPage, pageCount, pageEighths);
      this.view.dismiss();
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave NewShotModal');
  }

}
