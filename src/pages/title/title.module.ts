import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitlePage } from './title';

@NgModule({
  declarations: [
    TitlePage,
  ],
  imports: [
    IonicPageModule.forChild(TitlePage),
  ],
  exports: [
    TitlePage
  ]
})
export class TitlePageModule {}
