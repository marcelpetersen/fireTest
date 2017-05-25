import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditShot } from './edit-shot';

@NgModule({
  declarations: [
    EditShot,
  ],
  imports: [
    IonicPageModule.forChild(EditShot),
  ],
  exports: [
    EditShot
  ]
})
export class EditShotModule {}
