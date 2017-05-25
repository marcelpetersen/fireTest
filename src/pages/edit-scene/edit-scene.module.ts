import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditScene } from './edit-scene';

@NgModule({
  declarations: [
    EditScene,
  ],
  imports: [
    IonicPageModule.forChild(EditScene),
  ],
  exports: [
    EditScene
  ]
})
export class EditSceneModule {}
