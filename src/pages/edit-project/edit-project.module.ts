import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProject } from './edit-project';

@NgModule({
  declarations: [
    EditProject,
  ],
  imports: [
    IonicPageModule.forChild(EditProject),
  ],
  exports: [
    EditProject
  ]
})
export class EditProjectModule {}
