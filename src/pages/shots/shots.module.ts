import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShotsPage } from './shots';

@NgModule({
  declarations: [
    ShotsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShotsPage),
  ],
  exports: [
    ShotsPage
  ]
})
export class ShotsPageModule {}
