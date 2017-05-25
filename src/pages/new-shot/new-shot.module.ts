import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewShot } from './new-shot';

@NgModule({
  declarations: [
    NewShot,
  ],
  imports: [
    IonicPageModule.forChild(NewShot),
  ],
  exports: [
    NewShot
  ]
})
export class NewShotModule {}
