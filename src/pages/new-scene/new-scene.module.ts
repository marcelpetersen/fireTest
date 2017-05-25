import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewScene } from './new-scene';

@NgModule({
  declarations: [
    NewScene,
  ],
  imports: [
    IonicPageModule.forChild(NewScene),
  ],
  exports: [
    NewScene
  ]
})
export class NewSceneModule {}
