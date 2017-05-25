import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewProject } from './new-project';

@NgModule({
  declarations: [
    NewProject,
  ],
  imports: [
    IonicPageModule.forChild(NewProject),
  ],
  exports: [
    NewProject
  ]
})
export class NewProjectModule {}
