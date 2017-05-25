import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProjects } from './user-projects';

@NgModule({
  declarations: [
    UserProjects,
  ],
  imports: [
    IonicPageModule.forChild(UserProjects),
  ],
  exports: [
    UserProjects
  ]
})
export class UserProjectsModule {}
