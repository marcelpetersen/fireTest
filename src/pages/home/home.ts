import { Component } from '@angular/core';
import {  IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

public image: string;

  constructor(public navCtrl: NavController) {

  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
