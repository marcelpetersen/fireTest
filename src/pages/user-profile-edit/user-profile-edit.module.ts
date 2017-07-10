import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfileEditPage } from './user-profile-edit';

@NgModule({
  declarations: [
    UserProfileEditPage,
  ],
  imports: [
    IonicPageModule.forChild(UserProfileEditPage),
  ],
  exports: [
    UserProfileEditPage
  ]
})
export class UserProfileEditPageModule {}
