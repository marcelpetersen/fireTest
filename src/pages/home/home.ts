import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
